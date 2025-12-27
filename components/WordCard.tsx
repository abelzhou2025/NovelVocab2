
import React, { useState, useRef, useEffect, memo } from 'react';
import { Word } from '../types';

interface WordCardProps {
  word: Word;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  isActive: boolean;
  zIndex: number;
}

const SWIPE_THRESHOLD_X = 100;
const SWIPE_THRESHOLD_Y = -120;

const WordCard: React.FC<WordCardProps> = ({ word, onSwipe, isActive, zIndex }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const rotation = position.x * 0.1;
  const opacity = 1 - Math.abs(position.x) / 200;

  const handleDragStart = (clientX: number, clientY: number) => {
    if (!isActive) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isActive) return;
    const dx = clientX - startPos.x;
    const dy = clientY - startPos.y;
    setPosition({ x: dx, y: dy });
  };

  const handleDragEnd = () => {
    if (!isDragging || !isActive) return;
    setIsDragging(false);

    if (position.y < SWIPE_THRESHOLD_Y) {
      onSwipe('up');
    } else if (position.x > SWIPE_THRESHOLD_X) {
      onSwipe('right');
    } else if (position.x < -SWIPE_THRESHOLD_X) {
      onSwipe('left');
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX, e.clientY);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => handleDragEnd();

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchEnd = () => handleDragEnd();
  
  useEffect(() => {
     setPosition({ x: 0, y: 0 });
  }, [word]);

  const dynamicStyle = {
    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${isActive ? 1 : 0.95})`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    opacity: isActive ? opacity : 1,
    zIndex: zIndex,
    top: isActive ? 0 : `${(3-zIndex) * -10}px`
  };

  let borderColorClass = 'border-transparent';
  if (isDragging) {
    if (position.y < SWIPE_THRESHOLD_Y * 0.7) {
      borderColorClass = 'border-blue-500';
    } else if (position.x > SWIPE_THRESHOLD_X * 0.7) {
      borderColorClass = 'border-green-500';
    } else if (position.x < -SWIPE_THRESHOLD_X * 0.7) {
      borderColorClass = 'border-red-500';
    }
  }


  return (
    <div
      ref={cardRef}
      className={`absolute w-full h-full p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col justify-center items-center text-center cursor-grab select-none border-4 ${borderColorClass} transition-all duration-200 ${isActive ? 'cursor-grabbing' : ''} will-change-transform`}
      style={dynamicStyle}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <h2 className="text-5xl font-bold text-slate-800 dark:text-white mb-2">{word.word}</h2>
      <p className="text-xl text-slate-500 dark:text-slate-400 mb-6">{word.pronunciation}</p>
      <p className="text-2xl text-indigo-600 dark:text-indigo-400 font-medium font-chinese">{word.translation}</p>
    </div>
  );
};

export default memo(WordCard);
