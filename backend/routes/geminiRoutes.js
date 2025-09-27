
// // routes/geminiRoutes.js

// import express from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import dotenv from 'dotenv';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';

// dotenv.config();
// const router = express.Router();

// // --- Manual scholarship content (replace with your actual PDF content) ---
// const scholarshipContent = `
// SCHOLARSHIP INFORMATION FOR ENGINEERING STUDENTS

// EWS (Economically Weaker Section) Scholarship:
// - Eligibility: Family annual income should be less than Rs. 8,00,000
// - Benefits: Full tuition fee waiver or partial fee concession
// - Required Documents: Income certificate, EWS certificate, Aadhar card
// - Application Process: Online application through state scholarship portal

// TFWS (Tuition Fee Waiver Scheme):
// - Eligibility: Merit-based selection with income criteria
// - Income Limit: Family income below Rs. 6,00,000 per annum  
// - Benefits: Complete tuition fee waiver for eligible students
// - Documents: Income certificate, caste certificate (if applicable), mark sheets

// Merit-based Scholarships:
// - Based on academic performance in previous qualifying examinations
// - Minimum 85% marks required in 12th standard
// - Benefits: Rs. 5000 to Rs. 50,000 per year depending on merit rank
// - Renewable annually based on academic performance

// Need-based Financial Aid:
// - For students from financially disadvantaged backgrounds
// - Income limit: Below Rs. 2,50,000 per annum
// - Benefits: Partial or full fee waiver plus maintenance allowance
// - Special consideration for orphans and single parent families

// Application Documents Generally Required:
// 1. Income certificate from competent authority
// 2. Caste certificate (if applicable)
// 3. Domicile certificate
// 4. Previous year mark sheets
// 5. Bank account details
// 6. Aadhar card
// 7. Passport size photographs

// Application Deadlines:
// - First semester: Usually by July 31st
// - Second semester: By December 31st
// - Late applications may be considered with penalty


// `;

// // --- Helper function to detect scholarship-related queries ---
// const isScholarshipQuery = (message) => {
//   const scholarshipKeywords = [
//     'scholarship', 'scholarships', 'financial aid', 'fee concession', 
//     'ews', 'tfws', 'economically weaker section', 'tuition fee waiver',
//     'study grant', 'education fund', 'merit scholarship', 'need based',
//     'eligibility', 'application process', 'documents required'
//   ];
  
//   const lowerMessage = message.toLowerCase();
//   return scholarshipKeywords.some(keyword => lowerMessage.includes(keyword));
// };

// // --- Helper function to detect screen analysis queries ---
// const isScreenAnalysisQuery = (message, hasScreenCapture) => {
//   const screenKeywords = [
//     'screen', 'analyze screen', 'screen capture', 'what do you see',
//     'explain this', 'what\'s on my screen', 'current screen', 'display',
//     'analyze this image', 'explain the diagram', 'code analysis'
//   ];
  
//   const lowerMessage = message.toLowerCase();
//   return hasScreenCapture || screenKeywords.some(keyword => lowerMessage.includes(keyword));
// };

// // --- Enhanced System Instruction with Screen Analysis Context ---
// const getSystemInstruction = (includeScholarship = false, isScreenAnalysis = false) => {
//   let systemText = `
// You are **Engineering Hub AI**, an all-rounder engineering tutor, problem solver, and roadmap guide for students across all engineering disciplines (Mechanical, Civil, Electrical, CSE, IT, ECE, Chemical, etc.).

// YOUR PERSONA
// - Polite, encouraging, and highly knowledgeable mentor.
// - A "doubt killer" and "study helper" who gives clear, step-by-step, practical guidance.
// - Speak in **simple, student-friendly language** — avoid jargon unless explaining it.
// - Always respond concisely; keep answers **short by default**, but give extended detail if the user explicitly asks for a "long" or "detailed" response.

// DOMAIN FOCUS
// - Stay strictly within **engineering, computing, applied sciences, and study help**.
// - If asked about non-engineering topics, politely redirect to relevant engineering areas.

// SPECIAL FEATURES
// 1. **Roadmaps:**  
//    - If a user asks for a roadmap (e.g., "roadmap for AI in Mechanical Engineering"), provide a structured path from beginner → intermediate → advanced.  
//    - Use **bullet points or tables** for clarity.  
//    - Include hyperlinks to **YouTube tutorials**, **open-source PDFs**, **free articles**, and **documentation** wherever possible.  
//    - Mark links clearly (e.g., [YouTube: Thermodynamics Basics](https://youtube.com/...)).

// 2. **Problem Solving:**  
//    - Solve numerical problems, explain derivations, and break down complex theories in **step-by-step** manner.  
//    - Use **formulas**, **diagrams (Markdown tables for now)**, and **code snippets** when needed.  

// 3. **Resource Suggestion:**  
//    - For any topic, suggest **at least 1–2 YouTube links**, **open-source references**, or **free online books/articles**.  
//    - Use markdown hyperlinks.

// 4. **File Analysis:**  
//    - **PDFs**: Extract and summarize key engineering concepts, solve problems, explain diagrams
//    - **Images**: Analyze circuit diagrams, engineering drawings, graphs, equations, sketches
//    - **Documents**: Review assignments, projects, research papers, technical documentation
//    - **Audio/Video**: Transcribe and analyze engineering lectures, tutorials, presentations
//    - Always provide detailed analysis with practical engineering insights

// 5. **Multiple File Handling:**
//    - When multiple files are uploaded, analyze each one and provide comparative insights
//    - Cross-reference information between files when relevant
//    - Provide consolidated summaries for related materials
// `;

//   if (isScreenAnalysis) {
//     systemText += `

// 6. **SCREEN ANALYSIS SPECIALIST:**
//    - You are analyzing content from a user's screen capture and/or audio input.
//    - The user is likely working on engineering problems, viewing code, diagrams, or technical content.
//    - Provide detailed analysis of what you see in the screen capture.
//    - If code is visible, explain its functionality, suggest improvements, or help debug issues.
//    - If diagrams/circuits are shown, explain their working principles and analyze their design.
//    - If equations or formulas are visible, help solve them step by step.
//    - If the user provided audio along with screen capture, respond to their spoken questions about the content.
//    - Be proactive in identifying potential issues, improvements, or learning opportunities.
//    - Always relate your analysis back to engineering principles and best practices.
// `;
//   }

//   if (includeScholarship) {
//     systemText += `

// 7. **SCHOLARSHIP INFORMATION SPECIALIST:**
//    - You have access to specific scholarship information from an official document.
//    - When users ask about scholarships, financial aid, EWS, TFWS, or related topics, use ONLY the information provided below.
//    - Always mention that users can download the complete scholarship document for detailed information.
//    - Be precise and quote specific details from the document.

// **SCHOLARSHIP DOCUMENT CONTENT:**
// \`\`\`
// ${scholarshipContent}
// \`\`\`

// **SCHOLARSHIP RESPONSE FORMAT:**
// - Provide direct answers based on the document content
// - Include specific details like eligibility criteria, required documents, benefits, etc.
// - Always end scholarship responses with: "📄 **Download the complete scholarship document for detailed information and application procedures.**"
// `;
//   }

//   systemText += `

// RESPONSE STYLE
// - Use **Markdown** for formatting:  
//   - **Bold** for keywords  
//   - Bullet points for lists  
//   - Numbered lists for steps  
//   - Proper Markdown tables for comparisons.  
// - Keep answers **concise by default**; expand only when asked.  
// - End every answer politely with a follow-up like:  
//   *"Would you like me to analyze any specific part in more detail or provide additional resources?"*

// EXAMPLES OF HOW TO RESPOND
// - If asked: *"Give me a roadmap for learning Data Structures in CSE"* → Provide beginner → advanced path + YouTube + free resources.  
// - If asked: *"Solve this thermodynamics problem"* → Give step-by-step solution + formula explanation.  
// - If asked: *"Explain this circuit diagram"* → Analyze components, explain working, suggest improvements.
// - If asked: *"Summarize this PDF"* → Extract key engineering concepts, formulas, and practical applications.
// - If screen capture shows code: → Explain code functionality, suggest optimizations, help with debugging.
// - If screen capture shows diagrams: → Analyze design, explain working principles, suggest improvements.
// - If audio + screen provided: → Address spoken questions while referencing visual content.

// You are always **helpful, resource-rich, concise, and domain-focused.**
// `;

//   return {
//     role: "system",
//     parts: [{ text: systemText }],
//   };
// };

// // --- Enhanced Multer Configuration for File Uploads ---
// const storage = multer.memoryStorage();
// const upload = multer({ 
//   storage: storage,
//   limits: { 
//     fileSize: 100 * 1024 * 1024, // 100 MB file size limit
//     files: 15 // Increased to accommodate screen captures + audio + regular files
//   },
//   fileFilter: (req, file, cb) => {
//     // Supported file types for Gemini
//     const allowedMimes = [
//       // Images (including screen captures)
//       'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
//       // Documents
//       'application/pdf',
//       'application/msword', // .doc
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
//       'application/vnd.ms-excel', // .xls
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
//       'application/vnd.ms-powerpoint', // .ppt
//       'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
//       // Text files
//       'text/plain', 'text/csv', 'text/html', 'text/css', 'text/javascript',
//       // Audio (including voice recordings)
//       'audio/wav', 'audio/mp3', 'audio/aiff', 'audio/aac', 'audio/ogg', 'audio/flac', 'audio/webm',
//       // Video
//       'video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/mpg', 'video/webm', 'video/wmv', 'video/3gpp'
//     ];
    
//     if (allowedMimes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error(`File type ${file.mimetype} is not supported. Supported types: ${allowedMimes.join(', ')}`), false);
//     }
//   }
// });

// // --- Helper function to convert buffer to Gemini Part ---
// function fileToGenerativePart(buffer, mimeType, fileName) {
//   return {
//     inlineData: {
//       data: buffer.toString("base64"),
//       mimeType,
//     },
//   };
// }

// // --- Helper function to get file type description ---
// function getFileTypeDescription(mimeType) {
//   if (mimeType.startsWith('image/')) return 'image';
//   if (mimeType === 'application/pdf') return 'PDF document';
//   if (mimeType.includes('word')) return 'Word document';
//   if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'Excel spreadsheet';
//   if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PowerPoint presentation';
//   if (mimeType.startsWith('audio/')) return 'audio file';
//   if (mimeType.startsWith('video/')) return 'video file';
//   if (mimeType.startsWith('text/')) return 'text file';
//   return 'file';
// }

// // --- Helper function to identify screen captures and audio files ---
// function categorizeFiles(files) {
//   const categories = {
//     screenCaptures: [],
//     audioFiles: [],
//     regularFiles: []
//   };

//   files.forEach(file => {
//     if (file.originalname.includes('screen-capture') || 
//         (file.mimetype.startsWith('image/') && file.originalname.includes('capture'))) {
//       categories.screenCaptures.push(file);
//     } else if (file.originalname.includes('voice-query') || 
//                (file.mimetype.startsWith('audio/') && file.originalname.includes('voice'))) {
//       categories.audioFiles.push(file);
//     } else {
//       categories.regularFiles.push(file);
//     }
//   });

//   return categories;
// }

// // --- Main chat route with enhanced screen and audio analysis ---
// router.post('/chat', upload.array('files', 15), async (req, res) => {
//   try {
//     const { message } = req.body;
//     const history = req.body.history ? JSON.parse(req.body.history) : [];
//     const files = req.files || [];

//     // Validate input
//     if (!message && files.length === 0) {
//       return res.status(400).json({ error: 'A message or at least one file is required.' });
//     }

//     // Categorize files
//     const { screenCaptures, audioFiles, regularFiles } = categorizeFiles(files);
    
//     // Check if this is a screen analysis or scholarship query
//     const isScholarshipRelated = message && isScholarshipQuery(message);
//     const hasScreenAnalysis = screenCaptures.length > 0 || isScreenAnalysisQuery(message, screenCaptures.length > 0);
    
//     // Prepare enhanced prompt message
//     let promptMessage = message || '';
    
//     if (files.length > 0) {
//       const descriptions = [];
      
//       if (screenCaptures.length > 0) {
//         descriptions.push(`${screenCaptures.length} screen capture(s)`);
//       }
      
//       if (audioFiles.length > 0) {
//         descriptions.push(`${audioFiles.length} voice recording(s)`);
//       }
      
//       if (regularFiles.length > 0) {
//         descriptions.push(`${regularFiles.length} additional file(s): ${regularFiles.map(f => f.originalname).join(', ')}`);
//       }
      
//       const fileDescription = descriptions.join(', ');
      
//       if (!message) {
//         if (hasScreenAnalysis) {
//           promptMessage = `Please analyze my screen content and provide detailed engineering insights. Files provided: ${fileDescription}`;
//         } else {
//           promptMessage = `Please analyze the following content: ${fileDescription}`;
//         }
//       } else {
//         promptMessage += `\n\nAttached: ${fileDescription}`;
//       }
      
//       // Add specific context for screen analysis
//       if (hasScreenAnalysis) {
//         if (audioFiles.length > 0) {
//           promptMessage += `\n\n[CONTEXT: This is a screen analysis request with voice query. Please analyze the screen capture(s) and respond to any questions in the audio recording(s).]`;
//         } else {
//           promptMessage += `\n\n[CONTEXT: This is a screen analysis request. Please provide detailed analysis of the screen content, focusing on engineering concepts, code, diagrams, or technical material visible.]`;
//         }
//       }
//     }

//     // Prepare prompt parts with optimized file order
//     const promptParts = [promptMessage];

//     // Add files in optimal order: screen captures first, then audio, then regular files
//     const orderedFiles = [...screenCaptures, ...audioFiles, ...regularFiles];
    
//     for (const file of orderedFiles) {
//       try {
//         const filePart = fileToGenerativePart(file.buffer, file.mimetype, file.originalname);
//         promptParts.push(filePart);
//       } catch (fileError) {
//         console.error(`Error processing file ${file.originalname}:`, fileError);
//         // Continue with other files, don't fail the entire request
//       }
//     }

//     // --- Gemini AI Configuration with enhanced system instruction ---
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({
//       model: 'gemini-1.5-flash',
//       systemInstruction: getSystemInstruction(isScholarshipRelated, hasScreenAnalysis),
//     });

//     // Enhanced generation config for screen analysis
//     const generationConfig = {
//       maxOutputTokens: hasScreenAnalysis ? 12288 : 8192, // More tokens for detailed screen analysis
//       temperature: hasScreenAnalysis ? 0.3 : 0.7, // Lower temperature for more focused analysis
//       topP: 0.8,
//       topK: 40
//     };

//     // Initialize chat
//     let chat;
//     try {
//       chat = model.startChat({
//         history: history,
//         generationConfig,
//       });
//     } catch (initError) {
//       console.error('Gemini Chat Init Error:', initError);
//       return res.status(500).json({ error: 'Failed to initialize AI chat. Please try again.' });
//     }

//     // Set response headers for streaming
//     res.setHeader('Content-Type', 'text/plain; charset=utf-8');
//     res.setHeader('Transfer-Encoding', 'chunked');

//     try {
//       // Send message and stream response
//       const result = await chat.sendMessageStream(promptParts);
//       let accumulatedResponse = '';

//       for await (const chunk of result.stream) {
//         if (!res.writableEnded && chunk.text()) {
//           const chunkText = chunk.text();
//           accumulatedResponse += chunkText;
//           res.write(chunkText);
//         } else if (res.writableEnded) {
//           console.warn('Response already ended, stopping stream.');
//           break;
//         }
//       }

//       // Add download link for scholarship queries
//       if (isScholarshipRelated && !res.writableEnded) {
//         const downloadLink = '\n\n📄 **[Download Complete Scholarship Document](http://localhost:5000/files/Scholarship.pdf)**';
//         res.write(downloadLink);
//       }

//       // Add screen analysis follow-up suggestions
//       if (hasScreenAnalysis && !res.writableEnded) {
//         const followUpSuggestions = '\n\n---\n**💡 Follow-up suggestions:**\n- Share more specific questions about the content\n- Upload related files for deeper analysis\n- Ask for step-by-step explanations of any concepts\n- Request improvements or optimizations';
//         res.write(followUpSuggestions);
//       }

//       if (!res.writableEnded) {
//         res.end();
//       }

//     } catch (streamError) {
//       console.error('Gemini API Error during streaming:', streamError);
      
//       if (!res.headersSent) {
//         let errorMessage = 'Error communicating with AI. ';
        
//         if (streamError.message?.includes('quota')) {
//           errorMessage += 'API quota exceeded. Please try again later.';
//         } else if (streamError.message?.includes('safety')) {
//           errorMessage += 'Content was flagged by safety filters. Please try rephrasing your question.';
//         } else if (streamError.message?.includes('file')) {
//           errorMessage += 'There was an issue processing your files. Please check the file format and try again.';
//         } else if (streamError.message?.includes('audio')) {
//           errorMessage += 'There was an issue processing the audio file. Please ensure it\'s in a supported format.';
//         } else {
//           errorMessage += streamError.message || 'Unknown error occurred.';
//         }
        
//         return res.status(500).json({ error: errorMessage });
//       } else {
//         // If streaming already started, write error message
//         if (!res.writableEnded) {
//           res.write('\n\n---\n**Error**: There was an issue processing your request. Please try again.');
//           res.end();
//         }
//       }
//     }

//   } catch (error) {
//     console.error('General Error in chat route:', error);
    
//     if (!res.headersSent) {
//       let errorMessage = 'Server error occurred. ';
      
//       if (error.code === 'LIMIT_FILE_SIZE') {
//         errorMessage = 'File size too large. Maximum size is 100MB per file.';
//       } else if (error.code === 'LIMIT_FILE_COUNT') {
//         errorMessage = 'Too many files. Maximum is 15 files per request.';
//       } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
//         errorMessage = 'Unexpected file upload error. Please try again.';
//       } else if (error.message?.includes('File type')) {
//         errorMessage = error.message;
//       }
      
//       return res.status(500).json({ error: errorMessage });
//     }
//   }
// });

// // // --- Enhanced Health check route ---
// // router.get('/health', (req, res) => {
// //   res.json({ 
// //     status: 'OK', 
// //     message: 'Engineering Hub AI with Screen Sharing is running',
// //     features: [
// //       'Multi-file analysis',
// //       'Screen capture analysis', 
// //       'Voice query processing',
// //       'Real-time streaming responses',
// //       'Engineering-focused AI assistance'
// //     ],
// //     scholarship: 'Manual content loaded',
// //     supportedFileTypes: [
// //       'Images: PNG, JPEG, GIF, WebP (including screen captures)',
// //       'Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX',
// //       'Text: TXT, CSV, HTML, CSS, JS',
// //       'Audio: WAV, MP3, AAC, OGG, FLAC, WebM (including voice recordings)',
// //       'Video: MP4, MOV, AVI, WebM, WMV'
// //     ],
// //     maxFiles: 15,
// //     maxFileSize: '100MB'
// //   });
// // });

// // // --- Screen Analysis specific route ---
// // router.post('/screen-analysis', upload.array('files', 15), async (req, res) => {
// //   try {
// //     const { message, hasAudio } = req.body;
// //     const files = req.files || [];

// //     if (files.length === 0) {
// //       return res.status(400).json({ error: 'At least one file (screen capture) is required for screen analysis.' });
// //     }

// //     // Categorize files
// //     const { screenCaptures, audioFiles, regularFiles } = categorizeFiles(files);
    
// //     if (screenCaptures.length === 0) {
// //       return res.status(400).json({ error: 'No screen capture found in uploaded files.' });
// //     }

// //     // Prepare specialized screen analysis prompt
// //     let analysisPrompt = `Please provide a comprehensive analysis of this screen capture. Focus on:

// // 1. **Content Identification**: What type of content is displayed (code, diagram, document, etc.)
// // 2. **Technical Analysis**: Explain any technical concepts, code functionality, or engineering principles shown
// // 3. **Issue Detection**: Identify any potential problems, bugs, or areas for improvement
// // 4. **Recommendations**: Suggest optimizations, corrections, or next steps
// // 5. **Educational Insights**: Explain underlying concepts for learning purposes`;

// //     if (message && message.trim()) {
// //       analysisPrompt = `${message}\n\nPlease analyze the screen capture while addressing the above query.`;
// //     }

// //     if (audioFiles.length > 0) {
// //       analysisPrompt += `\n\nAdditionally, please respond to any questions or requests made in the voice recording.`;
// //     }

// //     // Prepare prompt parts
// //     const promptParts = [analysisPrompt];
    
// //     // Add files in order: screen captures first, then audio, then regular files
// //     const orderedFiles = [...screenCaptures, ...audioFiles, ...regularFiles];
    
// //     for (const file of orderedFiles) {
// //       try {
// //         const filePart = fileToGenerativePart(file.buffer, file.mimetype, file.originalname);
// //         promptParts.push(filePart);
// //       } catch (fileError) {
// //         console.error(`Error processing file ${file.originalname}:`, fileError);
// //       }
// //     }

// //     // Configure Gemini for screen analysis
// //     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// //     const model = genAI.getGenerativeModel({
// //       model: 'gemini-1.5-flash',
// //       systemInstruction: getSystemInstruction(false, true),
// //     });

// //     const generationConfig = {
// //       maxOutputTokens: 16384, // Maximum tokens for detailed analysis
// //       temperature: 0.2, // Low temperature for precise analysis
// //       topP: 0.8,
// //       topK: 30
// //     };

// //     // Set response headers for streaming
// //     res.setHeader('Content-Type', 'text/plain; charset=utf-8');
// //     res.setHeader('Transfer-Encoding', 'chunked');

// //     try {
// //       const result = await model.generateContentStream(promptParts);
// //       let accumulatedResponse = '';

// //       for await (const chunk of result.stream) {
// //         if (!res.writableEnded && chunk.text()) {
// //           const chunkText = chunk.text();
// //           accumulatedResponse += chunkText;
// //           res.write(chunkText);
// //         }
// //       }

// //       if (!res.writableEnded) {
// //         res.end();
// //       }

// //     } catch (streamError) {
// //       console.error('Screen analysis streaming error:', streamError);
      
// //       if (!res.headersSent) {
// //         return res.status(500).json({ 
// //           error: 'Failed to analyze screen content. Please try again.' 
// //         });
// //       } else if (!res.writableEnded) {
// //         res.write('\n\n---\n**Error**: Failed to complete screen analysis. Please try again.');
// //         res.end();
// //       }
// //     }

// //   } catch (error) {
// //     console.error('Screen analysis error:', error);
    
// //     if (!res.headersSent) {
// //       return res.status(500).json({ 
// //         error: 'Screen analysis failed. Please ensure you have uploaded valid screen captures.' 
// //       });
// //     }
// //   }
// // });

// // // --- Voice Query Processing Route ---
// // router.post('/voice-query', upload.single('audio'), async (req, res) => {
// //   try {
// //     const { context } = req.body;
// //     const audioFile = req.file;

// //     if (!audioFile) {
// //       return res.status(400).json({ error: 'Audio file is required for voice query processing.' });
// //     }

// //     // Prepare voice analysis prompt
// //     let voicePrompt = `Please transcribe and respond to this voice query. The user is asking about engineering topics.`;
    
// //     if (context && context.trim()) {
// //       voicePrompt += ` Context: ${context}`;
// //     }

// //     const promptParts = [
// //       voicePrompt,
// //       fileToGenerativePart(audioFile.buffer, audioFile.mimetype, audioFile.originalname)
// //     ];

// //     // Configure Gemini for voice processing
// //     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// //     const model = genAI.getGenerativeModel({
// //       model: 'gemini-1.5-flash',
// //       systemInstruction: getSystemInstruction(false, false),
// //     });

// //     res.setHeader('Content-Type', 'text/plain; charset=utf-8');
// //     res.setHeader('Transfer-Encoding', 'chunked');

// //     const result = await model.generateContentStream(promptParts);
    
// //     for await (const chunk of result.stream) {
// //       if (!res.writableEnded && chunk.text()) {
// //         res.write(chunk.text());
// //       }
// //     }

// //     if (!res.writableEnded) {
// //       res.end();
// //     }

// //   } catch (error) {
// //     console.error('Voice query processing error:', error);
    
// //     if (!res.headersSent) {
// //       return res.status(500).json({ 
// //         error: 'Failed to process voice query. Please ensure the audio file is in a supported format.' 
// //       });
// //     }
// //   }
// // });

// // // --- Simplified scholarship route (keeping your original) ---
// // router.post('/scholarship', async (req, res) => {
// //   try {
// //     const { query } = req.body;
// //     if (!query) {
// //       return res.status(400).json({ error: 'Query is required.' });
// //     }

// //     const lowerQuery = query.toLowerCase();
// //     let response = '';

// //     if (lowerQuery.includes("eligibility")) {
// //       response = extractRelevantSection(scholarshipContent, "eligibility");
// //     } else if (lowerQuery.includes("document")) {
// //       response = extractRelevantSection(scholarshipContent, "document");
// //     } else if (lowerQuery.includes("benefit")) {
// //       response = extractRelevantSection(scholarshipContent, "benefit");
// //     } else if (lowerQuery.includes("ews")) {
// //       response = extractRelevantSection(scholarshipContent, "ews");
// //     } else if (lowerQuery.includes("tfws")) {
// //       response = extractRelevantSection(scholarshipContent, "tfws");
// //     } else {
// //       response = "Based on the scholarship information available:\n\n" + 
// //                  scholarshipContent.substring(0, 500) + "...";
// //     }

// //     res.json({
// //       answer: response.trim() || "Information not found in the document.",
// //       downloadLink: "http://localhost:5000/files/Scholarship.pdf"
// //     });

// //   } catch (error) {
// //     console.error("Scholarship route error:", error);
// //     res.status(500).json({ 
// //       error: "Failed to process scholarship query.",
// //       downloadLink: "http://localhost:5000/files/Scholarship.pdf"
// //     });
// //   }
// // });

// // // --- Helper function to extract relevant sections ---
// // function extractRelevantSection(text, keyword) {
// //   const lines = text.split('\n');
// //   const relevantLines = [];
  
// //   for (let i = 0; i < lines.length; i++) {
// //     const line = lines[i].toLowerCase();
// //     if (line.includes(keyword.toLowerCase())) {
// //       const start = Math.max(0, i - 1);
// //       const end = Math.min(lines.length, i + 3);
// //       relevantLines.push(...lines.slice(start, end));
// //       break;
// //     }
// //   }
  
// //   return relevantLines.length > 0 ? relevantLines.join('\n') : text.substring(0, 300);
// // }

// // // --- Static file serving route for scholarship PDF ---
// // router.get('/download/scholarship', (req, res) => {
// //   try {
// //     const pdfPath = path.join(process.cwd(), 'backend/public/files/Scholarship.pdf');
// //     if (fs.existsSync(pdfPath)) {
// //       res.setHeader('Content-Type', 'application/pdf');
// //       res.setHeader('Content-Disposition', 'attachment; filename="Scholarship.pdf"');
// //       res.sendFile(pdfPath);
// //     } else {
// //       res.status(404).json({ error: 'Scholarship PDF not found.' });
// //     }
// //   } catch (error) {
// //     console.error('Error serving scholarship PDF:', error);
// //     res.status(500).json({ error: 'Failed to serve scholarship PDF.' });
// //   }
// // });

// // export default router;

// // --- Enhanced Health check route ---
// router.get('/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     message: 'Engineering Hub AI with Advanced Screen Sharing is running',
//     features: [
//       'Multi-file analysis',
//       'Screen capture analysis with voice integration', 
//       'Real-time voice query processing',
//       'Floating widget for cross-tab functionality',
//       'White screen annotation mode',
//       'Automatic screen analysis on voice detection',
//       'Text-to-speech audio responses'
//     ],
//     scholarship: 'Manual content loaded',
//     supportedFileTypes: [
//       'Images: PNG, JPEG, GIF, WebP (including screen captures)',
//       'Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX',
//       'Text: TXT, CSV, HTML, CSS, JS',
//       'Audio: WAV, MP3, AAC, OGG, FLAC, WebM (including voice recordings)',
//       'Video: MP4, MOV, AVI, WebM, WMV'
//     ],
//     maxFiles: 15,
//     maxFileSize: '100MB',
//     voiceFeatures: {
//       realTimeTranscription: true,
//       automaticScreenCapture: true,
//       delayBeforeCapture: '2.0 seconds',
//       audioResponseGeneration: true
//     }
//   });
// });

// // --- New route for floating widget status ---
// router.get('/widget-status', (req, res) => {
//   res.json({
//     status: 'active',
//     features: {
//       screenSharing: true,
//       voiceDetection: true,
//       annotation: true,
//       whiteScreen: true,
//       crossTab: false // Note: True cross-tab requires browser extension
//     }
//   });
// });

// // --- Enhanced Screen Analysis route ---
// router.post('/screen-analysis', upload.array('files', 15), async (req, res) => {
//   try {
//     const { message, isVoiceQuery, hasAudio } = req.body;
//     const files = req.files || [];

//     if (files.length === 0) {
//       return res.status(400).json({ error: 'At least one file (screen capture) is required for screen analysis.' });
//     }

//     // Categorize files
//     const { screenCaptures, audioFiles, regularFiles } = categorizeFiles(files);
    
//     if (screenCaptures.length === 0 && !files.find(f => f.originalname.includes('screen'))) {
//       return res.status(400).json({ error: 'No screen capture found in uploaded files.' });
//     }

//     // Prepare specialized screen analysis prompt for voice queries
//     let analysisPrompt = message || `Please provide a comprehensive analysis of this screen content with focus on:

// 1. **Technical Content**: Identify and explain any code, formulas, diagrams, or technical concepts
// 2. **Problem Solving**: If there are any issues, errors, or problems visible, provide solutions
// 3. **Educational Insights**: Explain underlying engineering principles and concepts
// 4. **Actionable Advice**: Provide specific next steps or improvements

// ${isVoiceQuery === 'true' ? 'Please provide a concise response suitable for audio playback, focusing on key insights and practical information.' : ''}`;

//     if (audioFiles.length > 0) {
//       analysisPrompt += `\n\nAdditionally, please respond to any questions or requests made in the voice recording.`;
//     }

//     // Prepare prompt parts
//     const promptParts = [analysisPrompt];
    
//     // Add files in order: screen captures first, then audio, then regular files
//     const orderedFiles = [...screenCaptures, ...audioFiles, ...regularFiles];
    
//     for (const file of orderedFiles) {
//       try {
//         const filePart = fileToGenerativePart(file.buffer, file.mimetype, file.originalname);
//         promptParts.push(filePart);
//       } catch (fileError) {
//         console.error(`Error processing file ${file.originalname}:`, fileError);
//       }
//     }

//     // Configure Gemini for screen analysis
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({
//       model: 'gemini-1.5-flash',
//       systemInstruction: getSystemInstruction(false, true),
//     });

//     const generationConfig = {
//       maxOutputTokens: isVoiceQuery === 'true' ? 8192 : 16384,
//       temperature: 0.3, // Lower temperature for more focused analysis
//       topP: 0.8,
//       topK: 30
//     };

//     // Set response headers for streaming
//     res.setHeader('Content-Type', 'text/plain; charset=utf-8');
//     res.setHeader('Transfer-Encoding', 'chunked');

//     try {
//       const result = await model.generateContentStream(promptParts, { generationConfig });
//       let accumulatedResponse = '';

//       for await (const chunk of result.stream) {
//         if (!res.writableEnded && chunk.text()) {
//           const chunkText = chunk.text();
//           accumulatedResponse += chunkText;
//           res.write(chunkText);
//         }
//       }

//       // Add follow-up suggestions for voice queries
//       if (isVoiceQuery === 'true' && !res.writableEnded) {
//         const followUp = '\n\n[Voice Response Complete - You can ask follow-up questions or request more details about any specific aspect.]';
//         res.write(followUp);
//       }

//       if (!res.writableEnded) {
//         res.end();
//       }

//     } catch (streamError) {
//       console.error('Screen analysis streaming error:', streamError);
      
//       if (!res.headersSent) {
//         return res.status(500).json({ 
//           error: 'Failed to analyze screen content. Please try again.' 
//         });
//       } else if (!res.writableEnded) {
//         res.write('\n\n---\n**Error**: Failed to complete screen analysis. Please try again.');
//         res.end();
//       }
//     }

//   } catch (error) {
//     console.error('Screen analysis error:', error);
    
//     if (!res.headersSent) {
//       return res.status(500).json({ 
//         error: 'Screen analysis failed. Please ensure you have uploaded valid screen captures.' 
//       });
//     }
//   }
// });

// // --- Voice Query Processing Route (Enhanced) ---
// router.post('/voice-query', upload.single('audio'), async (req, res) => {
//   try {
//     const { context, screenData } = req.body;
//     const audioFile = req.file;

//     if (!audioFile) {
//       return res.status(400).json({ error: 'Audio file is required for voice query processing.' });
//     }

//     // Prepare voice analysis prompt with enhanced context
//     let voicePrompt = `Please transcribe and respond to this voice query about engineering topics.`;
    
//     if (context && context.trim()) {
//       voicePrompt += ` Context: ${context}`;
//     }

//     if (screenData) {
//       voicePrompt += ` The user is referring to content visible on their screen.`;
//     }

//     voicePrompt += ` Please provide a concise but complete response suitable for audio playback.`;

//     const promptParts = [
//       voicePrompt,
//       fileToGenerativePart(audioFile.buffer, audioFile.mimetype, audioFile.originalname)
//     ];

//     // Configure Gemini for voice processing
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({
//       model: 'gemini-1.5-flash',
//       systemInstruction: getSystemInstruction(false, false),
//     });

//     res.setHeader('Content-Type', 'text/plain; charset=utf-8');
//     res.setHeader('Transfer-Encoding', 'chunked');

//     const result = await model.generateContentStream(promptParts);
    
//     for await (const chunk of result.stream) {
//       if (!res.writableEnded && chunk.text()) {
//         res.write(chunk.text());
//       }
//     }

//     if (!res.writableEnded) {
//       res.end();
//     }

//   } catch (error) {
//     console.error('Voice query processing error:', error);
    
//     if (!res.headersSent) {
//       return res.status(500).json({ 
//         error: 'Failed to process voice query. Please ensure the audio file is in a supported format.' 
//       });
//     }
//   }
// });

// export default router;


// routes/geminiRoutes.js (Fixed Version)

// routes/geminiRoutes.js (Enhanced Voice Query Support)

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();
const router = express.Router();

// --- Enhanced Multer Configuration for File Uploads ---
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100 MB file size limit
    files: 15 // Support more files for screen captures + audio + regular files
  },
  fileFilter: (req, file, cb) => {
    // FIXED: Comprehensive MIME type support including all WebM variants
    const allowedMimes = [
      // Images (including screen captures)
      'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
      // Documents
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