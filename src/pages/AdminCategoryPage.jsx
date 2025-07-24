import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Save, Plus, Trash2, Edit, TrendingUp, DollarSign, PieChart, Shield, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminCategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categoryData, setCategoryData] = useState({ sections: [], tips: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Category configurations
  const categoryConfig = {
    'השקעות': {
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      title: 'השקעות'
    },
    'חיסכון': {
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-600',
      title: 'חיסכון'
    },
    'משכנתא': {
      icon: PieChart,
      color: 'from-purple-500 to-violet-600',
      title: 'משכנתא'
    },
    'ביטוח': {
      icon: Shield,
      color: 'from-orange-500 to-red-600',
      title: 'ביטוח'
    },
    'כרטיסי-אשראי': {
      icon: CreditCard,
      color: 'from-pink-500 to-rose-600',
      title: 'כרטיסי אשראי'
    }
  };

  useEffect(() => {
    // Check if user is admin
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (!adminStatus) {
      navigate('/');
      return;
    }

    // Load category data
    const savedData = localStorage.getItem(`categoryData_${category}`);
    if (savedData) {
      setCategoryData(JSON.parse(savedData));
    }
    setIsLoading(false);
  }, [category, navigate]);

  const handleSave = () => {
    localStorage.setItem(`categoryData_${category}`, JSON.stringify(categoryData));
    toast({
      title: "נשמר בהצלחה!",
      description: "התוכן עודכן בהצלחה"
    });
  };

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
      type: 'info'
    };
    setCategoryData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (id, field, value) => {
    setCategoryData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  const deleteSection = (id) => {
    setCategoryData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== id)
    }));
  };

  const addTip = () => {
    setCategoryData(prev => ({
      ...prev,
      tips: [...prev.tips, '']
    }));
  };

  const updateTip = (index, value) => {
    setCategoryData(prev => ({
      ...prev,
      tips: prev.tips.map((tip, i) => i === index ? value : tip)
    }));
  };

  const deleteTip = (index) => {
    setCategoryData(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index)
    }));
  };

  const config = categoryConfig[category];
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">קטגוריה לא נמצאה</h2>
          <Link to="/" className="btn-primary">
            חזור לעמוד הבית
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <>
      <Helmet>
        <title>עריכת {config.title} - זו לא המלצה</title>
      </Helmet>

      <div className="py-8 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">עמוד הבית</Link>
              <span>/</span>
              <Link to={`/category/${category}`} className="hover:text-blue-600">{config.title}</Link>
              <span>/</span>
              <span>עריכה</span>
            </div>
          </motion.nav>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className={`bg-gradient-to-r ${config.color} p-6 rounded-2xl mx-auto mb-6 w-fit`}>
              <Icon className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">עריכת {config.title}</h1>
            <div className="flex justify-center space-x-4 space-x-reverse">
              <button onClick={handleSave} className="btn-primary flex items-center space-x-2 space-x-reverse">
                <Save className="h-4 w-4" />
                <span>שמור שינויים</span>
              </button>
              <Link to={`/category/${category}`} className="btn-secondary">
                תצוגה מקדימה
              </Link>
            </div>
          </motion.header>

          {/* Sections Editor */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">סעיפי תוכן</h2>
              <button onClick={addSection} className="btn-secondary flex items-center space-x-2 space-x-reverse">
                <Plus className="h-4 w-4" />
                <span>הוסף סעיף</span>
              </button>
            </div>

            <div className="space-y-6">
              {categoryData.sections.map((section, index) => (
                <div key={section.id} className="glass-effect rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">סעיף {index + 1}</h3>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">כותרת</label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                        className="input-field"
                        placeholder="כותרת הסעיף..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">סוג</label>
                      <select
                        value={section.type}
                        onChange={(e) => updateSection(section.id, 'type', e.target.value)}
                        className="input-field"
                      >
                        <option value="info">מידע</option>
                        <option value="strategy">אסטרטגיה</option>
                        <option value="warning">אזהרה</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תוכן</label>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                      className="textarea-field h-24"
                      placeholder="תוכן הסעיף..."
                    />
                  </div>
                </div>
              ))}

              {categoryData.sections.length === 0 && (
                <div className="text-center py-12 glass-effect rounded-2xl">
                  <p className="text-gray-600 mb-4">אין סעיפים עדיין</p>
                  <button onClick={addSection} className="btn-primary">
                    הוסף סעיף ראשון
                  </button>
                </div>
              )}
            </div>
          </motion.section>

          {/* Tips Editor */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">טיפים</h2>
              <button onClick={addTip} className="btn-secondary flex items-center space-x-2 space-x-reverse">
                <Plus className="h-4 w-4" />
                <span>הוסף טיפ</span>
              </button>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <div className="space-y-4">
                {categoryData.tips.map((tip, index) => (
                  <div key={index} className="flex items-center space-x-3 space-x-reverse">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => updateTip(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder="טיפ חשוב..."
                    />
                    <button
                      onClick={() => deleteTip(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {categoryData.tips.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">אין טיפים עדיין</p>
                    <button onClick={addTip} className="btn-primary">
                      הוסף טיפ ראשון
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Save Button */}
          <div className="text-center mt-12">
            <button onClick={handleSave} className="btn-primary text-lg px-8 py-4">
              <Save className="h-5 w-5 ml-2" />
              שמור את כל השינויים
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCategoryPage;
