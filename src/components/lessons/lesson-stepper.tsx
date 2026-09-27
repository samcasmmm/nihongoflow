"use client";

import React, { useState, useCallback, useTransition } from "react";
import { Lesson, VocabItem, GrammarPattern, SentenceItem, LessonProgress } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Code2,
  Send,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  lesson: Lesson;
  vocab: VocabItem[];
  grammar: GrammarPattern[];
  sentences: SentenceItem[];
  initialProgress: LessonProgress;
}

type Stage = "vocab" | "grammar" | "practice" | "complete";

export function LessonStepper({
  lesson,
  vocab,
  grammar,
  sentences,
  initialProgress,
}: Props) {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<Stage>(
    initialProgress.isCompleted
      ? "practice"
      : (initialProgress.currentStage as Stage) || "vocab"
  );

  const [progressState, setProgressState] = useState<LessonProgress>(initialProgress);
  const [, startTransition] = useTransition();

  // Practice state
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    feedback: string;
    errorTag: string | null;
  } | null>(null);
  const [practiceCorrectCount, setPracticeCorrectCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentSentence = sentences[currentSentenceIndex] || sentences[0];

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const speakJapanese = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Update backend stage progress
  const syncStageProgress = useCallback(
    async (nextStage: Stage, extraData: Record<string, unknown> = {}) => {
      startTransition(async () => {
        try {
          const res = await fetch(`/api/lessons/${lesson.lessonNumber}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stage: nextStage,
              ...extraData,
            }),
          });
          const data = await res.json();
          if (data.data?.progress) {
            setProgressState(data.data.progress);
          }
          if (data.data?.isNewlyCompleted) {
            showToast(`+${data.data.xpAwarded} XP • Lesson ${lesson.lessonNumber} Cleared! 🎉`);
          }
        } catch (err) {
          console.error("Failed to sync stage progress:", err);
        }
      });
    },
    [lesson.lessonNumber, showToast]
  );

  // Initialize practice session
  const startPractice = useCallback(async () => {
    try {
      const res = await fetch("/api/practice/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonNumber: lesson.lessonNumber }),
      });
      const data = await res.json();
      if (data.data?.session) {
        setSessionId(data.data.session.id);
        setCurrentSentenceIndex(0);
        setPracticeCorrectCount(0);
        setPracticeFeedback(null);
      }
    } catch (err) {
      console.error("Failed to start practice session:", err);
    }
  }, [lesson.lessonNumber]);

  const handleAdvanceToGrammar = () => {
    setCurrentStage("grammar");
    syncStageProgress("grammar", { vocabCompleted: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdvanceToPractice = () => {
    setCurrentStage("practice");
    syncStageProgress("practice", { grammarCompleted: true });
    startPractice();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit single sentence answer
  const handleSubmitAnswer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim() || isEvaluating || !currentSentence) return;

    setIsEvaluating(true);

    try {
      let activeSessionId = sessionId;
      if (!activeSessionId) {
        const startRes = await fetch("/api/practice/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonNumber: lesson.lessonNumber }),
        });
        const startData = await startRes.json();
        activeSessionId = startData.data.session.id;
        setSessionId(activeSessionId);
      }

      const res = await fetch("/api/practice/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId,
          sentenceItemId: currentSentence.id,
          userAnswer: userAnswer.trim(),
        }),
      });

      const data = await res.json();
      const isCorrect = data.data.isCorrect;

      if (isCorrect) {
        setPracticeCorrectCount((prev) => prev + 1);
        showToast("+3 XP • 正解です！ (Correct!)");
      }

      setPracticeFeedback({
        submitted: true,
        isCorrect,
        feedback: data.data.feedback,
        errorTag: data.data.errorTag,
      });
    } catch (err) {
      console.error("Failed to evaluate answer:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Next question in practice
  const handleNextPracticeQuestion = () => {
    setUserAnswer("");
    setPracticeFeedback(null);

    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
    } else {
      // Practice session completed
      const total = sentences.length;
      const finalScore = Math.round((practiceCorrectCount / Math.max(1, total)) * 100);

      setCurrentStage("complete");
      syncStageProgress("complete", {
        practiceCompleted: true,
        practiceScore: finalScore,
      });
    }
  };

  // Helper keyboard tokens for users without Japanese IME
  const quickKanaTokens = [
    "は",
    "が",
    "を",
    "に",
    "で",
    "へ",
    "も",
    "の",
    "です",
    "じゃありません",
    "か",
    "。",
  ];

  const handleInsertToken = (token: string) => {
    setUserAnswer((prev) => prev + token);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce bg-[#1a1d26] border border-[#58cc02]/40 text-white px-4 py-2.5 rounded-2xl shadow-xl shadow-[#58cc02]/10 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#58cc02]" />
          <span className="text-xs font-bold font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Lesson Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#9a9aa8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Lesson {lesson.lessonNumber}: {lesson.title}
            </h1>
            <span className="chip text-[#58cc02] border-[#58cc02]/30 bg-[#58cc02]/10 font-bold font-mono text-xs">
              {lesson.japaneseTitle}
            </span>
          </div>
          <p className="text-xs text-[#9a9aa8] max-w-xl leading-relaxed">
            {lesson.summary}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="chip text-[#1cb0f6] border-[#1cb0f6]/30 bg-[#1cb0f6]/10 text-xs font-mono">
            Focus: {lesson.grammarTopic}
          </span>
        </div>
      </div>

      {/* 3-Stage Progress Stepper Bar */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setCurrentStage("vocab")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            currentStage === "vocab"
              ? "bg-[#58cc02]/15 border-[#58cc02] shadow-lg shadow-[#58cc02]/10"
              : progressState.vocabCompleted
              ? "bg-white/5 border-[#58cc02]/40 text-[#58cc02]"
              : "bg-white/2 border-white/10 text-[#9a9aa8]"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span>1. Vocabulary</span>
            {progressState.vocabCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-[#58cc02]" />
            ) : (
              <span className="text-[10px] font-mono opacity-60">{vocab.length} Words</span>
            )}
          </div>
          <div className="text-[11px] text-[#9a9aa8] mt-1 hidden sm:block">
            Pronunciation & meaning
          </div>
        </button>

        <button
          onClick={() => setCurrentStage("grammar")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            currentStage === "grammar"
              ? "bg-[#ce82ff]/15 border-[#ce82ff] shadow-lg shadow-[#ce82ff]/10"
              : progressState.grammarCompleted
              ? "bg-white/5 border-[#ce82ff]/40 text-[#ce82ff]"
              : "bg-white/2 border-white/10 text-[#9a9aa8]"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span>2. Grammar</span>
            {progressState.grammarCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-[#ce82ff]" />
            ) : (
              <span className="text-[10px] font-mono opacity-60">
                {grammar.length} Patterns
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#9a9aa8] mt-1 hidden sm:block">
            Formulas & Nuances
          </div>
        </button>

        <button
          onClick={() => {
            setCurrentStage("practice");
            if (!sessionId) startPractice();
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            currentStage === "practice" || currentStage === "complete"
              ? "bg-[#1cb0f6]/15 border-[#1cb0f6] shadow-lg shadow-[#1cb0f6]/10"
              : progressState.practiceCompleted
              ? "bg-white/5 border-[#1cb0f6]/40 text-[#1cb0f6]"
              : "bg-white/2 border-white/10 text-[#9a9aa8]"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span>3. Practice</span>
            {progressState.isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-[#1cb0f6]" />
            ) : (
              <span className="text-[10px] font-mono opacity-60">
                {sentences.length} Drills
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#9a9aa8] mt-1 hidden sm:block">
            Target: ≥70% score
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* STAGE 1: VOCABULARY SHOWCASE                                              */}
      {/* ========================================================================= */}
      {currentStage === "vocab" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#58cc02]" />
              <span>Lesson {lesson.lessonNumber} Vocabulary Bank</span>
            </h2>
            <span className="text-xs text-[#9a9aa8] font-mono">
              {vocab.length} Core Lexical Items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {vocab.map((item) => (
              <div
                key={item.id}
                className="bento p-4 flex items-start justify-between gap-3 group hover:border-[#58cc02]/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl select-none">{item.imageUrl || "📖"}</span>
                    <span className="text-lg font-bold text-white font-sans">
                      {item.word}
                    </span>
                    <span className="text-xs text-[#9a9aa8] font-mono">
                      ({item.reading})
                    </span>
                  </div>
                  <div className="text-sm text-[#58cc02] font-medium font-sans">
                    {item.meaning}
                  </div>
                  <div className="text-xs text-[#e4e4e9]/80 italic pt-1">
                    &ldquo;{item.exampleSentence}&rdquo;
                  </div>
                </div>

                <button
                  onClick={() => speakJapanese(item.reading || item.word)}
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#58cc02] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all shrink-0 mt-1"
                  title="Listen"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/10">
            <Link href={`/flashcards/vocabulary`}>
              <Button variant="chunkyOutline" size="default">
                Open in Flashcards Deck
              </Button>
            </Link>
            <Button
              variant="chunky"
              size="default"
              onClick={handleAdvanceToGrammar}
              className="bg-[#58cc02] hover:bg-[#46a302] border-[#388202]"
            >
              Continue to Grammar Patterns
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: GRAMMAR BLUEPRINT PATTERNS                                       */}
      {/* ========================================================================= */}
      {currentStage === "grammar" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#ce82ff]" />
              <span>Lesson {lesson.lessonNumber} Grammar Patterns</span>
            </h2>
            <span className="text-xs text-[#9a9aa8] font-mono">
              {grammar.length} Blueprint Formulas
            </span>
          </div>

          <div className="space-y-5">
            {grammar.map((pattern) => (
              <div
                key={pattern.id}
                className="bento p-6 space-y-4 border-l-4 border-l-[#ce82ff]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="chip text-[#ce82ff] border-[#ce82ff]/30 bg-[#ce82ff]/10 text-xs font-mono font-bold">
                      {pattern.japaneseTitle}
                    </span>
                    <span className="text-xs font-mono text-[#9a9aa8]">
                      #{pattern.skillTag}
                    </span>
                  </div>
                </div>

                <div className="bg-[#11131a] p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                  <span className="text-xs uppercase font-mono font-bold text-[#9a9aa8]">
                    Formula:
                  </span>
                  <span className="text-white font-mono text-sm font-bold bg-[#1e2029] px-2.5 py-0.5 rounded-md border border-white/5">
                    {pattern.formula}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#e4e4e9] leading-relaxed">
                  {pattern.explanation}
                </p>

                {/* Example Sentences */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-mono text-[#58cc02] uppercase tracking-wider font-bold">
                    Examples
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pattern.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="bg-[#181a24] p-3 rounded-xl border border-white/5 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{ex.japanese}</span>
                          <button
                            onClick={() => speakJapanese(ex.reading || ex.japanese)}
                            className="text-[#1cb0f6] hover:scale-110 transition-transform"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-[#9a9aa8] font-mono">{ex.reading}</div>
                        <div className="text-xs text-[#1cb0f6] font-medium">{ex.english}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Nuance Alert */}
                {pattern.commonMistakes && (
                  <div className="bg-[#ff9600]/10 border border-[#ff9600]/30 rounded-xl p-3 text-xs text-[#e4e4e9] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#ff9600] shrink-0 mt-0.5" />
                    <span>{pattern.commonMistakes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/10">
            <Button
              variant="chunkyOutline"
              size="default"
              onClick={() => setCurrentStage("vocab")}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Vocabulary
            </Button>
            <Button
              variant="chunky"
              size="default"
              onClick={handleAdvanceToPractice}
              className="bg-[#1cb0f6] hover:bg-[#0284c7] border-[#0369a1]"
            >
              Start Sentence Drills
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: INTERACTIVE PRACTICE & EVALUATION ENGINE                         */}
      {/* ========================================================================= */}
      {currentStage === "practice" && currentSentence && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="chip text-[#1cb0f6] border-[#1cb0f6]/30 bg-[#1cb0f6]/10 font-mono text-[11px]">
                Question {currentSentenceIndex + 1} of {sentences.length}
              </span>
              <h2 className="text-base font-display font-bold text-white">
                {currentSentence.type === "transformation"
                  ? "Grammar Transformation Drill"
                  : "English-to-Japanese Translation Drill"}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#58cc02]">
                {practiceCorrectCount} / {sentences.length} Correct
              </span>
            </div>
          </div>

          {/* Drill Question Card */}
          <div className="bento p-6 sm:p-8 space-y-6">
            <div className="space-y-3 text-center sm:text-left">
              <div className="text-xs uppercase font-mono tracking-wider text-[#9a9aa8]">
                {currentSentence.prompt}
              </div>

              {currentSentence.promptJapanese && (
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide py-2">
                  {currentSentence.promptJapanese}
                </div>
              )}

              {currentSentence.hint && (
                <div className="inline-flex items-center gap-1.5 text-xs text-[#ff9600] bg-[#ff9600]/10 px-3 py-1 rounded-xl border border-[#ff9600]/30 font-mono">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Hint: {currentSentence.hint}</span>
                </div>
              )}
            </div>

            {/* Answer Input Form */}
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your Japanese answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={practiceFeedback?.submitted}
                  className="w-full bg-[#11131a] border-2 border-white/10 rounded-2xl px-4 py-3.5 text-base sm:text-lg text-white font-sans placeholder-[#9a9aa8]/50 focus:outline-none focus:border-[#1cb0f6] transition-colors"
                />
                {!practiceFeedback?.submitted && (
                  <Button
                    type="submit"
                    variant="chunky"
                    size="sm"
                    disabled={!userAnswer.trim() || isEvaluating}
                    className="absolute right-2 top-2 bg-[#1cb0f6] hover:bg-[#0284c7] border-[#0369a1]"
                  >
                    Check
                    <Send className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>

              {/* On-screen Quick Kana / Particle Helper Tokens */}
              {!practiceFeedback?.submitted && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-mono text-[#9a9aa8] flex items-center justify-between">
                    <span>Quick Particle / Verb Helper (click to insert):</span>
                    <span>Tag: #{currentSentence.skillTag}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickKanaTokens.map((token) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => handleInsertToken(token)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#e4e4e9] active:scale-95 transition-all"
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>

            {/* Immediate Evaluation Feedback Box */}
            {practiceFeedback && (
              <div
                className={`p-4 rounded-2xl border space-y-2 animate-in fade-in duration-300 ${
                  practiceFeedback.isCorrect
                    ? "bg-[#58cc02]/10 border-[#58cc02]/40 text-[#58cc02]"
                    : "bg-[#ff4b4b]/10 border-[#ff4b4b]/40 text-rose-300"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <div className="flex items-center gap-2">
                    {practiceFeedback.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-[#58cc02]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>
                      {practiceFeedback.isCorrect
                        ? "Correct! +3 XP awarded"
                        : "Incorrect Answer"}
                    </span>
                  </div>
                  {practiceFeedback.errorTag && (
                    <span className="text-[10px] font-mono chip bg-rose-500/20 border-rose-500/30 text-rose-300">
                      Error: #{practiceFeedback.errorTag}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#e4e4e9] leading-relaxed">
                  {practiceFeedback.feedback}
                </p>

                {!practiceFeedback.isCorrect && (
                  <div className="text-xs text-[#9a9aa8] pt-1 border-t border-white/5 font-mono">
                    Accepted variant: &ldquo;{currentSentence.acceptedAnswers[0]}&rdquo;
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="chunky"
                    size="sm"
                    onClick={handleNextPracticeQuestion}
                    className="bg-white text-[#13151b] hover:bg-slate-200 border-slate-300"
                  >
                    {currentSentenceIndex < sentences.length - 1
                      ? "Next Question →"
                      : "View Lesson Results →"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: LESSON COMPLETE CELEBRATION                                      */}
      {/* ========================================================================= */}
      {currentStage === "complete" && (
        <div className="bento p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#58cc02]/20 border border-[#58cc02]/40 flex items-center justify-center text-[#58cc02] mx-auto shadow-xl shadow-[#58cc02]/20">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Lesson {lesson.lessonNumber} Practice Finished!
            </h2>
            <p className="text-xs sm:text-sm text-[#9a9aa8]">
              You scored{" "}
              <span className="text-white font-bold font-mono">
                {Math.round((practiceCorrectCount / Math.max(1, sentences.length)) * 100)}%
              </span>{" "}
              ({practiceCorrectCount} / {sentences.length} sentences correct).
            </p>
          </div>

          <div className="max-w-xs mx-auto bg-[#181a24] p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#9a9aa8]">Practice Mastery</span>
              <span className="text-white font-mono font-bold">
                {Math.round((practiceCorrectCount / Math.max(1, sentences.length)) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9a9aa8]">Passing Threshold</span>
              <span className="text-[#58cc02] font-mono">70% Required</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-[#9a9aa8]">Reward</span>
              <span className="chip text-[#58cc02] border-[#58cc02]/30 bg-[#58cc02]/10 font-bold text-[11px]">
                +25 Lesson Clear XP
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="chunkyOutline"
              onClick={() => {
                startPractice();
                setCurrentStage("practice");
              }}
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Retake Practice Drills
            </Button>
            <Button
              variant="chunky"
              onClick={() => router.push("/dashboard")}
              className="bg-[#58cc02] hover:bg-[#46a302] border-[#388202]"
            >
              Return to Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
