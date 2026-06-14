import { useRef, useCallback, useEffect } from 'react';

interface UsePointerEventsOptions {
  onSingleClick?: () => void;
  onDoubleClick?: () => void;
  onLongPress?: () => void;
  longPressDelay?: number;
  doubleClickDelay?: number;
  moveThreshold?: number;
}

interface GestureHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
}

export function usePointerEvents(
  options: UsePointerEventsOptions
): GestureHandlers {
  const {
    onSingleClick,
    onDoubleClick,
    onLongPress,
    longPressDelay = 600,
    doubleClickDelay = 300,
    moveThreshold = 10,
  } = options;

  const pointerStartTimeRef = useRef<number | null>(null);
  const pointerStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const longPressTimerRef = useRef<number | null>(null);
  const singleClickTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);

  // 清理所有计时器
  const clearAllTimers = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (singleClickTimerRef.current !== null) {
      clearTimeout(singleClickTimerRef.current);
      singleClickTimerRef.current = null;
    }
  }, []);

  // 处理指针按下
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // 忽略非主按钮点击
      if (e.button !== 0) return;

      clearAllTimers();
      longPressTriggeredRef.current = false;
      hasMovedRef.current = false;

      pointerStartTimeRef.current = Date.now();
      pointerStartPosRef.current = { x: e.clientX, y: e.clientY };

      // 设置长按计时器
      if (onLongPress) {
        longPressTimerRef.current = window.setTimeout(() => {
          if (!hasMovedRef.current) {
            longPressTriggeredRef.current = true;
            onLongPress();
          }
        }, longPressDelay);
      }
    },
    [clearAllTimers, onLongPress, longPressDelay]
  );

  // 处理指针移动
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStartPosRef.current) return;

      const dx = e.clientX - pointerStartPosRef.current.x;
      const dy = e.clientY - pointerStartPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > moveThreshold) {
        hasMovedRef.current = true;
        clearAllTimers();
      }
    },
    [moveThreshold, clearAllTimers]
  );

  // 处理指针抬起
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      // 忽略非主按钮点击
      if (e.button !== 0) return;

      // 清除长按计时器
      if (longPressTimerRef.current !== null) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      // 如果长按已触发,不处理点击
      if (longPressTriggeredRef.current) {
        return;
      }

      // 如果有移动,不处理点击
      if (hasMovedRef.current) {
        return;
      }

      const now = Date.now();
      const timeSinceLastClick = now - lastClickTimeRef.current;

      // 检查是否是双击
      if (timeSinceLastClick < doubleClickDelay && onDoubleClick) {
        // 清除待处理的单击
        if (singleClickTimerRef.current !== null) {
          clearTimeout(singleClickTimerRef.current);
          singleClickTimerRef.current = null;
        }
        lastClickTimeRef.current = 0;
        onDoubleClick();
        return;
      }

      // 记录这次点击时间
      lastClickTimeRef.current = now;

      // 延迟触发单击,等待可能的第二次点击
      if (onSingleClick) {
        singleClickTimerRef.current = window.setTimeout(() => {
          if (!longPressTriggeredRef.current) {
            onSingleClick();
          }
        }, doubleClickDelay);
      }
    },
    [doubleClickDelay, onSingleClick, onDoubleClick]
  );

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerMove: handlePointerMove,
  };
}
