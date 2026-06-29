"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, X, Search, CheckCircle2, XCircle,
  AlertTriangle, Target, FileText, ChevronLeft, Award, HelpCircle,
  Clock, CheckSquare, Settings, Check, UserCheck, Eye, EyeOff,
} from "lucide-react";
import {
  createQuiz, updateQuiz, deleteQuiz,
  createQuizQuestion, updateQuizQuestion, deleteQuizQuestion,
  gradeQuizSubmission,
} from "@/app/actions/quizActions";
import { useSession } from "next-auth/react";
import { hasAccess } from "@/lib/permissions";

const EMPTY_QUIZ = {
  title: "", description: "", timeLimitMinutes: "",
  passingScore: "70", rewardXp: "20", isPublished: false,
};

const EMPTY_QUESTION = {
  type: "MULTIPLE_CHOICE", question: "", points: "10",
  options: [{ id: "1", text: "" }, { id: "2", text: "" }],
  correctOptionId: "1",
};

export default function QuizClient({ initialQuizzes, initialSubmissions, currentUser }) {
  const { data: session } = useSession();
  const user = session?.user ?? currentUser;

  // View state: "list" | "questions"
  const [activeTab, setActiveTab] = useState("quizzes"); // "quizzes" | "submissions"
  const [view, setView] = useState("list"); // "list" | "questions"
  const [activeQuiz, setActiveQuiz] = useState(null); // quiz with questions

  // Data state
  const [quizzes, setQuizzes] = useState(initialQuizzes || []);
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState(initialSubmissions || []);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modals state
  const [quizModal, setQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState(EMPTY_QUIZ);
  const [targetQuiz, setTargetQuiz] = useState(null);
  const [quizDelModal, setQuizDelModal] = useState(false);

  const [questionModal, setQuestionModal] = useState(false);
  const [questionForm, setQuestionForm] = useState(EMPTY_QUESTION);
  const [targetQuestion, setTargetQuestion] = useState(null);
  const [questionDelModal, setQuestionDelModal] = useState(false);

  const [gradeModal, setGradeModal] = useState(false);
  const [targetSubmission, setTargetSubmission] = useState(null);
  const [essayScoreInput, setEssayScoreInput] = useState("");

  const canCreate = hasAccess(user, "quiz", "create");
  const canUpdate = hasAccess(user, "quiz", "update");
  const canDelete = hasAccess(user, "quiz", "delete");

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenQuizModal = (qz = null) => {
    setQuizForm(qz ? {
      title: qz.title,
      description: qz.description || "",
      timeLimitMinutes: qz.timeLimitMinutes?.toString() || "",
      passingScore: qz.passingScore?.toString() || "70",
      rewardXp: qz.rewardXp?.toString() || "20",
      isPublished: qz.isPublished,
    } : { ...EMPTY_QUIZ });
    setTargetQuiz(qz);
    setQuizModal(true);
  };

  const handleCloseQuizModal = () => {
    setQuizModal(false);
    setTimeout(() => { setQuizForm(EMPTY_QUIZ); setTargetQuiz(null); }, 300);
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isEditing = Boolean(targetQuiz?.id);
    const payload = {
      ...quizForm,
      timeLimitMinutes: quizForm.timeLimitMinutes ? parseInt(quizForm.timeLimitMinutes) : null,
      passingScore: parseInt(quizForm.passingScore),
      rewardXp: parseInt(quizForm.rewardXp),
      isPublished: quizForm.isPublished,
      createdById: user.id,
    };

    const res = isEditing
      ? await updateQuiz(targetQuiz.id, payload)
      : await createQuiz(payload);

    if (res.success) {
      if (isEditing) {
        setQuizzes(quizzes.map(q => q.id === targetQuiz.id ? { ...res.quiz, questionCount: q.questionCount } : q));
        if (activeQuiz?.id === targetQuiz.id) {
          setActiveQuiz(prev => ({ ...prev, ...res.quiz }));
        }
      } else {
        setQuizzes([res.quiz, ...quizzes]);
      }
      notify("success", isEditing ? "Kuis berhasil diperbarui!" : "Kuis baru dibuat!");
      handleCloseQuizModal();
    } else {
      notify("error", res.error || "Gagal menyimpan kuis");
    }
    setIsLoading(false);
  };

  const handleDeleteQuiz = async () => {
    if (!targetQuiz?.id) return;
    setIsLoading(true);
    const res = await deleteQuiz(targetQuiz.id);
    if (res.success) {
      setQuizzes(quizzes.filter(q => q.id !== targetQuiz.id));
      notify("success", "Kuis berhasil dihapus");
      setQuizDelModal(false);
      if (view === "questions") setView("list");
    } else {
      notify("error", res.error || "Gagal menghapus kuis");
    }
    setIsLoading(false);
  };

  const handleOpenQuestionManager = async (qz) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/quiz/${qz.id}`);
      const data = await res.json();
      setActiveQuiz(data);
      setQuestions(data.questions || []);
      setView("questions");
    } catch {
      setActiveQuiz({ ...qz, questions: [] });
      setQuestions([]);
      setView("questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenQuestionModal = (q = null) => {
    if (q) {
      setQuestionForm({
        type: q.type,
        question: q.question,
        points: q.points?.toString() || "10",
        options: Array.isArray(q.options) ? q.options : [],
        correctOptionId: q.correctOptionId || "",
      });
    } else {
      setQuestionForm({ ...EMPTY_QUESTION });
    }
    setTargetQuestion(q);
    setQuestionModal(true);
  };

  const handleCloseQuestionModal = () => {
    setQuestionModal(false);
    setTimeout(() => { setQuestionForm(EMPTY_QUESTION); setTargetQuestion(null); }, 300);
  };

  const handleAddOption = () => {
    const nextId = (questionForm.options.length + 1).toString();
    setQuestionForm(prev => ({
      ...prev,
      options: [...prev.options, { id: nextId, text: "" }],
    }));
  };

  const handleRemoveOption = (id) => {
    setQuestionForm(prev => {
      const remaining = prev.options.filter(o => o.id !== id);
      return {
        ...prev,
        options: remaining,
        correctOptionId: prev.correctOptionId === id && remaining.length > 0 ? remaining[0].id : prev.correctOptionId,
      };
    });
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!activeQuiz) return;
    setIsLoading(true);
    const isEditing = Boolean(targetQuestion?.id);

    const payload = {
      type: questionForm.type,
      question: questionForm.question,
      points: parseInt(questionForm.points) || 10,
      options: questionForm.type === "MULTIPLE_CHOICE" ? questionForm.options : [],
      correctOptionId: questionForm.type === "MULTIPLE_CHOICE" ? questionForm.correctOptionId : null,
    };

    const res = isEditing
      ? await updateQuizQuestion(targetQuestion.id, payload)
      : await createQuizQuestion(activeQuiz.id, payload);

    if (res.success) {
      if (isEditing) {
        setQuestions(questions.map(q => q.id === targetQuestion.id ? res.question : q));
      } else {
        setQuestions([...questions, res.question]);
        setQuizzes(quizzes.map(q => q.id === activeQuiz.id ? { ...q, questionCount: q.questionCount + 1 } : q));
      }
      notify("success", isEditing ? "Soal diperbarui!" : "Soal ditambahkan!");
      handleCloseQuestionModal();
    } else {
      notify("error", res.error || "Gagal menyimpan soal");
    }
    setIsLoading(false);
  };

  const handleDeleteQuestion = async () => {
    if (!targetQuestion?.id || !activeQuiz) return;
    setIsLoading(true);
    const res = await deleteQuizQuestion(targetQuestion.id, activeQuiz.id);
    if (res.success) {
      const remaining = questions
        .filter(q => q.id !== targetQuestion.id)
        .map((q, i) => ({ ...q, order: i + 1 }));
      setQuestions(remaining);
      setQuizzes(quizzes.map(q => q.id === activeQuiz.id ? { ...q, questionCount: Math.max(0, q.questionCount - 1) } : q));
      notify("success", "Soal dihapus");
      setQuestionDelModal(false);
    } else {
      notify("error", res.error || "Gagal menghapus soal");
    }
    setIsLoading(false);
  };

  const handleOpenGradeModal = (sub) => {
    setTargetSubmission(sub);
    setEssayScoreInput(sub.essayScore?.toString() || "");
    setGradeModal(true);
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!targetSubmission) return;
    setIsLoading(true);

    const res = await gradeQuizSubmission(targetSubmission.id, {
      essayScore: parseInt(essayScoreInput),
      gradedById: user.id,
    });

    if (res.success) {
      setSubmissions(submissions.map(s => s.id === targetSubmission.id ? {
        ...s,
        ...res.submission,
        gradedBy: { id: user.id, name: user.name },
      } : s));
      notify("success", "Nilai essay berhasil disimpan!");
      setGradeModal(false);
    } else {
      notify("error", res.error || "Gagal menilai essay");
    }
    setIsLoading(false);
  };

  const filteredQuizzes = quizzes.filter(q =>
    (q.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubmissions = submissions.filter(s =>
    (s.member?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.quiz?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Question manager view
  if (view === "questions" && activeQuiz) {
    return (
      <div className="w-full relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setView("list"); setActiveQuiz(null); setQuestions([]); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 shadow-sm border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-7 h-7 text-primary" />
                {activeQuiz.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">Kelola daftar pertanyaan kuis.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {canUpdate && (
              <button
                onClick={() => handleOpenQuizModal(activeQuiz)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 shadow-sm border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium"
              >
                <Settings className="w-4 h-4" />
                Edit Kuis
              </button>
            )}
            {canCreate && (
              <button
                onClick={() => handleOpenQuestionModal()}
                className="flex items-center gap-2 bg-primary text-[#050e0a] px-5 py-2.5 rounded-xl font-bold hover:bg-primary-focus transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Soal
              </button>
            )}
          </div>
        </div>

        {/* Quiz Info Bar */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
            <Clock className="w-4 h-4 text-primary" />
            <span>Waktu: <strong>{activeQuiz.timeLimitMinutes ? `${activeQuiz.timeLimitMinutes} Menit` : "Tanpa Batas"}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
            <CheckSquare className="w-4 h-4 text-primary" />
            <span>Kriteria Kelulusan: <strong>{activeQuiz.passingScore}%</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
            <Award className="w-4 h-4 text-primary" />
            <span>XP Reward: <strong>{activeQuiz.rewardXp} XP</strong></span>
          </div>
        </div>

        {/* Questions list */}
        {questions.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-white/40 dark:bg-white/[0.02] border border-dashed border-gray-200/50 dark:border-white/10 rounded-3xl">
            <HelpCircle className="w-12 h-12 text-gray-400 dark:text-white/20 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Belum ada pertanyaan</h3>
            <p className="text-gray-500 dark:text-white/40 text-sm">Tambahkan pertanyaan baru untuk memulai.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-sm flex flex-col md:flex-row justify-between items-start gap-6 group hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      SOAL {idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      q.type === "MULTIPLE_CHOICE"
                        ? "bg-blue-500/15 text-blue-400 border-blue-500/25"
                        : "bg-purple-500/15 text-purple-400 border-purple-500/25"
                    }`}>
                      {q.type === "MULTIPLE_CHOICE" ? "Pilihan Ganda" : "Essay"}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-white/30 font-medium">
                      {q.points} Poin
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium text-sm leading-relaxed whitespace-pre-wrap">
                    {q.question}
                  </p>

                  {/* MCQ Options */}
                  {q.type === "MULTIPLE_CHOICE" && Array.isArray(q.options) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {q.options.map((opt) => {
                        const isCorrect = opt.id === q.correctOptionId;
                        return (
                          <div
                            key={opt.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium transition-all ${
                              isCorrect
                                ? "bg-green-500/10 border-green-500/30 text-green-400 font-bold"
                                : "bg-gray-50/50 dark:bg-white/[0.01] border-gray-200 dark:border-white/5 text-gray-500 dark:text-white/50"
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] uppercase font-bold shrink-0 ${
                              isCorrect ? "bg-green-500 text-gray-900" : "bg-gray-200 dark:bg-white/10"
                            }`}>
                              {isCorrect ? <Check className="w-3 h-3" /> : opt.id}
                            </span>
                            <span className="truncate">{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0 self-end md:self-start">
                  {canUpdate && (
                    <button
                      onClick={() => handleOpenQuestionModal(q)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 text-gray-500 dark:text-white/70 flex items-center justify-center border border-transparent hover:border-gray-200 dark:border-white/10 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => { setTargetQuestion(q); setQuestionDelModal(true); }}
                      className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center border border-transparent hover:border-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Question Add/Edit Modal */}
        <AnimatePresence>
          {questionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={handleCloseQuestionModal} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    {targetQuestion ? "Edit Pertanyaan" : "Pertanyaan Baru"}
                  </h2>
                  <button onClick={handleCloseQuestionModal} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                  <form id="questionForm" onSubmit={handleSaveQuestion} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">Tipe Soal</label>
                        <select
                          value={questionForm.type}
                          onChange={e => setQuestionForm(p => ({ ...p, type: e.target.value }))}
                          className="w-full h-12 px-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
                        >
                          <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
                          <option value="ESSAY">Essay</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">Poin</label>
                        <input
                          type="number"
                          required
                          value={questionForm.points}
                          onChange={e => setQuestionForm(p => ({ ...p, points: e.target.value }))}
                          className="w-full h-12 px-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">Pertanyaan</label>
                      <textarea
                        required
                        rows={3}
                        value={questionForm.question}
                        onChange={e => setQuestionForm(p => ({ ...p, question: e.target.value }))}
                        className="w-full p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none resize-none h-24"
                        placeholder="Tuliskan isi pertanyaan..."
                      />
                    </div>

                    {questionForm.type === "MULTIPLE_CHOICE" && (
                      <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase">Pilihan Jawaban</label>
                          <button
                            type="button"
                            onClick={handleAddOption}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Tambah Pilihan
                          </button>
                        </div>

                        <div className="space-y-3">
                          {questionForm.options.map((opt, oIdx) => (
                            <div key={opt.id} className="flex gap-3 items-center">
                              <input
                                type="radio"
                                name="correctOption"
                                checked={questionForm.correctOptionId === opt.id}
                                onChange={() => setQuestionForm(p => ({ ...p, correctOptionId: opt.id }))}
                                className="w-4 h-4 text-primary focus:ring-primary focus:ring-offset-0 accent-primary cursor-pointer shrink-0"
                              />
                              <input
                                type="text"
                                required
                                value={opt.text}
                                onChange={e => {
                                  const textVal = e.target.value;
                                  setQuestionForm(p => ({
                                    ...p,
                                    options: p.options.map(o => o.id === opt.id ? { ...o, text: textVal } : o),
                                  }));
                                }}
                                className="flex-1 h-10 px-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none"
                                placeholder={`Pilihan ${oIdx + 1}`}
                              />
                              {questionForm.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(opt.id)}
                                  className="text-red-400 hover:text-red-300 p-2"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.02]">
                  <button type="button" onClick={handleCloseQuestionModal} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10">Batal</button>
                  <button type="submit" form="questionForm" disabled={isLoading}
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-[#050e0a] hover:bg-primary-focus flex items-center gap-2">
                    {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "Simpan"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Question Delete Modal */}
        <AnimatePresence>
          {questionDelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setQuestionDelModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/25">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Pertanyaan?</h3>
                <p className="text-xs text-gray-500 dark:text-white/40 mb-6">Pertanyaan ini akan dihapus permanen dari kuis.</p>
                <div className="flex gap-3">
                  <button onClick={() => setQuestionDelModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5">Batal</button>
                  <button onClick={handleDeleteQuestion} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600">Hapus</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Toast */}
        <Toast notification={notification} onClose={() => setNotification(null)} />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER — LIST & SUBMISSIONS VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <Target className="w-8 h-8 text-primary" />
            Quiz System
          </h1>
          <p className="text-gray-500 dark:text-white/50 max-w-xl">
            Kelola kuis berkala, pertanyaan pilihan ganda & essay, dan nilai submisi anggota.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
            <input
              type="text"
              placeholder={activeTab === "quizzes" ? "Cari kuis..." : "Cari nama / judul kuis..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none"
            />
          </div>
          {activeTab === "quizzes" && canCreate && (
            <button
              onClick={() => handleOpenQuizModal()}
              className="flex items-center gap-2 bg-primary text-[#050e0a] px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-primary-focus hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Plus className="w-5 h-5" />
              <span>Buat Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 dark:bg-white/[0.03] p-1 rounded-2xl w-fit border border-gray-200 dark:border-white/10">
        {[
          { key: "quizzes", label: "Daftar Kuis", icon: Target },
          { key: "submissions", label: "Hasil Submisi", icon: UserCheck },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(""); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────
          TAB: QUIZ LIST
         ─────────────────────────────────── */}
      {activeTab === "quizzes" && (
        <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-lg">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-gray-200/50 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                <tr>
                  {["Judul Kuis", "Jumlah Soal", "Durasi", "Kelulusan", "Reward XP", "Status", "Aksi"].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                <AnimatePresence>
                  {filteredQuizzes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-white/30">
                          <Target className="w-10 h-10" />
                          <p className="font-medium">Belum ada data kuis</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredQuizzes.map(qz => (
                    <tr key={qz.id} className="hover:bg-white/60 dark:hover:bg-white/[0.03] transition-all group">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenQuestionManager(qz)}
                          className="font-bold text-gray-900 dark:text-white text-sm hover:text-primary transition-colors text-left block"
                        >
                          {qz.title}
                        </button>
                        {qz.description && (
                          <span className="text-xs text-gray-400 dark:text-white/30 line-clamp-1 mt-0.5 max-w-[280px]">
                            {qz.description}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-white/70">
                        {qz.questionCount || 0} Soal
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-white/60">
                        {qz.timeLimitMinutes ? `${qz.timeLimitMinutes} Menit` : "Tanpa Batas"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-white/60">
                        {qz.passingScore}%
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">
                          <Award className="w-3.5 h-3.5" /> +{qz.rewardXp} XP
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold border ${
                          qz.isPublished
                            ? "bg-green-500/15 text-green-400 border-green-500/25"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}>
                          {qz.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          {qz.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenQuestionManager(qz)}
                            className="h-8 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all"
                          >
                            Kelola Soal
                          </button>
                          {canUpdate && (
                            <button
                              onClick={() => handleOpenQuizModal(qz)}
                              className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-transparent hover:border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/70 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => { setTargetQuiz(qz); setQuizDelModal(true); }}
                              className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-transparent hover:border-red-500/20 text-red-400 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────
          TAB: SUBMISSIONS LIST
         ─────────────────────────────────── */}
      {activeTab === "submissions" && (
        <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-lg">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-gray-200/50 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                <tr>
                  {["Nama Anggota", "Kuis", "MCQ Score", "Essay Score", "Total Score", "Status", "Aksi"].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                <AnimatePresence>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-white/30">
                          <UserCheck className="w-10 h-10" />
                          <p className="font-medium">Belum ada hasil kuis yang dikirim</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-white/60 dark:hover:bg-white/[0.03] transition-all">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                        {sub.member?.name || `ID User: ${sub.memberId}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-white/70">
                        {sub.quiz?.title || `ID Kuis: ${sub.quizId}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-white/70">
                        {sub.mcqScore !== null ? `${sub.mcqScore}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {sub.essayScore !== null ? (
                          <span className="text-gray-900 dark:text-white font-semibold">{sub.essayScore}</span>
                        ) : (
                          <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-amber-500/20">Ungraded</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-primary">
                        {sub.totalScore !== null ? `${sub.totalScore}` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {sub.isPassed !== null ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                            sub.isPassed
                              ? "bg-green-500/10 text-green-400 border-green-500/25"
                              : "bg-red-500/10 text-red-400 border-red-500/25"
                          }`}>
                            {sub.isPassed ? "LULUS" : "GAGAL"}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs font-semibold">Menunggu Penilaian</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {sub.essayScore === null && canUpdate ? (
                          <button
                            onClick={() => handleOpenGradeModal(sub)}
                            className="h-8 px-3 rounded-lg bg-primary text-[#050e0a] text-xs font-bold hover:bg-primary-focus transition-all"
                          >
                            Beri Nilai Essay
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-white/30">
                            {sub.gradedBy ? `Dinilai oleh ${sub.gradedBy.name}` : "Selesai"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quiz Add/Edit Modal */}
      <AnimatePresence>
        {quizModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseQuizModal} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  {targetQuiz ? "Edit Kuis" : "Kuis Baru"}
                </h2>
                <button onClick={handleCloseQuizModal} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <form id="quizForm" onSubmit={handleSaveQuiz} className="space-y-5">
                  <InputField label="Judul Kuis *">
                    <input type="text" required value={quizForm.title}
                      onChange={e => setQuizForm(p => ({ ...p, title: e.target.value }))}
                      className={inputCls} placeholder="e.g. Kuis Kimia Dasar Modul 1" />
                  </InputField>

                  <InputField label="Deskripsi">
                    <textarea rows={3} value={quizForm.description}
                      onChange={e => setQuizForm(p => ({ ...p, description: e.target.value }))}
                      className={`${textareaCls} h-24`} placeholder="Penjelasan singkat mengenai kuis..." />
                  </InputField>

                  <div className="grid grid-cols-3 gap-4">
                    <InputField label="Waktu (Menit)">
                      <input type="number" min="0" value={quizForm.timeLimitMinutes}
                        onChange={e => setQuizForm(p => ({ ...p, timeLimitMinutes: e.target.value }))}
                        className={inputCls} placeholder="e.g. 30" />
                    </InputField>
                    <InputField label="Lulus (%)">
                      <input type="number" required min="0" max="100" value={quizForm.passingScore}
                        onChange={e => setQuizForm(p => ({ ...p, passingScore: e.target.value }))}
                        className={inputCls} placeholder="e.g. 70" />
                    </InputField>
                    <InputField label="XP Reward">
                      <input type="number" required min="0" value={quizForm.rewardXp}
                        onChange={e => setQuizForm(p => ({ ...p, rewardXp: e.target.value }))}
                        className={inputCls} placeholder="e.g. 20" />
                    </InputField>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium text-[14px]">Status Publikasi</div>
                      <div className="text-gray-500 dark:text-white/40 text-[12px]">Dapat langsung dikerjakan oleh anggota</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={quizForm.isPublished}
                        onChange={e => setQuizForm(p => ({ ...p, isPublished: e.target.checked }))} />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.02]">
                <button type="button" onClick={handleCloseQuizModal} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10">Batal</button>
                <button type="submit" form="quizForm" disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-[#050e0a] hover:bg-primary-focus flex items-center gap-2">
                  {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "Simpan"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quiz Delete Modal */}
      <AnimatePresence>
        {quizDelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setQuizDelModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/25">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Kuis?</h3>
              <p className="text-xs text-gray-500 dark:text-white/40 mb-6">Seluruh data pertanyaan dan hasil pengerjaan kuis ini akan ikut terhapus.</p>
              <div className="flex gap-3">
                <button onClick={() => setQuizDelModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5">Batal</button>
                <button onClick={handleDeleteQuiz} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grade Essay Modal */}
      <AnimatePresence>
        {gradeModal && targetSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setGradeModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#0a1612] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  Beri Nilai Jawaban Essay
                </h2>
                <button onClick={() => setGradeModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-2">Jawaban Anggota:</h3>
                  <div className="space-y-4">
                    {targetSubmission.answers.map((ans, aIdx) => {
                      // Find matching question
                      return (
                        <div key={aIdx} className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl">
                          <div className="text-xs font-bold text-primary mb-1">PERTANYAAN #{aIdx + 1}</div>
                          {ans.essayText ? (
                            <p className="text-sm font-medium text-gray-900 dark:text-white italic">"{ans.essayText}"</p>
                          ) : (
                            <p className="text-xs text-gray-400">Pilihan Ganda (Sudah Terkalkulasi Otomatis)</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <form id="gradeForm" onSubmit={handleGradeSubmission} className="space-y-5">
                  <InputField label="Input Nilai Tambahan / Essay (0-100)">
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={essayScoreInput}
                      onChange={e => setEssayScoreInput(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. 85"
                    />
                  </InputField>
                </form>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.02]">
                <button type="button" onClick={() => setGradeModal(false)} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10">Batal</button>
                <button type="submit" form="gradeForm" disabled={isLoading}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-[#050e0a] hover:bg-primary-focus flex items-center gap-2">
                  {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "Simpan Nilai"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast notification={notification} onClose={() => setNotification(null)} />
    </div>
  );
}

// Extracted toast component
function Toast({ notification, onClose }) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
            notification.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {notification.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-medium text-xs">{notification.message}</span>
          <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  "w-full h-12 px-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all";

const textareaCls =
  "w-full p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all resize-none";

const InputField = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-bold tracking-wider text-gray-500 dark:text-white/50 uppercase mb-2">
      {label}
    </label>
    {children}
  </div>
);
