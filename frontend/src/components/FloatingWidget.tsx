// src/components/FloatingWidget.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Monitor, Edit3, Mic, MicOff, Zap, FileImage, 
  Square, ChevronLeft, ChevronRight, Minimize2,
  Volume2, Settings, X, Maximize2
} from 'lucide-react';

interface FloatingWidgetProps {
  isScreenSharing: boolean;
  isVoiceListening: boolean;
  currentTranscript?: string;
  isProcessing?: boolean;
  onToggleVoice: () => void;
  onAnalyzeScreen: () => void;
  onOpenAnnotation: () => void;
  onOpenWhiteScreen: () => void;
  onStopScreenShare: () => void;
  position?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
}

const FloatingWidget: React.FC<FloatingWidgetProps> = ({
  isScreenSharing,
  isVoiceListening,
  currentTranscript = '',
  isProcessing = false,
  onToggleVoice,
  onAnalyzeScreen,
  onOpenAnnotation,
  onOpenWhiteScreen,
  onStopScreenShare,
  position = { x: window.innerWidth - 280, y: 100 },
  onPositionChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Update position when prop changes
  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!widgetRef.current) return;
    
    setIsDragging(true);
    const rect = widgetRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newPosition = {
      x: Math.max(0, Math.min(window.innerWidth - 280, e.clientX - dragOffset.x)),
      y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
    };

    setCurrentPosition(newPosition);
    onPositionChange?.(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Auto-expand on first render if screen sharing is active
  useEffect(() => {
    if (isScreenSharing && !isExpanded) {
      setTimeout(() => setIsExpanded(true), 500);
    }
  }, [isScreenSharing]);

  if (!isScreenSharing) return null;

  return (
    <div
      ref={widgetRef}
      className={`fixed z-[9999] transition-all duration-300 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        width: isMinimized ? '60px' : isExpanded ? '280px' : '80px',
        height: isMinimized ? '60px' : isExpanded ? 'auto' : '80px'
      }}
    >
      {/* Main Widget Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
        
        {/* Header - Always visible */}
        <div 
          className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              {!isMinimized && (
                <span className="text-sm font-medium">
                  {isProcessing ? 'Processing...' : isVoiceListening ? 'Listening' : 'Active'}
                </span>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-1">
              {!isMinimized && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </Button>
            </div>
          </div>

          {/* Transcript Display */}
          {!isMinimized && currentTranscript && (
            <div className="mt-2 text-xs bg-white/20 rounded px-2 py-1 max-h-12 overflow-hidden">
              <div className="truncate">{currentTranscript}</div>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && !isMinimized && (
          <div className="p-4 space-y-3">
            
            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={onAnalyzeScreen}
                disabled={isProcessing}
              >
                <Zap size={16} className="mr-1" />
                Analyze
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className={`${
                  isVoiceListening 
                    ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100' 
                    : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
                onClick={onToggleVoice}
              >
                {isVoiceListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span className="ml-1">{isVoiceListening ? 'Stop' : 'Voice'}</span>
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
                onClick={onOpenAnnotation}
              >
                <Edit3 size={16} className="mr-2" />
                Annotation Mode
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
                onClick={onOpenWhiteScreen}
              >
                <FileImage size={16} className="mr-2" />
                White Screen
              </Button>
            </div>

            {/* Status & Controls */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Monitor size={12} />
                  Screen Sharing
                </div>
                {isVoiceListening && (
                  <div className="flex items-center gap-1">
                    <Volume2 size={12} />
                    Voice Active
                  </div>
                )}
              </div>
              
              <Button
                size="sm"
                variant="destructive"
                className="w-full"
                onClick={onStopScreenShare}
              >
                <Square size={14} className="mr-1" />
                Stop Sharing
              </Button>
            </div>
          </div>
        )}

        {/* Minimized Quick Actions */}
        {!isExpanded && !isMinimized && (
          <div className="p-2 flex justify-center">
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white w-full"
              onClick={onAnalyzeScreen}
              disabled={isProcessing}
            >
              <Zap size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default FloatingWidget;