import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Save, Image, Type, FileText, Tag, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import blogStorage from '@/lib/storage';

const CreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'השקעות',
    image: '',
    readTime: ''
  });

  const categories = [
    'השקעות',
    'חיסכון', 
    'משכנתא',
    'ביטוח',
    'כרטיסי אשראי',
    'תכנון פיננסי',
    'מסים',
    'פנסיה'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.author) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString(),
      comments: [],
      image: formData.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop'
    };

    try {
      // Load existing posts and add the new one
      const existingPosts = await blogStorage.loadPosts();
      const updatedPosts = [newPost, ...existingPosts];
      
      // Save using the new storage system
      const success = await blogStorage.savePosts(updatedPosts);
      
      if (success) {
        toast({
          title: "פוסט נוצר בהצלחה!",
          description: "הפוסט שלך נשמר באופן מאובטח ומוכן לקריאה"
        });
        navigate('/');
      } else {
        throw new Error('Failed to save post');
      }
    } catch (error) {
      console.error('Failed to save post:', error);
      
      // Fallback to localStorage if storage system fails
      const savedPosts = localStorage.getItem('blogPosts');
      const posts = savedPosts ? JSON.parse(savedPosts) : [];
      posts.unshift(newPost);
      localStorage.setItem('blogPosts', JSON.stringify(posts));

      toast({
        title: "פוסט נוצר בהצלחה!",
        description: "הפוסט שלך נשמר (גיבוי מקומי) ומוכן לקריאה",
        variant: "default"
      });
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>כתיבת פוסט חדש - זו לא המלצה</title>
        <meta name="description" content="כתוב פוסט חדש ושתף את הידע שלך עם הקהילה" />
      </Helmet>

      <div className="py-8 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                כתיבת פוסט חדש
              </h1>
              <p className="text-gray-600 text-lg">
                שתף את הידע הפיננסי שלך עם הקהילה
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="glass-effect rounded-2xl p-6 md:p-8 space-y-6">
                {/* Title */}
                <div>
                  <label className="flex items-center space-x-2 space-x-reverse text-gray-700 font-semibold mb-2">
                    <Type className="h-5 w-5" />
                    <span>כותרת הפוסט *</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="כתוב כותרת מעניינת ומושכת..."
                    className="input-field"
                    required
                  />
                </div>

                {/* Author & Category */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 space-x-reverse text-gray-700 font-semibold mb-2">
                      <User className="h-5 w-5" />
                      <span>שם הכותב *</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="השם שלך..."
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 space-x-reverse text-gray-700 font-semibold mb-2">
                      <Tag className="h-5 w-5" />
                      <span>קטגוריה</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image URL & Read Time */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 space-x-reverse text-gray-700 font-semibold mb-2">
                      <Image className="h-5 w-5" />
                      <span>קישור לתמונה</span>
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 space-x-reverse text-gray-700 font-semibold mb-2">
                      <span>זמן קריאה</span>
                    </label>
                    <input
                      type="text"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleChange}
                      placeholder="5 דקות קריאה"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="flex items-center space-x-2 space-x-reverse text-gray-700 font-semibold mb-2">
                    <FileText className="h-5 w-5" />
                    <span>תקציר הפוסט *</span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="כתוב תקציר קצר ומעניין שיעודד אנשים לקרוא את הפוסט..."
                    className="textarea-field h-24"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="flex items-center space-x-2 space-x-reverse text-gray-700 font-semibold mb-2">
                    <FileText className="h-5 w-5" />
                    <span>תוכן הפוסט *</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="כתוב את התוכן המלא של הפוסט כאן... השתמש בפסקאות נפרדות לקריאה נוחה."
                    className="textarea-field h-64"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button type="submit" className="btn-primary text-lg px-8 py-4">
                  <Save className="h-5 w-5 ml-2" />
                  פרסם פוסט
                </button>
              </div>
            </form>

            {/* Preview Section */}
            {formData.title && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">תצוגה מקדימה</h2>
                <div className="blog-card max-w-md mx-auto">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src={formData.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop'} 
                      alt={formData.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {formData.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {formData.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {formData.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formData.author}</span>
                    <span>{formData.readTime}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
