"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 4000;
const ANIMATION_DURATION = 300;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const dismissToast = useCallback(() => {
    if (document.activeElement === dismissButtonRef.current) {
      const returnTarget = returnFocusRef.current;

      if (returnTarget?.isConnected) {
        returnTarget.focus();
      } else {
        document.getElementById("main-content")?.focus();
      }
    }

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsVisible(false);

    if (animationRef.current !== null) {
      clearTimeout(animationRef.current);
    }

    animationRef.current = setTimeout(() => {
      setMessage(null);
      animationRef.current = null;
    }, ANIMATION_DURATION);
  }, []);

  const showToast = useCallback(
    (nextMessage: string) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      if (animationRef.current !== null) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }

      const activeElement = document.activeElement;

      if (
        activeElement instanceof HTMLElement &&
        activeElement !== dismissButtonRef.current
      ) {
        returnFocusRef.current = activeElement;
      }

      setMessage(nextMessage);
      setIsVisible(true);

      timeoutRef.current = setTimeout(() => {
        dismissToast();
      }, TOAST_DURATION);
    },
    [dismissToast],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      if (animationRef.current !== null) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {message !== null && (
        <div
          role={isVisible ? "status" : undefined}
          aria-live="polite"
          aria-hidden={!isVisible}
          className={`fixed bottom-6 right-6 z-50 flex max-w-[calc(100vw-3rem)] items-center gap-3 rounded-lg border border-zinc-400 bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-8 opacity-0"
          }`}
        >
          <span aria-hidden="true" className="text-teal-400">
            ✓
          </span>

          <span>{message}</span>

          <button
            ref={dismissButtonRef}
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            tabIndex={isVisible ? 0 : -1}
            className="ml-2 cursor-pointer rounded p-1 text-zinc-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
          >
            ×
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
