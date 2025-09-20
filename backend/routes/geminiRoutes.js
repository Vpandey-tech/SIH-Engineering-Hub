// routes/geminiRoutes.js

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
// Remove pdf-parse import

dotenv.config();
const router = express.Router();

// --- Manual scholarship content (replace with your actual PDF content) ---
const scholarshipContent = `
SCHOLARSHIP INFORMATION FOR ENGINEERING STUDENTS

EWS (Economically Weaker Section) Scholarship:
- Eligibility: Family annual income should be less than Rs. 8,00,000
- Benefits: Full tuition fee waiver or partial fee concession
- Required Documents: Income certificate, EWS certificate, Aadhar card
- Application Process: Online application through state scholarship portal

TFWS (Tuition Fee Waiver Scheme):
- Eligibility: Merit-based selection with income criteria
- Income Limit: Family income below Rs. 6,00,000 per annum  
- Benefits: Complete tuition fee waiver for eligible students
- Documents: Income certificate, caste certificate (if applicable), mark sheets

Merit-based Scholarships:
- Based on academic performance in previous qualifying examinations
- Minimum 85% marks required in 12th standard
- Benefits: Rs. 5000 to Rs. 50,000 per year depending on merit rank
- Renewable annually based on academic performance

Need-based Financial Aid:
- For students from financially disadvantaged backgrounds
- Income limit: Below Rs. 2,50,000 per annum
- Benefits: Partial or full fee waiver plus maintenance allowance
- Special consideration for orphans and single parent families

Application Documents Generally Required:
1. Income certificate from competent authority
2. Caste certificate (if applicable)
3. Domicile certificate
4. Previous year mark sheets
5. Bank account details
6. Aadhar card
7. Passport size photographs

Application Deadlines:
- First semester: Usually by July 31st
- Second semester: By December 31st
- Late applications may be considered with penalty

Contact Information:
- Scholarship Cell: scholarship@college.edu
- Phone: +91-XXXXXXXXXX
- Office Hours: 9 AM to 5 PM (Mon-Fri)
`;

// --- Helper function to detect scholarship-related queries ---
const isScholarshipQuery = (message) => {
  const scholarshipKeywords = [
    'scholarship', 'scholarships', 'financial aid', 'fee concession', 
    'ews', 'tfws', 'economically weaker section', 'tuition fee waiver',
    'study grant', 'education fund', 'merit scholarship', 'need based',
    'eligibility', 'application process', 'documents required'
  ];
  
  const lowerMessage = message.toLowerCase();
  return scholarshipKeywords.some(keyword => lowerMessage.includes(keyword));
};

// --- Enhanced System Instruction with Scholarship Context ---
const getSystemInstruction = (includeScholarship = false) => {
  let systemText = `
You are **Engineering Hub AI**, an all-rounder engineering tutor, problem solver, and roadmap guide for students across all engineering disciplines (Mechanical, Civil, Electrical, CSE, IT, ECE, Chemical, etc.).

YOUR PERSONA
- Polite, encouraging, and highly knowledgeable mentor.
- A "doubt killer" and "study helper" who gives clear, step-by-step, practical guidance.
- Speak in **simple, student-friendly language** – avoid jargon unless explaining it.
- Always respond concisely; keep answers **short by default**, but give extended detail if the user explicitly asks for a "long" or "detailed" response.

DOMAIN FOCUS
- Stay strictly within **engineering, computing, applied sciences, and study help**.
- If asked about non-engineering topics, politely redirect to relevant engineering areas.

SPECIAL FEATURES
1. **Roadmaps:**  
   - If a user asks for a roadmap (e.g., "roadmap for AI in Mechanical Engineering"), provide a structured path from beginner → intermediate → advanced.  
   - Use **bullet points or tables** for clarity.  
   - Include hyperlinks to **YouTube tutorials**, **open-source PDFs**, **free articles**, and **documentation** wherever possible.  
   - Mark links clearly (e.g., [YouTube: Thermodynamics Basics](https://youtube.com/...)).

2. **Problem Solving:**  
   - Solve numerical problems, explain derivations, and break down complex theories in **step-by-step** manner.  
   - Use **formulas**, **diagrams (Markdown tables for now)**, and **code snippets** when needed.  

3. **Resource Suggestion:**  
   - For any topic, suggest **at least 1–2 YouTube links**, **open-source references**, or **free online books/articles**.  
   - Use markdown hyperlinks.

4. **File Analysis:**  
   - **PDFs**: Extract and summarize key engineering concepts, solve problems, explain diagrams
   - **Images**: Analyze circuit diagrams, engineering drawings, graphs, equations, sketches
   - **Documents**: Review assignments, projects, research papers, technical documentation
   - **Audio/Video**: Transcribe and analyze engineering lectures, tutorials, presentations
   - Always provide detailed analysis with practical engineering insights

5. **Multiple File Handling:**
   - When multiple files are uploaded, analyze each one and provide comparative insights
   - Cross-reference information between files when relevant
   - Provide consolidated summaries for related materials
`;

  if (includeScholarship) {
    systemText += `

6. **SCHOLARSHIP INFORMATION SPECIALIST:**
   - You have access to specific scholarship information from an official document.
   - When users ask about scholarships, financial aid, EWS, TFWS, or related topics, use ONLY the information provided below.
   - Always mention that users can download the complete scholarship document for detailed information.
   - Be precise and quote specific details from the document.

**SCHOLARSHIP DOCUMENT CONTENT:**
\`\`\`
${scholarshipContent}
\`\`\`

**SCHOLARSHIP RESPONSE FORMAT:**
- Provide direct answers based on the document content
- Include specific details like eligibility criteria, required documents, benefits, etc.
- Always end scholarship responses with: "📄 **Download the complete scholarship document for detailed information and application procedures.**"
`;
  }

  systemText += `

RESPONSE STYLE
- Use **Markdown** for formatting:  
  - **Bold** for keywords  
  - Bullet points for lists  
  - Numbered lists for steps  
  - Proper Markdown tables for comparisons.  
- Keep answers **concise by default**; expand only when asked.  
- End every answer politely with a follow-up like:  
  *"Would you like me to analyze any specific part in more detail or provide additional resources?"*

EXAMPLES OF HOW TO RESPOND
- If asked: *"Give me a roadmap for learning Data Structures in CSE"* → Provide beginner → advanced path + YouTube + free resources.  
- If asked: *"Solve this thermodynamics problem"* → Give step-by-step solution + formula explanation.  
- If asked: *"Explain this circuit diagram"* → Analyze components, explain working, suggest improvements.
- If asked: *"Summarize this PDF"* → Extract key engineering concepts, formulas, and practical applications.
- If asked: *"What scholarships are available?"* → Use scholarship document content + download link.

You are always **helpful, resource-rich, concise, and domain-focused.**
`;

  return {
    role: "system",
    parts: [{ text: systemText }],
  };
};

// --- Multer Configuration for File Uploads ---
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100 MB file size limit
    files: 10 // Maximum 10 files at once
  },
  fileFilter: (req, file, cb) => {
    // Supported file types for Gemini
    const allowedMimes = [
      // Images
      'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
      // Documents
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      // Text files
      'text/plain', 'text/csv', 'text/html', 'text/css', 'text/javascript',
      // Audio
      'audio/wav', 'audio/mp3', 'audio/aiff', 'audio/aac', 'audio/ogg', 'audio/flac',
      // Video
      'video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/mpg', 'video/webm', 'video/wmv', 'video/3gpp'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not supported. Supported types: ${allowedMimes.join(', ')}`), false);
    }
  }
});

// --- Helper function to convert buffer to Gemini Part ---
function fileToGenerativePart(buffer, mimeType, fileName) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

// --- Helper function to get file type description ---
function getFileTypeDescription(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'PDF document';
  if (mimeType.includes('word')) return 'Word document';
  if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'Excel spreadsheet';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PowerPoint presentation';
  if (mimeType.startsWith('audio/')) return 'audio file';
  if (mimeType.startsWith('video/')) return 'video file';
  if (mimeType.startsWith('text/')) return 'text file';
  return 'file';
}

// --- Main chat route with enhanced scholarship support ---
router.post('/chat', upload.array('files', 10), async (req, res) => {
  try {
    const { message } = req.body;
    const history = req.body.history ? JSON.parse(req.body.history) : [];
    const files = req.files || [];

    // Validate input
    if (!message && files.length === 0) {
      return res.status(400).json({ error: 'A message or at least one file is required.' });
    }

    // Check if this is a scholarship query
    const isScholarshipRelated = message && isScholarshipQuery(message);
    
    // Prepare prompt message
    let promptMessage = message || '';
    if (files.length > 0) {
      const fileDescriptions = files.map((file, index) => 
        `File ${index + 1}: ${file.originalname} (${getFileTypeDescription(file.mimetype)})`
      ).join(', ');
      
      if (!message) {
        promptMessage = `Please analyze the following ${files.length > 1 ? 'files' : 'file'}: ${fileDescriptions}`;
      } else {
        promptMessage += `\n\nAttached ${files.length > 1 ? 'files' : 'file'}: ${fileDescriptions}`;
      }
    }

    // // Add scholarship download link for scholarship queries
    // if (isScholarshipRelated) {
    //   promptMessage += `\n\n[Note: Include download link: http://localhost:5000/files/Scholarship.pdf]`;
    // }

    // Prepare prompt parts
    const promptParts = [promptMessage];

    // Add file parts to prompt
    for (const file of files) {
      try {
        const filePart = fileToGenerativePart(file.buffer, file.mimetype, file.originalname);
        promptParts.push(filePart);
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        // Continue with other files, don't fail the entire request
      }
    }

    // --- Gemini AI Configuration with dynamic system instruction ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: getSystemInstruction(isScholarshipRelated),
    });

    // Initialize chat
    let chat;
    try {
      chat = model.startChat({
        history: history,
        generationConfig: { 
          maxOutputTokens: 8192,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        },
      });
    } catch (initError) {
      console.error('Gemini Chat Init Error:', initError);
      return res.status(500).json({ error: 'Failed to initialize AI chat. Please try again.' });
    }

    // Set response headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    try {
      // Send message and stream response
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

      // Add download link for scholarship queries
      if (isScholarshipRelated && !res.writableEnded) {
        const downloadLink = '\n\n📄 **[Download Complete Scholarship Document](http://localhost:5000/files/Scholarship.pdf)**';
        res.write(downloadLink);
      }

      if (!res.writableEnded) {
        res.end();
      }

    } catch (streamError) {
      console.error('Gemini API Error during streaming:', streamError);
      
      if (!res.headersSent) {
        let errorMessage = 'Error communicating with AI. ';
        
        if (streamError.message?.includes('quota')) {
          errorMessage += 'API quota exceeded. Please try again later.';
        } else if (streamError.message?.includes('safety')) {
          errorMessage += 'Content was flagged by safety filters. Please try rephrasing your question.';
        } else if (streamError.message?.includes('file')) {
          errorMessage += 'There was an issue processing your file. Please check the file format and try again.';
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
        errorMessage = 'Too many files. Maximum is 10 files per request.';
      } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        errorMessage = 'Unexpected file upload error. Please try again.';
      } else if (error.message?.includes('File type')) {
        errorMessage = error.message;
      }
      
      return res.status(500).json({ error: errorMessage });
    }
  }
});

// --- Health check route ---
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Engineering Hub AI is running',
    scholarship: 'Manual content loaded',
    supportedFileTypes: [
      'Images: PNG, JPEG, GIF, WebP',
      'Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX',
      'Text: TXT, CSV, HTML, CSS, JS',
      'Audio: WAV, MP3, AAC, OGG, FLAC',
      'Video: MP4, MOV, AVI, WebM, WMV'
    ]
  });
});

// --- Simplified scholarship route ---
router.post('/scholarship', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    // Simple keyword-based response
    const lowerQuery = query.toLowerCase();
    let response = '';

    if (lowerQuery.includes("eligibility")) {
      response = extractRelevantSection(scholarshipContent, "eligibility");
    } else if (lowerQuery.includes("document")) {
      response = extractRelevantSection(scholarshipContent, "document");
    } else if (lowerQuery.includes("benefit")) {
      response = extractRelevantSection(scholarshipContent, "benefit");
    } else if (lowerQuery.includes("ews")) {
      response = extractRelevantSection(scholarshipContent, "ews");
    } else if (lowerQuery.includes("tfws")) {
      response = extractRelevantSection(scholarshipContent, "tfws");
    } else {
      response = "Based on the scholarship information available:\n\n" + 
                 scholarshipContent.substring(0, 500) + "...";
    }

    res.json({
      answer: response.trim() || "Information not found in the document.",
      downloadLink: "http://localhost:5000/files/Scholarship.pdf"
    });

  } catch (error) {
    console.error("Scholarship route error:", error);
    res.status(500).json({ 
      error: "Failed to process scholarship query.",
      downloadLink: "http://localhost:5000/files/Scholarship.pdf"
    });
  }
});

// --- Helper function to extract relevant sections ---
function extractRelevantSection(text, keyword) {
  const lines = text.split('\n');
  const relevantLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes(keyword.toLowerCase())) {
      // Include context: previous, current, and next few lines
      const start = Math.max(0, i - 1);
      const end = Math.min(lines.length, i + 3);
      relevantLines.push(...lines.slice(start, end));
      break;
    }
  }
  
  return relevantLines.length > 0 ? relevantLines.join('\n') : text.substring(0, 300);
}

// --- Static file serving route for scholarship PDF ---
router.get('/download/scholarship', (req, res) => {
  try {
    const pdfPath = path.join(process.cwd(), 'backend/public/files/Scholarship.pdf');
    if (fs.existsSync(pdfPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Scholarship.pdf"');
      res.sendFile(pdfPath);
    } else {
      res.status(404).json({ error: 'Scholarship PDF not found.' });
    }
  } catch (error) {
    console.error('Error serving scholarship PDF:', error);
    res.status(500).json({ error: 'Failed to serve scholarship PDF.' });
  }
});

export default router;