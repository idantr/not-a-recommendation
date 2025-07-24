import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, TrendingUp, DollarSign, PieChart, Shield, CreditCard, Plus, Edit, Trash2, Home, Building, Car, Heart, Briefcase, GraduationCap } from 'lucide-react';
import blogStorage from '@/lib/storage';

const CategoryPage = () => {
  const { category } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [categoryConfig, setCategoryConfig] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

  // Default category data
  const getDefaultCategoryData = (categoryName) => {
    const defaultData = {
      'השקעות': {
        sections: [
          {
            id: '1',
            title: 'סוגי השקעות',
            content: 'מניות, אגרות חוב, קרנות נאמנות, נדל"ן ועוד',
            type: 'info'
          },
          {
            id: '2',
            title: 'אסטרטגיות השקעה',
            content: 'השקעה לטווח ארוך, גיוון תיק, ממוצע עלות דולר',
            type: 'strategy'
          },
          {
            id: '3',
            title: 'סיכונים בהשקעות',
            content: 'סיכון שוק, סיכון אשראי, סיכון נזילות',
            type: 'warning'
          }
        ],
        tips: [
          'התחל עם סכומים קטנים',
          'גוון את התיק שלך',
          'השקע רק כסף שאתה יכול להרשות לעצמך להפסיד',
          'למד לפני שאתה משקיע'
        ]
      },
      'חיסכון': {
        sections: [
          {
            id: '1',
            title: 'חשיבות החיסכון',
            content: 'בניית קרן חירום, השגת יעדים פיננסיים, ביטחון כלכלי',
            type: 'info'
          },
          {
            id: '2',
            title: 'דרכי חיסכון',
            content: 'חיסכון אוטומטי, קופות גמל, פקדונות בנקאיים',
            type: 'strategy'
          },
          {
            id: '3',
            title: 'טעויות נפוצות',
            content: 'חיסכון לא סדיר, השקעה בלי ידע, הוצאות מיותרות',
            type: 'warning'
          }
        ],
        tips: [
          'חסוך לפחות 10% מההכנסה',
          'בנה קרן חירום של 6 חודשים',
          'השתמש בחיסכון אוטומטי',
          'עקוב אחר ההוצאות שלך'
        ]
      },
      'משכנתא': {
        sections: [
          {
            id: '1',
            title: 'סוגי משכנתאות',
            content: 'משכנתא קבועה, משתנה, מעורבת, צמודה ולא צמודה',
            type: 'info'
          },
          {
            id: '2',
            title: 'תהליך קבלת משכנתא',
            content: 'אישור עקרוני, בדיקת כושר פירעון, בחירת מסלול',
            type: 'strategy'
          },
          {
            id: '3',
            title: 'מלכודות נפוצות',
            content: 'ריבית נמוכה לתקופה קצרה, עמלות נסתרות, ביטוח יקר',
            type: 'warning'
          }
        ],
        tips: [
          'השווה בין בנקים שונים',
          'קרא את הדפדפן בעיון',
          'שמור על יחס של 30% מההכנסה למשכנתא',
          'שקול פירעון מוקדם'
        ]
      },
      'ביטוח': {
        sections: [
          {
            id: '1',
            title: 'סוגי ביטוחים',
            content: 'ביטוח חיים, בריאות, רכוש, אחריות מקצועית',
            type: 'info'
          },
          {
            id: '2',
            title: 'איך לבחור ביטוח',
            content: 'הערכת צרכים, השוואת מחירים, בדיקת כיסוי',
            type: 'strategy'
          },
          {
            id: '3',
            title: 'טעויות בביטוח',
            content: 'תת-ביטוח, יתר-ביטוח, אי-עדכון פוליסה',
            type: 'warning'
          }
        ],
        tips: [
          'עדכן את הפוליסה מדי שנה',
          'קרא את התנאים הקטנים',
          'השווה מחירים',
          'אל תחסוך על ביטוח חיים'
        ]
      }
    };

    return defaultData[categoryName] || { sections: [], tips: [] };
  };

  useEffect(() => {
    // Check if user is admin (simple check - in real app use proper authentication)
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    // Load category data
    const savedData = localStorage.getItem(`categoryData_${category}`);
    if (savedData) {
      setCategoryData(JSON.parse(savedData));
    } else {
      const defaultData = getDefaultCategoryData(category);
      setCategoryData(defaultData);
      localStorage.setItem(`categoryData_${category}`, JSON.stringify(defaultData));
    }

    // Load category config
    loadCategoryConfig();
  }, [category]);

  const loadCategoryConfig = async () => {
    const config = await getCategoryConfig();
    setCategoryConfig(config);
  };

  // Get category config from storage or use defaults
  const getCategoryConfig = async () => {
    try {
      const categories = await blogStorage.loadCategories();
      const foundCategory = categories.find(cat => cat.slug === category || cat.name === category);
      if (foundCategory) {
        return {
          icon: getIconComponent(foundCategory.icon),
          color: foundCategory.color,
          title: foundCategory.name,
          description: foundCategory.description || `כל מה שצריך לדעת על ${foundCategory.name}`
        };
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to localStorage
      const savedCategories = localStorage.getItem('categories');
      if (savedCategories) {
        const categories = JSON.parse(savedCategories);
        const foundCategory = categories.find(cat => cat.slug === category || cat.name === category);
        if (foundCategory) {
          return {
            icon: getIconComponent(foundCategory.icon),
            color: foundCategory.color,
            title: foundCategory.name,
            description: foundCategory.description || `כל מה שצריך לדעת על ${foundCategory.name}`
          };
        }
      }
    }
    
    // Fallback to default config
    const defaultConfigs = {
      'השקעות': {
        icon: getIconComponent('TrendingUp'),
        color: 'from-green-500 to-emerald-600',
        title: 'השקעות',
        description: 'כל מה שצריך לדעת על השקעות חכמות ובטוחות'
      },
      'חיסכון': {
        icon: getIconComponent('DollarSign'),
        color: 'from-blue-500 to-cyan-600',
        title: 'חיסכון',
        description: 'טיפים ואסטרטגיות לחיסכון יעיל'
      },
      'משכנתא': {
        icon: getIconComponent('PieChart'),
        color: 'from-purple-500 to-violet-600',
        title: 'משכנתא',
        description: 'מדריך מלא לרכישת דירה ומשכנתאות'
      },
      'ביטוח': {
        icon: getIconComponent('Shield'),
        color: 'from-orange-500 to-red-600',
        title: 'ביטוח',
        description: 'הכל על ביטוחים וחשיבותם'
      },
      'כרטיסי-אשראי': {
        icon: getIconComponent('CreditCard'),
        color: 'from-pink-500 to-rose-600',
        title: 'כרטיסי אשראי',
        description: 'שימוש נכון בכרטיסי אשראי'
      }
    };
    
    return defaultConfigs[category] || {
      icon: getIconComponent('TrendingUp'),
      color: 'from-blue-500 to-cyan-600',
      title: category,
      description: `מידע על ${category}`
    };
  };

  if (!categoryData || !categoryConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  const Icon = categoryConfig.icon;

  return (
    <>
      <Helmet>
        <title>{categoryConfig.title} - זו לא המלצה</title>
        <meta name="description" content={categoryConfig.description} />
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
            <div className={`bg-gradient-to-r ${categoryConfig.color} p-6 rounded-2xl mx-auto mb-6 w-fit`}>
              <Icon className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">{categoryConfig.title}</h1>
            <p className="text-xl text-gray-600">{categoryConfig.description}</p>
            
            {isAdmin && (
              <div className="mt-6">
                <Link 
                  to={`/admin/category/${category}`}
                  className="btn-secondary inline-flex items-center space-x-2 space-x-reverse"
                >
                  <Edit className="h-4 w-4" />
                  <span>עריכת תוכן</span>
                </Link>
              </div>
            )}
          </motion.header>

          {/* Content Sections */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {categoryData.sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-effect rounded-2xl p-6 ${
                  section.type === 'warning' ? 'border-l-4 border-red-500' :
                  section.type === 'strategy' ? 'border-l-4 border-blue-500' :
                  'border-l-4 border-green-500'
                }`}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Tips Section */}
          {categoryData.tips && categoryData.tips.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-effect rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">טיפים חשובים</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {categoryData.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 space-x-reverse">
                    <div className={`bg-gradient-to-r ${categoryConfig.color} p-1 rounded-full flex-shrink-0 mt-1`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
