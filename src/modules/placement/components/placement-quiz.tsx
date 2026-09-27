'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlacementQuestion, QuizAnswer, PlacementResult } from '../types';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, SlidersHorizontal, Loader2, Check } from 'lucide-react';

interface PlacementQuizProps {
  questions: PlacementQuestion[];
  currentStartingLesson?: number;
}

export function PlacementQuiz({ questions, currentStartingLesson = 1 }: PlacementQuizProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);

  // Manual Override State
  const [showOverride, setShowOverride] = useState(false);
  const [selectedOverrideLesson, setSelectedOverrideLesson] = useState<number>(currentStartingLesson);
  const [savingOverride, setSavingOverride] = useState(false);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const currentAnswer = answers[currentQ?.id];

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Final submission
      setSubmitting(true);
      try {
        const payloadAnswers: QuizAnswer[] = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        }));

        const res = await fetch('/api/placement/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: payloadAnswers }),
        });

        const json = await res.json();
        if (json.data) {
          setResult(json.data);
          setSelectedOverrideLesson(json.data.suggestedLesson);
        }
      } catch (err) {
        console.error('Submission failed:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleConfirmLevel = () => {
    router.push('/dashboard');
    router.refresh();
  };

  const handleSaveOverride = async () => {
    setSavingOverride(true);
    try {
      await fetch('/api/placement/override', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetLesson: selectedOverrideLesson }),
      });
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Failed to save override:', err);
    } finally {
      setSavingOverride(false);
    }
  };

  // Result View
  if (result) {
    return (
      <div className='max-w-2xl mx-auto space-y-6'>
        <div
          className='bento p-6 sm:p-8 text-center space-y-6 shadow-2xl'
          style={{ '--card-glow': 'rgba(88, 204, 2, 0.35)' } as React.CSSProperties}
        >
          <div className='w-16 h-16 rounded-2xl bg-[#58cc02]/20 border border-[#58cc02]/30 mx-auto flex items-center justify-center text-3xl shadow-xl shadow-[#58cc02]/20'>
            🦊
          </div>

          <div className='space-y-2'>
            <span className='chip text-[#58cc02]'>
              <Sparkles className='w-3.5 h-3.5' />
              Assessment Complete
            </span>
            <h2 className='text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight'>
              Recommended: {result.levelLabel}
            </h2>
            <p className='text-xs sm:text-sm text-[#9a9aa8] max-w-lg mx-auto leading-relaxed'>{result.summary}</p>
          </div>

          {/* Metric cards */}
          <div className='grid grid-cols-2 gap-4 py-2'>
            <div className='p-4 rounded-xl bg-[#181826] border border-white/5'>
              <span className='text-xs text-[#9a9aa8] block font-semibold'>Starting Lesson</span>
              <span className='text-3xl font-display font-extrabold text-white'>Lesson {result.suggestedLesson}</span>
            </div>
            <div className='p-4 rounded-xl bg-[#181826] border border-white/5'>
              <span className='text-xs text-[#9a9aa8] block font-semibold'>Assessment Score</span>
              <span className='text-3xl font-display font-extrabold text-[#58cc02]'>{result.score} pts</span>
            </div>
          </div>

          <div className='pt-2 flex flex-col sm:flex-row items-center justify-center gap-3'>
            <Button variant='chunky' size='lg' onClick={handleConfirmLevel} className='w-full sm:w-auto text-base'>
              Start at Lesson {result.suggestedLesson} 🦊
              <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
            <Button
              variant='chunkyOutline'
              size='lg'
              onClick={() => setShowOverride(!showOverride)}
              className='w-full sm:w-auto text-base'
            >
              <SlidersHorizontal className='w-4 h-4 mr-2 text-[#1cb0f6]' />
              Choose Another Lesson
            </Button>
          </div>
        </div>

        {/* Manual Override Accordion */}
        {showOverride && (
          <div
            className='bento p-6 space-y-4'
            style={{ '--card-glow': 'rgba(28, 176, 246, 0.3)' } as React.CSSProperties}
          >
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-display font-bold text-white'>Manual Level Selection</h3>
              <span className='text-xs text-[#9a9aa8]'>Adjustable anytime</span>
            </div>
            <p className='text-xs text-[#9a9aa8]'>
              Prefer to start from scratch or jump directly to specific grammar points? Pick your preferred starting
              lesson:
            </p>

            <div className='grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2'>
              {[1, 2, 3, 4, 5].map((lessonNum) => (
                <button
                  key={lessonNum}
                  type='button'
                  onClick={() => setSelectedOverrideLesson(lessonNum)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedOverrideLesson === lessonNum
                      ? 'border-[#58cc02] bg-[#58cc02]/15 text-white font-bold shadow-md shadow-[#58cc02]/20'
                      : 'border-white/10 bg-[#181826] text-[#9a9aa8] hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className='block text-[10px] uppercase font-bold text-[#9a9aa8]'>Track</span>
                  <span className='text-base font-display font-bold'>Lesson {lessonNum}</span>
                </button>
              ))}
            </div>

            <div className='pt-2 flex justify-end'>
              <Button variant='chunkyBlue' size='sm' onClick={handleSaveOverride} disabled={savingOverride}>
                {savingOverride ? (
                  <>
                    <Loader2 className='w-3.5 h-3.5 animate-spin mr-1.5' />
                    Saving...
                  </>
                ) : (
                  <>
                    Confirm Lesson {selectedOverrideLesson}
                    <Check className='w-3.5 h-3.5 ml-1.5' />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quiz Stepper View
  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      {/* Progress Bar & Header */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between text-xs text-[#9a9aa8]'>
          <span className='font-extrabold text-[#58cc02] uppercase tracking-wider flex items-center gap-1.5'>
            <span>🦊</span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className='font-bold text-white'>{progressPercent}% Complete</span>
        </div>
        <div className='w-full h-2 rounded-full bg-[#181826] overflow-hidden p-0.5 border border-white/5'>
          <div
            className='h-full rounded-full bg-linear-to-r from-[#58cc02] to-[#1cb0f6] transition-all duration-300'
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Bento Card */}
      <div
        className='bento p-6 sm:p-8 space-y-6 shadow-2xl'
        style={{ '--card-glow': 'rgba(88, 204, 2, 0.2)' } as React.CSSProperties}
      >
        <div>
          <span className='chip text-[#1cb0f6] uppercase tracking-wider text-[10px] font-extrabold'>
            {currentQ.category}
          </span>
          <h2 className='text-xl sm:text-2xl font-display font-extrabold text-white mt-3 tracking-tight leading-snug'>
            {currentQ.title}
          </h2>
          {currentQ.subtitle && <p className='text-xs text-[#9a9aa8] mt-1 font-sans'>{currentQ.subtitle}</p>}
        </div>

        {/* Options */}
        <div className='space-y-3'>
          {currentQ.options.map((opt) => {
            const isSelected = currentAnswer === opt.id;
            return (
              <button
                key={opt.id}
                type='button'
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-[#58cc02] bg-[#58cc02]/15 text-white shadow-lg shadow-[#58cc02]/15'
                    : 'border-white/10 bg-[#181826] text-[#9a9aa8] hover:border-white/20 hover:text-white'
                }`}
              >
                <div className='space-y-0.5'>
                  <div className='font-bold text-sm sm:text-base text-white font-sans'>{opt.label}</div>
                  {opt.sublabel && <div className='text-xs text-[#9a9aa8] leading-relaxed'>{opt.sublabel}</div>}
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected ? 'border-[#58cc02] bg-[#58cc02] text-white' : 'border-white/20 bg-[#14141f]'
                  }`}
                >
                  {isSelected && <CheckCircle2 className='w-3.5 h-3.5' />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className='flex items-center justify-between pt-4 border-t border-white/5'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className='text-xs'
          >
            <ArrowLeft className='w-4 h-4 mr-1.5' />
            Previous
          </Button>

          <Button
            type='button'
            variant='chunky'
            size='default'
            onClick={handleNext}
            disabled={!currentAnswer || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Evaluating...
              </>
            ) : currentIndex === questions.length - 1 ? (
              <>
                Complete Assessment 🦊
                <Sparkles className='w-4 h-4 ml-1.5' />
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className='w-4 h-4 ml-1.5' />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
