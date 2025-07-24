import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Upload, 
  Database, 
  HardDrive, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import blogStorage from '@/lib/storage';

const StorageManager = ({ isOpen, onClose }) => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadStorageInfo();
    }

    // Handle escape key to close modal
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const loadStorageInfo = async () => {
    setIsLoading(true);
    try {
      const info = await blogStorage.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to load storage info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const success = await blogStorage.exportToFile();
      if (success) {
        toast({
          title: "יצוא הושלם בהצלחה!",
          description: "הקובץ נשמר במחשב שלך",
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast({
        title: "שגיאה ביצוא",
        description: "לא הצלחנו לייצא את הנתונים",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      console.log('Starting import process for file:', file.name);
      const result = await blogStorage.importFromFile(file);
      console.log('Import result:', result);
      
      if (result.success) {
        const verificationText = result.verified ? 
          ` (אומת: ${result.verified.posts} פוסטים, ${result.verified.categories} קטגוריות)` : '';
        
        toast({
          title: "יבוא הושלם בהצלחה!",
          description: `יובאו ${result.postsImported} פוסטים ו-${result.categoriesImported} קטגוריות${verificationText}`,
        });
        
        // Reload storage info immediately
        await loadStorageInfo();
        
        // Give a moment for the UI to update, then refresh
        setTimeout(() => {
          console.log('Refreshing page to show imported data');
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "שגיאה ביבוא",
        description: error.message || "לא הצלחנו לייבא את הנתונים",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handleClearData = async () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }

    setIsLoading(true);
    try {
      const success = await blogStorage.clearAllData();
      if (success) {
        toast({
          title: "נתונים נמחקו",
          description: "כל הפוסטים והקטגוריות נמחקו",
        });
        setShowClearConfirm(false);
        loadStorageInfo();
        // Refresh the page to reflect changes
        setTimeout(() => window.location.reload(), 1000);
      } else {
        throw new Error('Clear failed');
      }
    } catch (error) {
      toast({
        title: "שגיאה במחיקה",
        description: "לא הצלחנו למחוק את הנתונים",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ניהול אחסון</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
            title="סגור (Escape)"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="mr-3 text-gray-600">טוען...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Storage Info */}
            {storageInfo && (
              <div className="glass-effect rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Database className="h-5 w-5 ml-2" />
                  מידע על האחסון
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">סוג אחסון:</span>
                    <span className="font-medium">
                      {storageInfo.storageType === 'indexeddb' ? 'IndexedDB' : 'LocalStorage'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">סה"כ פוסטים:</span>
                    <span className="font-medium">{storageInfo.totalPosts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">סה"כ קטגוריות:</span>
                    <span className="font-medium">{storageInfo.totalCategories}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">גודל אחסון:</span>
                    <span className="font-medium">{storageInfo.localStorageSize} KB</span>
                  </div>
                  {storageInfo.lastBackup && (
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-between">
                      <span className="text-gray-600">גיבוי אחרון:</span>
                      <span className="font-medium text-sm">
                        {new Date(storageInfo.lastBackup).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Storage Status */}
            <div className="flex items-center space-x-3 space-x-reverse p-4 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">אחסון פעיל</p>
                <p className="text-sm text-green-600">
                  הפוסטים שלך נשמרים ב-{storageInfo?.storageType === 'indexeddb' ? 'IndexedDB' : 'LocalStorage'} 
                  {storageInfo?.storageType === 'indexeddb' && ' עם גיבוי ב-LocalStorage'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">פעולות</h3>
              
              {/* Export */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-xl space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Download className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">יצוא נתונים</p>
                    <p className="text-sm text-gray-600">שמור גיבוי של כל הפוסטים והקטגוריות</p>
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  disabled={isLoading}
                  className="btn-primary text-sm px-4 py-2 w-full sm:w-auto"
                >
                  יצא
                </button>
              </div>

              {/* Import */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-xl space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Upload className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">יבוא נתונים</p>
                    <p className="text-sm text-gray-600">טען פוסטים וקטגוריות מקובץ גיבוי</p>
                  </div>
                </div>
                <label className="btn-secondary text-sm px-4 py-2 cursor-pointer w-full sm:w-auto text-center">
                  יבא
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              </div>

              {/* Clear Data */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-red-200 rounded-xl bg-red-50 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Trash2 className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800">מחק את כל הנתונים</p>
                    <p className="text-sm text-red-600">מחיקה מוחלטת של כל הפוסטים והקטגוריות</p>
                  </div>
                </div>
                <button
                  onClick={handleClearData}
                  disabled={isLoading}
                  className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto ${
                    showClearConfirm 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {showClearConfirm ? 'אישור מחיקה' : 'מחק'}
                </button>
              </div>

              {showClearConfirm && (
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 sm:space-x-reverse p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      לחץ שוב על "אישור מחיקה" כדי למחוק את כל הנתונים לצמיתות
                    </p>
                  </div>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="text-yellow-600 hover:text-yellow-800 text-sm underline self-start sm:self-center"
                  >
                    ביטול
                  </button>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex items-start space-x-3 space-x-reverse p-4 rounded-xl bg-blue-50 border border-blue-200">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">מידע חשוב:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• הנתונים נשמרים באופן אוטומטי בדפדפן שלך</li>
                  <li>• גיבוי אוטומטי נוצר כל 10 פוסטים</li>
                  <li>• מומלץ לייצא גיבוי באופן קבוע</li>
                  <li>• IndexedDB מספק אחסון יציב יותר מ-LocalStorage</li>
                  <li>• לחץ Escape או לחץ מחוץ לחלון כדי לסגור</li>
                </ul>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="btn-secondary px-6 py-2 w-full sm:w-auto"
              >
                סגור
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StorageManager;
