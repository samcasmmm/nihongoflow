'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { KanaCardWithProgress, DeckStats } from '@/modules/decks/repositories/deck-repository';
import { Button } from '@/components/ui/button';
import {
  RotateCcw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Sparkles,
  Info,
  Layers,
  ArrowLeft,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  initialCards: KanaCardWithProgress[];
  initialStats: DeckStats;
}

type CategoryTab = 'all' | 'base' | 'dakuten' | 'yoon';

export function HiraganaDeck({ initialCards, initialStats }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('all');
  const [cards, setCards] = useState<KanaCardWithProgress[]>(initialCards);
  const [stats, setStats] = useState<DeckStats>(initialStats);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [xpToast, setXpToast] = useState<{ show: boolean; text: string }>({
    show: false,
    text: '',
  });
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0);
  const [sessionXpEarned, setSessionXpEarned] = useState(0);
  const [, startTransition] = useTransition();

  // Filter cards based on selected category tab
  const filterCards = useCallback((category: CategoryTab, cardList: KanaCardWithProgress[]) => {
    if (category === 'all') return cardList;
    if (category === 'dakuten') {
      return cardList.filter((c) => c.category === 'dakuten' || c.category === 'handakuten');
    }
    return cardList.filter((c) => c.category === category);
  }, []);

  const displayedCards = React.useMemo(() => {
    return filterCards(selectedCategory, cards);
  }, [cards, selectedCategory, filterCards]);

  const currentCard = displayedCards[currentIndex] || displayedCards[0];

  const handleCategoryChange = (cat: CategoryTab) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < displayedCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, displayedCards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const showToast = useCallback((text: string) => {
    setXpToast({ show: true, text });
    setTimeout(() => {
      setXpToast({ show: false, text: '' });
    }, 2200);
  }, []);

  const handleShuffle = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    showToast('Deck shuffled 🔀');
  }, [cards, showToast]);

  const submitProgress = useCallback(
    async (action: 'know_it' | 'still_learning') => {
      if (!currentCard) return;

      const cardId = currentCard.id;
      const oldBox = currentCard.box;

      // Optimistic state update
      const newBox = action === 'know_it' ? Math.min(5, oldBox + 1) : 1;

      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? {
                ...c,
                box: newBox,
                timesReviewed: c.timesReviewed + 1,
                timesCorrect: c.timesCorrect + (action === 'know_it' ? 1 : 0),
              }
            : c,
        ),
      );

      // Update stats
      setStats((prev) => {
        const dist = { ...prev.boxDistribution };
        const oldKey = `box${oldBox}` as keyof typeof dist;
        const newKey = `box${newBox}` as keyof typeof dist;
        dist[oldKey] = Math.max(0, dist[oldKey] - 1);
        dist[newKey] = (dist[newKey] || 0) + 1;
        return {
          ...prev,
          boxDistribution: dist,
          masteredCount: newBox === 5 ? prev.masteredCount + 1 : prev.masteredCount,
        };
      });

      setSessionReviewedCount((prev) => prev + 1);
      setSessionXpEarned((prev) => prev + 1);

      if (action === 'know_it') {
        showToast(`+1 XP • Advanced to Box ${newBox} 🎯`);
      } else {
        showToast('+1 XP • Queued for reinforcement (Box 1) 🔁');
      }

      // Advance to next card
      if (currentIndex < displayedCards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      }

      // Call server API in background
      startTransition(async () => {
        try {
          await fetch(`/api/cards/${cardId}/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardType: 'kana', action }),
          });
        } catch (err) {
          console.error('Failed to sync card progress:', err);
        }
      });
    },
    [currentCard, currentIndex, displayedCards.length, showToast],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === '1') {
        submitProgress('still_learning');
      } else if (e.key === '2') {
        submitProgress('know_it');
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      } else if (e.key.toLowerCase() === 's') {
        handleShuffle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleShuffle, submitProgress]);

  const boxColors = [
    { label: 'Box 1: Learning', bg: 'bg-rose-500/20', border: 'border-rose-500/40', text: 'text-rose-400' },
    { label: 'Box 2: Review', bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400' },
    { label: 'Box 3: Familiar', bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400' },
    { label: 'Box 4: Strong', bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' },
    { label: 'Box 5: Mastered', bg: 'bg-[#58cc02]/20', border: 'border-[#58cc02]/40', text: 'text-[#58cc02]' },
  ];

  return (
    <div className='space-y-6 max-w-4xl mx-auto'>
      {/* Header and Back Link */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='space-y-1'>
          <Link
            href='/dashboard'
            className='inline-flex items-center gap-1.5 text-xs text-[#9a9aa8] hover:text-white transition-colors'
          >
            <ArrowLeft className='w-3.5 h-3.5' />
            Back to Dashboard
          </Link>
          <h1 className='text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2'>
            <span>Hiragana Flashcards</span>
            <span className='text-xs font-mono font-normal chip text-[#ff9600] border-[#ff9600]/30 bg-[#ff9600]/10'>
              Leitner System
            </span>
          </h1>
        </div>

        {/* Live Session Counter */}
        <div className='flex items-center gap-3'>
          <div className='chip text-[#58cc02] border-[#58cc02]/30 bg-[#58cc02]/10 font-mono text-xs flex items-center gap-1.5'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>+{sessionXpEarned} XP this session</span>
          </div>
          <div className='chip text-[#9a9aa8] border-white/10 bg-white/5 font-mono text-xs'>
            {sessionReviewedCount} cards reviewed
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-white text-[#13151b] shadow-md'
                : 'text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            All Decks (104)
          </button>
          <button
            onClick={() => handleCategoryChange('base')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'base'
                ? 'bg-[#ff9600] text-white shadow-md shadow-[#ff9600]/20'
                : 'text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            Base 46 (あ-ん)
          </button>
          <button
            onClick={() => handleCategoryChange('dakuten')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'dakuten'
                ? 'bg-[#1cb0f6] text-white shadow-md shadow-[#1cb0f6]/20'
                : 'text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            Dakuten & Handakuten (25)
          </button>
          <button
            onClick={() => handleCategoryChange('yoon')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'yoon'
                ? 'bg-[#ce82ff] text-white shadow-md shadow-[#ce82ff]/20'
                : 'text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            Yōon Blends (33)
          </button>
        </div>

        <button
          onClick={handleShuffle}
          className='inline-flex items-center gap-1.5 text-xs text-[#9a9aa8] hover:text-white bg-white/5 px-2.5 py-1.5 rounded-xl transition-colors'
          title='Shuffle Deck (Press S)'
        >
          <Shuffle className='w-3.5 h-3.5 text-[#ff9600]' />
          <span>Shuffle (S)</span>
        </button>
      </div>

      {/* Leitner Box Distribution Stats Bar */}
      <div className='bento p-3 bg-white/2 border-white/5'>
        <div className='flex items-center justify-between text-xs text-[#9a9aa8] mb-2 font-mono'>
          <div className='flex items-center gap-1.5'>
            <Layers className='w-3.5 h-3.5 text-[#1cb0f6]' />
            <span>Spaced Repetition Mastery Distribution</span>
          </div>
          <span className='text-[#58cc02] font-bold'>
            {stats.masteredCount} / {stats.totalCards} Mastered (Box 5)
          </span>
        </div>
        <div className='grid grid-cols-5 gap-2'>
          {boxColors.map((box, idx) => {
            const bNum = idx + 1;
            const count = stats.boxDistribution[`box${bNum}` as keyof typeof stats.boxDistribution] || 0;
            return (
              <div key={bNum} className={`rounded-lg p-2 border ${box.bg} ${box.border} text-center transition-all`}>
                <div className={`text-xs font-mono font-bold ${box.text}`}>Box {bNum}</div>
                <div className='text-sm font-extrabold text-white mt-0.5'>{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating XP / Feedback Toast */}
      {xpToast.show && (
        <div className='fixed bottom-8 right-8 z-50 animate-bounce bg-[#1a1d26] border border-[#58cc02]/40 text-white px-4 py-2.5 rounded-2xl shadow-xl shadow-[#58cc02]/10 flex items-center gap-2'>
          <Sparkles className='w-4 h-4 text-[#58cc02]' />
          <span className='text-xs font-bold'>{xpToast.text}</span>
        </div>
      )}

      {/* Main Flashcard Section */}
      {displayedCards.length > 0 && currentCard ? (
        <div className='space-y-4'>
          {/* Card Progress Indicator */}
          <div className='flex items-center justify-between text-xs text-[#9a9aa8]'>
            <span className='font-mono'>
              Card {currentIndex + 1} of {displayedCards.length}
            </span>
            <span className='chip text-white border-white/10 bg-white/5 text-[11px] font-mono'>
              Row: {currentCard.rowGroup}
            </span>
          </div>

          {/* 3D Tactile Card Container */}
          <div
            onClick={handleFlip}
            className='cursor-pointer perspective-1000 select-none group min-h-85 sm:min-h-95 w-full'
            style={{ perspective: '1200px' }}
          >
            <div
              className={`relative w-full h-full min-h-85 sm:min-h-95 transition-transform duration-500 rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col justify-between ${
                isFlipped ? 'bg-[#181a24] border-[#1cb0f6]/40' : 'bg-[#14161f] border-white/10'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* FRONT FACE */}
              <div
                className={`absolute inset-0 p-8 flex flex-col justify-between ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
                } transition-opacity duration-300`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className='flex items-center justify-between'>
                  <span
                    className={`chip text-[11px] font-mono font-bold ${
                      boxColors[currentCard.box - 1].bg
                    } ${boxColors[currentCard.box - 1].border} ${boxColors[currentCard.box - 1].text}`}
                  >
                    {boxColors[currentCard.box - 1].label}
                  </span>

                  <span className='chip text-[11px] text-[#9a9aa8] border-white/10 bg-white/5 uppercase'>
                    {currentCard.category}
                  </span>
                </div>

                {/* Big Character Display */}
                <div className='text-center py-6'>
                  <div className='text-7xl sm:text-9xl font-display font-extrabold text-white tracking-wider filter drop-shadow-[0_10px_20px_rgba(255,255,255,0.08)]'>
                    {currentCard.character}
                  </div>
                  <div className='mt-4 text-xs font-mono text-[#9a9aa8]/80'>
                    Click card or press <kbd className='px-1.5 py-0.5 rounded bg-white/10 text-white'>Space</kbd> to
                    flip
                  </div>
                </div>

                <div className='flex items-center justify-between text-xs text-[#9a9aa8] border-t border-white/5 pt-3'>
                  <span>Reviewed {currentCard.timesReviewed} times</span>
                  <span>
                    Accuracy:{' '}
                    {currentCard.timesReviewed > 0
                      ? Math.round((currentCard.timesCorrect / currentCard.timesReviewed) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              {/* BACK FACE */}
              <div
                className={`absolute inset-0 p-8 flex flex-col justify-between ${
                  !isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
                } transition-opacity duration-300`}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-2xl font-display font-extrabold text-white'>{currentCard.character}</span>
                  <span className='text-xl sm:text-2xl font-mono font-black text-[#1cb0f6] bg-[#1cb0f6]/10 px-3 py-1 rounded-xl border border-[#1cb0f6]/30'>
                    /{currentCard.romaji}/
                  </span>
                </div>

                {/* Mnemonic and Example Word */}
                <div className='space-y-4 py-3'>
                  {currentCard.mnemonic && (
                    <div className='bg-[#1e2029] p-3.5 rounded-2xl border border-white/5 space-y-1'>
                      <div className='flex items-center gap-1.5 text-xs text-[#ff9600] font-bold'>
                        <Sparkles className='w-3.5 h-3.5' />
                        <span>Visual Mnemonic</span>
                      </div>
                      <p className='text-sm text-[#e4e4e9] leading-relaxed'>{currentCard.mnemonic}</p>
                    </div>
                  )}

                  {currentCard.exampleWord && (
                    <div className='bg-[#1e2029] p-3.5 rounded-2xl border border-white/5 space-y-1'>
                      <div className='flex items-center gap-1.5 text-xs text-[#58cc02] font-bold'>
                        <Info className='w-3.5 h-3.5' />
                        <span>Example Vocabulary</span>
                      </div>
                      <div className='flex items-baseline justify-between'>
                        <span className='text-base font-bold text-white font-sans'>
                          {currentCard.exampleWord}{' '}
                          <span className='text-xs text-[#9a9aa8] font-mono'>({currentCard.exampleReading})</span>
                        </span>
                        <span className='text-xs text-[#1cb0f6] font-medium'>{currentCard.exampleMeaning}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className='flex items-center justify-between text-xs text-[#9a9aa8] border-t border-white/5 pt-3'>
                  <span>
                    Press <kbd className='px-1.5 py-0.5 rounded bg-white/10 text-white'>1</kbd> Still Learning
                  </span>
                  <span>
                    Press <kbd className='px-1.5 py-0.5 rounded bg-white/10 text-white'>2</kbd> Know It
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Decision Buttons (Know It / Still Learning) */}
          <div className='grid grid-cols-2 gap-4'>
            <button
              onClick={() => submitProgress('still_learning')}
              className='py-4 px-6 rounded-2xl bg-[#ea2b2b]/15 hover:bg-[#ea2b2b]/25 border-2 border-[#ea2b2b]/40 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] group'
            >
              <div className='w-6 h-6 rounded-lg bg-[#ea2b2b]/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform'>
                <X className='w-4 h-4' />
              </div>
              <div className='text-left'>
                <div className='text-sm'>Still Learning</div>
                <div className='text-[10px] text-[#9a9aa8] font-mono'>Reset to Box 1 • Key [1]</div>
              </div>
            </button>

            <button
              onClick={() => submitProgress('know_it')}
              className='py-4 px-6 rounded-2xl bg-[#58cc02]/15 hover:bg-[#58cc02]/25 border-2 border-[#58cc02]/40 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] group'
            >
              <div className='w-6 h-6 rounded-lg bg-[#58cc02]/20 flex items-center justify-center text-[#58cc02] group-hover:scale-110 transition-transform'>
                <Check className='w-4 h-4' />
              </div>
              <div className='text-left'>
                <div className='text-sm'>Know It!</div>
                <div className='text-[10px] text-[#9a9aa8] font-mono'>Next Box + 1 XP • Key [2]</div>
              </div>
            </button>
          </div>

          {/* Prev / Flip / Next Nav Controls */}
          <div className='flex items-center justify-between pt-2'>
            <Button variant='chunkyOutline' size='sm' onClick={handlePrev} disabled={currentIndex === 0}>
              <ChevronLeft className='w-4 h-4 mr-1' />
              Prev [←]
            </Button>

            <Button variant='chunkyOutline' size='sm' onClick={handleFlip} className='border-white/20'>
              <RotateCcw className='w-4 h-4 mr-1' />
              Flip Card [Space]
            </Button>

            <Button
              variant='chunkyOutline'
              size='sm'
              onClick={handleNext}
              disabled={currentIndex === displayedCards.length - 1}
            >
              Next [→]
              <ChevronRight className='w-4 h-4 ml-1' />
            </Button>
          </div>
        </div>
      ) : (
        <div className='bento p-12 text-center space-y-4'>
          <Trophy className='w-12 h-12 text-[#ff9600] mx-auto' />
          <h2 className='text-xl font-bold text-white'>Deck Complete!</h2>
          <p className='text-sm text-[#9a9aa8] max-w-md mx-auto'>
            You reviewed all cards in this category. Continue practicing to maintain memory stability.
          </p>
          <Button variant='chunky' onClick={() => setCurrentIndex(0)}>
            Review Again
          </Button>
        </div>
      )}
    </div>
  );
}
