// src/components/AudioResponseManager.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { cn } from "@/lib/utils";

interface AudioResponseManagerProps {
  text: string;
  autoPlay?: boolean;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  className?: string;
}

const AudioResponseManager: React.FC<AudioResponseManagerProps> = ({
  text,
  autoPlay = false,
  onPlayStart,
  onPlayEnd,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    setIsSupported('speechSynthesis' in window);
  }, []);

  useEffect(() => {
    if (text && autoPlay && isSupported) {
      playAudio();
    }

    // Cleanup function
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [text, autoPlay, isSupported]);

  const playAudio = () => {
    if (!text || !isSupported) return;

    // Stop any currently playing speech
    speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure speech settings
    utterance.rate = 1.1; // Slightly faster for better UX
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Try to get a more natural voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Neural')
    ) || voices.find(voice => 
      voice.lang.startsWith('en') && !voice.name.includes('Microsoft')
    ) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      onPlayStart?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      onPlayEnd?.();
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      onPlayEnd?.();
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    onPlayEnd?.();
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  // Don't render if speech synthesis is not supported
  if (!isSupported) {
    return null;
  }

  return (
    <div className={cn(
      "bg-white rounded-lg shadow-lg border p-3 flex items-center gap-2 max-w-sm",
      className
    )}>
      <Button
        size="sm"
        variant={isPlaying ? "destructive" : "default"}
        onClick={toggleAudio}
        disabled={!text}
      >
        {isPlaying ? (
          <>
            <Pause size={14} />
            <span className="ml-1">Stop</span>
          </>
        ) : (
          <>
            <Volume2 size={14} />
            <span className="ml-1">Play</span>
          </>
        )}
      </Button>
      
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-600">AI Response</div>
        <div className="text-xs text-gray-500 truncate">
          {isPlaying ? 'Playing audio...' : 'Ready to play'}
        </div>
      </div>
      
      {isPlaying && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse animation-delay-100"></div>
          <div className="w-1 h-1 bg-green-300 rounded-full animate-pulse animation-delay-200"></div>
        </div>
      )}
    </div>
  );
};

export default AudioResponseManager;