
import React, { useState, useCallback } from 'react';
import SetupScreen from './components/SetupScreen';
import StudyScreen from './components/StudyScreen';
import { Book, Level, Word } from './types';

const App: React.FC = () => {
  const [words, setWords] = useState<Word[] | null>(null);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartStudy = useCallback((book: Book, level: Level, generatedWords: Word[]) => {
    setCurrentBook(book);
    setCurrentLevel(level);
    setWords(generatedWords);
    setIsLoading(false);
  }, []);

  const handleGoToSetup = useCallback(() => {
    setWords(null);
    setCurrentBook(null);
    setCurrentLevel(null);
    setError(null);
  }, []);
  
  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };
  
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">NovelVocab</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Master vocabulary from classic literature.</p>
        </header>
        <main className="w-full">
          {!words ? (
            <SetupScreen 
              onStart={handleStartStudy} 
              isLoading={isLoading}
              onLoading={handleLoading}
              onError={handleError}
              error={error}
            />
          ) : (
            <StudyScreen 
              words={words} 
              book={currentBook!} 
              level={currentLevel!} 
              onBack={handleGoToSetup} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
