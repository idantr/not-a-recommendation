import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, User, MessageCircle, ArrowRight, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import blogStorage from '@/lib/storage';

const BlogPost = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const posts = await blogStorage.loadPosts();
      const foundPost = posts.find(p => p.id === id);
      if (foundPost) {
        setPost(foundPost);
        setComments(foundPost.comments || []);
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      // Fallback to localStorage
      const savedPosts = localStorage.getItem('blogPosts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const foundPost = posts.find(p => p.id === id);
        if (foundPost) {
          setPost(foundPost);
          setComments(foundPost.comments || []);
        }
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.name || !newComment.message) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    const comment = {
      id: Date.now().toString(),
      name: newComment.name,
      email: newComment.email,
      message: newComment.message,
      date: new Date().toISOString()
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);

    try {
      // Update using the new storage system
      const posts = await blogStorage.loadPosts();
      const updatedPosts = posts.map(p => 
        p.id === id ? { ...p, comments: updatedComments } : p
      );
      
      const success = await blogStorage.savePosts(updatedPosts);
      
      if (success) {
        toast({
          title: "תגובה נוספה בהצלחה!",
          description: "התגובה שלך נשמרה באופן מאובטח"
        });
      } else {
        throw new Error('Failed to save comment');
      }
    } catch (error) {
      console.error('Failed to save comment:', error);
      
      // Fallback to localStorage
      const savedPosts = localStorage.getItem('blogPosts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const updatedPosts = posts.map(p => 
          p.id === id ? { ...p, comments: updatedComments } : p
        );
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      }
      
      toast({
        title: "תגובה נוספה בהצלחה!",
        description: "התגובה שלך נשמרה (גיבוי מקומי)"
      });
    }

    setNewComment({ name: '', email: '', message: '' });
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">פוסט לא נמצא</h2>
          <Link to="/" className="btn-primary">
            חזור לעמוד הבית
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - זו לא המלצה</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
      </Helmet>

      <article className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
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

          {/* Post Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl mb-6">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-medium text-sm md:text-base">
                  {post.category}
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
              <div className="flex items-center space-x-2 space-x-reverse">
                <User className="h-5 w-5" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Calendar className="h-5 w-5" />
                <span>{new Date(post.date).toLocaleDateString('he-IL')}</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <MessageCircle className="h-5 w-5" />
                <span>{comments.length} תגובות</span>
              </div>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {post.readTime}
              </span>
            </div>
          </motion.header>

          {/* Post Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none mb-12"
          >
            <div className="glass-effect rounded-2xl p-6 md:p-8">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 font-medium">
                {post.excerpt}
              </p>
              <div className="text-gray-700 leading-relaxed space-y-4">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2 space-x-reverse">
              <MessageCircle className="h-6 w-6" />
              <span>תגובות ({comments.length})</span>
            </h2>

            {/* Comment Form */}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">הוסף תגובה</h3>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="שם מלא *"
                    value={newComment.name}
                    onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                    className="input-field"
                    required
                  />
                  <input
                    type="email"
                    placeholder="כתובת אימייל"
                    value={newComment.email}
                    onChange={(e) => setNewComment({...newComment, email: e.target.value})}
                    className="input-field"
                  />
                </div>
                <textarea
                  placeholder="כתוב את התגובה שלך... *"
                  value={newComment.message}
                  onChange={(e) => setNewComment({...newComment, message: e.target.value})}
                  className="textarea-field h-32"
                  required
                />
                <button type="submit" className="btn-primary flex items-center space-x-2 space-x-reverse">
                  <Send className="h-4 w-4" />
                  <span>שלח תגובה</span>
                </button>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="comment-bubble"
                  >
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 sm:space-x-reverse mb-2">
                          <h4 className="font-semibold text-gray-800">{comment.name}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.date).toLocaleDateString('he-IL')}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{comment.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">אין תגובות עדיין. היה הראשון להגיב!</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
