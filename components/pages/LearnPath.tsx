'use client';

import { useState } from 'react';
import { ChevronDown } from '../icons';

export interface Step {
  title: string;
  summary: string;
  points: string[];
}

/** Expandable numbered learning path for first-time investors. */
export default function LearnPath({ steps }: { steps: Step[] }) {
  const [open, setOpen] = useState<number>(0);

  return (
    <ol className="lpath">
      {steps.map((s, i) => {
        const isOpen = open === i;
        return (
          <li className={`lstep${isOpen ? ' open' : ''}`} key={s.title}>
            <button
              className="lstep-head"
              aria-expanded={isOpen}
              aria-controls={`lstep-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="lstep-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="lstep-t">
                <span className="lstep-title">{s.title}</span>
                <span className="lstep-sum">{s.summary}</span>
              </span>
              <span className="lstep-chev" aria-hidden="true">
                <ChevronDown size={16} strokeW={2.4} />
              </span>
            </button>
            <div className="lstep-body" id={`lstep-${i}`}>
              <div>
                <ul>
                  {s.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
