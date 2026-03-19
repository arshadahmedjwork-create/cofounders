import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight } from "lucide-react";

const questions = [
  {
    id: 1,
    category: "Risk DNA",
    text: "Your startup is 8 months in, burning runway, and you get a bridge offer at unfavorable terms. You:",
    options: [
      { id: "A", text: "Take it immediately — survival first" },
      { id: "B", text: "Decline and run a revenue sprint instead" },
      { id: "C", text: "Take 2 weeks to explore all alternatives" },
      { id: "D", text: "Take it as a forcing function to pivot" },
    ],
    type: "multiple-choice"
  },
  {
    id: 2,
    category: "Time Horizon",
    text: "When you think about your startup, which timeframe feels most real to you?",
    options: [
      { id: "A", text: "Next 30 days — I think in sprints" },
      { id: "B", text: "Next 12 months — annual planning" },
      { id: "C", text: "3 to 5 years — I can see the arc" },
      { id: "D", text: "10+ years — building a generational company" },
    ],
    type: "multiple-choice"
  },
  {
    id: 3,
    category: "Conflict Resolution",
    text: "You and your co-founder disagree on a major hire. What do you do?",
    options: [
      { id: "A", text: "Data-driven structured meeting — best argument wins" },
      { id: "B", text: "Defer to whoever has domain context" },
      { id: "C", text: "Try both approaches in parallel" },
      { id: "D", text: "Bring in a third-party advisor" },
    ],
    type: "multiple-choice"
  },
  {
    id: 4,
    category: "Work Style",
    text: "Your ideal work week as a founder looks like:",
    options: [
      { id: "A", text: "60–70 hours: fully consumed, love it" },
      { id: "B", text: "50–60 hours: intense with recovery" },
      { id: "C", text: "40–50 hours: sustainable with boundaries" },
      { id: "D", text: "Varies 30–80+ hours based on phase" },
    ],
    type: "multiple-choice"
  },
  {
    id: 5,
    category: "Financial Commitment",
    text: "Rate how much personal savings you'd invest at the start: Scale: 1 – 7 (Strongly Disagree → Strongly Agree)",
    type: "scale"
  },
  {
    id: 6,
    category: "Leadership Style",
    text: "Your leadership philosophy is closest to:",
    options: [
      { id: "A", text: "Servant: remove obstacles for my team" },
      { id: "B", text: "Visionary: set direction, inspire others" },
      { id: "C", text: "Coaching: develop people through questions" },
      { id: "D", text: "Operational: systems and accountability" },
    ],
    type: "multiple-choice"
  },
  {
    id: 7,
    category: "Resilience",
    text: "After a major failure, how long does it take you to feel re-energized?",
    options: [
      { id: "A", text: "Hours to a day — I bounce back fast" },
      { id: "B", text: "A few days — short reset then back" },
      { id: "C", text: "1–2 weeks — I come back stronger" },
      { id: "D", text: "A month+ — setbacks forge me deeply" },
    ],
    type: "multiple-choice"
  },
  {
    id: 8,
    category: "Ethics",
    text: "Your co-founder asks you to slightly misrepresent traction to an investor. You:",
    options: [
      { id: "A", text: "Refuse absolutely — dealbreaker for me" },
      { id: "B", text: "Push back strongly and suggest reframing" },
      { id: "C", text: "Ask a clarifying question to buy time" },
      { id: "D", text: "Present only verified facts and let truth speak" },
    ],
    type: "multiple-choice"
  },
  {
    id: 9,
    category: "Adaptability",
    text: "After 12 months, data shows your core hypothesis is wrong. You feel:",
    options: [
      { id: "A", text: "Excited — this is how great companies are born" },
      { id: "B", text: "Painful but expected — the nature of the journey" },
      { id: "C", text: "A crisis requiring all hands on deck immediately" },
      { id: "D", text: "Devastating temporarily — but I find the path" },
    ],
    type: "multiple-choice"
  },
  {
    id: 10,
    category: "Vision",
    text: "Rate how strongly you identify: “I am building something that will still matter in 20 years.”",
    type: "scale"
  },
  {
    id: 11,
    category: "Communication",
    text: "When frustrated with a colleague, you typically:",
    options: [
      { id: "A", text: "Address directly — I say what I mean" },
      { id: "B", text: "Process internally, then speak calmly" },
      { id: "C", text: "Write / journal it first, then decide" },
      { id: "D", text: "Seek input from a trusted third party" },
    ],
    type: "multiple-choice"
  },
  {
    id: 12,
    category: "Execution",
    text: "When you set a personal deadline, how often do you hit it?",
    type: "scale"
  },
  {
    id: 13,
    category: "Management",
    text: "A key team member underperforms after one conversation. You:",
    options: [
      { id: "A", text: "Set a 30-day PIP with weekly check-ins" },
      { id: "B", text: "Have a deeper conversation — find the root cause" },
      { id: "C", text: "Reassign their work and observe self-correction" },
      { id: "D", text: "Begin off-boarding — one warning is enough" },
    ],
    type: "multiple-choice"
  },
  {
    id: 14,
    category: "Growth Mindset",
    text: "Rate: “Every significant failure has ultimately made me a better founder.”",
    type: "scale"
  },
  {
    id: 15,
    category: "Integrity",
    text: "Rate: “I would rather fail ethically than succeed by cutting corners.”",
    type: "scale"
  },
  {
    id: 16,
    category: "Decision Making",
    text: "Your co-founder wants to change the technical architecture 6 months before launch. You:",
    options: [
      { id: "A", text: "Only agree with overwhelming evidence — time is real" },
      { id: "B", text: "Explore it seriously — tech debt now is worse" },
      { id: "C", text: "Propose a hybrid: ship now, rebuild in parallel" },
      { id: "D", text: "Defer to them — this is their domain" },
    ],
    type: "multiple-choice"
  },
  {
    id: 17,
    category: "Autonomy",
    text: "It's Friday evening. A strategic decision must be made by Monday. Your co-founder is unreachable. You:",
    options: [
      { id: "A", text: "Make the call — waiting is also a decision" },
      { id: "B", text: "Keep trying — this must be joint" },
      { id: "C", text: "Prepare both options, call Sunday night" },
      { id: "D", text: "Escalate to a board member or advisor" },
    ],
    type: "multiple-choice"
  },
  {
    id: 18,
    category: "Equity",
    text: "On equity split, you believe:",
    options: [
      { id: "A", text: "50-50 always — equal partnership" },
      { id: "B", text: "Split by contribution and role" },
      { id: "C", text: "Start equal, adjust after one year" },
      { id: "D", text: "Follow advisor recommendation" },
    ],
    type: "multiple-choice"
  },
  {
    id: 19,
    category: "Ambition",
    text: "Rate your personal ambition level for this venture:",
    type: "scale"
  },
  {
    id: 20,
    category: "Readiness",
    text: "Rate: “I am emotionally and professionally ready to commit to a co-founder right now.”",
    type: "scale"
  }
];

export default function SynapseTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [direction, setDirection] = useState(1);

  const question = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const selectOption = (value: string | number) => {
    setAnswers({ ...answers, [question.id]: value });
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        handleNext();
      }, 400); // short delay to show selection
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
              Your <span className="text-primary">SYNAPSE™</span> Assessment
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Psychometric science + Graphology analysis · ~20 minutes · No right or wrong answers
            </p>
          </div>

          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              <span>PSYCHEMAP™ — FOUNDER PSYCHE</span>
              <span className="text-foreground">{currentIndex + 1} of {questions.length}</span>
            </div>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < currentIndex ? "bg-primary" :
                      i === currentIndex ? "bg-primary/50 relative overflow-hidden" :
                        "bg-primary/10"
                    }`}
                >
                  {i === currentIndex && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-card bg-card/60 rounded-3xl p-6 md:p-10 shadow-lg border border-border/50 relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <span>💭</span> PSYCHEMAP™
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  Question {currentIndex + 1} of {questions.length} · {question.category}
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-8 leading-relaxed">
                  {question.text}
                </h2>

                {/* Options Layout */}
                {question.type === "multiple-choice" ? (
                  <div className="flex flex-col gap-3">
                    {question.options?.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => selectOption(option.id)}
                        className={`flex items-center p-4 rounded-xl border transition-all text-left w-full
                          ${answers[question.id] === option.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                          }
                        `}
                      >
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm mr-4 shrink-0 transition-colors
                          ${answers[question.id] === option.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-muted-foreground/30 text-muted-foreground"
                          }
                        `}>
                          {option.id}
                        </div>
                        <span className={`text-base font-medium ${answers[question.id] === option.id ? "text-foreground" : "text-foreground/80"}`}>
                          {option.text}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="flex justify-between px-2 mb-6">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Strongly Disagree</span>
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Strongly Agree</span>
                    </div>
                    <div className="flex justify-between gap-2 max-w-lg mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                        <button
                          key={val}
                          onClick={() => selectOption(val)}
                          className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all
                            ${answers[question.id] === val
                              ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30"
                              : "border-primary/20 text-foreground/70 hover:border-primary/50 hover:bg-primary/5"
                            }
                          `}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold border border-border bg-background/50 hover:bg-muted transition-colors ${currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "text-foreground"
                }`}
            >
              <ArrowLeft size={18} className="mr-2" />
              Previous
            </button>
            <button
              onClick={handleNext}
              className="flex items-center px-8 py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
            >
              Next
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
