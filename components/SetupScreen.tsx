
import React, { useState, useCallback } from 'react';
import { Book, Level, Word, WordCount } from '../types';
import { BOOKS, LEVELS, WORD_COUNTS } from '../constants';
import { generateWords } from '../services/geminiService';

interface SetupScreenProps {
  onStart: (book: Book, level: Level, words: Word[]) => void;
  isLoading: boolean;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
  error: string | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading, onLoading, onError, error }) => {
  const [selectedBook, setSelectedBook] = useState<Book>(BOOKS[0]);
  const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS[0]);
  const [selectedCount, setSelectedCount] = useState<WordCount>(20);

  const handleGenerate = useCallback(async () => {
    onLoading(true);
    onError('');
    try {
      const words = await generateWords(selectedBook, selectedLevel, selectedCount);
      onStart(selectedBook, selectedLevel, words);
    } catch (err) {
      if (err instanceof Error) {
        onError(err.message);
      } else {
        onError("An unknown error occurred.");
      }
    } finally {
      onLoading(false);
    }
  }, [selectedBook, selectedLevel, selectedCount, onStart, onLoading, onError]);

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg w-full max-w-sm mx-auto animate-fade-in">
      <div className="space-y-6">
        <div>
          <label htmlFor="book-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Choose a Book
          </label>
          <select
            id="book-select"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value as Book)}
            className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {BOOKS.map((book) => (
              <option key={book} value={book}>
                {book}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Choose a Level
          </label>
          <select
            id="level-select"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as Level)}
            className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
         <div>
          <label htmlFor="count-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Number of Words
          </label>
          <select
            id="count-select"
            value={selectedCount}
            onChange={(e) => setSelectedCount(Number(e.target.value) as WordCount)}
            className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {WORD_COUNTS.map((count) => (
              <option key={count} value={count}>
                {count} Words
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
            {error}
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Words...
            </>
          ) : (
            'Start Studying'
          )}
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
