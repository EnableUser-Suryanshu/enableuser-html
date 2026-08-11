'use client';

import { useEffect, useState } from 'react';
import { PauseIcon, PlayIcon } from './icons';

const KEY = 'kml-motion-paused';

/**
 * Site-wide pause/resume for all decorative motion (WCAG 2.2.2 Pause, Stop, Hide).
 * Toggles `motion-paused` on <html>: CSS pauses every animation, and JS-driven
 * effects (ticker updates, notice rotation, typewriter) check the class too.
 */
export function motionPaused(): boolean {
  return document.documentElement.classList.contains('motion-paused');
}

export default function MotionToggle() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY) === '1';
    if (stored) document.documentElement.classList.add('motion-paused');
    setPaused(stored);
  }, []);

  const toggle = () => {
    // Derive from the DOM so the control never drifts from the actual state.
    const next = !document.documentElement.classList.contains('motion-paused');
    document.documentElement.classList.toggle('motion-paused', next);
    localStorage.setItem(KEY, next ? '1' : '0');
    setPaused(next);
  };

  return (
    <button
      className="motion-toggle"
      aria-pressed={paused}
      aria-label={paused ? 'Resume animations' : 'Pause animations'}
      title={paused ? 'Resume animations' : 'Pause animations'}
      onClick={toggle}
    >
      {paused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
    </button>
  );
}
