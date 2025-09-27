

// // src/pages/GeminiStudyGuide.tsx (Complete Updated Version)

// import { useState, useRef, useEffect, useCallback } from 'react';
// import ChatBubble from '@/components/ChatBubble';

// import VoiceManager from '@/components/VoiceManager';
// import AnnotationOverlay from '@/components/AnnotationOverlay';
// import AudioResponseManager from '@/components/AudioResponseManager';
// import FloatingWidget from '@/components/FloatingWidget';
// import ScreenShareManager from '@/components/ScreenShareManager';
// import WhiteScreen from '@/components/WhiteScreen';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { 
//   ArrowUp, Sparkles, Paperclip, X, PlusCircle, MessageSquare, 
//   Trash2, FileText, Image, Music, Video, File as FileIcon, ChevronDown,
//   Download, Copy, MoreVertical, Monitor, FileImage, Square, Edit3
// } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// // --- DATA STRUCTURES ---
// interface HistoryItem {
//   role: 'user' | 'model';
//   parts: { text: string }[];
// }

// interface Conversation {
//   id: string;
//   title: string;
//   history: HistoryItem[];
//   createdAt: Date;
// }

// interface ScreenState {
//   isSharing: boolean;
//   mediaStream: MediaStream | null;
//   imageCapture: ImageCapture | null;
// }

// interface VoiceState {
//   isListening: boolean;
//   currentTranscript: string;
//   finalTranscript: string;
//   audioBlob: Blob | null;
//   isProcessing: boolean;
// }

// // --- FILE TYPE UTILITIES ---
// const getFileIcon = (mimeType: string) => {
//   if (mimeType.startsWith('image/')) return <Image size={16} className="text-blue-500" />;
//   if (mimeType === 'application/pdf') return <FileText size={16} className="text-red-500" />;
//   if (mimeType.includes('word') || mimeType.includes('document')) return <FileText size={16} className="text-blue-600" />;
//   if (mimeType.includes('excel') || mimeType.includes('sheet')) return <FileText size={16} className="text-green-600" />;
//   if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return <FileText size={16} className="text-orange-600" />;
//   if (mimeType.startsWith('audio/')) return <Music size={16} className="text-purple-500" />;
//   if (mimeType.startsWith('video/')) return <Video size={16} className="text-pink-500" />;
//   return <FileIcon size={16} className="text-gray-500" />;
// };

// const formatFileSize = (bytes: number): string => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };

// const examplePrompts = [
//   "Give me Roadmap for Mastering DSA With C language.",
//   "Start screen sharing to analyze content with voice commands",
//   "Help me understand code and diagrams through voice interaction"
// ];



// const GeminiStudyGuide = () => {
//   // --- STATE MANAGEMENT ---
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
//   const [message, setMessage] = useState('');
//   const [files, setFiles] = useState<File[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [dragOver, setDragOver] = useState(false);

//   // Screen sharing state
//   const [screenState, setScreenState] = useState<ScreenState>({
//     isSharing: false,
//     mediaStream: null,
//     imageCapture: null,
//   });

//   // Voice state
//   const [voiceState, setVoiceState] = useState<VoiceState>({
//     isListening: false,
//     currentTranscript: '',
//     finalTranscript: '',
//     audioBlob: null,
//     isProcessing: false,
//   });

//   // UI states
//   // --- NEW UNIFIED STATE FOR OVERLAYS ---
//   const [isAnnotationActive, setIsAnnotationActive] = useState(false); // <-- ADD THIS LINE
//   const [isWhiteScreenActive, setIsWhiteScreenActive] = useState(false); // <-- ADD THIS LINE
//   const [annotationMode, setAnnotationMode] = useState<'whiteboard' | 'overlay' | null>(null);
//   const [showAnnotationChoice, setShowAnnotationChoice] = useState(false);
//   const [currentAudioResponse, setCurrentAudioResponse] = useState<string>('');
//   const [floatingWidgetPosition, setFloatingWidgetPosition] = useState({ x: window.innerWidth - 280, y: 100 });

//   // Refs
//   const activeConversation = conversations.find(c => c.id === activeConversationId);
//   const activeHistory = activeConversation?.history ?? [];
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const voiceCaptureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // --- SCREEN SHARING FUNCTIONS ---
//   const handleStreamChange = (stream: MediaStream | null, imageCapture: ImageCapture | null) => {
//     setScreenState(prev => ({
//       ...prev,
//       mediaStream: stream,
//       imageCapture: imageCapture
//     }));

//     // Auto-start voice listening when screen sharing starts
//     if (stream && imageCapture) {
//       setVoiceState(prev => ({ ...prev, isListening: true }));
//     }
//   };

//   const handleSharingEnd = () => {
//     setScreenState({
//       isSharing: false,
//       mediaStream: null,
//       imageCapture: null,
//     });

//     // Stop voice listening when screen sharing ends
//     setVoiceState(prev => ({ 
//       ...prev, 
//       isListening: false,
//       currentTranscript: '',
//       finalTranscript: '',
//       audioBlob: null,
//       isProcessing: false
//     }));
//   };

//   // FIX: Add this useEffect to prevent layout shift when modal is open
//   useEffect(() => {
//     if (showAnnotationChoice) {
//       const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
//       document.body.style.overflow = 'hidden';
//       document.body.style.paddingRight = `${scrollbarWidth}px`;
//     } else {
//       document.body.style.overflow = 'auto';
//       document.body.style.paddingRight = '0px';
//     }

//     // Cleanup function to restore scrolling if component unmounts
//     return () => {
//       document.body.style.overflow = 'auto';
//       document.body.style.paddingRight = '0px';
//     };
//   }, [showAnnotationChoice]);

//   const startScreenShare = () => {
//     setScreenState(prev => ({ ...prev, isSharing: true }));
//   };

//   const stopScreenShare = () => {
//     setScreenState(prev => ({ ...prev, isSharing: false }));
//     handleSharingEnd();
//   };

//   const captureScreenFrame = async (): Promise<Blob> => {
//     if (!screenState.imageCapture) {
//       throw new Error('ImageCapture not available. Is screen sharing active?');
//     }
//     if (!canvasRef.current) {
//       throw new Error('Canvas element is not available.');
//     }
    
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) {
//       throw new Error('Could not get canvas context.');
//     }

//     try {
//       const imageBitmap = await (screenState.imageCapture as any).grabFrame();
      
//       canvas.width = imageBitmap.width;
//       canvas.height = imageBitmap.height;
//       ctx.drawImage(imageBitmap, 0, 0);
//       imageBitmap.close();

//       return new Promise((resolve, reject) => {
//         canvas.toBlob((blob) => {
//           if (blob) {
//             resolve(blob);
//           } else {
//             reject(new Error('Failed to create blob from canvas.'));
//           }
//         }, 'image/png');
//       });
//     } catch (error) {
//       console.error("Error capturing screen frame:", error);
//       throw new Error("Could not capture screen frame.");
//     }
//   };

//   // --- VOICE HANDLING FUNCTIONS ---
//   const handleTranscriptUpdate = useCallback((transcript: string) => {
//     setVoiceState(prev => ({ ...prev, currentTranscript: transcript }));
//   }, []);

//   const handleFinalTranscript = useCallback((transcript: string) => {
//     if (!screenState.isSharing || !transcript.trim()) return;

//     setVoiceState(prev => ({ 
//       ...prev, 
//       finalTranscript: transcript,
//       isProcessing: true 
//     }));

//     // Clear any existing timeout
//     if (voiceCaptureTimeoutRef.current) {
//       clearTimeout(voiceCaptureTimeoutRef.current);
//     }

//     // Set delay for screen capture (2.5 seconds to allow tab switching)
//     voiceCaptureTimeoutRef.current = setTimeout(async () => {
//       try {
//         await processVoiceQuery(transcript);
//       } catch (error) {
//         console.error('Error processing voice query:', error);
//         setVoiceState(prev => ({ ...prev, isProcessing: false }));
//       }
//     }, 2500);
//   }, [screenState.isSharing]);

//   const handleAudioRecorded = useCallback((audioBlob: Blob) => {
//     setVoiceState(prev => ({ ...prev, audioBlob }));
//   }, []);

//   const processVoiceQuery = async (transcript: string) => {
//     if (!screenState.isSharing || isLoading) return;
//     setIsLoading(true);
//     try {
//       const frameBlob = await captureScreenFrame();
//       const frameFile = new File([frameBlob], 'voice-screen-capture.png', { type: 'image/png' });
//       let analysisFiles = [frameFile];
//       if (voiceState.audioBlob) {
//         // *** THE CORE AUDIO BUG FIX IS HERE ***
//         // It now correctly uses the blob's original MIME type and a matching file extension.
//         const audioFile = new File([voiceState.audioBlob], 'voice-query.webm', { type: voiceState.audioBlob.type });
//         analysisFiles.push(audioFile);
//       }
//       await sendMessageWithFiles(transcript, analysisFiles, true);
//     } catch (error) {
//       console.error('Error processing voice query:', error);
//       setCurrentAudioResponse('Failed to process voice query. Please try again.');
//     } finally {
//       setIsLoading(false);
//       setVoiceState(prev => ({ ...prev, isProcessing: false, currentTranscript: '', finalTranscript: '', audioBlob: null }));
//     }
//   };

//   const toggleVoiceListening = () => {
//     if (!screenState.isSharing) return;
    
//     setVoiceState(prev => ({ 
//       ...prev, 
//       isListening: !prev.isListening,
//       currentTranscript: '',
//       finalTranscript: ''
//     }));
//   };


//   // --- HANDLER for AnnotationOverlay and WhiteScreen ---
//   const handleOverlaySendToAI = async (imageBlob: Blob, audioBlob?: Blob, textQuery?: string) => {
//     const imageFile = new File([imageBlob], 'overlay-content.png', { type: 'image/png' });
//     const files: File[] = [imageFile];
//     if (audioBlob) {
//       const audioFile = new File([audioBlob], 'overlay-audio.webm', { type: audioBlob.type });
//       files.push(audioFile);
//     }
//     await sendMessageWithFiles(textQuery || 'Analyze this content', files, !!audioBlob);
//     // This closes the canvas after sending
//     setAnnotationMode(null);
//   };


//   // --- FLOATING WIDGET HANDLERS ---
//   const handleAnalyzeScreen = async () => {
//     if (!screenState.isSharing) return;
    
//     try {
//       setIsLoading(true);
//       const frameBlob = await captureScreenFrame();
//       const frameFile = new File([frameBlob], 'manual-screen-capture.png', { type: 'image/png' });
//       await sendMessageWithFiles('Analyze this screen capture', [frameFile], false);
//     } catch (error) {
//       console.error('Error analyzing screen:', error);
//       setCurrentAudioResponse('Failed to analyze screen. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOpenAnnotation = () => {
//     setIsAnnotationActive(true);
//   };

//   const handleOpenWhiteScreen = () => {
//     setIsWhiteScreenActive(true);
//   };

//   // --- ENHANCED SEND MESSAGE FUNCTION ---
//   const sendMessageWithFiles = async (
//     messageText: string, 
//     additionalFiles: File[] = [], 
//     isVoiceQuery: boolean = false
//   ) => {
//     if (!messageText.trim() && files.length === 0 && additionalFiles.length === 0) return;
//     if (isLoading) return;

//     setIsLoading(true);

//     const allFiles = [...files, ...additionalFiles];
//     const userMessageText = messageText || (allFiles.length > 0 ? `Analyze ${allFiles.length} file(s): ${allFiles.map(f => f.name).join(', ')}` : "");
//     const userMessage: HistoryItem = { role: 'user', parts: [{ text: userMessageText }] };

//     let conversationId = activeConversationId;
//     let historyForApi = [...activeHistory, userMessage];

//     if (!conversationId) {
//       const newId = Date.now().toString();
//       const newTitle = (isVoiceQuery ? 'Voice: ' : '') + userMessageText.substring(0, 40) + (userMessageText.length > 40 ? '...' : '');
//       const newConversation: Conversation = { 
//         id: newId, 
//         title: newTitle, 
//         history: [userMessage],
//         createdAt: new Date()
//       };

//       setConversations(prev => [newConversation, ...prev]);
//       setActiveConversationId(newId);
//       conversationId = newId;
//     } else {
//       updateConversationHistory(conversationId, historyForApi);
//     }

//     updateConversationHistory(conversationId, [...historyForApi, { role: 'model', parts: [{ text: '' }] }]);

//     setMessage('');
//     setFiles([]);

//     const formData = new FormData();
    
//     if (isVoiceQuery) {
//       formData.append('message', messageText + '\n\n[VOICE_QUERY: Please provide a concise but complete response suitable for audio playback. Focus on key insights and practical information.]');
//     } else {
//       formData.append('message', messageText);
//     }

//     const sanitizedHistory = historyForApi.map(h => ({
//       role: h.role === 'user' ? 'user' : 'model',
//       parts: Array.isArray(h.parts) && h.parts.length ? h.parts : [{ text: '' }]
//     }));
//     formData.append('history', JSON.stringify(sanitizedHistory));

//     allFiles.forEach(file => formData.append('files', file));

//     try {
//       const response = await fetch('http://localhost:5000/api/gemini/chat', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || `Request failed with status ${response.status}`);
//       }

//       if (!response.body) {
//         throw new Error('No response body received');
//       }

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let accumulatedResponse = '';

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         accumulatedResponse += chunk;

//         const streamingHistory = [...historyForApi, { role: 'model', parts: [{ text: accumulatedResponse }] }];
//         updateConversationHistory(conversationId, streamingHistory);
//       }

//       // For voice queries, trigger audio response
//       if (isVoiceQuery && accumulatedResponse.trim()) {
//         setCurrentAudioResponse(accumulatedResponse.trim());
//       }

//     } catch (error) {
//       console.error('Error fetching stream:', error);
//       let errorMessage = 'Sorry, something went wrong. ';

//       if (error instanceof Error) {
//         if (error.message.includes('quota')) {
//           errorMessage += 'API quota exceeded. Please try again later.';
//         } else if (error.message.includes('safety')) {
//           errorMessage += 'Content was flagged by safety filters. Please try rephrasing your question.';
//         } else if (error.message.includes('file')) {
//           errorMessage += 'There was an issue processing your files. Please check the file formats and try again.';
//         } else {
//           errorMessage += error.message;
//         }
//       } else {
//         errorMessage += 'Unknown error occurred.';
//       }

//       const finalHistoryWithError = [...historyForApi, { role: 'model', parts: [{ text: errorMessage }] }];
//       updateConversationHistory(conversationId, finalHistoryWithError);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- EXISTING FUNCTIONS (keeping all your original functions) ---
  
//   useEffect(() => {
//     try {
//       const storedConversations = localStorage.getItem('chat_conversations');
//       if (storedConversations) {
//         const parsedConversations: unknown = JSON.parse(storedConversations);

//         // Type guard to ensure data is in the expected format
//         if (Array.isArray(parsedConversations)) {
//           const typedConversations: Conversation[] = parsedConversations.map((conv: any) => ({
//             id: conv.id || '',
//             title: conv.title || 'Untitled Chat',
//             createdAt: new Date(conv.createdAt),
//             history: Array.isArray(conv.history) ? conv.history.map((h: any) => ({
//               role: h.role === 'user' ? 'user' : 'model',
//               parts: Array.isArray(h.parts) ? h.parts : [{ text: '' }],
//             })) : [],
//           }));
//           setConversations(typedConversations);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to parse conversations from localStorage", error);
//     }
//   }, []);

//   useEffect(() => {
//     if (conversations.length === 0) {
//       localStorage.removeItem('chat_conversations');
//     } else {
//       localStorage.setItem('chat_conversations', JSON.stringify(conversations));
//     }
//   }, [conversations]);
  
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
//     }
//   }, [activeHistory, isLoading]);

//   // --- DRAG AND DROP HANDLERS ---
//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(true);
//   };

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
    
//     const droppedFiles = Array.from(e.dataTransfer.files);
//     handleFileSelection(droppedFiles);
//   };

//   // --- FILE HANDLING ---
//   const handleFileSelection = (newFiles: File[]) => {
//     const validFiles = newFiles.filter(file => {
//       if (file.size > 100 * 1024 * 1024) {
//         alert(`File ${file.name} is too large. Maximum size is 100MB.`);
//         return false;
//       }
//       return true;
//     });

//     const totalFiles = files.length + validFiles.length;
//     if (totalFiles > 10) {
//       alert(`You can only upload up to 10 files at once. You're trying to add ${totalFiles} files.`);
//       return;
//     }

//     setFiles(prev => [...prev, ...validFiles]);
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       const newFiles = Array.from(event.target.files);
//       handleFileSelection(newFiles);
//     }
//   };

//   const handleRemoveFile = (index: number) => {
//     setFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const clearAllFiles = () => {
//     setFiles([]);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   // --- CHAT HANDLERS ---
//   const handleNewChat = () => {
//     setActiveConversationId(null);
//     setMessage('');
//     setFiles([]);
//   };

//   const handleSelectChat = (id: string) => {
//     setActiveConversationId(id);
//     setMessage('');
//     setFiles([]);
//   };

//   const handleDeleteChat = (e: React.MouseEvent, id: string) => {
//     e.stopPropagation();
//     setConversations(prev => prev.filter(c => c.id !== id));
//     if (activeConversationId === id) {
//       handleNewChat();
//     }
//   };

//   const copyConversation = (conversation: Conversation) => {
//     const text = conversation.history
//       .map(item => `**${item.role.toUpperCase()}:** ${item.parts[0].text}`)
//       .join('\n\n');
//     navigator.clipboard.writeText(text);
//   };

//   const exportConversation = (conversation: Conversation) => {
//     const text = conversation.history
//       .map(item => `${item.role.toUpperCase()}: ${item.parts[0].text}`)
//       .join('\n\n');
//     const blob = new Blob([text], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${conversation.title}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const updateConversationHistory = (id: string, newHistory: HistoryItem[]) => {
//     setConversations(prev =>
//       prev.map(c => c.id === id ? { ...c, history: newHistory } : c)
//     );
//   };

//   const sendMessage = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     await sendMessageWithFiles(message, []);
//   };

//   // --- ANNOTATION HANDLERS ---
//   const handleActivateAnnotation = () => {
//     setIsAnnotationActive(true);
//   };

//   const handleCloseAnnotation = () => {
//     setIsAnnotationActive(false);
//   };

//   // src/pages/GeminiStudyGuide.tsx

//   const handleAnnotationSendToAI = async (imageBlob: Blob, audioBlob?: Blob, textQuery?: string) => {
//     const imageFile = new File([imageBlob], 'annotation.png', { type: 'image/png' });
//     const files: File[] = [imageFile];
    
//     if (audioBlob) {
//     // FIX: Changed to .webm and using the correct blob type
//     const audioFile = new File([audioBlob], 'annotation-audio.webm', { type: audioBlob.type });
//     files.push(audioFile);
//   }

//     await sendMessageWithFiles(textQuery || 'Analyze this annotation', files, !!audioBlob);
//     setIsAnnotationActive(false);
//   };

//   // --- WHITE SCREEN HANDLERS ---
//   const handleCloseWhiteScreen = () => {
//     setIsWhiteScreenActive(false);
//   };

//   const handleWhiteScreenSendToAI = async (imageBlob: Blob, audioBlob?: Blob, textQuery?: string) => {
//     const imageFile = new File([imageBlob], 'whiteboard.png', { type: 'image/png' });
//     const files: File[] = [imageFile];
    
//     if (audioBlob) {
//     // FIX: Changed to .webm and using the correct blob type
//     const audioFile = new File([audioBlob], 'whiteboard-audio.webm', { type: audioBlob.type });
//     files.push(audioFile);
//   }

//     await sendMessageWithFiles(textQuery || 'Analyze this drawing', files, !!audioBlob);
//     setIsWhiteScreenActive(false);
//   };
//   // --- JSX LAYOUT ---
//   return (
//     <div className="flex h-screen overflow-hidden bg-gradient-to-tr from-[#e9edfb] via-[#f6f8ff] to-[#e8f2fe] dark:from-[#1a2139] dark:via-[#232848] dark:to-[#19233b] transition-colors duration-500">
      
//       {/* Hidden canvas for screen capture */}
//       <canvas ref={canvasRef} style={{ display: 'none' }} />

//       {/* Screen Share Manager */}
//       <ScreenShareManager
//         isSharing={screenState.isSharing}
//         onStreamChange={handleStreamChange}
//         onSharingEnd={handleSharingEnd}
//       />

//       {/* Voice Manager - Only active when screen sharing */}
//       {screenState.isSharing && (
//         <VoiceManager
//           isListening={voiceState.isListening}
//           onTranscriptUpdate={handleTranscriptUpdate}
//           onFinalTranscript={handleFinalTranscript}
//           onAudioRecorded={handleAudioRecorded}
//           autoListen={false}
//           isScreenSharing={screenState.isSharing}
//         />
//       )}

//       {/* Floating Widget - Shows when screen sharing */}
//       <FloatingWidget
//         isScreenSharing={screenState.isSharing}
//         isVoiceListening={voiceState.isListening}
//         currentTranscript={voiceState.currentTranscript}
//         isProcessing={voiceState.isProcessing || isLoading}
//         onToggleVoice={toggleVoiceListening}
//         onAnalyzeScreen={handleAnalyzeScreen}
//         onOpenAnnotation={handleOpenAnnotation}
//         onOpenWhiteScreen={handleOpenWhiteScreen}
//         onStopScreenShare={stopScreenShare}
//         position={floatingWidgetPosition}
//         onPositionChange={setFloatingWidgetPosition}
//       />

//       {/* Tab Detector for Annotation Mode
//       <TabDetector
//         onActivateAnnotation={handleActivateAnnotation}
//         isAnnotationActive={isAnnotationActive}
//       /> */}

//       {/* NEW: Annotation Choice Modal */}
//       {showAnnotationChoice && (
//         <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4 text-center">
//             <h3 className="text-lg font-semibold mb-4">Choose Annotation Mode</h3>
//             <div className="flex gap-4">
//               <Button onClick={() => { setAnnotationMode('overlay'); setShowAnnotationChoice(false); }} className="flex-1">
//                 <Edit3 size={16} className="mr-2"/> Annotate on Tab
//               </Button>
//               <Button onClick={() => { setAnnotationMode('whiteboard'); setShowAnnotationChoice(false); }} className="flex-1" variant="outline">
//                 <FileImage size={16} className="mr-2"/> Open Whiteboard
//               </Button>
//             </div>
//             <Button onClick={() => setShowAnnotationChoice(false)} variant="ghost" size="sm" className="mt-4"><X size={16} className="mr-1" />Cancel</Button>
//           </div>
//         </div>
//       )}

//       {/* Annotation Overlay */}
//       {/* Your two separate components, now controlled by the new state */}
//       <AnnotationOverlay
//         isActive={annotationMode === 'overlay'}
//         onClose={() => setAnnotationMode(null)}
//         onSendToAI={handleOverlaySendToAI}
//       />
//       <WhiteScreen
//         isActive={annotationMode === 'whiteboard'}
//         onClose={() => setAnnotationMode(null)}
//         onSendToAI={handleOverlaySendToAI}
//       />

//       {/* Audio Response Manager */}
//       {currentAudioResponse && (
//         <AudioResponseManager
//           text={currentAudioResponse}
//           autoPlay={true}
//           onPlayEnd={() => setCurrentAudioResponse('')}
//           className="fixed bottom-4 right-4 z-40"
//         />
//       )}

//       {/* --- Sidebar for Chat History --- */}
//       <aside className="w-64 flex-shrink-0 bg-white/70 dark:bg-slate-900/70 border-r border-indigo-100 dark:border-slate-800 flex flex-col">
//         <div className="p-4 border-b border-indigo-100 dark:border-slate-800">
//           <Button onClick={handleNewChat} className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow hover:scale-105 transition">
//             <PlusCircle size={18} className="mr-2" />
//             New Chat
//           </Button>
//         </div>
        
//         <ScrollArea className="flex-1 p-2">
//           <div className="flex flex-col gap-1">
//             {conversations.map(convo => (
//               <div key={convo.id} className="relative group">
//                 <button 
//                   onClick={() => handleSelectChat(convo.id)}
//                   className={`w-full text-left p-2.5 rounded-md text-sm font-medium transition-colors text-slate-700 dark:text-slate-300 pr-16 ${
//                     activeConversationId === convo.id 
//                       ? 'bg-indigo-100 dark:bg-slate-800' 
//                       : 'hover:bg-indigo-50 dark:hover:bg-slate-800/50'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <MessageSquare size={16} className="flex-shrink-0" />
//                     <span className="truncate">{convo.title}</span>
//                   </div>
//                   <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//                     {convo.createdAt.toLocaleDateString()}
//                   </div>
//                 </button>
                
//                 <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-7 w-7 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
//                       >
//                         <MoreVertical size={14} />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => copyConversation(convo)}>
//                         <Copy size={14} className="mr-2" />
//                         Copy
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => exportConversation(convo)}>
//                         <Download size={14} className="mr-2" />
//                         Export
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem 
//                         onClick={(e) => handleDeleteChat(e, convo.id)}
//                         className="text-red-600 dark:text-red-400"
//                       >
//                         <Trash2 size={14} className="mr-2" />
//                         Delete
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>
//       </aside>

//       {/* --- Main Chat Window --- */}
//       <main className="flex-1 flex flex-col overflow-hidden">
//         <header className="flex-shrink-0 z-10 backdrop-blur-md bg-transparent border-b border-indigo-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm">
//           <div className="flex items-center gap-3">
//             <Sparkles className="text-indigo-600 dark:text-indigo-300" />
//             <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-wide">
//               Engineering Hub — AI Study Guide
//             </h1>
//           </div>
//           <div className="flex items-center gap-4">
//             {/* Screen Share Controls */}
//             <div className="flex items-center gap-2">
//               {!screenState.isSharing ? (
//                 <Button
//                   onClick={startScreenShare}
//                   variant="outline"
//                   size="sm"
//                   className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20"
//                 >
//                   <Monitor size={16} className="mr-2" />
//                   Share Screen
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={stopScreenShare}
//                   variant="outline"
//                   size="sm"
//                   className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
//                 >
//                   <Square size={16} className="mr-2" />
//                   Stop Sharing
//                 </Button>
//               )}
//             </div>

//             {/* Annotation Button */}
//             {/* Find this button */}
//             <Button onClick={() => setShowAnnotationChoice(true)} variant="outline" size="sm">
//               <Edit3 size={16} className="mr-2"/> Annotate
//             </Button>

//             <div className="text-sm text-slate-600 dark:text-slate-400">
//               Voice + Screen + Files
//             </div>
//           </div>
//         </header>

//         {/* Screen Sharing Status Alert */}
//         {screenState.isSharing && (
//           <div className="px-6 py-2">
//             <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
//               <div className="flex items-center gap-2">
//                 <Monitor className="h-4 w-4 text-green-600 dark:text-green-400" />
//                 {voiceState.isListening && (
//                   <div className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse">🎤</div>
//                 )}
//               </div>
//               <AlertDescription className="text-green-800 dark:text-green-200">
//                 Screen sharing active with voice detection. 
//                 {voiceState.isProcessing && " Processing voice query..."}
//                 {voiceState.currentTranscript && ` Hearing: "${voiceState.currentTranscript}"`}
//               </AlertDescription>
//             </Alert>
//           </div>
//         )}
      
//         <div 
//           className="flex-1 flex flex-col overflow-hidden"
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           {/* Drag overlay */}
//           {dragOver && (
//             <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-400/20 border-2 border-dashed border-indigo-400 dark:border-indigo-300 z-50 flex items-center justify-center">
//               <div className="text-center">
//                 <Paperclip size={48} className="mx-auto mb-4 text-indigo-600 dark:text-indigo-300" />
//                 <p className="text-lg font-medium text-indigo-800 dark:text-indigo-200">
//                   Drop files here to analyze
//                 </p>
//                 <p className="text-sm text-indigo-600 dark:text-indigo-400">
//                   PDF, Images, Documents, Audio, Video supported
//                 </p>
//               </div>
//             </div>
//           )}

//           <ScrollArea className="flex-1 p-6">
//             <div className="flex flex-col gap-4 max-w-5xl mx-auto">
//               {activeHistory.map((item, index) => (
//                 <ChatBubble key={index} role={item.role} content={item.parts[0].text} />
//               ))}
//               {isLoading && activeHistory.length > 0 && activeHistory[activeHistory.length-1].role === 'model' && activeHistory[activeHistory.length-1].parts[0].text === '' && (
//                  <ChatBubble role="model" content="Analyzing your content and preparing response..." />
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//           </ScrollArea>
        
//           <div className="flex-shrink-0 p-4 sticky bottom-0">
//             <div className="border bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg p-4 shadow-md rounded-2xl max-w-5xl mx-auto">
              
//               {/* File attachments display */}
//               {files.length > 0 && (
//                 <div className="mb-3">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       Attached Files ({files.length}/10)
//                     </span>
//                     <Button 
//                       type="button" 
//                       variant="ghost" 
//                       size="sm" 
//                       onClick={clearAllFiles}
//                       className="text-red-500 hover:text-red-600 h-6"
//                     >
//                       Clear all
//                     </Button>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
//                     {files.map((file, index) => (
//                       <div key={index} className="flex items-center justify-between bg-indigo-50 dark:bg-slate-800 p-2 rounded-lg text-sm border border-indigo-100 dark:border-slate-700">
//                         <div className="flex items-center gap-2 min-w-0 flex-1">
//                           {getFileIcon(file.type)}
//                           <div className="min-w-0 flex-1">
//                             <p className="font-medium text-slate-700 dark:text-slate-300 truncate">
//                               {file.name}
//                             </p>
//                             <p className="text-xs text-slate-500 dark:text-slate-400">
//                               {formatFileSize(file.size)}
//                             </p>
//                           </div>
//                         </div>
//                         <Button 
//                           type="button" 
//                           variant="ghost" 
//                           size="icon" 
//                           onClick={() => handleRemoveFile(index)}
//                           className="h-6 w-6 text-red-500 hover:text-red-600 flex-shrink-0 ml-2"
//                         >
//                           <X size={14} />
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Example prompts */}
//               {(activeHistory.length === 0 || !activeConversationId) && message === "" && files.length === 0 && !screenState.isSharing && (
//                 <div className="mb-3 flex flex-wrap gap-2">
//                   {examplePrompts.map((prompt, i) => (
//                     <button 
//                       key={i} 
//                       onClick={() => setMessage(prompt)} 
//                       type="button" 
//                       className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-300 text-sm hover:bg-indigo-100 dark:hover:bg-slate-700 transition"
//                     >
//                       {prompt}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               <form onSubmit={sendMessage} className="flex items-center gap-2">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button 
//                       type="button" 
//                       variant="outline" 
//                       size="icon" 
//                       disabled={isLoading || files.length >= 10}
//                       className="rounded-full border-indigo-200 dark:border-slate-700 hover:bg-indigo-100 dark:hover:bg-slate-800"
//                     >
//                       <div className="flex items-center">
//                         <Paperclip size={18} className="text-indigo-600 dark:text-indigo-300" />
//                         <ChevronDown size={14} className="text-indigo-600 dark:text-indigo-300 ml-1" />
//                       </div>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="start">
//                     <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
//                       <FileIcon size={16} className="mr-2" />
//                       Upload Files
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem disabled className="text-xs text-slate-500">
//                       Supported: PDF, Images, Docs, Audio, Video
//                     </DropdownMenuItem>
//                     <DropdownMenuItem disabled className="text-xs text-slate-500">
//                       Max: 10 files, 100MB each
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
                
//                 <input 
//                   type="file" 
//                   ref={fileInputRef} 
//                   onChange={handleFileChange}
//                   className="hidden" 
//                   multiple
//                   accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.html,.css,.js,audio/*,video/*"
//                 />

//                 <Input 
//                   value={message} 
//                   onChange={(e) => setMessage(e.target.value)} 
//                   placeholder={
//                     screenState.isSharing 
//                       ? "Type message or use floating widget for screen analysis..." 
//                       : files.length > 0 
//                         ? "Ask about your files..." 
//                         : "Ask your engineering question..."
//                   } 
//                   className="flex-1 rounded-full border-indigo-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 px-4" 
//                   disabled={isLoading}
//                 />
                
//                 <Button 
//                   type="submit" 
//                   disabled={isLoading || (!message.trim() && files.length === 0)} 
//                   className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
//                 >
//                   {isLoading ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
//                   ) : (
//                     <ArrowUp size={18} />
//                   )}
//                 </Button>
//               </form>
              
//               {/* Status info */}
//               <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
//                 {isLoading ? (
//                   screenState.isSharing ? 
//                     "Analyzing screen content and processing your request..." :
//                     "Processing your request..."
//                 ) : screenState.isSharing ? (
//                   "Screen sharing active - Use floating widget for quick analysis"
//                 ) : files.length > 0 ? (
//                   `${files.length} file(s) ready to analyze`
//                 ) : null}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
//         <div className="absolute top-[15%] left-[60%] w-72 h-72 bg-indigo-200/40 dark:bg-indigo-900/30 rounded-full blur-3xl" />
//         <div className="absolute bottom-[-60px] right-[-40px] w-40 h-40 bg-violet-800/30 rounded-full blur-2xl" />
//       </div>
//     </div>
//   );
// };

// export default GeminiStudyGuide;



// src/pages/GeminiStudyGuide.tsx (Complete Fixed Version)

import { useState, useRef, useEffect, useCallback } from 'react';
import ChatBubble from '@/components/ChatBubble';
import VoiceManager from '@/components/VoiceManager';
import AnnotationOverlay from '@/components/AnnotationOverlay';
import AudioResponseManager from '@/components/AudioResponseManager';
import FloatingWidget from '@/components/FloatingWidget';
import ScreenShareManager from '@/components/ScreenShareManager';
import WhiteScreen from '@/components/WhiteScreen';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowUp, Sparkles, Paperclip, X, PlusCircle, MessageSquare, 
  Trash2, FileText, Image, Music, Video, File as FileIcon, ChevronDown,
  Download, Copy, MoreVertical, Monitor, FileImage, Square, Edit3, Mic, MicOff
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

// --- DATA STRUCTURES ---
interface HistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface Conversation {
  id: string;
  title: string;
  history: HistoryItem[];
  createdAt: Date;
}

interface ScreenState {
  isSharing: boolean;
  mediaStream: MediaStream | null;
  imageCapture: ImageCapture | null;
}

interface VoiceState {
  isListening: boolean;
  currentTranscript: string;
  finalTranscript: string;
  audioBlob: Blob | null;
  isProcessing: boolean;
}

// --- FILE TYPE UTILITIES ---
const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image size={16} className="text-blue-500" />;
  if (mimeType === 'application/pdf') return <FileText size={16} className="text-red-500" />;
  if (mimeType.includes('word') || mimeType.includes('document')) return <FileText size={16} className="text-blue-600" />;
  if (mimeType.includes('excel') || mimeType.includes('sheet')) return <FileText size={16} className="text-green-600" />;
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return <FileText size={16} className="text-orange-600" />;
  if (mimeType.startsWith('audio/')) return <Music size={16} className="text-purple-500" />;
  if (mimeType.startsWith('video/')) return <Video size={16} className="text-pink-500" />;
  return <FileIcon size={16} className="text-gray-500" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const examplePrompts = [
  "Give me Roadmap for Mastering DSA With C language.",
  "Start voice query to ask questions without screen sharing",
  "Help me understand code and diagrams through voice interaction"
];

const GeminiStudyGuide = () => {
  // --- STATE MANAGEMENT ---
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Screen sharing state
  const [screenState, setScreenState] = useState<ScreenState>({
    isSharing: false,
    mediaStream: null,
    imageCapture: null,
  });

  // Voice state - FIXED: Now independent of screen sharing
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    currentTranscript: '',
    finalTranscript: '',
    audioBlob: null,
    isProcessing: false,
  });

  // UI states
  // const [isAnnotationActive, setIsAnnotationActive] = useState(false);
  // const [isWhiteScreenActive, setIsWhiteScreenActive] = useState(false);
  const [annotationMode, setAnnotationMode] = useState<'whiteboard' | 'overlay' | null>(null);
  
  // FIXED: Annotation dropdown instead of full screen modal
  const [showAnnotationDropdown, setShowAnnotationDropdown] = useState(false);
  const annotationButtonRef = useRef<HTMLButtonElement>(null);
  
  const [currentAudioResponse, setCurrentAudioResponse] = useState<string>('');
  const [floatingWidgetPosition, setFloatingWidgetPosition] = useState({ x: window.innerWidth - 280, y: 100 });

  // FIXED: Independent voice listening (not tied to screen sharing)
  const [isVoiceOnlyMode, setIsVoiceOnlyMode] = useState(false);

  // Refs
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeHistory = activeConversation?.history ?? [];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const voiceCaptureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const screenStateRef = useRef<ScreenState>(screenState);
  useEffect(() => { screenStateRef.current = screenState; }, [screenState]);



  const waitForImageCapture = useCallback(async (timeout = 6000): Promise<ImageCapture | null> => {
  const start = Date.now();
  return new Promise((resolve) => {
    const poll = () => {
      if (screenStateRef.current.imageCapture) return resolve(screenStateRef.current.imageCapture);
      if (Date.now() - start > timeout) return resolve(null);
      setTimeout(poll, 150);
    };
    poll();
  });
}, []);


  const promptUserToEnableScreenShare = () => {
  setCurrentAudioResponse("I couldn't start screen sharing automatically — please click 'Share Screen' at the top of the page to allow analysis.");
  // (You can replace this with a nicer toast/modal that focuses the Share button)
};


  // --- SCREEN SHARING FUNCTIONS ---
  const handleStreamChange = (stream: MediaStream | null, imageCapture: ImageCapture | null) => {
    setScreenState(prev => ({
      ...prev,
      mediaStream: stream,
      imageCapture: imageCapture
    }));

    // Auto-start voice listening when screen sharing starts
    if (stream && imageCapture) {
      setVoiceState(prev => ({ ...prev, isListening: true }));
    }
  };

  const handleSharingEnd = () => {
    setScreenState({
      isSharing: false,
      mediaStream: null,
      imageCapture: null,
    });

    // FIXED: Don't stop voice if in voice-only mode
    if (!isVoiceOnlyMode) {
      setVoiceState(prev => ({ 
        ...prev, 
        isListening: false,
        currentTranscript: '',
        finalTranscript: '',
        audioBlob: null,
        isProcessing: false
      }));
    }
  };

  const startScreenShare = () => {
    setScreenState(prev => ({ ...prev, isSharing: true }));
  };

  const stopScreenShare = () => {
    setScreenState(prev => ({ ...prev, isSharing: false }));
    handleSharingEnd();
  };

  // FIXED: Optional screen capture (only when screen sharing is active)
  const captureScreenFrame = async (): Promise<Blob | null> => {
  if (!screenState.imageCapture || !screenState.isSharing) {
    console.warn('Screen capture not available - screen sharing not active');
    return null;
  }
  
  if (!canvasRef.current) {
    console.error('Canvas element not available');
    return null;
  }
  
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get canvas context');
    return null;
  }

  try {
    // Add retry logic for more reliable capture
    let imageBitmap;
    for (let i = 0; i < 3; i++) {
      try {
        imageBitmap = await (screenState.imageCapture as any).grabFrame();
        break;
      } catch (retryError) {
        if (i === 2) throw retryError;
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    ctx.drawImage(imageBitmap, 0, 0);
    imageBitmap.close();

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas.'));
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error("Error capturing screen frame:", error);
    return null;
  }
};
  // --- FIXED: VOICE HANDLING FUNCTIONS ---
  const handleTranscriptUpdate = useCallback((transcript: string) => {
    setVoiceState(prev => ({ ...prev, currentTranscript: transcript }));
  }, []);

//   // FIXED: Voice queries work with or without screen sharing
//   const handleFinalTranscript = useCallback(async (transcript: string) => { // Becomes async
//   if (!transcript.trim()) return;

//   setVoiceState(prev => ({ ...prev, isProcessing: true }));

//   // 1. CAPTURE IMMEDIATELY: Screen is captured instantly when you stop talking.
//   let frameBlob: Blob | null = null;
//   if (screenState.isSharing) {
//     frameBlob = await captureScreenFrame(); 
//   }
  
//   if (voiceCaptureTimeoutRef.current) {
//     clearTimeout(voiceCaptureTimeoutRef.current);
//   }
  
//   const delay = screenState.isSharing ? 1000 : 500; // Delay is now shorter

//   // 2. PASS DATA: The already-captured frame is passed to the next function.
//   voiceCaptureTimeoutRef.current = setTimeout(() => {
//     processVoiceQuery(transcript, frameBlob);
//   }, delay);

// }, [
//     screenState.isSharing, 
//     processVoiceQuery, 
//     captureScreenFrame
// ]); // 3. CORRECT DEPENDENCIES: All used functions are now included.

  const handleAudioRecorded = useCallback((audioBlob: Blob) => {
    setVoiceState(prev => ({ ...prev, audioBlob }));
  }, []);

  // FIXED: Voice processing works independently of screen sharing

// --- ENHANCED SEND MESSAGE FUNCTION ---
  const sendMessageWithFiles = async (
  messageText: string, 
  additionalFiles: File[] = [], 
  isVoiceQuery: boolean = false
) => {
  if (!messageText.trim() && files.length === 0 && additionalFiles.length === 0) return;
  if (isLoading) return;

  setIsLoading(true);

  const allFiles = [...files, ...additionalFiles];
  const userMessageText = messageText || (allFiles.length > 0 ? `Analyze ${allFiles.length} file(s): ${allFiles.map(f => f.name).join(', ')}` : "");
  const userMessage: HistoryItem = { role: 'user', parts: [{ text: userMessageText }] };

  let conversationId = activeConversationId;
  let currentHistory = activeConversation?.history ?? [];

  // --- CORE LOGIC FIX IS HERE ---
  // This logic now correctly decides whether to create a new chat or update the existing one.
  if (!conversationId) {
    // 1. NO ACTIVE CHAT: Create a new conversation because one doesn't exist.
    // This will happen for the very first message (typed or voice).
    const newId = Date.now().toString();
    const prefix = isVoiceQuery ? 'Voice: ' : screenState.isSharing ? 'Screen: ' : '';
    const newTitle = prefix + userMessageText.substring(0, 40) + (userMessageText.length > 40 ? '...' : '');
    const newConversation: Conversation = { 
      id: newId, 
      title: newTitle, 
      history: [userMessage], // Start history with the user's message
      createdAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
    
    // Set the conversationId and history for the API call
    conversationId = newId;
    currentHistory = [userMessage];

  } else {
    // 2. CHAT IS ALREADY ACTIVE: Simply add the new message to the existing history.
    // This is where all subsequent voice queries and typed messages will go.
    currentHistory = [...currentHistory, userMessage];
    updateConversationHistory(conversationId, currentHistory);
  }
  // --- END OF CORE LOGIC FIX ---

  // Add a temporary "model is typing" message
  updateConversationHistory(conversationId, [...currentHistory, { role: 'model', parts: [{ text: '' }] }]);

  setMessage('');
  setFiles([]);

  const formData = new FormData();
  
  if (isVoiceQuery) {
    formData.append('message', messageText + '\n\n[VOICE_QUERY: Please provide a concise but complete response suitable for audio playback. Focus on key insights and practical information.]');
  } else {
    formData.append('message', messageText);
  }

  // Use the up-to-date history for the API call
  const historyForApi = currentHistory; 
  const sanitizedHistory = historyForApi.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: Array.isArray(h.parts) && h.parts.length ? h.parts : [{ text: '' }]
  }));
  formData.append('history', JSON.stringify(sanitizedHistory));

  allFiles.forEach(file => formData.append('files', file));

  try {
    const response = await fetch('http://localhost:5000/api/gemini/chat', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body received');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      accumulatedResponse += chunk;

      const streamingHistory = [...historyForApi, { role: 'model', parts: [{ text: accumulatedResponse }] }];
      updateConversationHistory(conversationId, streamingHistory);
    }

    if (isVoiceQuery && accumulatedResponse.trim()) {
      const cleanResponse = accumulatedResponse
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1') 
        .replace(/`(.*?)`/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/💡.*$/gm, '')
        .replace(/Follow-up suggestions?:.*$/gmi, '')
        .replace(/\n{2,}/g, ' ')
        .split(/[.!?]+/)
        .slice(0, 5)
        .join('. ') + '.';
        
      setCurrentAudioResponse(cleanResponse);
    }

  } catch (error) {
    console.error('Error fetching stream:', error);
    let errorMessage = 'Sorry, something went wrong. ';

    if (error instanceof Error) {
        errorMessage += error.message;
    } else {
        errorMessage += 'Unknown error occurred.';
    }

    const finalHistoryWithError = [...historyForApi, { role: 'model', parts: [{ text: errorMessage }] }];
    updateConversationHistory(conversationId, finalHistoryWithError);
  } finally {
    setIsLoading(false);
  }
};

  
  // Now accepts TWO arguments: transcript and frameBlob
const processVoiceQuery = useCallback(async (transcript: string, frameBlob: Blob | null) => { 
  if (isLoading) return;
  setIsLoading(true);
  
  try {
    let analysisFiles: File[] = [];
    
    if (frameBlob) { 
      const frameFile = new File([frameBlob], 'voice-screen-capture.png', { type: 'image/png' });
      analysisFiles.push(frameFile);
    }
    
    if (voiceState.audioBlob) {
      const audioFile = new File([voiceState.audioBlob], 'voice-query.webm', { type: voiceState.audioBlob.type });
      analysisFiles.push(audioFile);
    }
    
    const queryText = frameBlob ? `Analyze screen and respond to: ${transcript}` : `Voice query: ${transcript}`;
    
    // Send to backend and get response
    await sendMessageWithFiles(queryText, analysisFiles, true);
    
  } catch (error) {
    console.error('Error processing voice query:', error);
    setCurrentAudioResponse('Failed to process voice query.');
  } finally {
    setIsLoading(false);
    setVoiceState(prev => ({ 
      ...prev, 
      isProcessing: false, 
      currentTranscript: '', 
      finalTranscript: '', 
      audioBlob: null 
    }));
  }
}, [isLoading, voiceState.audioBlob, sendMessageWithFiles, activeConversationId]); // Note the corrected dependencies



// FIXED: Voice queries work with or without screen sharing
  // --- FIX: Always use screen when sharing ---
const handleFinalTranscript = useCallback(async (transcript: string) => {
  if (!transcript || !transcript.trim()) return;

  // Keywords to detect a screen analysis request
  const screenAnalysisKeywords = /analyz|screen|what's on|explain this|what do you see|this screen|current tab|this page/i;

  // --- PRIMARY FIX ---
  // If the user asks to analyze the screen BUT screen sharing is NOT active,
  // give them a direct instruction instead of sending it to the AI.
  if (screenAnalysisKeywords.test(transcript) && !screenState.isSharing) {
    setCurrentAudioResponse("To analyze your screen, please start screen sharing and then use the 'Analyze' button. I am ready to help with any of your engineering questions!");
    
    // Reset voice state without processing further
    setVoiceState(prev => ({ ...prev, isProcessing: false, currentTranscript: '', finalTranscript: '' }));
    return; // Stop execution here
  }
  // --- END OF PRIMARY FIX ---

  setVoiceState(prev => ({ ...prev, isProcessing: true }));

  let frameBlob: Blob | null = null;

  // If sharing is active, capture a frame
  if (screenState.isSharing && screenState.imageCapture) {
    try {
      frameBlob = await captureScreenFrame();
      console.log('Screen captured for voice query');
    } catch (err) {
      console.warn("Screen capture failed for voice query:", err);
    }
  }

  // Process the query (with or without a screen capture)
  try {
    await processVoiceQuery(transcript, frameBlob);
  } catch (error) {
    console.error('Error processing voice query:', error);
    setCurrentAudioResponse('Sorry, I could not process that request.');
  } finally {
    // This state is reset inside processVoiceQuery, but we ensure it happens
    setVoiceState(prev => ({ ...prev, isProcessing: false }));
  }

}, [screenState.isSharing, screenState.imageCapture, captureScreenFrame, processVoiceQuery, activeConversationId]);

  // FIXED: Independent voice toggle
  const toggleVoiceListening = () => {
    setVoiceState(prev => ({ 
      ...prev, 
      isListening: !prev.isListening,
      currentTranscript: '',
      finalTranscript: ''
    }));
  };

  // FIXED: Voice-only mode toggle
  const toggleVoiceOnlyMode = () => {
    if (!voiceState.isListening) {
      // Starting voice mode
      setIsVoiceOnlyMode(true);
      setVoiceState(prev => ({ ...prev, isListening: true }));
      setCurrentAudioResponse("Voice mode activated. You can now ask questions and I'll automatically capture your screen if needed for analysis.");
    } else {
      // Stopping voice mode  
      setIsVoiceOnlyMode(false);
      setVoiceState(prev => ({ ...prev, isListening: false }));
      setCurrentAudioResponse("Voice mode deactivated.");
    }
  };

  // --- ANNOTATION HANDLERS ---
  const handleOverlaySendToAI = async (imageBlob: Blob, audioBlob?: Blob, textQuery?: string) => {
    const imageFile = new File([imageBlob], 'overlay-content.png', { type: 'image/png' });
    const files: File[] = [imageFile];
    if (audioBlob) {
      const audioFile = new File([audioBlob], 'overlay-audio.webm', { type: audioBlob.type });
      files.push(audioFile);
    }
    await sendMessageWithFiles(textQuery || 'Analyze this content', files, !!audioBlob);
    setAnnotationMode(null);
  };

  // --- FLOATING WIDGET HANDLERS ---
  const handleAnalyzeScreen = async () => {
    if (!screenState.isSharing) return;
    
    try {
      setIsLoading(true);
      const frameBlob = await captureScreenFrame();
      if (frameBlob) {
        const frameFile = new File([frameBlob], 'manual-screen-capture.png', { type: 'image/png' });
        await sendMessageWithFiles('Analyze this screen capture', [frameFile], false);
      } else {
        setCurrentAudioResponse('Failed to capture screen. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing screen:', error);
      setCurrentAudioResponse('Failed to analyze screen. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleOpenAnnotation = () => {
  //   setIsAnnotationActive(true);
  // };

  // const handleOpenWhiteScreen = () => {
  //   setIsWhiteScreenActive(true);
  // };

  // --- ENHANCED SEND MESSAGE FUNCTION ---
  // const sendMessageWithFiles = async (
  //   messageText: string, 
  //   additionalFiles: File[] = [], 
  //   isVoiceQuery: boolean = false
  // ) => {
  //   if (!messageText.trim() && files.length === 0 && additionalFiles.length === 0) return;
  //   if (isLoading) return;

  //   setIsLoading(true);

  //   const allFiles = [...files, ...additionalFiles];
  //   const userMessageText = messageText || (allFiles.length > 0 ? `Analyze ${allFiles.length} file(s): ${allFiles.map(f => f.name).join(', ')}` : "");
  //   const userMessage: HistoryItem = { role: 'user', parts: [{ text: userMessageText }] };

  //   let conversationId = activeConversationId;
  //   let historyForApi = [...activeHistory, userMessage];

  //   if (!conversationId) {
  //     const newId = Date.now().toString();
  //     const prefix = isVoiceQuery ? 'Voice: ' : screenState.isSharing ? 'Screen: ' : '';
  //     const newTitle = prefix + userMessageText.substring(0, 40) + (userMessageText.length > 40 ? '...' : '');
  //     const newConversation: Conversation = { 
  //       id: newId, 
  //       title: newTitle, 
  //       history: [userMessage],
  //       createdAt: new Date()
  //     };

  //     setConversations(prev => [newConversation, ...prev]);
  //     setActiveConversationId(newId);
  //     conversationId = newId;
  //   } else {
  //     updateConversationHistory(conversationId, historyForApi);
  //   }

  //   updateConversationHistory(conversationId, [...historyForApi, { role: 'model', parts: [{ text: '' }] }]);

  //   setMessage('');
  //   setFiles([]);

  //   const formData = new FormData();
    
  //   if (isVoiceQuery) {
  //     formData.append('message', messageText + '\n\n[VOICE_QUERY: Please provide a concise but complete response suitable for audio playback. Focus on key insights and practical information.]');
  //   } else {
  //     formData.append('message', messageText);
  //   }

  //   const sanitizedHistory = historyForApi.map(h => ({
  //     role: h.role === 'user' ? 'user' : 'model',
  //     parts: Array.isArray(h.parts) && h.parts.length ? h.parts : [{ text: '' }]
  //   }));
  //   formData.append('history', JSON.stringify(sanitizedHistory));

  //   allFiles.forEach(file => formData.append('files', file));

  //   try {
  //     const response = await fetch('http://localhost:5000/api/gemini/chat', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}));
  //       throw new Error(errorData.error || `Request failed with status ${response.status}`);
  //     }

  //     if (!response.body) {
  //       throw new Error('No response body received');
  //     }

  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();
  //     let accumulatedResponse = '';

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;

  //       const chunk = decoder.decode(value, { stream: true });
  //       accumulatedResponse += chunk;

  //       const streamingHistory = [...historyForApi, { role: 'model', parts: [{ text: accumulatedResponse }] }];
  //       updateConversationHistory(conversationId, streamingHistory);
  //     }

  //     // For voice queries, trigger audio response
  //     if (isVoiceQuery && accumulatedResponse.trim()) {
  //       setCurrentAudioResponse(accumulatedResponse.trim());
  //     }

  //   } catch (error) {
  //     console.error('Error fetching stream:', error);
  //     let errorMessage = 'Sorry, something went wrong. ';

  //     if (error instanceof Error) {
  //       if (error.message.includes('quota')) {
  //         errorMessage += 'API quota exceeded. Please try again later.';
  //       } else if (error.message.includes('safety')) {
  //         errorMessage += 'Content was flagged by safety filters. Please try rephrasing your question.';
  //       } else if (error.message.includes('file')) {
  //         errorMessage += 'There was an issue processing your files. Please check the file formats and try again.';
  //       } else {
  //         errorMessage += error.message;
  //       }
  //     } else {
  //       errorMessage += 'Unknown error occurred.';
  //     }

  //     const finalHistoryWithError = [...historyForApi, { role: 'model', parts: [{ text: errorMessage }] }];
  //     updateConversationHistory(conversationId, finalHistoryWithError);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // --- EXISTING FUNCTIONS (localStorage, effects, handlers) ---
  useEffect(() => {
    try {
      const storedConversations = localStorage.getItem('chat_conversations');
      if (storedConversations) {
        const parsedConversations: unknown = JSON.parse(storedConversations);

        if (Array.isArray(parsedConversations)) {
          const typedConversations: Conversation[] = parsedConversations.map((conv: any) => ({
            id: conv.id || '',
            title: conv.title || 'Untitled Chat',
            createdAt: new Date(conv.createdAt),
            history: Array.isArray(conv.history) ? conv.history.map((h: any) => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: Array.isArray(h.parts) ? h.parts : [{ text: '' }],
            })) : [],
          }));
          setConversations(typedConversations);
        }
      }
    } catch (error) {
      console.error("Failed to parse conversations from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (conversations.length === 0) {
      localStorage.removeItem('chat_conversations');
    } else {
      localStorage.setItem('chat_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [activeHistory, isLoading]);

  // FIXED: Close annotation dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAnnotationDropdown && annotationButtonRef.current && 
          !annotationButtonRef.current.contains(event.target as Node)) {
        setShowAnnotationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAnnotationDropdown]);

  // --- DRAG AND DROP, FILE HANDLING, CHAT HANDLERS (unchanged) ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelection(droppedFiles);
  };

  const handleFileSelection = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > 100 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 100MB.`);
        return false;
      }
      return true;
    });

    const totalFiles = files.length + validFiles.length;
    if (totalFiles > 10) {
      alert(`You can only upload up to 10 files at once. You're trying to add ${totalFiles} files.`);
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      handleFileSelection(newFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessage('');
    setFiles([]);
  };

  const handleSelectChat = (id: string) => {
    setActiveConversationId(id);
    setMessage('');
    setFiles([]);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      handleNewChat();
    }
  };

  const copyConversation = (conversation: Conversation) => {
    const text = conversation.history
      .map(item => `**${item.role.toUpperCase()}:** ${item.parts[0].text}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
  };

  const exportConversation = (conversation: Conversation) => {
    const text = conversation.history
      .map(item => `${item.role.toUpperCase()}: ${item.parts[0].text}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateConversationHistory = (id: string, newHistory: HistoryItem[]) => {
    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, history: newHistory } : c)
    );
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await sendMessageWithFiles(message, []);
  };

  // const handleAnnotationSendToAI = async (imageBlob: Blob, audioBlob?: Blob, textQuery?: string) => {
  //   const imageFile = new File([imageBlob], 'annotation.png', { type: 'image/png' });
  //   const files: File[] = [imageFile];
    
  //   if (audioBlob) {
  //     const audioFile = new File([audioBlob], 'annotation-audio.webm', { type: audioBlob.type });
  //     files.push(audioFile);
  //   }

  //   await sendMessageWithFiles(textQuery || 'Analyze this annotation', files, !!audioBlob);
  //   setIsAnnotationActive(false);
  // };

  // const handleCloseAnnotation = () => {
  //   setIsAnnotationActive(false);
  // };

  // const handleCloseWhiteScreen = () => {
  //   setIsWhiteScreenActive(false);
  // };

  const handleWhiteScreenSendToAI = async (imageBlob: Blob, audioBlob?: Blob, textQuery?: string) => {
    const imageFile = new File([imageBlob], 'whiteboard.png', { type: 'image/png' });
    const files: File[] = [imageFile];
    
    if (audioBlob) {
      const audioFile = new File([audioBlob], 'whiteboard-audio.webm', { type: audioBlob.type });
      files.push(audioFile);
    }

    await sendMessageWithFiles(textQuery || 'Analyze this drawing', files, !!audioBlob);
    setIsWhiteScreenActive(false);
  };

  // --- JSX LAYOUT ---
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-tr from-[#e9edfb] via-[#f6f8ff] to-[#e8f2fe] dark:from-[#1a2139] dark:via-[#232848] dark:to-[#19233b] transition-colors duration-500">
      
      {/* Hidden canvas for screen capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Screen Share Manager */}
      <ScreenShareManager
        isSharing={screenState.isSharing}
        onStreamChange={handleStreamChange}
        onSharingEnd={handleSharingEnd}
      />

      {/* FIXED: Voice Manager - Works independently */}
      <VoiceManager
        isListening={voiceState.isListening}
        onTranscriptUpdate={handleTranscriptUpdate}
        onFinalTranscript={handleFinalTranscript}
        onAudioRecorded={handleAudioRecorded}
        // autoListen={false}
        // isScreenSharing={screenState.isSharing}
      />

      {/* Floating Widget - Shows when screen sharing */}
      <FloatingWidget
        isScreenSharing={screenState.isSharing}
        isVoiceListening={voiceState.isListening}
        currentTranscript={voiceState.currentTranscript}
        isProcessing={voiceState.isProcessing || isLoading}
        onToggleVoice={toggleVoiceListening}
        onAnalyzeScreen={handleAnalyzeScreen}
        onOpenAnnotation={() => setAnnotationMode('overlay')} // Now sets the correct state directly
        onOpenWhiteScreen={() => setAnnotationMode('whiteboard')} // Now sets the correct state directly
        onStopScreenShare={stopScreenShare}
        position={floatingWidgetPosition}
        onPositionChange={setFloatingWidgetPosition}
      />

      {/* Annotation Overlay */}
      <AnnotationOverlay
        isActive={annotationMode === 'overlay'}
        onClose={() => setAnnotationMode(null)}
        onSendToAI={handleOverlaySendToAI}
      />
      
      <WhiteScreen
        isActive={annotationMode === 'whiteboard'}
        onClose={() => setAnnotationMode(null)}
        onSendToAI={handleWhiteScreenSendToAI} // Correct handler passed
      />

      {/* Audio Response Manager */}
      {currentAudioResponse && (
        <AudioResponseManager
          text={currentAudioResponse}
          autoPlay={true}
          onPlayEnd={() => setCurrentAudioResponse('')}
          className="fixed bottom-4 right-4 z-40"
        />
      )}

      {/* --- Sidebar for Chat History --- */}
      <aside className="w-64 flex-shrink-0 bg-white/70 dark:bg-slate-900/70 border-r border-indigo-100 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-indigo-100 dark:border-slate-800">
          <Button onClick={handleNewChat} className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow hover:scale-105 transition">
            <PlusCircle size={18} className="mr-2" />
            New Chat
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-2">
          <div className="flex flex-col gap-1">
            {conversations.map(convo => (
              <div key={convo.id} className="relative group">
                <button 
                  onClick={() => handleSelectChat(convo.id)}
                  className={`w-full text-left p-2.5 rounded-md text-sm font-medium transition-colors text-slate-700 dark:text-slate-300 pr-16 ${
                    activeConversationId === convo.id 
                      ? 'bg-indigo-100 dark:bg-slate-800' 
                      : 'hover:bg-indigo-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="flex-shrink-0" />
                    <span className="truncate">{convo.title}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {convo.createdAt.toLocaleDateString()}
                  </div>
                </button>
                
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      >
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyConversation(convo)}>
                        <Copy size={14} className="mr-2" />
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportConversation(convo)}>
                        <Download size={14} className="mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => handleDeleteChat(e, convo.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* --- Main Chat Window --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 z-10 backdrop-blur-md bg-transparent border-b border-indigo-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="text-indigo-600 dark:text-indigo-300" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-wide">
              Engineering Hub — AI Study Guide
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Screen Share Controls */}
            <div className="flex items-center gap-2">
              {!screenState.isSharing ? (
                <Button
                  onClick={startScreenShare}
                  variant="outline"
                  size="sm"
                  className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20"
                >
                  <Monitor size={16} className="mr-2" />
                  Share Screen
                </Button>
              ) : (
                <Button
                  onClick={stopScreenShare}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
                >
                  <Square size={16} className="mr-2" />
                  Stop Sharing
                </Button>
              )}
            </div>

            {/* FIXED: Voice-only Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleVoiceOnlyMode}
                variant="outline"
                size="sm"
                className={`transition-all duration-200 ${
                  isVoiceOnlyMode || voiceState.isListening
                    ? 'border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:bg-blue-900/20'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {voiceState.isListening ? <MicOff size={16} className="mr-2" /> : <Mic size={16} className="mr-2" />}
                {voiceState.isListening ? 'Stop Listening' : 'Start Voice Mode'}
              </Button>
              
              {/* Screen status indicator */}
              {voiceState.isListening && (
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  {screenState.isSharing ? '🎤 + 📺 Ready' : '🎤 Voice Only'}
                </span>
              )}
            </div>

            {/* FIXED: Annotation Dropdown Button */}
            <div className="relative">
              {/* <Button 
                ref={annotationButtonRef}
                onClick={() => setShowAnnotationDropdown(!showAnnotationDropdown)} 
                variant="outline" 
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20"
              >
                <Edit3 size={16} className="mr-2"/> 
                Annotate
                <ChevronDown size={14} className="ml-1" />
              </Button> */}

              {/* FIXED: Annotation Dropdown Menu */}
              {showAnnotationDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 min-w-48">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setAnnotationMode('overlay');
                        setShowAnnotationDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md flex items-center gap-2 transition-colors"
                    >
                      <Edit3 size={14} className="text-purple-600 dark:text-purple-400" />
                      Annotate on Tab
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">Highlight content</span>
                    </button>
                    <button
                      onClick={() => {
                        setAnnotationMode('whiteboard');
                        setShowAnnotationDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md flex items-center gap-2 transition-colors"
                    >
                      <FileImage size={14} className="text-blue-600 dark:text-blue-400" />
                      Open Whiteboard
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">Draw freely</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              {isVoiceOnlyMode ? 'Voice Ready' : 'Voice + Screen + Files'}
            </div>
          </div>
        </header>

        {/* FIXED: Enhanced Status Alerts */}
        {(screenState.isSharing || isVoiceOnlyMode) && (
          <div className="px-6 py-2">
            {screenState.isSharing && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-green-600 dark:text-green-400" />
                  {voiceState.isListening && (
                    <div className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse">🎤</div>
                  )}
                </div>
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Screen sharing active with voice detection. 
                  {voiceState.isProcessing && " Processing voice query..."}
                  {voiceState.currentTranscript && ` Hearing: "${voiceState.currentTranscript}"`}
                </AlertDescription>
              </Alert>
            )}
            
            {isVoiceOnlyMode && !screenState.isSharing && (
              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {voiceState.isListening && (
                    <div className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse">🎤</div>
                  )}
                </div>
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  Voice-only mode active. 
                  {voiceState.isProcessing && " Processing voice query..."}
                  {voiceState.currentTranscript && ` Hearing: "${voiceState.currentTranscript}"`}
                  {!voiceState.isListening && " Click 'Voice Mode' to start listening."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      
        <div 
          className="flex-1 flex flex-col overflow-hidden"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {dragOver && (
            <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-400/20 border-2 border-dashed border-indigo-400 dark:border-indigo-300 z-50 flex items-center justify-center">
              <div className="text-center">
                <Paperclip size={48} className="mx-auto mb-4 text-indigo-600 dark:text-indigo-300" />
                <p className="text-lg font-medium text-indigo-800 dark:text-indigo-200">
                  Drop files here to analyze
                </p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  PDF, Images, Documents, Audio, Video supported
                </p>
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 p-6">
            <div className="flex flex-col gap-4 max-w-5xl mx-auto">
              {activeHistory.map((item, index) => (
                <ChatBubble key={index} role={item.role} content={item.parts[0].text} />
              ))}
              {isLoading && activeHistory.length > 0 && activeHistory[activeHistory.length-1].role === 'model' && activeHistory[activeHistory.length-1].parts[0].text === '' && (
                 <ChatBubble role="model" content="Analyzing your content and preparing response..." />
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        
          <div className="flex-shrink-0 p-4 sticky bottom-0">
            <div className="border bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg p-4 shadow-md rounded-2xl max-w-5xl mx-auto">
              
              {/* File attachments display */}
              {files.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Attached Files ({files.length}/10)
                    </span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFiles}
                      className="text-red-500 hover:text-red-600 h-6"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-indigo-50 dark:bg-slate-800 p-2 rounded-lg text-sm border border-indigo-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-700 dark:text-slate-300 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveFile(index)}
                          className="h-6 w-6 text-red-500 hover:text-red-600 flex-shrink-0 ml-2"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FIXED: Enhanced example prompts */}
              {(activeHistory.length === 0 || !activeConversationId) && message === "" && files.length === 0 && !screenState.isSharing && !isVoiceOnlyMode && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {examplePrompts.map((prompt, i) => (
                    <button 
                      key={i} 
                      onClick={() => setMessage(prompt)} 
                      type="button" 
                      className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-300 text-sm hover:bg-indigo-100 dark:hover:bg-slate-700 transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      disabled={isLoading || files.length >= 10}
                      className="rounded-full border-indigo-200 dark:border-slate-700 hover:bg-indigo-100 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center">
                        <Paperclip size={18} className="text-indigo-600 dark:text-indigo-300" />
                        <ChevronDown size={14} className="text-indigo-600 dark:text-indigo-300 ml-1" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                      <FileIcon size={16} className="mr-2" />
                      Upload Files
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled className="text-xs text-slate-500">
                      Supported: PDF, Images, Docs, Audio, Video
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled className="text-xs text-slate-500">
                      Max: 10 files, 100MB each
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  className="hidden" 
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.html,.css,.js,audio/*,video/*"
                />

                <Input 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder={
                    isVoiceOnlyMode
                      ? "Type message or use voice mode for voice queries..." 
                      : screenState.isSharing 
                        ? "Type message or use floating widget for screen analysis..." 
                        : files.length > 0 
                          ? "Ask about your files..." 
                          : "Ask your engineering question..."
                  } 
                  className="flex-1 rounded-full border-indigo-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 px-4" 
                  disabled={isLoading}
                />
                
                <Button 
                  type="submit" 
                  disabled={isLoading || (!message.trim() && files.length === 0)} 
                  className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <ArrowUp size={18} />
                  )}
                </Button>
              </form>
              
              {/* FIXED: Enhanced status info */}
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
                {isLoading ? (
                  voiceState.isProcessing ? 
                    "Processing voice query..." :
                    screenState.isSharing ? 
                      "Analyzing screen content and processing your request..." :
                      "Processing your request..."
                ) : isVoiceOnlyMode ? (
                  voiceState.isListening ? 
                    "Voice mode active - Listening for your query..." :
                    "Voice mode ready - Click 'Voice Mode' to start listening"
                ) : screenState.isSharing ? (
                  "Screen sharing active - Use floating widget for quick analysis"
                ) : files.length > 0 ? (
                  `${files.length} file(s) ready to analyze`
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[15%] left-[60%] w-72 h-72 bg-indigo-200/40 dark:bg-indigo-900/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-40px] w-40 h-40 bg-violet-800/30 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default GeminiStudyGuide;