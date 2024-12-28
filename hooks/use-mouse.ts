import { useEffect, useRef } from 'react';

const DRAG_THRESHOLD = 50;

export function useDrag(onDrag: (direction: "up" | "down" | "left" | "right") => void) {
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
    }

    function handleMouseUp(e: MouseEvent) {
      if (!isDragging.current || !dragStart.current) return;

      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;

      if (Math.abs(deltaX) < DRAG_THRESHOLD && Math.abs(deltaY) < DRAG_THRESHOLD) return;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        onDrag(deltaX > 0 ? "right" : "left");
      } else {
        onDrag(deltaY > 0 ? "down" : "up");
      }

      isDragging.current = false;
      dragStart.current = null;
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onDrag]);
}