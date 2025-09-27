// src/components/TabDetector.tsx
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit3, X, Eye } from 'lucide-react';

interface TabDetectorProps {
  onActivateAnnotation: () => void;
  isAnnotationActive: boolean;
}

const TabDetector: React.FC<TabDetectorProps> = ({
  onActivateAnnotation,
  isAnnotationActive
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const [hasReturnedToTab, setHasReturnedToTab] = useState(false);

  useEffect(() => {
    let returnTimeout: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      const isCurrentlyActive = !document.hidden;
      setIsTabActive(isCurrentlyActive);

      if (isCurrentlyActive && !isAnnotationActive) {
        // User returned to this tab
        setHasReturnedToTab(true);
        
        // Show prompt after a short delay to avoid accidental triggers
        returnTimeout = setTimeout(() => {
          setShowPrompt(true);
        }, 1000);
      } else if (!isCurrentlyActive) {
        // User switched away from this tab
        setHasReturnedToTab(false);
        setShowPrompt(false);
        if (returnTimeout) {
          clearTimeout(returnTimeout);
        }
      }
    };

    // Listen for tab visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for focus events as backup
    const handleFocus = () => {
      if (!document.hidden) {
        setIsTabActive(true);
      }
    };

    const handleBlur = () => {
      setIsTabActive(false);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      if (returnTimeout) {
        clearTimeout(returnTimeout);
      }
    };
  }, [isAnnotationActive]);

  // Auto-hide prompt after 10 seconds
  useEffect(() => {
    if (showPrompt) {
      const hideTimeout = setTimeout(() => {
        setShowPrompt(false);
      }, 10000);

      return () => clearTimeout(hideTimeout);
    }
  }, [showPrompt]);

  const handleActivateAnnotation = () => {
    setShowPrompt(false);
    onActivateAnnotation();
  };

  const handleDismissPrompt = () => {
    setShowPrompt(false);
  };

  // Don't show anything if annotation is already active
  if (isAnnotationActive) return null;

  return (
    <>
      {/* Tab status indicator */}
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-40 transition-opacity duration-500 ${
        isTabActive ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          <Eye size={14} className="inline mr-1" />
          Engineering Hub is running in background
        </div>
      </div>

      {/* Annotation prompt */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl border p-6 max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <Edit3 className="text-blue-600" size={24} />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome Back!
              </h3>
              
              <p className="text-gray-600 mb-6">
                Would you like to activate annotation mode to draw, highlight, and analyze content with AI assistance?
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleActivateAnnotation}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit3 size={16} className="mr-2" />
                  Start Annotating
                </Button>
                
                <Button
                  onClick={handleDismissPrompt}
                  variant="outline"
                >
                  <X size={16} className="mr-2" />
                  Not Now
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                This prompt will auto-hide in 10 seconds
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TabDetector;