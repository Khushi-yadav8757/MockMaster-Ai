import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Code, MessageSquare, Briefcase, ArrowRight, Cpu, Database, Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const interviewTypes = [
  { id: "technical", label: "Technical DSA", icon: Code, description: "Data Structures, Algorithms, Problem Solving" },
  { id: "hr", label: "HR & Behavioral", icon: MessageSquare, description: "Tell me about yourself, STAR method, Soft skills" },
  { id: "system-design", label: "System Design", icon: Briefcase, description: "Architecture, Scalability, Design patterns" },
];

const domains = [
  { id: "frontend", label: "Frontend Dev", icon: Palette },
  { id: "backend", label: "Backend Dev", icon: Database },
  { id: "fullstack", label: "Full Stack", icon: Globe },
  { id: "ml", label: "ML / Data Science", icon: Cpu },
];

const difficulties = [
  { id: "easy", label: "Easy", description: "Fresher / Beginner level" },
  { id: "medium", label: "Medium", description: "1-3 years experience" },
  { id: "hard", label: "Hard", description: "Senior / Expert level" },
];

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [role, setRole] = useState("");

  const canStart = selectedType && selectedDomain && selectedDifficulty;

  const handleStart = () => {
    navigate("/interview", {
      state: {
        type: selectedType,
        domain: selectedDomain,
        difficulty: selectedDifficulty,
        role: role || "Software Engineer",
      },
    });
  };

  return (
    <div className="min-h-screen gradient-hero">
      <nav className="glass-strong border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Brain className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold">MockMaster<span className="text-primary">AI</span></span>
        </div>
      </nav>

      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Configure Your <span className="text-gradient">Interview</span>
          </h1>
          <p className="text-muted-foreground">Select your preferences and let AI prepare the perfect interview for you.</p>
        </div>

        <div className="space-y-8 animate-fade-in">
          {/* Interview Type */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Interview Type</Label>
            <div className="grid md:grid-cols-3 gap-3">
              {interviewTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`glass rounded-xl p-5 text-left transition-all duration-200 ${
                    selectedType === type.id ? "glow-border bg-primary/5" : "hover:border-primary/20"
                  }`}
                >
                  <type.icon className={`h-6 w-6 mb-3 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="font-semibold text-sm mb-1">{type.label}</div>
                  <div className="text-xs text-muted-foreground">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Domain */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Domain</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {domains.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`glass rounded-xl p-4 text-center transition-all duration-200 ${
                    selectedDomain === domain.id ? "glow-border bg-primary/5" : "hover:border-primary/20"
                  }`}
                >
                  <domain.icon className={`h-5 w-5 mx-auto mb-2 ${selectedDomain === domain.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-sm font-medium">{domain.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Difficulty</Label>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`glass rounded-xl p-4 text-center transition-all duration-200 ${
                    selectedDifficulty === diff.id ? "glow-border bg-primary/5" : "hover:border-primary/20"
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">{diff.label}</div>
                  <div className="text-xs text-muted-foreground">{diff.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Role */}
          <div>
            <Label htmlFor="role" className="text-base font-semibold mb-3 block">Target Role (optional)</Label>
            <input
              id="role"
              type="text"
              placeholder="e.g., Software Engineer at Google"
              className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          {/* Start Button */}
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            disabled={!canStart}
            onClick={handleStart}
          >
            Start Interview <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
