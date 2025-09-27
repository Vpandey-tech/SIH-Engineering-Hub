// src/components/ChatBubble.tsx

import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect } from "react";

interface ChatBubbleProps {
  role: "user" | "model";
  content: string;
}

function splitMarkdownByTable(content: string) {
  const tableRegex = /(\|.*?\|\n\|[-:\s|]*\|\n(?:.*\|.*\n?)+)/g;

  const parts: { type: "table" | "text"; content: string }[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(tableRegex)) {
    const table = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push({ type: "text", content: content.slice(lastIndex, index) });
    }

    parts.push({ type: "table", content: table });
    lastIndex = index + table.length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) });
  }

  return parts;
}

const ChatBubble = ({ role, content }: ChatBubbleProps) => {
  const isUser = role === "user";

  // ⚠️ Note: localStorage usage removed as per Claude.ai artifact restrictions
  // You can uncomment this in your local environment
  
  // src/components/ChatBubble.tsx

// useEffect(() => {
//   if (!content) return;
//   const stored = localStorage.getItem("chat_history");
//   const history = stored ? JSON.parse(stored) : [];
//   history.push({ role, content, timestamp: new Date().toISOString() });
//   localStorage.setItem("chat_history", JSON.stringify(history));
// }, [role, content]);
  

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg max-w-[85%] mb-4",
        isUser ? "bg-primary/10 self-end ml-auto" : "bg-card self-start"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      <div className="flex-1 max-w-full break-words">
        {splitMarkdownByTable(content).map((part, idx) => {
          if (part.type === "table") {
            return (
              <div key={idx} className="my-4 overflow-x-auto">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ node, ...props }) => (
                      <table
                        {...props}
                        className="border border-gray-400 border-collapse w-full text-sm min-w-max"
                      />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        {...props}
                        className="border border-gray-400 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-left font-semibold"
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        {...props}
                        className="border border-gray-300 px-3 py-2"
                      />
                    ),
                  }}
                >
                  {part.content}
                </ReactMarkdown>
              </div>
            );
          } else {
            return (
              <div key={idx} className="space-y-3">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Proper paragraph spacing
                    p: ({ node, children, ...props }) => {
                      const textContent = Array.isArray(children)
                        ? children
                            .map((child) =>
                              typeof child === "string" ||
                              typeof child === "number"
                                ? String(child)
                                : ""
                            )
                            .join("")
                        : String(children);

                      if (textContent.trim() === "") return null;
                      return (
                        <p className="mb-4 leading-relaxed text-base" {...props}>
                          {children}
                        </p>
                      );
                    },

                    // Heading styles with proper spacing
                    h1: ({ node, ...props }) => (
                      <h1 
                        className="text-2xl font-bold mt-6 mb-4 text-foreground" 
                        {...props} 
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 
                        className="text-xl font-semibold mt-5 mb-3 text-foreground" 
                        {...props} 
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 
                        className="text-lg font-medium mt-4 mb-2 text-foreground" 
                        {...props} 
                      />
                    ),

                    // List styling
                    ul: ({ node, ...props }) => (
                      <ul className="mb-4 pl-5 space-y-1 list-disc" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="mb-4 pl-5 space-y-1 list-decimal" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="leading-relaxed" {...props} />
                    ),

                    // Code styling
                    code: ({ node, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      
                      if (match) {
                        // Block code
                        return (
                          <pre className="bg-gray-100 dark:bg-gray-900 rounded-md p-4 mb-4 overflow-x-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      } else {
                        // Inline code
                        return (
                          <code 
                            className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-sm font-mono" 
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                    },

                    // Blockquote styling
                    blockquote: ({ node, ...props }) => (
                      <blockquote 
                        className="border-l-4 border-gray-300 pl-4 mb-4 italic text-gray-700 dark:text-gray-300" 
                        {...props} 
                      />
                    ),

                    // Strong and emphasis
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold text-foreground" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-foreground" {...props} />
                    ),

                    // Links
                    a: ({ node, ...props }) => (
                      <a 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline" 
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props} 
                      />
                    ),

                    // Horizontal rule
                    hr: ({ node, ...props }) => (
                      <hr className="my-6 border-gray-300 dark:border-gray-700" {...props} />
                    ),
                  }}
                >
                  {part.content}
                </ReactMarkdown>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ChatBubble;