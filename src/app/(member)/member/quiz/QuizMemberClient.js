"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Award, Clock, HelpCircle, AlertTriangle, ArrowRight,
  CheckCircle2, XCircle, ArrowLeft, Send, Sparkles, RefreshCw,
  Trophy, BookmarkCheck, ChevronLeft, ChevronRight, FileText
} from "lucide-react";

export default function QuizMemberClient({ initialQuizzes, initialSubmissions }) {
  const [quizzes] = useState(initialQuizzes || []);
  const [submissions, setSubmissions] = useState(initialSubmissions || []);

  // View state: "list" | "taking" | "result"
  const [view, setView] = useState("list");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Quiz taking state
  const [answers, setAnswers] = useState([]); // [{ questionId, selectedOptionId, essayText }]
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [timerActive, setTimerActive] = useState(false);

  // Result state
  const [result, setResult] = useState(null);

  // Modals
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const timerRef = useRef(null);

  const getQuizAttempts = (quizId) => {
    const attempts = submissions.filter(s => s.quizId === quizId);
    if (attempts.length === 0) return { count: 0, bestScore: null, passed: false };
    const bestScore = Math.max(...attempts.map(a => a.totalScore ?? a.mcqScore ?? 0));
    const passed = attempts.some(a => a.isPassed);
    return { count: attempts.length, bestScore, passed };
  };

  const getQuizDifficulty = (questionCount) => {
    if (questionCount >= 10) return { label: "Hard", color: "text-red-400 bg-red-500/10 border-red-500/20" };
    if (questionCount >= 5) return { label: "Medium", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Easy", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  };

  // Start Quiz
  const handleStartQuiz = async (qz) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/quiz/${qz.id}`);
      if (!res.ok) throw new Error("Gagal mengambil soal kuis");
      const data = await res.json();
      setActiveQuiz(data);
      setQuestions(data.questions || []);
      setCurrentQuestionIdx(0);
      
      // Initialize empty answers
      const initialAnswers = (data.questions || []).map(q => ({
        questionId: q.id,
        selectedOptionId: q.type === "MULTIPLE_CHOICE" ? "" : null,
        essayText: q.type === "ESSAY" ? "" : null,
      }));
      setAnswers(initialAnswers);

      // Start timer if timeLimitMinutes exists
      if (qz.timeLimitMinutes) {
        setTimeLeft(qz.timeLimitMinutes * 60);
        setTimerActive(true);
      } else {
        setTimeLeft(0);
        setTimerActive(false);
      }
      setView("taking");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Timer countdown hook
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            handleAutoSubmit();
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

  const handleAutoSubmit = () => {
    handleSubmitQuiz(true);
  };

  const handleSelectOption = (questionId, optionId) => {
    setAnswers(prev => prev.map(ans =>
      ans.questionId === questionId
        ? { ...ans, selectedOptionId: optionId }
        : ans
    ));
  };

  const handleEssayChange = (questionId, text) => {
    setAnswers(prev => prev.map(ans =>
      ans.questionId === questionId
        ? { ...ans, essayText: text }
        : ans
    ));
  };

  const handleSubmitQuiz = async (force = false) => {
    if (!activeQuiz) return;
    setConfirmSubmitModal(false);
    setTimerActive(false);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/quiz/${activeQuiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setSubmissions(prev => [data.submission, ...prev]);
        setView("result");
      } else {
        setError(data.error || "Gagal mengirim kuis");
        setTimerActive(true); // Restart timer
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
      setTimerActive(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timer text
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentQuestionIdx];
  const progressPercent = questions.length > 0 ? ((currentQuestionIdx + 1) / questions.length) * 100 : 0;

  const prevSlide = () => {
    if (currentQuestionIdx > 0) setCurrentQuestionIdx(prev => prev - 1);
  };

  const nextSlide = () => {
    if (currentQuestionIdx < questions.length - 1) setCurrentQuestionIdx(prev => prev + 1);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  VIEW 3: RESULTS SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === "result" && result) {
    const isPassed = result.isPassed;
    const rewardXp = activeQuiz.rewardXp;
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-10 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-xl bg-gradient-to-b from-[#0a1f15] to-[#07130e] border border-primary/20 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden text-center"
        >
          {/* Confetti Particles (pure HTML/CSS) */}
          {isPassed && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(24)].map((_, i) => {
                const colors = ["bg-primary", "bg-emerald-400", "bg-amber-400", "bg-yellow-300", "bg-green-400"];
                const color = colors[i % colors.length];
                return (
                  <div
                    key={i}
                    className={`absolute rounded-full animate-ping ${color}`}
                    style={{
                      width: `${4 + Math.random() * 8}px`,
                      height: `${4 + Math.random() * 8}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 1.5}s`,
                      animationDuration: `${1.5 + Math.random() * 2}s`,
                    }}
                  />
                );
              })}
            </div>
          )}

          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Trophy className="w-10 h-10 text-primary animate-bounce" />
          </div>

          <h2 className="text-3xl font-display font-black tracking-tight text-white mb-2">
            {isPassed ? "Selamat! Kamu Lulus" : "Kuis Selesai"}
          </h2>
          
          <p className="text-xs text-white/50 mb-8 max-w-sm mx-auto leading-relaxed">
            {result.hasEssay
              ? "Jawaban essay kamu memerlukan penilaian manual oleh mentor. Nilai MCQ kamu telah dikalkulasi otomatis."
              : isPassed
              ? `Kamu berhasil melewati nilai kelulusan kuis dan mengklaim bonus XP.`
              : `Hasil pengerjaan kamu belum memenuhi nilai kelulusan (${activeQuiz.passingScore}%). Silakan kerjakan kembali.`}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Nilai MCQ</div>
              <div className="text-3xl font-black text-white">{result.mcqScore}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">XP Reward</div>
              <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400 shrink-0" />
                {isPassed ? `+${rewardXp}` : "+0"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {!isPassed && !result.hasEssay && (
              <button
                onClick={() => handleStartQuiz(activeQuiz)}
                className="w-full py-4 bg-primary text-[#050e0a] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-focus transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
              >
                <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
                Coba Mengerjakan Lagi
              </button>
            )}
            <button
              onClick={() => { setView("list"); setActiveQuiz(null); setResult(null); }}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-bold text-white transition-all text-xs uppercase tracking-wider"
            >
              Kembali ke Daftar Kuis
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  VIEW 2: TAKING THE QUIZ (IMMERSIVE E-LEARNING INTERFACE)
  // ═══════════════════════════════════════════════════════════════════════════
  if (view === "taking" && activeQuiz && currentQ) {
    const currentAns = answers.find(a => a.questionId === currentQ.id);
    return (
      <div className="min-h-[85vh] flex flex-col justify-between py-6 select-none">
        
        {/* Top Progress Bar & Timer */}
        <div className="w-full max-w-3xl mx-auto mb-10 shrink-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-white/50">Pertanyaan {currentQuestionIdx + 1} dari {questions.length}</span>
            {activeQuiz.timeLimitMinutes ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/5 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Tanpa Waktu</span>
              </div>
            )}
          </div>
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Panel */}
        <div className="flex-1 flex items-center justify-center w-full max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <div className="text-[10px] font-black text-primary tracking-widest uppercase mb-3">
                SOAL #{currentQ.order} ({currentQ.points} Poin)
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mb-8 leading-snug whitespace-pre-wrap tracking-tight">
                {currentQ.question}
              </h2>

              {/* MCQ Options */}
              {currentQ.type === "MULTIPLE_CHOICE" && Array.isArray(currentQ.options) && (
                <div className="space-y-4">
                  {currentQ.options.map((opt) => {
                    const isSelected = currentAns?.selectedOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, opt.id)}
                        className={`w-full text-left p-4.5 rounded-2xl border text-xs md:text-sm font-bold transition-all flex items-center gap-4 cursor-pointer hover:bg-white/[0.03] hover:scale-[1.01] ${
                          isSelected
                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                            : "bg-[#08120e] border-white/5 text-white/70"
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black uppercase shrink-0 ${
                          isSelected ? "bg-primary text-[#050e0a]" : "bg-white/10 text-white/40"
                        }`}>
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Essay Textarea */}
              {currentQ.type === "ESSAY" && (
                <div>
                  <textarea
                    rows={6}
                    value={currentAns?.essayText || ""}
                    onChange={e => handleEssayChange(currentQ.id, e.target.value)}
                    className="w-full p-5 bg-[#08120e] border border-white/5 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all resize-none h-44 leading-relaxed"
                    placeholder="Tuliskan lembar jawaban essay Anda..."
                  />
                  <div className="flex justify-end text-[10px] text-white/30 mt-2 font-bold uppercase tracking-wider">
                    {(currentAns?.essayText || "").length} Karakter
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Nav Bar */}
        <div className="w-full max-w-3xl mx-auto mt-12 flex justify-between items-center shrink-0">
          <button
            onClick={prevSlide}
            disabled={currentQuestionIdx === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-white/50 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          {currentQuestionIdx < questions.length - 1 ? (
            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-white/50 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setConfirmSubmitModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-[#050e0a] hover:bg-primary-focus hover:scale-105 transition-all text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Send className="w-4 h-4 animate-pulse" /> Kirim Kuis
            </button>
          )}
        </div>

        {/* Confirm Submit Modal */}
        <AnimatePresence>
          {confirmSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setConfirmSubmitModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm bg-[#08120e] border border-white/10 rounded-3xl p-8 text-center shadow-2xl z-10">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/25">
                  <BookmarkCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Selesai Mengerjakan?</h3>
                <p className="text-xs text-white/40 mb-8 leading-relaxed">Apakah Anda sudah yakin dengan semua jawaban Anda? Jawaban tidak dapat diubah setelah dikirim.</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmSubmitModal(false)} className="flex-1 py-3 rounded-xl border border-white/5 text-xs font-bold text-white/50 hover:bg-white/5">Batal</button>
                  <button onClick={() => handleSubmitQuiz(false)} className="flex-1 py-3 rounded-xl bg-primary text-[#050e0a] text-xs font-black hover:bg-primary-focus transition-all uppercase tracking-wider">Ya, Kirim</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  VIEW 1: LIST OF PUBLISHED QUIZZES (E-LEARNING PORTAL)
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="w-full relative select-none">
      
      {/* Background ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10">
        <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wide uppercase">
          E-Academy Quiz
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white mt-4 flex items-center gap-3">
          <Target className="w-9 h-9 text-primary animate-pulse" />
          Kuis & Evaluasi
        </h1>
        <p className="text-white/50 max-w-xl font-medium text-sm mt-2 leading-relaxed">
          Uji pemahaman Anda dari modul presentasi SRE dan dapatkan poin XP untuk bersaing di Hall of Fame.
        </p>
      </div>

      {isLoading && (
        <div className="py-20 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2 items-center">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && quizzes.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-[#08120e] border border-dashed border-white/5 rounded-3xl">
          <HelpCircle className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
          <h3 className="text-lg font-black text-white mb-1">Belum ada kuis tersedia</h3>
          <p className="text-white/40 text-xs max-w-xs leading-relaxed">Mentor atau pengurus Akademik akan merilis kuis baru untuk modul ini segera.</p>
        </div>
      ) : !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {quizzes.map(qz => {
            const status = getQuizAttempts(qz.id);
            const difficulty = getQuizDifficulty(qz.questionsCount || 5);
            return (
              <div
                key={qz.id}
                className="bg-gradient-to-br from-white/10 to-[#08120e] border border-white/5 rounded-3xl p-6 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-lg group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-2 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                      status.passed
                        ? "bg-green-500/15 text-green-400 border-green-500/25"
                        : status.count > 0
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                        : "bg-white/5 text-white/40 border-white/5"
                    }`}>
                      {status.passed ? "Lulus" : status.count > 0 ? "Belum Lulus" : "Belum Dicoba"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-400 font-mono">
                      <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" /> +{qz.rewardXp} XP
                    </span>
                  </div>

                  <h3 className="font-black text-white text-md mb-2 group-hover:text-primary transition-all line-clamp-1">{qz.title}</h3>
                  {qz.description && (
                    <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-6">
                      {qz.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2.5 text-xs text-white/60 font-medium">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{qz.timeLimitMinutes ? `${qz.timeLimitMinutes} Menit` : "Tanpa batas waktu"}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-white/60 font-medium">
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                      <span>Kelulusan: {qz.passingScore}%</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-white/60 font-medium">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${difficulty.color}`}>
                        {difficulty.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col gap-3 relative z-10">
                  {status.count > 0 && (
                    <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase tracking-wider">
                      <span>Terbaik: {status.bestScore}%</span>
                      <span>Percobaan: {status.count}x</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleStartQuiz(qz)}
                    className="w-full py-3.5 bg-primary text-[#050e0a] hover:bg-primary-focus transition-all rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider hover:scale-105"
                  >
                    <span>Mulai Kuis</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
