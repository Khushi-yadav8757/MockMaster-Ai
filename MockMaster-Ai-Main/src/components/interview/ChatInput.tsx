import { Mic, MicOff, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  loading: boolean;
  isListening: boolean;
  onToggleMic: () => void;
  micSupported: boolean;
  interviewEnded: boolean;
  onBackToDashboard: () => void;
}

const ChatInput = ({
  input,
  setInput,
  onSend,
  loading,
  isListening,
  onToggleMic,
  micSupported,
  interviewEnded,
  onBackToDashboard,
}: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  if (interviewEnded) {
    return (
      <div className="glass-strong border-t border-border px-4 py-4">
        <div className="container mx-auto max-w-3xl">
          <Button variant="hero" className="w-full" onClick={onBackToDashboard}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-strong border-t border-border px-4 py-3">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-end gap-2 bg-secondary/50 rounded-2xl border border-border px-3 py-2">
          {/* Mic button */}
          {micSupported && (
            <button
              onClick={onToggleMic}
              className={`shrink-0 p-2 rounded-full transition-all ${
                isListening
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              title={isListening ? "Stop recording" : "Start voice input"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          )}

          {/* Text input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "🎤 Listening... speak now" : "Type your answer or click 🎤"}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none py-2 max-h-32"
            style={{ minHeight: "36px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "36px";
              target.style.height = Math.min(target.scrollHeight, 128) + "px";
            }}
          />

          {/* Send button */}
          <button
            onClick={onSend}
            disabled={loading || !input.trim()}
            className={`shrink-0 p-2 rounded-full transition-all ${
              input.trim() && !loading
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "text-muted-foreground"
            }`}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>

        {isListening && (
          <div className="flex items-center gap-2 mt-2 px-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
            </span>
            <span className="text-xs text-muted-foreground">Recording... click mic to stop</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
