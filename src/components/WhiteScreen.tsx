// // src/components/WhiteScreen.tsx
// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Pen, Eraser, Type, Minus, Circle, Square as RectIcon,
//   Palette, RotateCcw, Save, X, Mic, MicOff, 
//   Volume2, Send, Download, Trash2
// } from 'lucide-react';

// interface WhiteScreenProps {
//   isActive: boolean;
//   onClose: () => void;
//   onSendToAI: (imageBlob: Blob, audioBlob?: Blob, textQuery?: string) => void;
//   isVoiceListening: boolean;
//   onToggleVoice: () => void;
//   currentTranscript?: string;
// }

// type DrawingTool = 'pen' | 'eraser' | 'text' | 'line' | 'circle' | 'rectangle';

// interface DrawingState {
//   tool: DrawingTool;
//   color: string;
//   size: number;
//   isDrawing: boolean;
//   startPos: { x: number; y: number };
// }

// const WhiteScreen: React.FC<WhiteScreenProps> = ({
//   isActive,
//   onClose,
//   onSendToAI,
//   isVoiceListening,
//   onToggleVoice,
//   currentTranscript = ''
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [drawingState, setDrawingState] = useState<DrawingState>({
//     tool: 'pen',
//     color: '#000000',
//     size: 3,
//     isDrawing: false,
//     startPos: { x: 0, y: 0 }
//   });
  
//   const [textQuery, setTextQuery] = useState('');
//   const [isTextMode, setIsTextMode] = useState(false);
//   const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
//   const [tempTextInput, setTempTextInput] = useState('');
//   const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);

//   const colors = [
//     '#000000', '#FF0000', '#00FF00', '#0000FF',
//     '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
//     '#800080', '#FFC0CB', '#A52A2A', '#808080'
//   ];

//   // Initialize canvas
//   useEffect(() => {
//     if (isActive && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
        
//         // Fill with white background
//         ctx.fillStyle = '#ffffff';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
        
//         // Set default drawing properties
//         ctx.lineCap = 'round';
//         ctx.lineJoin = 'round';
        
//         saveToHistory();
//       }
//     }
//   }, [isActive]);

//   const saveToHistory = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (ctx && canvas) {
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       setDrawingHistory(prev => [...prev.slice(-9), imageData]);
//     }
//   };

//   const undo = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (ctx && canvas && drawingHistory.length > 1) {
//       const newHistory = [...drawingHistory];
//       newHistory.pop();
//       const previousState = newHistory[newHistory.length - 1];
//       ctx.putImageData(previousState, 0, 0);
//       setDrawingHistory(newHistory);
//     }
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
    
//     if (drawingState.tool === 'text') {
//       setIsTextMode(true);
//       setTextPosition(pos);
//       return;
//     }

//     setDrawingState(prev => ({ 
//       ...prev, 
//       isDrawing: true, 
//       startPos: pos 
//     }));

//     // Set drawing properties
//     ctx.strokeStyle = drawingState.tool === 'eraser' ? '#ffffff' : drawingState.color;
//     ctx.fillStyle = drawingState.color;
//     ctx.lineWidth = drawingState.size;
    
//     if (drawingState.tool === 'eraser') {
//       ctx.globalCompositeOperation = 'destination-out';
//     } else {
//       ctx.globalCompositeOperation = 'source-over';
//     }

//     if (drawingState.tool === 'pen' || drawingState.tool === 'eraser') {
//       ctx.beginPath();
//       ctx.moveTo(pos.x, pos.y);
//     }
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!drawingState.isDrawing) return;
    
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx) return;

//     const pos = getMousePos(e);

//     if (drawingState.tool === 'pen' || drawingState.tool === 'eraser') {
//       ctx.lineTo(pos.x, pos.y);
//       ctx.stroke();
//     }
//   };

//   const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!drawingState.isDrawing) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx || !canvas) return;

//     if (e && (drawingState.tool === 'line' || drawingState.tool === 'circle' || drawingState.tool === 'rectangle')) {
//       const endPos = getMousePos(e);
//       drawShape(drawingState.startPos, endPos);
//     }

//     setDrawingState(prev => ({ ...prev, isDrawing: false }));
//     saveToHistory();
//   };

//   const drawShape = (start: { x: number; y: number }, end: { x: number; y: number }) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx) return;

//     ctx.globalCompositeOperation = 'source-over';
//     ctx.strokeStyle = drawingState.color;
//     ctx.lineWidth = drawingState.size;

//     switch (drawingState.tool) {
//       case 'line':
//         ctx.beginPath();
//         ctx.moveTo(start.x, start.y);
//         ctx.lineTo(end.x, end.y);
//         ctx.stroke();
//         break;
      
//       case 'rectangle':
//         const width = end.x - start.x;
//         const height = end.y - start.y;
//         ctx.beginPath();
//         ctx.rect(start.x, start.y, width, height);
//         ctx.stroke();
//         break;
      
//       case 'circle':
//         const radius = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
//         ctx.beginPath();
//         ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
//         ctx.stroke();
//         break;
//     }
//   };

//   const addText = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx || !tempTextInput.trim()) {
//       setIsTextMode(false);
//       setTempTextInput('');
//       return;
//     }

//     ctx.globalCompositeOperation = 'source-over';
//     ctx.fillStyle = drawingState.color;
//     ctx.font = `${drawingState.size * 8}px Arial`;
//     ctx.fillText(tempTextInput, textPosition.x, textPosition.y);
    
//     setIsTextMode(false);
//     setTempTextInput('');
//     saveToHistory();
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
//     const query = textQuery.trim() || currentTranscript.trim() || 'Analyze this drawing';
//     onSendToAI(imageBlob, undefined, query);
//     setTextQuery('');
//   };

//   const downloadImage = async () => {
//     const imageBlob = await captureCanvas();
//     const url = URL.createObjectURL(imageBlob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `whiteboard-${Date.now()}.png`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

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

//       {/* Top Toolbar */}
//       <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border p-3 flex items-center gap-4 z-10">
        
//         {/* Drawing Tools */}
//         <div className="flex gap-2">
//           <Button
//             size="sm"
//             variant={drawingState.tool === 'pen' ? 'default' : 'outline'}
//             onClick={() => setDrawingState(prev => ({ ...prev, tool: 'pen' }))}
//           >
//             <Pen size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant={drawingState.tool === 'eraser' ? 'default' : 'outline'}
//             onClick={() => setDrawingState(prev => ({ ...prev, tool: 'eraser' }))}
//           >
//             <Eraser size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant={drawingState.tool === 'text' ? 'default' : 'outline'}
//             onClick={() => setDrawingState(prev => ({ ...prev, tool: 'text' }))}
//           >
//             <Type size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant={drawingState.tool === 'line' ? 'default' : 'outline'}
//             onClick={() => setDrawingState(prev => ({ ...prev, tool: 'line' }))}
//           >
//             <Minus size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant={drawingState.tool === 'rectangle' ? 'default' : 'outline'}
//             onClick={() => setDrawingState(prev => ({ ...prev, tool: 'rectangle' }))}
//           >
//             <RectIcon size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant={drawingState.tool === 'circle' ? 'default' : 'outline'}
//             onClick={() => setDrawingState(prev => ({ ...prev, tool: 'circle' }))}
//           >
//             <Circle size={16} />
//           </Button>
//         </div>

//         {/* Colors */}
//         <div className="flex gap-1">
//           {colors.map(color => (
//             <button
//               key={color}
//               className={`w-6 h-6 rounded-full border-2 ${
//                 drawingState.color === color ? 'border-gray-800' : 'border-gray-300'
//               }`}
//               style={{ backgroundColor: color }}
//               onClick={() => setDrawingState(prev => ({ ...prev, color }))}
//             />
//           ))}
//         </div>

//         {/* Size Control */}
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium">Size:</span>
//           <input
//             type="range"
//             min="1"
//             max="30"
//             value={drawingState.size}
//             onChange={(e) => setDrawingState(prev => ({ ...prev, size: parseInt(e.target.value) }))}
//             className="w-20"
//           />
//           <span className="text-sm w-8 text-center">{drawingState.size}</span>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-2">
//           <Button size="sm" variant="outline" onClick={undo}>
//             <RotateCcw size={16} />
//           </Button>
//           <Button size="sm" variant="outline" onClick={clearCanvas}>
//             <Trash2 size={16} />
//           </Button>
//           <Button size="sm" variant="outline" onClick={downloadImage}>
//             <Download size={16} />
//           </Button>
//         </div>
//       </div>

//       {/* Voice & AI Controls */}
//       <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border p-3 space-y-3 z-10">
        
//         {/* Voice Control */}
//         <div className="flex items-center gap-2">
//           <Button
//             size="sm"
//             variant={isVoiceListening ? 'destructive' : 'default'}
//             onClick={onToggleVoice}
//           >
//             {isVoiceListening ? <MicOff size={16} /> : <Mic size={16} />}
//             {isVoiceListening ? 'Stop' : 'Voice'}
//           </Button>
          
//           {isVoiceListening && (
//             <div className="flex items-center gap-1 text-red-600">
//               <Volume2 size={14} className="animate-pulse" />
//               <span className="text-xs">Listening...</span>
//             </div>
//           )}
//         </div>

//         {/* Transcript Display */}
//         {currentTranscript && (
//           <div className="max-w-48 p-2 bg-gray-50 rounded text-sm">
//             <div className="text-xs font-medium text-gray-600 mb-1">Voice Input:</div>
//             <div className="text-gray-800">{currentTranscript}</div>
//           </div>
//         )}

//         {/* Text Query */}
//         <Input
//           value={textQuery}
//           onChange={(e) => setTextQuery(e.target.value)}
//           placeholder="Optional: Add text query..."
//           className="w-48"
//         />

//         {/* Send to AI */}
//         <Button
//           onClick={handleSendToAI}
//           className="w-full bg-green-600 hover:bg-green-700"
//         >
//           <Send size={16} className="mr-2" />
//           Send to AI
//         </Button>
//       </div>

//       {/* Close Button */}
//       <Button
//         onClick={onClose}
//         size="sm"
//         variant="destructive"
//         className="absolute top-4 left-4 z-10"
//       >
//         <X size={16} className="mr-1" />
//         Close
//       </Button>

//       {/* Text Input Modal */}
//       {isTextMode && (
//         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
//           <div className="bg-white p-6 rounded-lg shadow-xl">
//             <h3 className="text-lg font-medium mb-4">Add Text</h3>
//             <Input
//               value={tempTextInput}
//               onChange={(e) => setTempTextInput(e.target.value)}
//               placeholder="Enter text..."
//               className="mb-4"
//               autoFocus
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   addText();
//                 } else if (e.key === 'Escape') {
//                   setIsTextMode(false);
//                   setTempTextInput('');
//                 }
//               }}
//             />
//             <div className="flex gap-2 justify-end">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setIsTextMode(false);
//                   setTempTextInput('');
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={addText}>
//                 Add Text
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WhiteScreen;

// src/components/WhiteScreen.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import VoiceManager from '@/components/VoiceManager'; // Import VoiceManager
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Pen, Eraser, RotateCcw, Send, X, Mic, MicOff, Trash2
} from 'lucide-react';

interface WhiteScreenProps {
  isActive: boolean;
  onClose: () => void;
  onSendToAI: (imageBlob: Blob, audioBlob?: Blob, textQuery?: string) => void;
}

const WhiteScreen: React.FC<WhiteScreenProps> = ({
  isActive,
  onClose,
  onSendToAI,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  
  // --- FIX: Independent Voice State for this component ---
  const [textQuery, setTextQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (isActive && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        saveToHistory();
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
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = size;
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
    }
  };

  const handleSendToAI = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const query = textQuery.trim() || currentTranscript.trim() || 'Analyze this drawing';
        onSendToAI(blob, audioBlob || undefined, query);
        // Reset local state after sending
        setTextQuery('');
        setAudioBlob(null);
        setCurrentTranscript('');
        setIsListening(false);
      }
    }, 'image/png');
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* VoiceManager is now inside and self-contained */}
      {isListening && (
        <VoiceManager
          isListening={isListening}
          onTranscriptUpdate={setCurrentTranscript}
          onFinalTranscript={(final) => setCurrentTranscript(final)}
          onAudioRecorded={setAudioBlob}
        />
      )}
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border p-3 flex items-center gap-4 z-10">
        <Button size="sm" variant={tool === 'pen' ? 'default' : 'outline'} onClick={() => setTool('pen')}><Pen size={16} /></Button>
        <Button size="sm" variant={tool === 'eraser' ? 'default' : 'outline'} onClick={() => setTool('eraser')}><Eraser size={16} /></Button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8" />
        <input type="range" min="1" max="50" value={size} onChange={(e) => setSize(Number(e.target.value))} />
        <Button size="sm" variant="outline" onClick={undo}><RotateCcw size={16} /></Button>
        <Button size="sm" variant="outline" onClick={clearCanvas}><Trash2 size={16} /></Button>
      </div>

      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border p-3 space-y-3 z-10 w-64">
        <h3 className="font-semibold text-center">Whiteboard Mode</h3>
        <Button onClick={onClose} size="sm" variant="destructive" className="w-full"><X size={16} className="mr-1" />Close</Button>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={isListening ? 'destructive' : 'default'} onClick={() => setIsListening(!isListening)} className="flex-1">
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            <span className="ml-1">{isListening ? 'Stop' : 'Voice'}</span>
          </Button>
        </div>
        {currentTranscript && <p className="text-xs p-2 bg-gray-100 rounded">"{currentTranscript}"</p>}
        <Input value={textQuery} onChange={(e) => setTextQuery(e.target.value)} placeholder="Or type a query..." />
        <Button onClick={handleSendToAI} className="w-full bg-green-600 hover:bg-green-700">
          <Send size={16} className="mr-2" />
          Send to AI
        </Button>
      </div>
    </div>
  );
};

export default WhiteScreen;