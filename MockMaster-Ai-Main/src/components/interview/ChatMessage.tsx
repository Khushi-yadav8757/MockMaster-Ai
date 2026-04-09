import ReactMarkdown from "react-markdown";
import { Bot, User, Volume2, VolumeX } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
  isSpeaking: boolean;
  onToggleSpeak: (content: string) => void;
}

const ChatMessage = ({ message, isSpeaking, onToggleSpeak }: ChatMessageProps) => {
  const isAI = message.role === "assistant";

  return (
    <div className={`flex gap-3 animate-fade-in ${isAI ? "" : "flex-row-reverse"}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAI
            ? "bg-primary/20 text-primary"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] group relative ${isAI ? "" : "text-right"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isAI
              ? "bg-card border border-border text-foreground rounded-tl-sm"
              : "bg-primary text-primary-foreground rounded-tr-sm"
          }`}
        >
          {isAI ? (
            <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_li]:mb-0.5 [&_strong]:text-primary [&_code]:text-primary [&_code]:bg-secondary [&_code]:px-1 [&_code]:rounded [&_pre]:bg-secondary [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Voice button for AI messages */}
        {isAI && (
          <button
            onClick={() => onToggleSpeak(message.content)}
            className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded-full p-1.5 hover:bg-secondary"
            title={isSpeaking ? "Stop speaking" : "Read aloud"}
          >
            {isSpeaking ? (
              <VolumeX className="h-3 w-3 text-primary" />
            ) : (
              <Volume2 className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
