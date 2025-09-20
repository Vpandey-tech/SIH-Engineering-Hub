// src/pages/GeminiStudyGuide.tsx

import { useState, useRef, useEffect } from 'react';
import ChatBubble from '@/components/ChatBubble';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowUp, Sparkles, Paperclip, X, PlusCircle, MessageSquare, 
  Trash2, FileText, Image, Music, Video, File, ChevronDown,
  Download, Copy, MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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

// --- FILE TYPE UTILITIES ---
const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image size={16} className="text-blue-500" />;
  if (mimeType === 'application/pdf') return <FileText size={16} className="text-red-500" />;
  if (mimeType.includes('word') || mimeType.includes('document')) return <FileText size={16} className="text-blue-600" />;
  if (mimeType.includes('excel') || mimeType.includes('sheet')) return <FileText size={16} className="text-green-600" />;
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return <FileText size={16} className="text-orange-600" />;
  if (mimeType.startsWith('audio/')) return <Music size={16} className="text-purple-500" />;
  if (mimeType.startsWith('video/')) return <Video size={16} className="text-pink-500" />;
  return <File size={16} className="text-gray-500" />;
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
  "Describe the working principle of a 4-stroke petrol engine with a diagram.",
  "What are the key data structures used in database indexing?",
  "Summarize the basics of Kirchhoff's circuit laws.",
  "Analyze my circuit diagram and suggest improvements.",
  "Explain this PDF document in simple terms."
];

const GeminiStudyGuide = () => {
  // --- STATE MANAGEMENT ---
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeHistory = activeConversation?.history ?? [];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LOCAL STORAGE & STATE SYNC ---
  useEffect(() => {
    try {
      const storedConversations = localStorage.getItem('chat_conversations');
      if (storedConversations) {
        const parsed = JSON.parse(storedConversations);
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt || Date.now())
        }));
        setConversations(conversationsWithDates);
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

  // --- DRAG AND DROP HANDLERS ---
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

  // --- FILE HANDLING ---
  const handleFileSelection = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 100MB.`);
        return false;
      }
      return true;
    });

    // Limit total files to 10
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

  // --- CHAT HANDLERS ---
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
    if ((!message.trim() && files.length === 0) || isLoading) return;

    setIsLoading(true);

    const userMessageText = message || (files.length > 0 ? `Analyze ${files.length} file(s): ${files.map(f => f.name).join(', ')}` : "");
    const userMessage: HistoryItem = { role: 'user', parts: [{ text: userMessageText }] };
    
    let conversationId = activeConversationId;
    let historyForApi = [...activeHistory, userMessage];

    if (!conversationId) {
      const newId = Date.now().toString();
      const newTitle = userMessageText.substring(0, 40) + (userMessageText.length > 40 ? '...' : '');
      const newConversation: Conversation = { 
        id: newId, 
        title: newTitle, 
        history: [userMessage],
        createdAt: new Date()
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newId);
      conversationId = newId;
    } else {
      updateConversationHistory(conversationId, historyForApi);
    }
    
    updateConversationHistory(conversationId, [...historyForApi, { role: 'model', parts: [{ text: '' }] }]);
    
    const currentMessage = message;
    const currentFiles = [...files];
    setMessage('');
    setFiles([]);

    const formData = new FormData();
    formData.append('message', currentMessage);
    formData.append('history', JSON.stringify(historyForApi));
    
    // Append all files
    currentFiles.forEach((file) => {
      formData.append('files', file);
    });

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

    } catch (error) {
      console.error('Error fetching stream:', error);
      let errorMessage = 'Sorry, something went wrong. ';
      
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          errorMessage += 'API quota exceeded. Please try again later.';
        } else if (error.message.includes('safety')) {
          errorMessage += 'Content was flagged by safety filters. Please try rephrasing your question.';
        } else if (error.message.includes('file')) {
          errorMessage += 'There was an issue processing your files. Please check the file formats and try again.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error occurred.';
      }
      
      const finalHistoryWithError = [...historyForApi, { role: 'model', parts: [{ text: errorMessage }] }];
      updateConversationHistory(conversationId, finalHistoryWithError);
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX LAYOUT ---
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-tr from-[#e9edfb] via-[#f6f8ff] to-[#e8f2fe] dark:from-[#1a2139] dark:via-[#232848] dark:to-[#19233b] transition-colors duration-500">
      
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
      {/* --- Main Chat Window --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 z-10 backdrop-blur-md bg-transparent border-b border-indigo-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="text-indigo-600 dark:text-indigo-300" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-wide">
              Engineering Hub — AI Study Guide
            </h1>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Supports: PDF, Images, Documents, Audio, Video
          </div>
        </header>
      
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
                 <ChatBubble role="model" content="Analyzing your files and preparing response..." />
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

              {/* Example prompts */}
              {(activeHistory.length === 0 || !activeConversationId) && message === "" && files.length === 0 && (
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
                      <File size={16} className="mr-2" />
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
                  placeholder={files.length > 0 ? "Ask about your files..." : "Ask your engineering question..."} 
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
              
              {/* Status info */}
              {(files.length > 0 || isLoading) && (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
                  {isLoading 
                    ? "Processing your request..." 
                    : `${files.length} file(s) ready to analyze`
                  }
                </div>
              )}
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