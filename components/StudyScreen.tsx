
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import WordCard from './WordCard';
import { Book, Level, Word } from '../types';

interface StudyScreenProps {
  words: Word[];
  book: Book;
  level: Level;
  onBack: () => void;
}

const StudyScreen: React.FC<StudyScreenProps> = ({ words, book, level, onBack }) => {
  const [deck, setDeck] = useState<Word[]>([]);
  const [reviewPile, setReviewPile] = useState<Word[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);

  useEffect(() => {
    // Shuffle words and initialize the deck
    setDeck([...words].sort(() => Math.random() - 0.5));
    setCompletedCount(0);
    setReviewPile([]);
    setShowSummary(false);
    setKnownCount(0);
    setUnknownCount(0);
  }, [words]);

  const handleSwipe = useCallback((word: Word, direction: 'left' | 'right' | 'up') => {
    const newDeck = deck.slice(1);
    
    if (direction === 'up') {
      // Mastered, remove from session
      setCompletedCount(prev => prev + 1);
    } else if (direction === 'right') {
      // Knew it, remove from session
      setKnownCount(prev => prev + 1);
      setCompletedCount(prev => prev + 1);
    } else if (direction === 'left') {
      // Didn't know it, add to review pile
      setUnknownCount(prev => prev + 1);
      setReviewPile(prev => [...prev, word]);
    }
    
    // Logic to re-insert review words
    if (newDeck.length > 0 && reviewPile.length > 0 && Math.random() < 0.4) { // 40% chance to insert review card
      const reviewWord = reviewPile[0];
      setReviewPile(prev => prev.slice(1));
      const insertIndex = Math.min(newDeck.length, Math.floor(Math.random() * 3) + 2); // Insert 2-4 cards away
      newDeck.splice(insertIndex, 0, reviewWord);
    }

    setDeck(newDeck);

    if (newDeck.length === 0 && reviewPile.length === 0) {
      setShowSummary(true);
    }
  }, [deck, reviewPile]);

  const currentWord = useMemo(() => deck.length > 0 ? deck[0] : null, [deck]);

  if (showSummary) {
    return (
      <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg w-full max-w-sm mx-auto animate-fade-in">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Session Complete!</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">You've reviewed all the words for this session.</p>
        <div className="mt-6 space-y-2 text-left">
            <p><strong className="text-slate-800 dark:text-white">Total words:</strong> {words.length}</p>
            <p><strong className="text-green-500">Knew:</strong> {knownCount}</p>
            <p><strong className="text-red-500">Didn't know:</strong> {unknownCount}</p>
            <p><strong className="text-blue-500">Mastered:</strong> {completedCount - knownCount}</p>
        </div>
        <button onClick={onBack} className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition">
          Start New Session
        </button>
      </div>
    );
  }

  const progress = (completedCount / words.length) * 100;
  const visibleCards = deck.slice(0, 3).reverse();

  return (
    <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-sm relative">
            <div className="flex justify-between items-center mb-4">
                 <button onClick={onBack} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    &larr; Change Deck
                </button>
                 <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{completedCount} / {words.length}</span>
            </div>
           
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-6">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
            </div>

            <div className="relative h-96 w-full flex items-center justify-center">
                {visibleCards.map((word, index) => (
                    <WordCard
                        key={word.id}
                        word={word}
                        onSwipe={(direction) => handleSwipe(word, direction)}
                        isActive={index === visibleCards.length - 1}
                        zIndex={index}
                    />
                ))}
                {!currentWord && !showSummary && (
                   <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                      <p className="text-lg text-slate-500 dark:text-slate-400">Loading words...</p>
                    </div>
                )}
            </div>
             <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 px-4">
                <p>Swipe Left: Don't Know | Swipe Right: Know | Swipe Up: Mastered</p>
            </div>
        </div>
    </div>
  );
};

export default StudyScreen;
