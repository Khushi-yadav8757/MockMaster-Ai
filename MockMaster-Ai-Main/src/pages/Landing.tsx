import { Brain, Target, BarChart3, Clock, Zap, Users, ArrowRight, ChevronRight, Code, MessageSquare, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "10K+", label: "Mock Interviews" },
  { value: "95%", label: "Placement Rate" },
  { value: "50+", label: "Interview Types" },
  { value: "4.9★", label: "User Rating" },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Questions",
    description: "Dynamic questions tailored to your role, experience level, and domain expertise.",
  },
  {
    icon: Target,
    title: "Real-Time Feedback",
    description: "Get instant evaluation with detailed scoring on communication, technical accuracy, and confidence.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your progress with detailed charts, strengths analysis, and improvement suggestions.",
  },
  {
    icon: Clock,
    title: "Timed Sessions",
    description: "Practice with realistic time constraints to build speed and confidence under pressure.",
  },
  {
    icon: Zap,
    title: "Multiple Domains",
    description: "Technical, HR, Behavioral, System Design, DSA — all interview types covered.",
  },
  {
    icon: Users,
    title: "Interview History",
    description: "Review past interviews, track improvements, and revisit AI feedback anytime.",
  },
];

const interviewTypes = [
  { icon: Code, label: "Technical DSA", color: "text-primary" },
  { icon: MessageSquare, label: "HR & Behavioral", color: "text-success" },
  { icon: Briefcase, label: "System Design", color: "text-warning" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold tracking-tight">MockMaster<span className="text-primary">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass glow-border mb-8 animate-slide-up">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Interview Preparation</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Crack Your Next
            <br />
            <span className="text-gradient">Interview</span> with AI
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up">
            Practice with an AI interviewer that adapts to your level. Get real-time feedback, 
            detailed scoring, and actionable insights to land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Button variant="hero" size="xl" onClick={() => navigate("/signup")}>
              Start Mock Interview <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
            <Button variant="hero-outline" size="xl" onClick={() => navigate("/login")}>
              View Demo
            </Button>
          </div>

          {/* Interview type pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-in">
            {interviewTypes.map((type) => (
              <div key={type.label} className="glass rounded-full px-5 py-2.5 flex items-center gap-2">
                <type.icon className={`h-4 w-4 ${type.color}`} />
                <span className="text-sm font-medium">{type.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-6 text-center animate-pulse-glow">
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-gradient">Ace Interviews</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our AI interview system covers all aspects of interview preparation with intelligent, adaptive technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass rounded-xl p-6 hover:glow-border transition-all duration-300 group cursor-default"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="glass rounded-2xl p-12 glow-border">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="text-gradient">Get Hired</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of candidates who cracked their dream interviews with MockMaster AI.
            </p>
            <Button variant="hero" size="xl" onClick={() => navigate("/signup")}>
              Start Free Interview <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-semibold">MockMaster<span className="text-primary">AI</span></span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 MockMasterAI. Built for placement success.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
