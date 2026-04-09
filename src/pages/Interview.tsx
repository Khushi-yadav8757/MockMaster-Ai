import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Brain, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ChatMessage from "@/components/interview/ChatMessage";
import ChatInput from "@/components/interview/ChatInput";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state as { type: string; domain: string; difficulty: string; role: string } | null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const savedRef = useRef(false);

  const maxQuestions = 8;

  const { isListening, transcript, startListening, stopListening, supported: micSupported } = useSpeechRecognition();
  const { isSpeaking, speak, stop: stopSpeaking, supported: ttsSupported } = useTextToSpeech();

  // Sync speech transcript to input
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!config) {
      navigate("/setup");
      return;
    }
    startInterview();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (interviewStarted && !interviewEnded) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [interviewStarted, interviewEnded]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const callAI = async (msgs: Message[]): Promise<string> => {
    const systemPrompt = `You are an expert ${config?.type} interviewer for a ${config?.role || "Software Engineer"} position in the ${config?.domain} domain at ${config?.difficulty} difficulty level.

Rules:
- Ask ONE question at a time
- After the candidate answers, briefly evaluate their answer (1-2 lines) then ask the next question
- Be encouraging but honest
- For technical questions, expect code-level thinking
- Use markdown formatting for better readability
- After ${maxQuestions} questions, provide a FINAL EVALUATION with:
  - Overall Score (out of 10)
  - Strengths (bullet points)
  - Areas for Improvement (bullet points)
  - Verdict: Hire / Maybe / No Hire
  - Tips for improvement

IMPORTANT: In your FINAL EVALUATION, include this exact format on a separate line:
SCORE: X/10
VERDICT: Hire/Maybe/No Hire

Start by introducing yourself and asking the first question.`;

    const { data, error } = await supabase.functions.invoke("chat", {
      body: {
        messages: [{ role: "system", content: systemPrompt }, ...msgs],
      },
    });

    if (error) throw error;
    if (data?.content) return data.content;
    if (typeof data === "string") return data;
    if (data?.choices?.[0]?.message?.content) return data.choices[0].message.content;
    return JSON.stringify(data);
  };

  const parseEvaluation = (content: string) => {
    const scoreMatch = content.match(/SCORE:\s*(\d+)\s*\/\s*10/i);
    const verdictMatch = content.match(/VERDICT:\s*(Hire|Maybe|No Hire)/i);
    const strengthsMatch = content.match(/Strengths?[:\s]*\n((?:[-•*]\s*.+\n?)+)/i);
    const improvementsMatch = content.match(/(?:Areas? for )?Improvement[s]?[:\s]*\n((?:[-•*]\s*.+\n?)+)/i);
    const parseList = (match: RegExpMatchArray | null) =>
      match?.[1]?.split("\n").map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean) || [];
    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : null,
      verdict: verdictMatch?.[1] || null,
      strengths: parseList(strengthsMatch),
      improvements: parseList(improvementsMatch),
    };
  };

  const saveInterview = async (finalMessage: string, allMessages: Message[]) => {
    if (savedRef.current) return;
    savedRef.current = true;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !config) return;
    const eval_ = parseEvaluation(finalMessage);
    const { error } = await supabase.from("interviews").insert({
      user_id: user.id,
      interview_type: config.type,
      domain: config.domain,
      difficulty: config.difficulty,
      role: config.role || "Software Engineer",
      score: eval_.score,
      duration_seconds: timer,
      question_count: maxQuestions,
      verdict: eval_.verdict,
      strengths: eval_.strengths,
      improvements: eval_.improvements,
      messages: allMessages,
    } as any);
    if (error) console.error("Failed to save interview:", error);
    else toast.success("Interview saved to your history!");
  };

  const startInterview = async () => {
    setLoading(true);
    setInterviewStarted(true);
    try {
      const response = await callAI([]);
      setMessages([{ role: "assistant", content: response }]);
      setQuestionCount(1);
      if (autoSpeak && ttsSupported) speak(response);
    } catch (err) {
      toast.error("Failed to start interview. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (isListening) stopListening();

    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await callAI(newMessages);
      const updatedMessages = [...newMessages, { role: "assistant" as const, content: response }];
      setMessages(updatedMessages);
      const newCount = questionCount + 1;
      setQuestionCount(newCount);

      if (autoSpeak && ttsSupported) speak(response);

      if (newCount > maxQuestions) {
        clearInterval(timerRef.current);
        setInterviewEnded(true);
        await saveInterview(response, updatedMessages);
      }
    } catch (err) {
      toast.error("AI response failed. Try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleToggleMic = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  }, [isListening, stopListening, startListening, stopSpeaking]);

  const handleToggleSpeak = useCallback(
    (content: string) => {
      if (isSpeaking) stopSpeaking();
      else speak(content);
    },
    [isSpeaking, speak, stopSpeaking]
  );

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <div className="glass-strong border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="font-semibold text-sm block leading-tight">
                  AI Interviewer
                </span>
                <span className="text-xs text-muted-foreground">
                  {config?.type} • {config?.difficulty}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Auto-speak toggle */}
            {ttsSupported && (
              <button
                onClick={() => {
                  setAutoSpeak(!autoSpeak);
                  if (autoSpeak) stopSpeaking();
                }}
                className={`glass rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  autoSpeak ? "text-primary border-primary/30" : "text-muted-foreground"
                }`}
              >
                🔊 {autoSpeak ? "Voice ON" : "Voice OFF"}
              </button>
            )}
            <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-xs">{formatTime(timer)}</span>
            </div>
            <div className="glass rounded-lg px-3 py-1.5 text-xs font-medium">
              Q {Math.min(questionCount, maxQuestions)}/{maxQuestions}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="container mx-auto max-w-3xl space-y-6">
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              message={msg}
              isSpeaking={isSpeaking}
              onToggleSpeak={handleToggleSpeak}
            />
          ))}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-muted-foreground ml-1">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        loading={loading}
        isListening={isListening}
        onToggleMic={handleToggleMic}
        micSupported={micSupported}
        interviewEnded={interviewEnded}
        onBackToDashboard={() => navigate("/dashboard")}
      />
    </div>
  );
};

export default Interview;
