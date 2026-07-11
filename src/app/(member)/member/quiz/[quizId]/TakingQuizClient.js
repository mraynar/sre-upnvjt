"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { 
  X, Check, Clock, Send, Target, ChevronRight, Trophy, Zap, 
  RefreshCw, CheckCircle2, ArrowRight
} from "lucide-react";

export default function TakingQuizClient({ quiz, user }) {
  const { t } = useLanguage();
  const router = useRouter();
  const questions = quiz.questions || [];

  const storageKey = `quiz_progress_${quiz.id}`;

  const [currentIdx, setCurrentIdx] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).currentIdx || 0;
    }
    return 0;
  });

  const [answers, setAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved && JSON.parse(saved).answers) {
         return JSON.parse(saved).answers;
      }
    }
    return questions.map(q => ({
      questionId: q.id,
      selectedOptionId: q.type === "multiple_choice" || q.type === "true_false" ? "" : null,
      selectedOptionIds: q.type === "multiple_choice_complex" ? [] : null,
      essayText: q.type === "short_answer" ? "" : null,
    }));
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && questions.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify({ currentIdx, answers }));
    }
  }, [currentIdx, answers, storageKey, questions.length]);

  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitMinutes ? quiz.timeLimitMinutes * 60 : 0);
  const [timerActive, setTimerActive] = useState(!!quiz.timeLimitMinutes);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const isSubmittingRef = useRef(false);

  const [feedback, setFeedback] = useState({
    status: 'none',
    selectedId: null,
    correctId: null,
    points: 0
  });

  const [shuffledOptionsMap, setShuffledOptionsMap] = useState({});

  useEffect(() => {
    // Shuffle options once on client mount so it's random per user
    const newShuffled = {};
    questions.forEach(q => {
      if (q.options) {
        const opts = [...q.options];
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        newShuffled[q.id] = opts;
      }
    });
    setShuffledOptionsMap(newShuffled);
  }, [questions]);

  const timerRef = useRef(null);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  useEffect(() => {
    // Only auto-submit if time runs out and it was previously active (meaning they are actually taking a timed quiz)
    if (timeLeft === 0 && !isSubmittingRef.current && quiz.timeLimitMinutes > 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const handleSelectOption = (qId, optionId, type) => {
    if (feedback.status !== 'none') return;
    const currentQ = questions.find(q => q.id === qId);

    setAnswers(prev => prev.map(ans => {
      if (ans.questionId !== qId) return ans;
      
      if (type === "multiple_choice_complex") {
        const currentIds = ans.selectedOptionIds || [];
        if (currentIds.includes(optionId)) {
          return { ...ans, selectedOptionIds: currentIds.filter(id => id !== optionId) };
        } else {
          return { ...ans, selectedOptionIds: [...currentIds, optionId] };
        }
      } else {
        return { ...ans, selectedOptionId: optionId };
      }
    }));

    if (type === "multiple_choice" || type === "true_false") {
      const isCorrect = optionId === currentQ.correctOptionId;
      setFeedback({
        status: isCorrect ? 'correct' : 'incorrect',
        selectedId: optionId,
        correctId: currentQ.correctOptionId,
        points: isCorrect ? (currentQ.points || 600) : 0
      });

      setTimeout(() => {
        setFeedback({ status: 'none', selectedId: null, correctId: null, points: 0 });
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(currentIdx + 1);
        } else {
          handleSubmitQuiz();
        }
      }, 2500);
    }
  };

  const handleValidateManual = () => {
    if (feedback.status !== 'none') return;
    const currentQ = questions[currentIdx];
    const ans = answers.find(a => a.questionId === currentQ.id);

    let isCorrect = true;
    let correctId = null;
    let pointsEarned = 0;

    if (currentQ.type === "multiple_choice_complex") {
      const correctArr = (currentQ.correctOptionId || "").split(",").map(s => s.trim()).filter(Boolean);
      const selectedArr = ans.selectedOptionIds || [];
      
      const maxPoints = currentQ.points || 600;
      if (correctArr.length > 0) {
        const pointsPerCorrect = maxPoints / correctArr.length;
        let earned = 0;
        selectedArr.forEach(id => {
          if (correctArr.includes(id)) {
            earned += pointsPerCorrect;
          } else {
            earned -= pointsPerCorrect; // Penalize incorrect checks
          }
        });
        pointsEarned = Math.max(0, Math.round(earned));
        // Visually correct if they got some points or all
        isCorrect = pointsEarned > 0;
      }
      correctId = currentQ.correctOptionId;
    } else if (currentQ.type === "short_answer") {
      const userAns = (ans.essayText || "").trim().toLowerCase();
      const correctKey = (currentQ.correctOptionId || "").trim().toLowerCase();

      if (correctKey) {
        isCorrect = userAns === correctKey;
        pointsEarned = isCorrect ? (currentQ.points || 600) : 0;
      } else {
        isCorrect = true; // Accepted for manual grading
        pointsEarned = currentQ.points || 600;
      }
    }

    setFeedback({
      status: isCorrect ? 'correct' : 'incorrect',
      selectedId: 'manual',
      correctId: correctId,
      points: pointsEarned
    });

    setTimeout(() => {
      setFeedback({ status: 'none', selectedId: null, correctId: null, points: 0 });
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        handleSubmitQuiz();
      }
    }, 2500);
  };

  const handleTextChange = (qId, text) => {
    setAnswers(prev => prev.map(ans => ans.questionId === qId ? { ...ans, essayText: text } : ans));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
    
    setTimerActive(false);
    setIsSubmitting(true);
    setError("");
    
    // Transform answers for the backend if needed
    // In QuizMemberClient earlier, we just sent { answers }
    try {
      const res = await fetch(`/api/quiz/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || t("member_quiz.err_submit"));
        setTimerActive(true);
      }
    } catch (err) {
      setError(t("member_quiz.err_conn"));
      setTimerActive(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (result) {
    const isPassed = result.isPassed;
    const isPending = result.hasEssay && isPassed === null;
    return (
      <div className="fixed inset-0 bg-emerald-950 z-[100] flex flex-col items-center justify-center p-6 select-none overflow-hidden text-white">
        {/* Soft glowing gamified background orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        {/* Ambient floating particles for gamification feel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`bg-particle-${i}`}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute bg-emerald-300 rounded-full blur-[2px]"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 max-w-xl w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
          {isPassed && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-sm animate-ping ${["bg-emerald-400", "bg-amber-400", "bg-cyan-400", "bg-rose-400"][i % 4]}`}
                  style={{
                    width: `${4 + Math.random() * 8}px`,
                    height: `${10 + Math.random() * 15}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animationDelay: `${Math.random() * 1.5}s`,
                    animationDuration: `${1 + Math.random() * 1.5}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className={`absolute inset-0 rounded-full animate-ping ${isPending ? 'bg-amber-500/20' : isPassed ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`} />
            <div className={`w-full h-full rounded-full border-2 flex items-center justify-center relative z-10 
              ${isPending ? 'bg-gradient-to-br from-amber-500/20 to-amber-500/40 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 
                isPassed ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/40 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 
                'bg-gradient-to-br from-rose-500/20 to-rose-500/40 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]'}`}>
              {isPending ? <Trophy className="w-16 h-16 text-amber-400 animate-pulse" /> : 
               isPassed ? <Trophy className="w-16 h-16 text-emerald-400 animate-bounce" /> : 
               <X className="w-16 h-16 text-rose-500" />}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            {isPending ? "MISSION COMPLETED!" : isPassed ? "MISSION PASSED!" : "MISSION FAILED"}
          </h1>
          <p className="text-white/60 mb-10 max-w-sm mx-auto">
            {result.hasEssay 
              ? "Jawaban short answer kamu akan dinilai oleh mentor. Skor MCQ sudah dikalkulasi." 
              : isPassed 
              ? "Luar biasa! Kamu berhasil melewati syarat kelulusan." 
              : "Jangan menyerah, coba pelajari materinya lagi!"}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Score</div>
              <div className={`text-4xl font-black ${isPending ? 'text-amber-400' : isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.submission?.totalScore ?? result.submission?.mcqScore ?? 0}
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
              <div className="text-[10px] uppercase tracking-widest text-amber-500/60 font-bold mb-2">XP Reward</div>
              <div className="text-4xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Zap className="w-6 h-6 fill-amber-400" />
                +{result.gainedXp || 0}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {!isPassed && !isPending && (
              <button onClick={() => window.location.reload()} className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050e0a] font-black uppercase tracking-widest transition-all">
                Try Again
              </button>
            )}
            <button onClick={() => router.push("/member/quiz")} className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest transition-all">
              Return to Quizzes
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  if (!currentQ) return null;
  const currentAns = answers.find(a => a.questionId === currentQ.id);
  const progressPercent = ((currentIdx + 1) / questions.length) * 100;

  // Elegant Holographic style colors for options
  const optionColors = [
    "bg-emerald-900/40 border-emerald-500/30 hover:bg-emerald-800/60 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]", 
    "bg-teal-900/40 border-teal-500/30 hover:bg-teal-800/60 hover:border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.1)]",
    "bg-cyan-900/40 border-cyan-500/30 hover:bg-cyan-800/60 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]",
    "bg-sky-900/40 border-sky-500/30 hover:bg-sky-800/60 hover:border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.1)]",
    "bg-blue-900/40 border-blue-500/30 hover:bg-blue-800/60 hover:border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    "bg-indigo-900/40 border-indigo-500/30 hover:bg-indigo-800/60 hover:border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]",
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#021008] text-white flex flex-col font-sans select-none overflow-hidden">
      
      {/* Gamified Background - Elegant & Holographic */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#061b10] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a2e1c] via-[#041a10] to-[#021008]" />
        
        {/* Holographic Grid */}
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
          }}
        />

        {/* Animated Orbs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-emerald-500/10 blur-[130px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-teal-500/10 blur-[130px] rounded-full mix-blend-screen" 
        />
        
        {/* Elegant Floating Holographic Particles */}
        <motion.div animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[15%] text-emerald-500/20 text-4xl font-light">+</motion.div>
        <motion.div animate={{ y: [0, 40, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[35%] right-[10%] w-8 h-8 border-[1px] border-teal-500/20 rounded-full" />
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 90, 180] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[40%] right-[20%] w-16 h-16 border-[1px] border-white/5 rotate-45" />
        <motion.div animate={{ y: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[15%] left-[25%] text-emerald-500/20 text-2xl font-light">×</motion.div>
      </div>

      {/* Top Bar Minimalist */}
      <div className="shrink-0 flex items-center justify-between px-4 py-4 relative z-20">
        <div className="w-12"></div> {/* Spacer for centering */}

        {(timeLeft !== null && quiz.timeLimitMinutes > 0) && (
          <div className="px-6 py-2 bg-[#06291a]/80 rounded-2xl border-2 border-white/10 font-mono text-2xl md:text-4xl font-black flex items-center gap-4 shadow-2xl ring-1 ring-white/5">
            <Clock className={`w-8 h-8 md:w-10 md:h-10 ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
            <span className={`tracking-widest ${timeLeft < 60 ? 'text-rose-500 animate-pulse drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]' : 'text-emerald-50 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}

        <div className="w-12 flex justify-end">
          <button onClick={() => router.push("/member/quiz")} className="w-10 h-10 rounded-xl bg-[#06291a]/80 flex items-center justify-center hover:bg-rose-500 transition-colors border border-white/10 shadow-sm">
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 px-4 md:px-6 pb-2 w-full h-full justify-between overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", bounce: 0 }}
            className="w-full h-full flex flex-col justify-between pt-6 pb-8"
          >
            {/* Question Text Box */}
            <div className="w-full flex justify-center mb-8 relative">
              <div className="absolute -top-3 z-20 bg-[#020d08] border border-white/10 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                {currentIdx + 1} / {questions.length}
              </div>
              <div className="w-full max-w-5xl bg-[#06291a]/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 text-center shadow-[0_15px_50px_rgba(0,0,0,0.6)] border border-emerald-500/30 flex items-center justify-center min-h-[140px] md:min-h-[180px]">
                <h2 className="text-2xl md:text-5xl font-black tracking-tighter leading-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                  {currentQ.question}
                </h2>
              </div>
            </div>

            {/* Answer Options Row */}
            <div className="w-full flex flex-col items-center relative pb-16">
              {/* Feedback Animation overlay (points/confetti) */}
              {feedback.status === 'correct' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
                  <motion.div
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0], y: [50, 0, -50] }}
                    transition={{ duration: 1.5, times: [0, 0.2, 1] }}
                    className="text-white text-6xl md:text-8xl font-black drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] tracking-tighter italic"
                  >
                    +{feedback.points}
                  </motion.div>
                </div>
              )}

              {(currentQ.type === "multiple_choice" || currentQ.type === "true_false") && (
                <div className="grid grid-cols-2 auto-rows-fr md:flex md:flex-row gap-3 md:gap-4 w-full h-[30vh] md:justify-center items-stretch">
                  {(shuffledOptionsMap[currentQ.id] || currentQ.options || []).map((opt, idx) => {
                  const colorClass = optionColors[idx % optionColors.length];

                  // Render feedback state
                  if (feedback.status !== 'none') {
                    const isSelected = opt.id === feedback.selectedId;
                    const isCorrect = opt.id === feedback.correctId;
                    
                    if (feedback.status === 'correct' && !isCorrect) return null;
                    if (feedback.status === 'incorrect' && !isSelected && !isCorrect) return null;
                    
                    return (
                      <div
                        key={opt.id}
                        className={`flex-1 h-full relative rounded-2xl md:rounded-3xl p-3 md:p-6 overflow-hidden group flex items-center justify-center text-center transition-all border ${colorClass} opacity-100 scale-100 backdrop-blur-md`}
                      >
                        <span className="text-base md:text-3xl font-black tracking-tight leading-snug drop-shadow-md relative z-10 text-white break-words w-full">
                          {opt.text}
                        </span>
                        {!isCorrect && <div className="absolute inset-0 bg-black/50 z-20 pointer-events-none backdrop-blur-[2px]" />}
                        {isCorrect && <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full z-20"><Check className="text-white w-8 h-8" strokeWidth={3} /></div>}
                        {!isCorrect && <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full z-20"><X className="w-8 h-8 text-white" strokeWidth={3} /></div>}
                      </div>
                    );
                  }

                  const isSelected = currentAns?.selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQ.id, opt.id, currentQ.type)}
                      className={`flex-1 h-full relative rounded-2xl md:rounded-3xl p-3 md:p-6 transition-all active:scale-[0.98] overflow-hidden group flex items-center justify-center text-center border backdrop-blur-md ${
                        isSelected ? "bg-white/20 border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.2)]" : colorClass
                      }`}
                    >
                      {isSelected && <div className="absolute inset-0 bg-black/20 rounded-2xl md:rounded-3xl" />}
                      <span className="text-base md:text-3xl font-black tracking-tight leading-snug drop-shadow-md relative z-10 text-white break-words w-full">
                        {opt.text}
                      </span>
                      {isSelected && (
                        <div className="absolute inset-0 border-4 border-white/40 rounded-3xl pointer-events-none" />
                      )}
                    </button>
                  );
                })}
                </div>
              )}

              {currentQ.type === "multiple_choice_complex" && (
                <div className="grid grid-cols-2 auto-rows-fr md:flex md:flex-row gap-3 md:gap-4 w-full h-[30vh] md:justify-center items-stretch relative">
                  {(shuffledOptionsMap[currentQ.id] || currentQ.options || []).map((opt, idx) => {
                    const isSelected = (currentAns?.selectedOptionIds || []).includes(opt.id);
                    const colorClass = optionColors[idx % optionColors.length];
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQ.id, opt.id, "multiple_choice_complex")}
                        className={`flex-1 h-full relative rounded-2xl md:rounded-3xl p-3 md:p-6 transition-all active:scale-[0.98] overflow-hidden group flex flex-col items-center justify-center text-center border backdrop-blur-md ${
                          isSelected ? "bg-white/20 border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.2)]" : colorClass
                        }`}
                      >
                        {isSelected && <div className="absolute inset-0 bg-white/10 rounded-2xl md:rounded-3xl mix-blend-overlay" />}
                        <div className={`w-6 h-6 md:w-10 md:h-10 mb-2 md:mb-4 rounded-lg md:rounded-xl flex items-center justify-center border-2 md:border-4 shrink-0 relative z-10 transition-all ${
                          isSelected ? "bg-white border-white scale-110" : "border-white/50"
                        }`}>
                          {isSelected && <Check className="text-slate-900 w-4 h-4 md:w-7 md:h-7" strokeWidth={4} />}
                        </div>
                        <span className="text-base md:text-4xl font-black tracking-tight leading-snug drop-shadow-md relative z-10 text-white break-words w-full">
                          {opt.text}
                        </span>
                        {isSelected && (
                          <div className="absolute inset-0 border-4 border-white/40 rounded-3xl pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                  <div className="absolute -top-12 left-0 right-0 text-center text-white/70 text-xs font-black uppercase tracking-widest bg-[#06291a] border border-white/10 shadow-lg py-2 rounded-xl backdrop-blur-sm max-w-sm mx-auto">
                    (Pilih semua opsi yang benar)
                  </div>
                </div>
              )}

              {currentQ.type === "short_answer" && (
                <div className="w-full h-[30vh] flex flex-col justify-center items-center">
                  <textarea
                    rows={4}
                    value={currentAns?.essayText || ""}
                    onChange={e => handleTextChange(currentQ.id, e.target.value)}
                    className="w-full h-full max-w-4xl bg-white/10 border-4 border-white/20 rounded-3xl p-6 md:p-10 text-2xl md:text-4xl font-black tracking-tight text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all resize-none shadow-inner"
                    placeholder="Ketik jawaban Anda di sini..."
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mt-8 bg-rose-500/20 text-rose-300 px-6 py-3 rounded-xl border border-rose-500/30 font-bold">
            {error}
          </div>
        )}
      </div>

      {/* Bottom User Area / Navigation / Feedback */}
      <AnimatePresence>
        {feedback.status !== 'none' && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className={`absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center z-50 text-2xl font-bold text-white shadow-[0_-10px_30px_rgba(0,0,0,0.5)] ${
              feedback.status === 'correct' ? 'bg-[#189d53]' : 'bg-[#dc143c]'
            }`}
          >
            {feedback.status === 'correct' ? (
              <div className="flex items-center gap-3"><Check className="w-8 h-8" strokeWidth={4} /> Correct</div>
            ) : (
              <div className="flex items-center gap-3"><X className="w-8 h-8" strokeWidth={4} /> Incorrect</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`fixed bottom-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-none z-30 transition-opacity duration-300 ${feedback.status !== 'none' ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex items-center gap-3 pointer-events-auto bg-[#06291a]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5">
          <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden border-2 border-white/20">
            <img src={user?.image || "/images/default-avatar.png"} alt="User Avatar" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
          </div>
          <div className="text-xs">
            <div className="font-bold text-white leading-tight">{user?.name || "Player"}</div>
            <div className="text-white/50">Student</div>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {(currentQ.type === "multiple_choice_complex" || currentQ.type === "short_answer") && (
            <button
              onClick={handleValidateManual}
              disabled={isSubmitting}
              className="px-6 h-12 rounded-xl bg-emerald-500 border-b-4 border-emerald-700 text-white font-bold flex items-center justify-center hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all"
            >
              {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : (currentIdx < questions.length - 1 ? "LANJUT" : "KUMPULKAN")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
