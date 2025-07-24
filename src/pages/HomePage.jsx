import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, User, MessageCircle, TrendingUp, DollarSign, PieChart, CreditCard, Shield, Plus, Home, Building, Car, Heart, Briefcase, GraduationCap } from 'lucide-react';
import blogStorage from '@/lib/storage';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    
    // Load data using the new storage system
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load posts and categories using the new storage system
      const [loadedPosts, loadedCategories] = await Promise.all([
        blogStorage.loadPosts(),
        blogStorage.loadCategories()
      ]);
      
      setPosts(loadedPosts);
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to localStorage if storage system fails
      const savedPosts = localStorage.getItem('blogPosts');
      const savedCategories = localStorage.getItem('categories');
      
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
      
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    }
  };

  // Icon mapping for dynamic categories
  const getIconComponent = (iconName) => {
    const iconMap = {
      TrendingUp,
      DollarSign,
      PieChart,
      Shield,
      CreditCard,
      Home,
      Building,
      Car,
      Heart,
      Briefcase,
      GraduationCap
    };
    return iconMap[iconName] || TrendingUp;
  };

  return (
    <>
      <Helmet>
        <title>זו לא המלצה - כל המידע הפיננסי שאתה צריך</title>
        <meta name="description" content="זו לא המלצה - המקור שלך למידע פיננסי אובייקטיבי, מדריכים וטיפים לניהול כספים חכם, השקעות ותכנון פיננסי" />
      </Helmet>

      <div className="hero-pattern">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-6">
                זו לא המלצה
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                כל המידע הפיננסי שאתה צריך, בלי המלצות
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAdmin && (
                  <Link to="/create" className="btn-primary">
                    כתוב פוסט חדש
                  </Link>
                )}
                <button className="btn-secondary">
                  הירשם לניוזלטר
                </button>
              </div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="floating-element top-20 left-10 hidden md:block">
            <DollarSign className="h-16 w-16 text-blue-500" />
          </div>
          <div className="floating-element top-40 right-20 hidden md:block">
            <TrendingUp className="h-20 w-20 text-purple-500" />
          </div>
          <div className="floating-element bottom-20 left-1/4 hidden md:block">
            <PieChart className="h-12 w-12 text-green-500" />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">נושאים פיננסיים</h2>
              <p className="text-gray-600">גלה את כל הנושאים החשובים בעולם הכספים</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {categories.map((category, index) => {
                const Icon = getIconComponent(category.icon);
                const categorySlug = category.slug || category.name;
                return (
                  <motion.div
                    key={category.id || category.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-effect rounded-2xl p-4 md:p-6 text-center hover-lift cursor-pointer w-32 md:w-40 lg:w-44"
                  >
                    <Link to={`/category/${categorySlug}`} className="block">
                      <div className={`bg-gradient-to-r ${category.color} p-3 md:p-4 rounded-xl mx-auto mb-4 w-fit`}>
                        <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">{category.name}</h3>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* No categories message */}
            {categories.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">אין קטגוריות עדיין</h3>
                <p className="text-gray-500 mb-6">
                  {isAdmin ? 'הוסף קטגוריות כדי להתחיל' : 'המנהל עדיין לא הוסיף קטגוריות'}
                </p>
                {isAdmin && (
                  <Link to="/admin/categories" className="btn-primary">
                    הוסף קטגוריות
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">מאמרים אחרונים</h2>
              <p className="text-gray-600">התעדכן במידע הכי חדש ורלוונטי בעולם הפיננסים</p>
            </motion.div>

            <div className={`${posts.length === 1 ? 'flex justify-center' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`blog-card group ${posts.length === 1 ? 'max-w-md w-full' : ''}`}
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 gap-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString('he-IL')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                      <Link 
                        to={`/post/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                      >
                        קרא עוד ←
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {posts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">אין מאמרים עדיין</h3>
                <p className="text-gray-500 mb-6">
                  {isAdmin ? 'כתוב מאמר ראשון כדי להתחיל' : 'המנהל עדיין לא הוסיף מאמרים'}
                </p>
                {isAdmin && (
                  <Link to="/create" className="btn-primary">
                    כתוב מאמר ראשון
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
