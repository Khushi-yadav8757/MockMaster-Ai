import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Clock, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const InterviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("id", id)
        .single() as any;

      if (error || !data) {
        navigate("/dashboard");
        return;
      }
      setInterview(data);
      setLoading(false);
    };
    fetchInterview();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Brain className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const messages: Message[] = interview.messages || [];
  const formatDuration = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  const getVerdictColor = (v: string | null) => {
    if (!v) return "text-muted-foreground";
    if (v.toLowerCase() === "hire") return "text-green-400";
    if (v.toLowerCase() === "maybe") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <div className="glass-strong border-b border-border">
        <div className="container mx-auto flex items-center gap-3 h-14 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Interview Review</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Summary Card */}
        <div className="glass rounded-xl p-6 mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl font-bold capitalize">
                {interview.interview_type} • {interview.domain}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {interview.difficulty} • {interview.role || "Software Engineer"} •{" "}
                {new Date(interview.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className={`text-2xl font-bold ${getVerdictColor(interview.verdict)}`}>
              {interview.verdict || "—"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="glass rounded-lg p-3 text-center">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="font-bold">{interview.score != null ? `${interview.score}/10` : "—"}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
              <div className="font-bold">{formatDuration(interview.duration_seconds)}</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <Brain className="h-5 w-5 mx-auto mb-1 text-blue-400" />
              <div className="font-bold">{interview.question_count}</div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
          </div>
        </div>

        {/* Strengths & Improvements */}
        {(interview.strengths?.length > 0 || interview.improvements?.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-4 mb-6 animate-fade-in">
            {interview.strengths?.length > 0 && (
              <div className="glass rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <h3 className="font-semibold text-sm">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {interview.strengths.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-green-400">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {interview.improvements?.length > 0 && (
              <div className="glass rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <h3 className="font-semibold text-sm">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {interview.improvements.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-red-400">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Conversation Replay */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Conversation Replay</h2>
          {messages.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center text-muted-foreground">
              Conversation not available for this interview.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "glass"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button variant="hero" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetail;
