
import { useState, useRef } from "react";
import { Bot, User, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// HuggingFace Transformers.js imports (lazy, to only load on click)
let pipeline: any = null;

const loadPipeline = async () => {
  if (!pipeline) {
    const mod = await import("@huggingface/transformers");
    // Remove the unsupported { quantized: false } option
    pipeline = await mod.pipeline(
      "text-generation",
      "Xenova/phi-2"
    );
  }
};

interface Message {
  sender: "user" | "bot";
  text: string;
}

const BrowserAIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hi! I'm a fully free, private AI assistant running right in your browser (powered by a small open-source model). What would you like to learn?",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  // Handle user message submit and generation
  const handleSend = async () => {
    if (!input.trim()) return;
    const question = input;
    setInput("");
    setMessages((msgs) => [...msgs, { sender: "user", text: question }]);
    setWaiting(true);
    scrollToBottom();

    try {
      if (!loaded) {
        // First time - load pipeline and model
        await loadPipeline();
        setLoaded(true);
      }

      // Call LLM
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "🤖 Thinking..." },
      ]);
      const output = await pipeline(question, {
        max_new_tokens: 128,
        temperature: 0.7,
      });
      // Remove "🤖 Thinking..." and add real response
      setMessages((msgs) =>
        [
          ...msgs.slice(0, -1),
          { sender: "bot", text: output[0]?.generated_text || "Sorry, I don't have an answer." }
        ]
      );
    } catch (err: any) {
      setMessages((msgs) =>
        [
          ...msgs,
          {
            sender: "bot",
            text:
              "⚠️ Sorry, your device could not load the AI model " +
              "(doesn't work well on older/weak devices or Safari). Try on a newer laptop or Chrome, or refresh.",
          },
        ]
      );
    }
    setWaiting(false);
    scrollToBottom();
  };

  // Hotkey: enter to send, shift+enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!waiting) handleSend();
    }
  };

  // Always scroll on open or message
  const handleOpen = () => {
    setOpen(!open);
    setTimeout(scrollToBottom, 100);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleOpen}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-800 hover:to-blue-700 shadow-2xl border-2 border-white/20"
          size="lg"
        >
          <Bot className="h-7 w-7 text-white" />
        </Button>
      </div>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-28 right-6 z-50 w-96 max-w-[96vw]">
          <Card className="bg-white dark:bg-slate-900 shadow-2xl border border-blue-200 dark:border-slate-700 flex flex-col h-[480px]">
            <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-purple-700 to-blue-600">
              <Bot className="h-6 w-6 text-white" />
              <span className="text-white font-semibold text-lg">Free AI Assistant</span>
              <span className="ml-auto text-xs text-white/70">
                {loaded ? "Model loaded" : waiting ? "Loading model..." : "Powered by Phi-2"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1"
                onClick={handleOpen}
              >
                ×
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line
                      ${msg.sender === "user"
                        ? "bg-blue-100 dark:bg-blue-800 text-right text-blue-800 dark:text-blue-100"
                        : "bg-slate-200 dark:bg-slate-700 text-left text-slate-800 dark:text-slate-50"
                      }
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!waiting) handleSend();
              }}
              className="p-3 border-t flex gap-2 bg-white dark:bg-slate-800"
            >
              <textarea
                className="flex-1 rounded-md border px-3 py-2 resize-none bg-slate-50 dark:bg-slate-900 focus:outline-blue-400 text-sm"
                rows={2}
                maxLength={500}
                placeholder="Ask me any study or MU question…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={waiting}
                autoFocus={open}
              />
              <Button
                type="submit"
                disabled={waiting || !input.trim()}
                className="h-10 w-10 p-0 rounded-md"
              >
                {waiting ? <Loader2 className="animate-spin" /> : <Send />}
              </Button>
            </form>
            <div className="text-xs text-center py-1 text-gray-400">
              100% runs in your browser. <a href="https://huggingface.co/Xenova/phi-2" target="_blank" rel="noreferrer" className="underline">Powered by HuggingFace</a>
            </div>
          </Card>
        </div>
      )}
      {/* Click-off backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default BrowserAIAssistant;
