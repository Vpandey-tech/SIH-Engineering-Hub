// // src/components/AnnotationOverlay.tsx
// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Pen, Eraser, Square, Circle, Type, Save, X, 
//   Mic, MicOff, Volume2, VolumeX, Palette, Minus
// } from 'lucide-react';

// interface AnnotationOverlayProps {
//   isActive: boolean;
//   onClose: () => void;
//   onSendToAI: (imageBlob: Blob, audioBlob?: Blob, textQuery?: string) => void;
//   isListening: boolean;
//   onToggleListening: () => void;
//   currentTranscript?: string;
// }

// type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text' | 'line';

// interface DrawingPoint {
//   x: number;
//   y: number;
//   tool: Tool;
//   color: string;
//   size: number;
// }

// const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
//   isActive,
//   onClose,
//   onSendToAI,
//   isListening,
//   onToggleListening,
//   currentTranscript = ''
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [currentTool, setCurrentTool] = useState<Tool>('pen');
//   const [currentColor, setCurrentColor] = useState('#ff0000');
//   const [currentSize, setCurrentSize] = useState(3);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [textQuery, setTextQuery] = useState('');
//   const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);
//   const [isTextMode, setIsTextMode] = useState(false);
//   const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

//   // Audio state
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [isPlayingAudio, setIsPlayingAudio] = useState(false);
//   const audioRef = useRef<HTMLAudioElement>(null);

//   useEffect(() => {
//     if (isActive && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         // Set canvas size to full screen
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
        
//         // Fill with white background
//         ctx.fillStyle = '#ffffff';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
        
//         // Save initial state
//         saveToHistory();
//       }
//     }
//   }, [isActive]);

//   const saveToHistory = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (ctx && canvas) {
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       setDrawingHistory(prev => [...prev.slice(-9), imageData]); // Keep last 10 states
//     }
//   };

//   const undo = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (ctx && canvas && drawingHistory.length > 1) {
//       const newHistory = [...drawingHistory];
//       newHistory.pop(); // Remove current state
//       const previousState = newHistory[newHistory.length - 1];
//       ctx.putImageData(previousState, 0, 0);
//       setDrawingHistory(newHistory);
//     }
//   };

//   const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return { x: 0, y: 0 };
    
//     const rect = canvas.getBoundingClientRect();
//     return {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top
//     };
//   }, []);

//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx || !canvas) return;

//     const pos = getMousePos(e);
    
//     if (currentTool === 'text') {
//       setIsTextMode(true);
//       setTextPosition(pos);
//       return;
//     }

//     setIsDrawing(true);
    
//     ctx.beginPath();
//     ctx.moveTo(pos.x, pos.y);
    
//     // Set drawing properties
//     ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
//     ctx.lineWidth = currentSize;
//     ctx.lineCap = 'round';
//     ctx.lineJoin = 'round';
    
//     if (currentTool === 'eraser') {
//       ctx.globalCompositeOperation = 'destination-out';
//     } else {
//       ctx.globalCompositeOperation = 'source-over';
//     }
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing) return;
    
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx) return;

//     const pos = getMousePos(e);
    
//     if (currentTool === 'pen' || currentTool === 'eraser') {
//       ctx.lineTo(pos.x, pos.y);
//       ctx.stroke();
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//     if (canvasRef.current) {
//       saveToHistory();
//     }
//   };

//   const addText = (text: string) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx || !text.trim()) {
//       setIsTextMode(false);
//       return;
//     }

//     ctx.globalCompositeOperation = 'source-over';
//     ctx.fillStyle = currentColor;
//     ctx.font = `${currentSize * 8}px Arial`;
//     ctx.fillText(text, textPosition.x, textPosition.y);
    
//     setIsTextMode(false);
//     saveToHistory();
//   };

//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (ctx && canvas) {
//       ctx.fillStyle = '#ffffff';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       saveToHistory();
//     }
//   };

//   const captureCanvas = (): Promise<Blob> => {
//     return new Promise((resolve) => {
//       canvasRef.current?.toBlob((blob) => {
//         resolve(blob || new Blob());
//       }, 'image/png');
//     });
//   };

//   const handleSendToAI = async () => {
//     const imageBlob = await captureCanvas();
//     onSendToAI(imageBlob, audioBlob || undefined, textQuery.trim() || currentTranscript);
//     setTextQuery('');
//     setAudioBlob(null);
//   };

//   const playAudioResponse = (audioUrl: string) => {
//     if (audioRef.current) {
//       audioRef.current.src = audioUrl;
//       audioRef.current.play();
//       setIsPlayingAudio(true);
//     }
//   };

//   const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#888888'];

//   if (!isActive) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-white">
//       {/* Canvas */}
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 cursor-crosshair"
//         onMouseDown={startDrawing}
//         onMouseMove={draw}
//         onMouseUp={stopDrawing}
//         onMouseLeave={stopDrawing}
//       />

//       {/* Toolbar */}
//       <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border p-2 flex flex-wrap gap-2 max-w-md">
//         {/* Drawing Tools */}
//         <div className="flex gap-1">
//           <Button
//             size="sm"
//             variant={currentTool === 'pen' ? 'default' : 'outline'}
//             onClick={() => setCurrentTool('pen')}
//           >
//             <Pen size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant={currentTool === 'eraser' ? 'default' : 'outline'}
//             onClick={() => setCurrentTool('eraser')}
//           >
//             <Eraser size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant={currentTool === 'text' ? 'default' : 'outline'}
//             onClick={() => setCurrentTool('text')}
//           >
//             <Type size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant={currentTool === 'line' ? 'default' : 'outline'}
//             onClick={() => setCurrentTool('line')}
//           >
//             <Minus size={16} />
//           </Button>
//         </div>

//         {/* Colors */}
//         <div className="flex gap-1">
//           {colors.map(color => (
//             <button
//               key={color}
//               className={`w-6 h-6 rounded border-2 ${
//                 currentColor === color ? 'border-gray-800' : 'border-gray-300'
//               }`}
//               style={{ backgroundColor: color }}
//               onClick={() => setCurrentColor(color)}
//             />
//           ))}
//         </div>

//         {/* Size */}
//         <div className="flex items-center gap-2">
//           <span className="text-sm">Size:</span>
//           <input
//             type="range"
//             min="1"
//             max="20"
//             value={currentSize}
//             onChange={(e) => setCurrentSize(parseInt(e.target.value))}
//             className="w-20"
//           />
//           <span className="text-sm w-6">{currentSize}</span>
//         </div>
//       </div>

//       {/* Voice Controls */}
//       <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border p-3">
//         <div className="flex items-center gap-2 mb-2">
//           <Button
//             size="sm"
//             variant={isListening ? 'destructive' : 'default'}
//             onClick={onToggleListening}
//           >
//             {isListening ? <MicOff size={16} /> : <Mic size={16} />}
//             {isListening ? 'Stop' : 'Voice'}
//           </Button>
//           {isPlayingAudio && (
//             <Button size="sm" variant="outline">
//               <Volume2 size={16} />
//             </Button>
//           )}
//         </div>
        
//         {currentTranscript && (
//           <div className="text-sm text-gray-600 max-w-48 p-2 bg-gray-50 rounded">
//             <strong>Listening:</strong> {currentTranscript}
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
//         <Button onClick={undo} variant="outline">
//           Undo
//         </Button>
//         <Button onClick={clearCanvas} variant="outline">
//           Clear
//         </Button>
//         <Input
//           value={textQuery}
//           onChange={(e) => setTextQuery(e.target.value)}
//           placeholder="Optional: Add text query..."
//           className="max-w-md"
//         />
//         <Button onClick={handleSendToAI} className="bg-green-600 hover:bg-green-700">
//           Send to AI
//         </Button>
//         <Button onClick={onClose} variant="destructive">
//           <X size={16} className="mr-1" />
//           Close
//         </Button>
//       </div>

//       {/* Text Input Modal */}
//       {isTextMode && (
//         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-4 rounded-lg">
//             <Input
//               autoFocus
//               placeholder="Enter text..."
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   addText(e.currentTarget.value);
//                   e.currentTarget.value = '';
//                 } else if (e.key === 'Escape') {
//                   setIsTextMode(false);
//                 }
//               }}
//             />
//             <div className="mt-2 text-sm text-gray-600">
//               Press Enter to add text, Escape to cancel
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Hidden audio element */}
//       <audio
//         ref={audioRef}
//         onEnded={() => setIsPlayingAudio(false)}
//         onLoadStart={() => setIsPlayingAudio(true)}
//       />
//     </div>
//   );
// };

// export default AnnotationOverlay;


// src/components/AnnotationOverlay.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen, Eraser, RotateCcw, Send, X, Trash2 } from 'lucide-react';

interface AnnotationOverlayProps {
  isActive: boolean;
  onClose: () => void;
  onSendToAI: (imageBlob: Blob, audioBlob?: Blob, textQuery?: string) => void;
  // Note: Voice props are removed as this will now be for visual-only on-page highlighting.
  // The WhiteScreen component will handle the integrated voice.
}

const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  isActive,
  onClose,
  onSendToAI,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#FF0000'); // Red for highlighting
  const [size, setSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [textQuery, setTextQuery] = useState('');
  const [history, setHistory] = useState<ImageData[]>([]);

  // Initialize canvas
  useEffect(() => {
    if (isActive && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const resizeCanvas = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          // **FIX: This is now transparent. No white background is drawn.**
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          if (history.length > 0) {
            ctx.putImageData(history[history.length - 1], 0, 0);
          }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        saveToHistory();
        return () => window.removeEventListener('resize', resizeCanvas);
      }
    }
  }, [isActive]);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      setHistory(prev => [...prev.slice(-9), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    }
  }, []);

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas && history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousState = newHistory[newHistory.length - 1];
      ctx.putImageData(previousState, 0, 0);
      setHistory(newHistory);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveToHistory();
    }
  };

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getMousePos(e);
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
  }, [getMousePos, tool, color, size]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, getMousePos]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  }, [isDrawing, saveToHistory]);

  const handleSendToAI = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        onSendToAI(blob, undefined, textQuery);
        setTextQuery('');
      }
    }, 'image/png');
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border p-3 flex items-center gap-4 z-10">
        <Button size="sm" variant={tool === 'pen' ? 'default' : 'outline'} onClick={() => setTool('pen')}><Pen size={16} /></Button>
        <Button size="sm" variant={tool === 'eraser' ? 'default' : 'outline'} onClick={() => setTool('eraser')}><Eraser size={16} /></Button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8" />
        <input type="range" min="1" max="50" value={size} onChange={(e) => setSize(Number(e.target.value))} />
        <Button size="sm" variant="outline" onClick={undo}><RotateCcw size={16} /></Button>
        <Button size="sm" variant="outline" onClick={clearCanvas}><Trash2 size={16} /></Button>
        <Button onClick={onClose} size="sm" variant="destructive"><X size={16} className="mr-1" />Close</Button>
      </div>
      
      {/* AI Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border p-3 flex items-center gap-2 z-10">
        <Input
          value={textQuery}
          onChange={(e) => setTextQuery(e.target.value)}
          placeholder="Optional: Ask about your annotation..."
          className="w-96"
        />
        <Button onClick={handleSendToAI} className="bg-green-600 hover:bg-green-700">
          <Send size={16} className="mr-2" />
          Send to AI
        </Button>
      </div>
    </div>
  );
};

export default AnnotationOverlay;