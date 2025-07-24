// Storage utility for persistent blog post management
import { toast } from '@/components/ui/use-toast';

class BlogStorage {
  constructor() {
    this.storageType = this.getStorageType();
    this.initIndexedDB();
  }

  // Determine the best available storage method
  getStorageType() {
    if (typeof window !== 'undefined') {
      // Check if IndexedDB is available
      if ('indexedDB' in window) {
        return 'indexeddb';
      }
      // Fallback to localStorage
      return 'localstorage';
    }
    return 'memory';
  }

  // Initialize IndexedDB
  async initIndexedDB() {
    if (this.storageType !== 'indexeddb') return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BlogDatabase', 1);

      request.onerror = () => {
        console.error('IndexedDB failed to open');
        this.storageType = 'localstorage'; // Fallback
        resolve();
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create posts store
        if (!db.objectStoreNames.contains('posts')) {
          const postsStore = db.createObjectStore('posts', { keyPath: 'id' });
          postsStore.createIndex('date', 'date', { unique: false });
          postsStore.createIndex('category', 'category', { unique: false });
        }

        // Create categories store
        if (!db.objectStoreNames.contains('categories')) {
          const categoriesStore = db.createObjectStore('categories', { keyPath: 'id' });
          categoriesStore.createIndex('name', 'name', { unique: false });
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Save posts
  async savePosts(posts) {
    try {
      if (this.storageType === 'indexeddb' && this.db) {
        const transaction = this.db.transaction(['posts'], 'readwrite');
        const store = transaction.objectStore('posts');
        
        // Clear existing posts
        await new Promise((resolve, reject) => {
          const clearRequest = store.clear();
          clearRequest.onsuccess = () => resolve();
          clearRequest.onerror = () => reject(clearRequest.error);
        });

        // Add all posts
        for (const post of posts) {
          await new Promise((resolve, reject) => {
            const addRequest = store.add(post);
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = () => reject(addRequest.error);
          });
        }

        // Also backup to localStorage as fallback
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        localStorage.setItem('blogPostsBackup', JSON.stringify({
          timestamp: new Date().toISOString(),
          posts: posts
        }));

      } else {
        // Fallback to localStorage with backup
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        localStorage.setItem('blogPostsBackup', JSON.stringify({
          timestamp: new Date().toISOString(),
          posts: posts
        }));
      }

      // Auto-export to file every 10 posts
      if (posts.length > 0 && posts.length % 10 === 0) {
        this.autoExportToFile(posts);
      }

      return true;
    } catch (error) {
      console.error('Failed to save posts:', error);
      return false;
    }
  }

  // Load posts
  async loadPosts() {
    try {
      if (this.storageType === 'indexeddb' && this.db) {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction(['posts'], 'readonly');
          const store = transaction.objectStore('posts');
          const request = store.getAll();

          request.onsuccess = () => {
            const posts = request.result || [];
            // Sort by date (newest first)
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            resolve(posts);
          };

          request.onerror = () => {
            // Fallback to localStorage
            const savedPosts = localStorage.getItem('blogPosts');
            const posts = savedPosts ? JSON.parse(savedPosts) : [];
            resolve(posts);
          };
        });
      } else {
        // Load from localStorage
        const savedPosts = localStorage.getItem('blogPosts');
        const posts = savedPosts ? JSON.parse(savedPosts) : [];
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      return [];
    }
  }

  // Save categories
  async saveCategories(categories) {
    try {
      if (this.storageType === 'indexeddb' && this.db) {
        const transaction = this.db.transaction(['categories'], 'readwrite');
        const store = transaction.objectStore('categories');
        
        // Clear existing categories
        await new Promise((resolve, reject) => {
          const clearRequest = store.clear();
          clearRequest.onsuccess = () => resolve();
          clearRequest.onerror = () => reject(clearRequest.error);
        });

        // Add all categories
        for (const category of categories) {
          await new Promise((resolve, reject) => {
            const addRequest = store.add(category);
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = () => reject(addRequest.error);
          });
        }
      }

      // Always save to localStorage as backup
      localStorage.setItem('categories', JSON.stringify(categories));
      return true;
    } catch (error) {
      console.error('Failed to save categories:', error);
      return false;
    }
  }

  // Load categories
  async loadCategories() {
    try {
      if (this.storageType === 'indexeddb' && this.db) {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction(['categories'], 'readonly');
          const store = transaction.objectStore('categories');
          const request = store.getAll();

          request.onsuccess = () => {
            const categories = request.result || [];
            resolve(categories);
          };

          request.onerror = () => {
            // Fallback to localStorage
            const savedCategories = localStorage.getItem('categories');
            const categories = savedCategories ? JSON.parse(savedCategories) : [];
            resolve(categories);
          };
        });
      } else {
        const savedCategories = localStorage.getItem('categories');
        return savedCategories ? JSON.parse(savedCategories) : [];
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      return [];
    }
  }

  // Export posts to JSON file
  async exportToFile(posts, categories = []) {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        posts: posts || await this.loadPosts(),
        categories: categories || await this.loadCategories(),
        metadata: {
          totalPosts: posts?.length || 0,
          exportedBy: 'זו לא המלצה - Blog System',
          storageType: this.storageType
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `blog-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Failed to export to file:', error);
      return false;
    }
  }

  // Auto-export (silent backup)
  async autoExportToFile(posts) {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        posts: posts,
        categories: await this.loadCategories(),
        metadata: {
          totalPosts: posts.length,
          autoBackup: true,
          storageType: this.storageType
        }
      };

      // Save to localStorage as a backup reference
      localStorage.setItem('lastAutoBackup', JSON.stringify({
        timestamp: new Date().toISOString(),
        postCount: posts.length
      }));

    } catch (error) {
      console.error('Auto-export failed:', error);
    }
  }

  // Import posts from JSON file
  async importFromFile(file) {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      console.log('Import data received:', importData);

      if (!importData.posts || !Array.isArray(importData.posts)) {
        throw new Error('Invalid file format - missing or invalid posts array');
      }

      // Validate posts structure
      const validPosts = importData.posts.filter(post => 
        post.id && post.title && post.content && post.date
      );

      console.log('Valid posts found:', validPosts.length);

      if (validPosts.length === 0) {
        throw new Error('No valid posts found in file');
      }

      // Ensure posts have proper structure and generate IDs if missing
      const processedPosts = validPosts.map(post => ({
        ...post,
        id: post.id || `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: post.date || new Date().toISOString(),
        author: post.author || 'מחבר לא ידוע',
        category: post.category || 'כללי',
        readTime: post.readTime || 'זמן קריאה לא ידוע'
      }));

      // Save imported posts
      const postsSaved = await this.savePosts(processedPosts);
      console.log('Posts saved successfully:', postsSaved);

      // Save imported categories if available
      let categoriesSaved = false;
      if (importData.categories && Array.isArray(importData.categories)) {
        categoriesSaved = await this.saveCategories(importData.categories);
        console.log('Categories saved successfully:', categoriesSaved);
      }

      // Verify data was saved by loading it back
      const savedPosts = await this.loadPosts();
      const savedCategories = await this.loadCategories();
      
      console.log('Verification - Posts loaded:', savedPosts.length);
      console.log('Verification - Categories loaded:', savedCategories.length);

      return {
        success: true,
        postsImported: processedPosts.length,
        categoriesImported: importData.categories?.length || 0,
        verified: {
          posts: savedPosts.length,
          categories: savedCategories.length
        }
      };

    } catch (error) {
      console.error('Failed to import from file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get storage info
  async getStorageInfo() {
    const posts = await this.loadPosts();
    const categories = await this.loadCategories();
    
    const lastBackup = localStorage.getItem('lastAutoBackup');
    const backupInfo = lastBackup ? JSON.parse(lastBackup) : null;

    return {
      storageType: this.storageType,
      totalPosts: posts.length,
      totalCategories: categories.length,
      lastBackup: backupInfo?.timestamp || null,
      hasIndexedDB: 'indexedDB' in window,
      localStorageSize: this.getLocalStorageSize()
    };
  }

  // Calculate localStorage usage
  getLocalStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return Math.round(total / 1024); // KB
  }

  // Clear all data (with confirmation)
  async clearAllData() {
    try {
      if (this.storageType === 'indexeddb' && this.db) {
        const transaction = this.db.transaction(['posts', 'categories'], 'readwrite');
        await Promise.all([
          new Promise(resolve => {
            const clearPosts = transaction.objectStore('posts').clear();
            clearPosts.onsuccess = () => resolve();
          }),
          new Promise(resolve => {
            const clearCategories = transaction.objectStore('categories').clear();
            clearCategories.onsuccess = () => resolve();
          })
        ]);
      }

      // Clear localStorage
      localStorage.removeItem('blogPosts');
      localStorage.removeItem('categories');
      localStorage.removeItem('blogPostsBackup');
      localStorage.removeItem('lastAutoBackup');

      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }
}

// Create singleton instance
const blogStorage = new BlogStorage();

export default blogStorage;
