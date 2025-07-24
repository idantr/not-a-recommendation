import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import BlogPost from '@/pages/BlogPost';
import CreatePost from '@/pages/CreatePost';
import CategoryPage from '@/pages/CategoryPage';
import AdminCategoryPage from '@/pages/AdminCategoryPage';
import AdminCategories from '@/pages/AdminCategories';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Helmet>
          <title>זו לא המלצה - כל המידע הפיננסי שאתה צריך</title>
          <meta name="description" content="זו לא המלצה - המקור שלך למידע פיננסי אובייקטיבי, מדריכים וטיפים לניהול כספים חכם, השקעות ותכנון פיננסי" />
          <meta name="keywords" content="פיננסים, השקעות, כספים, בורסה, חיסכון, ביטוח, משכנתא, מידע פיננסי" />
          <meta property="og:title" content="זו לא המלצה - כל המידע הפיננסי שאתה צריך" />
          <meta property="og:description" content="זו לא המלצה - המקור שלך למידע פיננסי אובייקטיבי ועצות מעשיות" />
          <meta property="og:type" content="website" />
        </Helmet>
        
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<BlogPost />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/category/:category" element={<AdminCategoryPage />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </main>
        
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
