import { useEffect, useRef } from 'react';

const SWIPE_THRESHOLD = 50;

export function useSwipe(onSwipe: (direction: "up" | "down" | "left" | "right") => void) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      
      if (Math.abs(deltaX) < SWIPE_THRESHOLD && Math.abs(deltaY) < SWIPE_THRESHOLD) return;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        onSwipe(deltaX > 0 ? "right" : "left");
      } else {
        onSwipe(deltaY > 0 ? "down" : "up");
      }

      touchStart.current = null;
    }

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipe]);
}