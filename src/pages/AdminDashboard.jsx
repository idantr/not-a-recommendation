import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Settings, PenTool, Database, Users, BarChart3, FileText, ArrowRight } from 'lucide-react';
import blogStorage from '@/lib/storage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    loading: true
  });

  useEffect(() => {
    // Check if user is admin
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (!adminStatus) {
      navigate('/admin/login');
      return;
    }

    // Load statistics
    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const [posts, categories] = await Promise.all([
        blogStorage.loadPosts(),
        blogStorage.loadCategories()
      ]);

      setStats({
        posts: posts.length,
        categories: categories.length,
        loading: false
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Fallback to localStorage
      const fallbackPosts = localStorage.getItem('blogPosts');
      const fallbackCategories = localStorage.getItem('categories');
      
      setStats({
        posts: fallbackPosts ? JSON.parse(fallbackPosts).length : 0,
        categories: fallbackCategories ? JSON.parse(fallbackCategories).length : 0,
        loading: false
      });
    }
  };

  const adminActions = [
    {
      title: 'ניהול קטגוריות',
      description: 'הוסף, ערוך ומחק קטגוריות פיננסיות',
      icon: Settings,
      path: '/admin/categories',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'כתיבת פוסט',
      description: 'צור תוכן חדש לבלוג',
      icon: PenTool,
      path: '/create',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'ניהול אחסון',
      description: 'גבה ושחזר נתונים',
      icon: Database,
      path: '#',
      color: 'from-purple-500 to-violet-600',
      onClick: () => {
        // This will be handled by the StorageManager component in Header
        window.dispatchEvent(new CustomEvent('openStorageManager'));
      }
    }
  ];

  return (
    <>
      <Helmet>
        <title>לוח בקרה מנהל - זו לא המלצה</title>
      </Helmet>

      <div className="py-8 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center space-x-2 space-x-reverse">
              <ArrowRight className="h-4 w-4" />
              <span>חזור לעמוד הבית</span>
            </Link>
          </motion.nav>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold gradient-text mb-4">לוח בקרה מנהל</h1>
            <p className="text-xl text-gray-600">ברוך הבא למערכת הניהול</p>
          </motion.header>

          {/* Admin Actions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {adminActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {action.onClick ? (
                    <button
                      onClick={action.onClick}
                      className="glass-effect rounded-2xl p-6 w-full text-right hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="text-center mb-4">
                        <div className={`bg-gradient-to-r ${action.color} p-4 rounded-xl mx-auto mb-4 w-fit group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{action.title}</h3>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                    </button>
                  ) : (
                    <Link
                      to={action.path}
                      className="glass-effect rounded-2xl p-6 block hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="text-center mb-4">
                        <div className={`bg-gradient-to-r ${action.color} p-4 rounded-xl mx-auto mb-4 w-fit group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{action.title}</h3>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">סטטיסטיקות מהירות</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl mx-auto mb-2 w-fit">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">פוסטים</h3>
                {stats.loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                ) : (
                  <p className="text-2xl font-bold text-blue-600">{stats.posts}</p>
                )}
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl mx-auto mb-2 w-fit">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">קטגוריות</h3>
                {stats.loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                ) : (
                  <p className="text-2xl font-bold text-green-600">{stats.categories}</p>
                )}
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-xl mx-auto mb-2 w-fit">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">סטטוס</h3>
                <p className="text-lg font-bold text-purple-600">פעיל</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
