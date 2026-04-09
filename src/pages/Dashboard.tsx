import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Plus, Clock, Target, BarChart3, LogOut, ChevronRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InterviewRecord {
  id: string;
  interview_type: string;
  domain: string;
  difficulty: string;
  role: string | null;
  score: number | null;
  duration_seconds: number;
  question_count: number;
  verdict: string | null;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate("/login");
        return;
      }
      setUser({
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || "User",
      });
      fetchInterviews();
    };
    getUser();
  }, [navigate]);

  const fetchInterviews = async () => {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .order("created_at", { ascending: false }) as any;

    if (!error && data) {
      setInterviews(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/");
  };

  const totalInterviews = interviews.length;
  const avgScore = totalInterviews > 0
    ? (interviews.filter(i => i.score != null).reduce((sum, i) => sum + (i.score || 0), 0) /
       (interviews.filter(i => i.score != null).length || 1)).toFixed(1)
    : "—";
  const totalMinutes = totalInterviews > 0
    ? Math.round(interviews.reduce((sum, i) => sum + i.duration_seconds, 0) / 60)
    : 0;

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getVerdictColor = (verdict: string | null) => {
    if (!verdict) return "text-muted-foreground";
    if (verdict.toLowerCase() === "hire") return "text-green-400";
    if (verdict.toLowerCase() === "maybe") return "text-yellow-400";
    return "text-red-400";
  };

  const quickStats = [
    { icon: Target, label: "Interviews Done", value: totalInterviews.toString(), color: "text-primary" },
    { icon: BarChart3, label: "Avg Score", value: avgScore + (avgScore !== "—" ? "/10" : ""), color: "text-green-400" },
    { icon: Clock, label: "Total Time", value: `${totalMinutes} min`, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      {/* Nav */}
      <nav className="glass-strong border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold">MockMaster<span className="text-primary">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Welcome */}
        <div className="mb-10 animate-slide-up">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, <span className="text-gradient">{user?.full_name}</span> 👋
          </h1>
          <p className="text-muted-foreground">Ready for your next mock interview?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10 animate-fade-in">
          {quickStats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-5 text-center">
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Start New */}
        <div className="glass rounded-xl p-8 glow-border mb-10 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Start a New Interview</h2>
              <p className="text-sm text-muted-foreground">Choose your interview type, domain, and difficulty level</p>
            </div>
            <Button variant="hero" size="lg" onClick={() => navigate("/setup")}>
              <Plus className="h-5 w-5 mr-2" /> New Interview
            </Button>
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Recent Interviews</h2>
          {interviews.length === 0 ? (
            <div className="glass rounded-xl p-10 text-center">
              <Brain className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No interviews yet. Start your first one!</p>
              <Button variant="hero-outline" onClick={() => navigate("/setup")}>
                Take Your First Interview <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.map((interview) => (
                <div key={interview.id} className="glass rounded-xl p-5 flex items-center justify-between cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all" onClick={() => navigate(`/interview/${interview.id}`)}>
                  <div className="flex items-center gap-4">
                    <div className="glass rounded-lg p-2.5">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm capitalize">
                        {interview.interview_type} • {interview.domain}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {interview.difficulty} • {interview.role || "Software Engineer"} • {new Date(interview.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center hidden sm:block">
                      <div className="font-bold">{interview.score != null ? `${interview.score}/10` : "—"}</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                    <div className="text-center hidden sm:block">
                      <div className="font-bold">{formatDuration(interview.duration_seconds)}</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div className={`font-bold text-sm ${getVerdictColor(interview.verdict)}`}>
                      {interview.verdict || "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
