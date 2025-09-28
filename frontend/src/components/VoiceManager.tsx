// // src/components/VoiceManager.tsx
// import { useRef, useEffect, useState, useCallback } from 'react';

// // --- Interfaces for Web Speech API to fix TypeScript errors ---
// interface SpeechRecognition extends EventTarget {
//   continuous: boolean;
//   interimResults: boolean;
//   lang: string;
//   start(): void;
//   stop(): void;
//   abort(): void;
// }

// interface SpeechRecognitionEvent extends Event {
//   results: SpeechRecognitionResultList;
//   resultIndex: number;
// }

// interface SpeechRecognitionErrorEvent extends Event {
//   error: string;
// }

// declare global {
//   interface Window {
//     SpeechRecognition: new () => SpeechRecognition;
//     webkitSpeechRecognition: new () => SpeechRecognition;
//   }
// }

// // --- Component Props ---
// interface VoiceManagerProps {
//   isListening: boolean;
//   onTranscriptUpdate: (transcript: string) => void;
//   onFinalTranscript: (transcript: string) => void;
//   onAudioRecorded: (audioBlob: Blob) => void;
//   isScreenSharing?: boolean;
// }

// const VoiceManager: React.FC<VoiceManagerProps> = ({
//   isListening,
//   onTranscriptUpdate,
//   onFinalTranscript,
//   onAudioRecorded,
//   isScreenSharing = false,
// }) => {
//   const [isSupported, setIsSupported] = useState(false);

//   // --- Refs ---
//   const recognitionRef = useRef<SpeechRecognition | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const streamRef = useRef<MediaStream | null>(null);

//   // Check for browser support on component mount
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     setIsSupported(!!SpeechRecognition && !!navigator.mediaDevices?.getUserMedia);
//   }, []);

//   // Main effect to start/stop listening based on props
//   useEffect(() => {
//     if (isListening) {
//       startListening();
//     } else {
//       stopListening();
//     }
//     // Cleanup function to stop everything when the component unmounts or props change
//     return () => {
//       stopListening();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isListening]);

//   // --- Core Functions ---

//   const startListening = useCallback(async () => {
//     if (!isSupported || recognitionRef.current) {
//       console.log('VoiceManager: Not supported or already listening.');
//       return;
//     }

//     // 1. Initialize and configure Speech Recognition
//     const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognitionAPI();
//     recognitionRef.current = recognition;
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';

//     // FIX: Use addEventListener for type safety and modern standards
//     recognition.addEventListener('result', handleRecognitionResult);
//     recognition.addEventListener('error', handleRecognitionError);
//     recognition.addEventListener('end', handleRecognitionEnd);

//     // 2. Initialize Audio Recording
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
//       });
//       streamRef.current = stream;

//       const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.addEventListener('dataavailable', (event) => {
//         if (event.data.size > 0) audioChunksRef.current.push(event.data);
//       });

//       mediaRecorder.addEventListener('stop', () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
//         if (audioBlob.size > 0) {
//           onAudioRecorded(audioBlob);
//         }
//         // Clean up stream tracks
//         streamRef.current?.getTracks().forEach((track) => track.stop());
//         streamRef.current = null;
//       });

//       // 3. Start both processes
//       recognition.start();
//       mediaRecorder.start();
//       console.log('VoiceManager: Started speech recognition and audio recording.');
//     } catch (error) {
//       console.error('VoiceManager: Failed to get audio permissions.', error);
//       stopListening(); // Clean up if we fail to start
//     }
//   }, [isSupported]);

//   const stopListening = useCallback(() => {
//     // Stop speech recognition and remove listeners
//     if (recognitionRef.current) {
//       recognitionRef.current.removeEventListener('result', handleRecognitionResult);
//       recognitionRef.current.removeEventListener('error', handleRecognitionError);
//       recognitionRef.current.removeEventListener('end', handleRecognitionEnd);
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//     }

//     // Stop the media recorder if it's running
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
//       mediaRecorderRef.current.stop();
//     }
//     mediaRecorderRef.current = null;

//     console.log('VoiceManager: Stopped listening.');
//   }, []);

//   // --- Event Handlers for Speech Recognition (defined outside useCallback for stability) ---

//   const handleRecognitionResult = (event: Event) => {
//     const speechEvent = event as SpeechRecognitionEvent;
//     let interimTranscript = '';
//     let finalTranscript = '';

//     for (let i = speechEvent.resultIndex; i < speechEvent.results.length; i++) {
//       const transcriptPart = speechEvent.results[i][0].transcript;
//       if (speechEvent.results[i].isFinal) {
//         finalTranscript += transcriptPart;
//       } else {
//         interimTranscript += transcriptPart;
//       }
//     }

//     onTranscriptUpdate(finalTranscript + interimTranscript);
//     if (finalTranscript.trim()) {
//       onFinalTranscript(finalTranscript.trim());
//     }
//   };

//   const handleRecognitionError = (event: Event) => {
//     const errorEvent = event as SpeechRecognitionErrorEvent;
//     console.error('Speech recognition error:', errorEvent.error);
//   };

//   const handleRecognitionEnd = () => {
//     // If the service ends but we are supposed to be listening (e.g., during screen share), restart it.
//     if (isListening) {
//       console.log('Speech recognition service ended, restarting...');
//       // A small delay to prevent rapid-fire restarts on some platforms
//       setTimeout(() => {
//         if (isListening && recognitionRef.current) {
//           try {
//             recognitionRef.current.start();
//           } catch (e) {
//             console.error('Error restarting recognition:', e);
//           }
//         }
//       }, 500);
//     }
//   };

//   // This component is for logic only and renders no UI
//   return null;
// };

// export default VoiceManager;

// src/components/VoiceManager.tsx (Complete Fixed Version)
import { useRef, useEffect, useState, useCallback } from 'react';

// --- Interfaces for Web Speech API ---
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// --- Component Props ---
interface VoiceManagerProps {
  isListening: boolean;
  onTranscriptUpdate: (transcript: string) => void;
  onFinalTranscript: (transcript: string) => void;
  onAudioRecorded: (audioBlob: Blob) => void;
}

const VoiceManager: React.FC<VoiceManagerProps> = ({
  isListening,
  onTranscriptUpdate,
  onFinalTranscript,
  onAudioRecorded,
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // --- Refs ---
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const isStoppingRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for browser support and permission on component mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isVoiceSupported = !!SpeechRecognition && !!navigator.mediaDevices?.getUserMedia;
    setIsSupported(isVoiceSupported);
    
    if (isVoiceSupported) {
      checkMicrophonePermission();
    }
  }, []);

  // Check microphone permission
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      // Immediately stop the stream since this is just a permission check
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.warn('Microphone permission not granted:', error);
      setHasPermission(false);
    }
  };

  // Main effect to start/stop listening based on props
  useEffect(() => {
    if (isListening && isSupported && hasPermission) {
      startListening();
    } else {
      stopListening();
    }
    
    // Cleanup function to stop everything when the component unmounts
    return () => {
      isStoppingRef.current = true;
      stopListening();
    };
  }, [isListening, isSupported, hasPermission]);

  // --- Core Functions ---
  const startListening = useCallback(async () => {
    if (!isSupported || !hasPermission || recognitionRef.current) return;
    isStoppingRef.current = false;

    try {
      // 1. Initialize and configure Speech Recognition
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.addEventListener('result', handleRecognitionResult);
      recognition.addEventListener('error', handleRecognitionError);
      recognition.addEventListener('end', handleRecognitionEnd);

      // 2. Initialize Audio Recording
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (audioBlob.size > 0) {
            onAudioRecorded(audioBlob);
          }
        }
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      });
      
      // 3. Start both processes
      recognition.start();
      mediaRecorder.start();
      console.log('VoiceManager: Started speech recognition and audio recording.');
      
    } catch (error) {
      console.error('VoiceManager: Failed to start voice recognition.', error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setHasPermission(false);
      }
      stopListening(); // Clean up on failure
    }
  }, [isSupported, hasPermission, onAudioRecorded]);

  const stopListening = useCallback(() => {
    isStoppingRef.current = true;
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.removeEventListener('result', handleRecognitionResult);
      recognitionRef.current.removeEventListener('error', handleRecognitionError);
      recognitionRef.current.removeEventListener('end', handleRecognitionEnd);
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    }

    console.log('VoiceManager: Stopped listening.');
  }, []);

  // --- Event Handlers for Speech Recognition ---
  const handleRecognitionResult = (event: Event) => {
    const speechEvent = event as SpeechRecognitionEvent;
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = speechEvent.resultIndex; i < speechEvent.results.length; i++) {
      const transcriptPart = speechEvent.results[i][0].transcript;
      if (speechEvent.results[i].isFinal) {
        finalTranscript += transcriptPart;
      } else {
        interimTranscript += transcriptPart;
      }
    }
    onTranscriptUpdate(finalTranscript + interimTranscript);
    if (finalTranscript.trim()) {
      onFinalTranscript(finalTranscript.trim());
    }
  };

  const handleRecognitionError = (event: Event) => {
    const errorEvent = event as SpeechRecognitionErrorEvent;
    console.error('Speech recognition error:', errorEvent.error);
    if (errorEvent.error === 'not-allowed') {
      setHasPermission(false);
    }
  };

  const handleRecognitionEnd = () => {
    if (isStoppingRef.current || !isListening) return;
    
    console.log('Speech recognition service ended, attempting restart...');
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    
    restartTimeoutRef.current = setTimeout(() => {
      if (isListening && !isStoppingRef.current && recognitionRef.current === null) {
        console.log('Restarting speech recognition...');
        startListening();
      }
    }, 500);
  };

  // This component is for logic only and renders no UI
  return null;
};

export default VoiceManager;