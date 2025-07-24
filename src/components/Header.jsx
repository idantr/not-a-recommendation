import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Home, TrendingUp, Menu, X, Settings, LogOut, LogIn, Database } from 'lucide-react';
import StorageManager from './StorageManager';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, [location]);

  // Check if current URL contains /admin
  const isAdminPage = location.pathname.includes('/admin');

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    setIsMenuOpen(false);
  };

  const getNavItems = () => {
    const items = [
      { path: '/', label: 'בית', icon: Home }
    ];
    
    if (isAdmin) {
      items.push({ path: '/create', label: 'כתיבת פוסט', icon: PenTool });
    }
    
    return items;
  };

  const navItems = getNavItems();

  const adminItems = [
    { path: '/admin/login', label: 'התחברות מנהל', icon: LogIn }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-effect sticky top-0 z-50 border-b border-white/20"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 md:p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold gradient-text">זו לא המלצה</h1>
              <p className="hidden md:block text-sm text-gray-600">כל המידע הפיננסי שאתה צריך, בלי המלצות</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Storage Manager Button - Only for Admin */}
            {isAdmin && (
              <button
                onClick={() => setShowStorageManager(true)}
                className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300"
                title="ניהול אחסון"
              >
                <Database className="h-4 w-4" />
                <span className="text-sm">אחסון</span>
              </button>
            )}

            {/* Admin Section - Only show when URL contains /admin */}
            {isAdminPage && (
              <>
                {isAdmin ? (
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Link
                      to="/admin/categories"
                      className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">ניהול קטגוריות</span>
                    </Link>
                    <span className="text-sm text-green-600 font-medium">מנהל מחובר</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">התנתק</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/admin/login"
                    className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-gray-600 hover:bg-white/60 hover:shadow-md rounded-lg transition-all duration-300"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="text-sm">מנהל</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-md"
          >
            <div className="flex flex-col items-center space-y-4 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 space-x-reverse w-full justify-center px-4 py-3 transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Storage Manager Button - Only for Admin */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setShowStorageManager(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 space-x-reverse w-full justify-center px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300"
                >
                  <Database className="h-4 w-4" />
                  <span className="text-sm">ניהול אחסון</span>
                </button>
              )}

              {/* Mobile Admin Section - Only show when URL contains /admin */}
              {isAdminPage && (
                <div className="w-full border-t border-gray-200 pt-4">
                  {isAdmin ? (
                    <div className="flex flex-col items-center space-y-2">
                      <Link
                        to="/admin/categories"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="text-sm">ניהול קטגוריות</span>
                      </Link>
                      <span className="text-sm text-green-600 font-medium">מנהל מחובר</span>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">התנתק</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/admin/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 space-x-reverse w-full justify-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="text-sm">התחברות מנהל</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Storage Manager Modal */}
      <StorageManager 
        isOpen={showStorageManager} 
        onClose={() => setShowStorageManager(false)} 
      />
    </motion.header>
  );
};

export default Header;
