import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 100 * 1024 * 1024, 
    files: 15 
  },
  fileFilter: (req, file, cb) => {
   
    const allowedMimes = [
      
      'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
      
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Text files
      'text/plain', 'text/csv', 'text/html', 'text/css', 'text/javascript',
      // ENHANCED: Audio support with all WebM variants and codecs
      'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/aiff', 'audio/aac', 'audio/ogg', 'audio/flac', 
      'audio/webm', 'audio/webm;codecs=opus', 'audio/webm;codecs=vorbis', 'audio/x-wav', 'audio/wave',
      // Video
      'video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/mpg', 
      'video/webm', 'video/wmv', 'video/3gpp'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.warn(`Unsupported file type: ${file.mimetype} for file: ${file.originalname}`);
      cb(new Error(`File type ${file.mimetype} is not supported. Please use supported audio formats like WebM, WAV, or MP3.`), false);
    }
  }
});

// --- Helper function to convert buffer to Gemini Part ---
function fileToGenerativePart(buffer, mimeType, fileName) {
  // FIXED: Better MIME type normalization for Gemini API
  let normalizedMimeType = mimeType;
  
  // Normalize WebM audio MIME types for Gemini
  if (mimeType === 'audio/webm;codecs=opus' || mimeType === 'audio/webm;codecs=vorbis') {
    normalizedMimeType = 'audio/webm';
  }
  
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType: normalizedMimeType,
    },
  };
}

// --- ENHANCED: Helper function to categorize files with better detection ---
function categorizeFiles(files) {
  const categories = {
    screenCaptures: [],
    audioFiles: [],
    regularFiles: []
  };

  files.forEach(file => {
    const fileName = file.originalname.toLowerCase();
    const mimeType = file.mimetype.toLowerCase();
    
    // Enhanced screen capture detection
    if (fileName.includes('screen-capture') || 
        fileName.includes('voice-screen-capture') ||
        fileName.includes('manual-screen-capture') ||
        (mimeType.startsWith('image/') && fileName.includes('capture'))) {
      categories.screenCaptures.push(file);
    } 
    // Enhanced voice/audio file detection
    else if (fileName.includes('voice-query') || 
             fileName.includes('voice') ||
             fileName.includes('audio') ||
             fileName.includes('annotation-audio') ||
             fileName.includes('whiteboard-audio') ||
             fileName.includes('overlay-audio') ||
             mimeType.startsWith('audio/')) {
      categories.audioFiles.push(file);
    } 
    // Regular files
    else {
      categories.regularFiles.push(file);
    }
  });

  console.log(`File categorization: ${categories.screenCaptures.length} screen, ${categories.audioFiles.length} audio, ${categories.regularFiles.length} regular`);
  return categories;
}

// --- Enhanced System Instruction ---
const getSystemInstruction = (hasVoiceQuery = false, hasScreenAnalysis = false) => {
  let systemText = `
You are **Engineering Hub AI**, an expert engineering tutor and problem solver for all engineering disciplines.

YOUR PERSONA
- Polite, encouraging, and highly knowledgeable mentor
- Clear, step-by-step explanations in student-friendly language
- Concise by default, detailed when requested
- Focus on practical engineering applications

CAPABILITIES
1. **Problem Solving**: Step-by-step solutions with formulas and explanations
2. **Code Analysis**: Debug, explain, and optimize code
3. **File Analysis**: PDFs, images, documents, audio, video analysis
4. **Roadmaps**: Structured learning paths with resources
`;

systemText += `
5. **GUIDELINE FOR SCREEN ANALYSIS REQUESTS**:
   - If a user asks you to analyze, see, or look at their screen, BUT no screen capture image is provided with the prompt, you MUST respond by politely instructing them to use the 'Analyze' button.
   - **DO NOT state that you are an AI and cannot see their screen.**
   - **Example Correct Response**: "To analyze your screen, please use the floating 'Analyze' button. I am able to help with any of your engineering questions!"
`;

  if (hasVoiceQuery) {
    systemText += `
6. **VOICE QUERY SPECIALIST**:
   - You are responding to a voice query from the user
   - Provide clear, concise responses suitable for audio playback
   - Focus on key insights and practical information
   - If audio transcription is unclear, ask for clarification
   - Respond conversationally as if speaking to the user
`;
  }

  if (hasScreenAnalysis) {
    systemText += `
7. **SCREEN ANALYSIS SPECIALIST**:
   - Analyze screen captures for code, diagrams, equations, or technical content
   - Identify issues, bugs, or improvement opportunities
   - Explain visible concepts and provide educational insights
   - Relate analysis to engineering principles and best practices
`;
  }

  systemText += `

RESPONSE STYLE
- Use **Markdown** formatting for clarity
- Keep answers concise unless detailed explanation requested
- Always end with helpful follow-up suggestions
- Provide practical, actionable advice

You are helpful, knowledgeable, and focused on engineering education.
`;

  return {
    role: "system",
    parts: [{ text: systemText }],
  };
};

// --- MAIN CHAT ROUTE WITH ENHANCED VOICE SUPPORT ---
router.post('/chat', upload.array('files', 15), async (req, res) => {
  try {
    const { message } = req.body;
    const history = req.body.history ? JSON.parse(req.body.history) : [];
    const files = req.files || [];

    // Validate input
    if (!message && files.length === 0) {
      return res.status(400).json({ error: 'A message or at least one file is required.' });
    }

    // ENHANCED: Better file categorization and query type detection
    const { screenCaptures, audioFiles, regularFiles } = categorizeFiles(files);
    
    console.log(`Processing request with message: "${message?.substring(0, 100)}..."`);
    console.log(`Files: ${files.length} total (${screenCaptures.length} screen, ${audioFiles.length} audio, ${regularFiles.length} regular)`);
    
    // Detect query types
    const hasVoiceQuery = audioFiles.length > 0 || (message && message.includes('[VOICE_QUERY'));
    const hasScreenAnalysis = screenCaptures.length > 0;
    const isVoiceOnlyQuery = hasVoiceQuery && screenCaptures.length === 0;
    
    // ENHANCED: Better prompt construction for different query types
    let promptMessage = message || '';
    
    if (files.length > 0) {
      const descriptions = [];
      
      if (screenCaptures.length > 0) {
        descriptions.push(`${screenCaptures.length} screen capture(s)`);
      }
      
      if (audioFiles.length > 0) {
        descriptions.push(`${audioFiles.length} voice recording(s)`);
      }
      
      if (regularFiles.length > 0) {
        descriptions.push(`${regularFiles.length} file(s): ${regularFiles.map(f => f.originalname).join(', ')}`);
      }
      
      const fileDescription = descriptions.join(', ');
      
      // Enhanced prompt construction based on query type
      if (!message) {
        if (isVoiceOnlyQuery) {
          promptMessage = `Please respond to my voice query. Voice recording provided: ${fileDescription}`;
        } else if (hasScreenAnalysis && hasVoiceQuery) {
          promptMessage = `Please analyze my screen content and respond to my voice query. Files provided: ${fileDescription}`;
        } else if (hasScreenAnalysis) {
          promptMessage = `Please analyze my screen content. Files provided: ${fileDescription}`;
        } else {
          promptMessage = `Please analyze the following content: ${fileDescription}`;
        }
      } else {
        promptMessage += `\n\nFiles attached: ${fileDescription}`;
      }
      
      // Add context for different query types
      if (isVoiceOnlyQuery) {
        promptMessage += `\n\n[VOICE_ONLY_QUERY: This is a voice-only query without screen sharing. Please transcribe the audio and provide a helpful response to the user's spoken question. Focus on clear, conversational responses suitable for audio playback.]`;
      } else if (hasScreenAnalysis && hasVoiceQuery) {
        promptMessage += `\n\n[SCREEN_VOICE_QUERY: Analyze the screen capture(s) and respond to questions in the voice recording(s). Provide comprehensive analysis addressing both visual content and spoken questions.]`;
      } else if (hasVoiceQuery) {
        promptMessage += `\n\n[VOICE_QUERY: Please transcribe and respond to the voice recording. Provide clear, conversational responses.]`;
      }
    }

    // ENHANCED: Prepare prompt parts with optimized file order
    const promptParts = [promptMessage];

    // Add files in optimal order for Gemini processing
    const orderedFiles = [...screenCaptures, ...audioFiles, ...regularFiles];
    
    for (const file of orderedFiles) {
      try {
        const filePart = fileToGenerativePart(file.buffer, file.mimetype, file.originalname);
        promptParts.push(filePart);
        
        console.log(`Added file: ${file.originalname} (${file.mimetype}, ${(file.buffer.length / 1024).toFixed(2)}KB)`);
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        // Continue with other files, don't fail the entire request
      }
    }

    // --- Gemini AI Configuration ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: getSystemInstruction(hasVoiceQuery, hasScreenAnalysis),
    });

    // ENHANCED: Generation config based on query type
    const generationConfig = {
      maxOutputTokens: hasScreenAnalysis ? 12288 : hasVoiceQuery ? 8192 : 8192,
      temperature: isVoiceOnlyQuery ? 0.6 : hasScreenAnalysis ? 0.3 : 0.7, // More conversational for voice-only
      topP: 0.8,
      topK: 40
    };

    // Initialize chat
    let chat;
    try {
      chat = model.startChat({
        history: history,
        generationConfig,
      });
    } catch (initError) {
      console.error('Gemini Chat Init Error:', initError);
      return res.status(500).json({ error: 'Failed to initialize AI chat. Please try again.' });
    }

    // Set response headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    try {
      console.log('Sending request to Gemini API...');
      
      const result = await chat.sendMessageStream(promptParts);
      let accumulatedResponse = '';

      for await (const chunk of result.stream) {
        if (!res.writableEnded && chunk.text()) {
          const chunkText = chunk.text();
          accumulatedResponse += chunkText;
          res.write(chunkText);
        } else if (res.writableEnded) {
          console.warn('Response already ended, stopping stream.');
          break;
        }
      }

      // // ENHANCED: Clean audio response for voice queries
      // if ((hasVoiceQuery || isVoiceOnlyQuery) && accumulatedResponse.trim()) {
      //   const cleanedResponse = cleanTextForAudio(accumulatedResponse);
      //   // setCurrentAudioResponse(cleanedResponse);
      // }

      // Add specific follow-up suggestions based on query type
      if (!res.writableEnded) {
        let followUpSuggestions = '\n\n---\n**💡 Follow-up suggestions:**\n';
        
        if (isVoiceOnlyQuery) {
          followUpSuggestions += '- Ask follow-up questions using voice or text\n- Request more detailed explanations\n- Try voice queries with screen sharing for visual analysis';
        } else if (hasVoiceQuery && hasScreenAnalysis) {
          followUpSuggestions += '- Ask for clarification on any specific concepts\n- Request step-by-step explanations\n- Continue using voice + screen for complex problems';
        } else {
          followUpSuggestions += '- Ask for clarification on any specific concepts\n- Request step-by-step explanations\n- Upload related files for deeper analysis';
        }
        
        res.write(followUpSuggestions);
      }

      if (!res.writableEnded) {
        res.end();
      }

      console.log(`Successfully processed ${hasVoiceQuery ? 'voice' : 'text'} query with ${files.length} files`);

    } catch (streamError) {
      console.error('Gemini API Error during streaming:', streamError);
      
      if (!res.headersSent) {
        let errorMessage = 'Error communicating with AI. ';
        
        if (streamError.message?.includes('quota')) {
          errorMessage += 'API quota exceeded. Please try again later.';
        } else if (streamError.message?.includes('safety')) {
          errorMessage += 'Content was flagged by safety filters. Please try rephrasing your question.';
        } else if (streamError.message?.includes('file') || streamError.message?.includes('audio')) {
          errorMessage += 'There was an issue processing your audio file. Please ensure it\'s in WebM, WAV, or MP3 format and try again.';
        } else {
          errorMessage += streamError.message || 'Unknown error occurred.';
        }
        
        return res.status(500).json({ error: errorMessage });
      } else {
        // If streaming already started, write error message
        if (!res.writableEnded) {
          res.write('\n\n---\n**Error**: There was an issue processing your request. Please try again.');
          res.end();
        }
      }
    }

  } catch (error) {
    console.error('General Error in chat route:', error);
    
    if (!res.headersSent) {
      let errorMessage = 'Server error occurred. ';
      
      if (error.code === 'LIMIT_FILE_SIZE') {
        errorMessage = 'File size too large. Maximum size is 100MB per file.';
      } else if (error.code === 'LIMIT_FILE_COUNT') {
        errorMessage = 'Too many files. Maximum is 15 files per request.';
      } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        errorMessage = 'Unexpected file upload error. Please try again.';
      } else if (error.message?.includes('File type')) {
        errorMessage = error.message;
      }
      
      return res.status(500).json({ error: errorMessage });
    }
  }
});


function cleanTextForAudio(text) {
  // Simple cleaning - remove ALL markdown and formatting
  let cleaned = text
    .replace(/\*\*(.*?)\*\*/g, '$1')     // **bold** -> text
    .replace(/\*(.*?)\*/g, '$1')         // *italic* -> text  
    .replace(/`(.*?)`/g, '$1')           // `code` -> text
    .replace(/#{1,6}\s/g, '')            // # headers -> nothing
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')  // [text](link) -> text
    .replace(/^[\s]*[-\*\+]\s/gm, '')    // bullet points -> nothing
    .replace(/^[\s]*\d+\.\s/gm, '')      // numbered lists -> nothing
    .replace(/---+/g, '')                // dividers -> nothing
    .replace(/\*\*.*?\*\*/g, '')         // Remove remaining bold
    .replace(/💡.*$/gm, '')              // Remove emoji sections
    .replace(/Follow-up suggestions?:.*$/gmi, '')  // Remove follow-up
    .replace(/Would you like.*?\?/gi, '') // Remove questions
    .replace(/\n{2,}/g, ' ')             // Multiple newlines -> space
    .replace(/\s{2,}/g, ' ')             // Multiple spaces -> single space
    .trim();
  
  // Get only first 2 sentences for voice
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const result = sentences.slice(0, 2).join('. ') + '.';
  
  return result.length > 10 ? result : "I've analyzed your request.";
}

// --- Health check route ---
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Engineering Hub AI with Enhanced Voice & Screen Sharing',
    features: [
      'Independent voice queries (no screen sharing required)',
      'Enhanced voice + screen analysis',
      'Multi-file analysis (up to 15 files)',
      'WebM, WAV, MP3 audio support',
      'Real-time streaming responses',
      'Better error handling and permissions'
    ],
    supportedFileTypes: [
      'Images: PNG, JPEG, GIF, WebP',
      'Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX',
      'Text: TXT, CSV, HTML, CSS, JS',
      'Audio: WebM, WAV, MP3, AAC, OGG, FLAC',
      'Video: MP4, MOV, AVI, WebM, WMV'
    ],
    maxFiles: 15,
    maxFileSize: '100MB',
    voiceFeatures: {
      independentVoiceQueries: true,
      voiceWithScreenAnalysis: true,
      enhancedAudioSupport: ['WebM', 'WAV', 'MP3'],
      betterPermissionHandling: true
    }
  });
});

export default router;