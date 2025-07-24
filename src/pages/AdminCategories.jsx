import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Trash2, Edit, Save, ArrowRight, TrendingUp, DollarSign, PieChart, Shield, CreditCard, Home, Building, Car, Heart, Briefcase, GraduationCap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import blogStorage from '@/lib/storage';

const AdminCategories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);

  // Available icons for categories
  const availableIcons = [
    { name: 'TrendingUp', icon: TrendingUp, label: 'גרף עולה' },
    { name: 'DollarSign', icon: DollarSign, label: 'דולר' },
    { name: 'PieChart', icon: PieChart, label: 'גרף עוגה' },
    { name: 'Shield', icon: Shield, label: 'מגן' },
    { name: 'CreditCard', icon: CreditCard, label: 'כרטיס אשראי' },
    { name: 'Home', icon: Home, label: 'בית' },
    { name: 'Building', icon: Building, label: 'בניין' },
    { name: 'Car', icon: Car, label: 'רכב' },
    { name: 'Heart', icon: Heart, label: 'לב' },
    { name: 'Briefcase', icon: Briefcase, label: 'תיק' },
    { name: 'GraduationCap', icon: GraduationCap, label: 'כובע סיום' }
  ];

  // Available colors for categories
  const availableColors = [
    { name: 'from-green-500 to-emerald-600', label: 'ירוק' },
    { name: 'from-blue-500 to-cyan-600', label: 'כחול' },
    { name: 'from-purple-500 to-violet-600', label: 'סגול' },
    { name: 'from-orange-500 to-red-600', label: 'כתום-אדום' },
    { name: 'from-pink-500 to-rose-600', label: 'ורוד' },
    { name: 'from-yellow-500 to-orange-500', label: 'צהוב-כתום' },
    { name: 'from-indigo-500 to-purple-500', label: 'אינדיגו-סגול' },
    { name: 'from-teal-500 to-cyan-500', label: 'טורקיז' },
    { name: 'from-red-500 to-pink-500', label: 'אדום-ורוד' },
    { name: 'from-gray-500 to-slate-600', label: 'אפור' }
  ];

  useEffect(() => {
    // Check if user is admin
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (!adminStatus) {
      navigate('/');
      return;
    }

    // Load categories using the new storage system
    loadCategories();
  }, [navigate]);

  const loadCategories = async () => {
    try {
      const loadedCategories = await blogStorage.loadCategories();
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to localStorage
      const savedCategories = localStorage.getItem('categories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    }
    setIsLoading(false);
  };

  const saveCategories = async (newCategories) => {
    try {
      await blogStorage.saveCategories(newCategories);
      setCategories(newCategories);
    } catch (error) {
      console.error('Failed to save categories:', error);
      // Fallback to localStorage
      localStorage.setItem('categories', JSON.stringify(newCategories));
      setCategories(newCategories);
    }
  };

  const addCategory = () => {
    const newCategory = {
      id: Date.now().toString(),
      name: '',
      icon: 'TrendingUp',
      color: 'from-blue-500 to-cyan-600',
      description: ''
    };
    setEditingCategory(newCategory);
  };

  const saveCategory = async (category) => {
    if (!category.name.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הכנס שם לקטגוריה",
        variant: "destructive"
      });
      return;
    }

    const categorySlug = category.name === 'כרטיסי אשראי' ? 'כרטיסי-אשראי' : category.name;
    const updatedCategory = { ...category, slug: categorySlug };

    let newCategories;
    if (categories.find(c => c.id === category.id)) {
      // Update existing
      newCategories = categories.map(c => c.id === category.id ? updatedCategory : c);
    } else {
      // Add new - put new categories at the beginning
      newCategories = [updatedCategory, ...categories];
    }

    await saveCategories(newCategories);
    setEditingCategory(null);
    
    toast({
      title: "נשמר בהצלחה!",
      description: "הקטגוריה נשמרה בהצלחה"
    });
  };

  const deleteCategory = async (id) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) {
      const newCategories = categories.filter(c => c.id !== id);
      await saveCategories(newCategories);
      
      toast({
        title: "נמחק בהצלחה!",
        description: "הקטגוריה נמחקה בהצלחה"
      });
    }
  };

  const getIconComponent = (iconName) => {
    const iconData = availableIcons.find(i => i.name === iconName);
    return iconData ? iconData.icon : TrendingUp;
  };

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

  return (
    <>
      <Helmet>
        <title>ניהול קטגוריות - זו לא המלצה</title>
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
            <h1 className="text-4xl font-bold gradient-text mb-4">ניהול קטגוריות</h1>
            <p className="text-xl text-gray-600 mb-6">הוסף, ערוך ומחק קטגוריות פיננסיות</p>
            <button onClick={addCategory} className="btn-primary flex items-center space-x-2 space-x-reverse mx-auto">
              <Plus className="h-5 w-5" />
              <span>הוסף קטגוריה חדשה</span>
            </button>
          </motion.header>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categories.map((category, index) => {
              const Icon = getIconComponent(category.icon);
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-effect rounded-2xl p-6"
                >
                  <div className="text-center mb-4">
                    <div className={`bg-gradient-to-r ${category.color} p-4 rounded-xl mx-auto mb-4 w-fit`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-center space-x-3 space-x-reverse">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="btn-secondary flex items-center space-x-1 space-x-reverse text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      <span>ערוך</span>
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-1 space-x-reverse text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>מחק</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12 glass-effect rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">אין קטגוריות עדיין</h3>
              <p className="text-gray-500 mb-6">הוסף קטגוריה ראשונה כדי להתחיל</p>
              <button onClick={addCategory} className="btn-primary">
                הוסף קטגוריה ראשונה
              </button>
            </div>
          )}

          {/* Edit Modal */}
          {editingCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-effect rounded-2xl p-6 w-full max-w-md"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {categories.find(c => c.id === editingCategory.id) ? 'ערוך קטגוריה' : 'הוסף קטגוריה חדשה'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם הקטגוריה</label>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      className="input-field"
                      placeholder="השקעות, חיסכון..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תיאור (אופציונלי)</label>
                    <input
                      type="text"
                      value={editingCategory.description || ''}
                      onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                      className="input-field"
                      placeholder="תיאור קצר של הקטגוריה..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">אייקון</label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableIcons.map((iconData) => {
                        const Icon = iconData.icon;
                        return (
                          <button
                            key={iconData.name}
                            onClick={() => setEditingCategory({...editingCategory, icon: iconData.name})}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                              editingCategory.icon === iconData.name 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="h-5 w-5 mx-auto" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">צבע</label>
                    <div className="grid grid-cols-5 gap-2">
                      {availableColors.map((colorData) => (
                        <button
                          key={colorData.name}
                          onClick={() => setEditingCategory({...editingCategory, color: colorData.name})}
                          className={`h-10 rounded-lg border-2 transition-all duration-300 bg-gradient-to-r ${colorData.name} ${
                            editingCategory.color === colorData.name 
                              ? 'border-gray-800 scale-110' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="btn-secondary"
                  >
                    ביטול
                  </button>
                  <button
                    onClick={() => saveCategory(editingCategory)}
                    className="btn-primary flex items-center space-x-2 space-x-reverse"
                  >
                    <Save className="h-4 w-4" />
                    <span>שמור</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCategories;
