'use client';

import { useState } from 'react';
import { FAQ_LEFT, FAQ_RIGHT, type FaqItem } from '@/lib/data';
import { ChevronDown } from './icons';

function Column({ items, col }: { items: FaqItem[]; col: string }) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="faq-col stagger">
      {items.map((item, i) => {
        const open = openSet.has(i);
        const bodyId = `faq-${col}-${i}`;
        return (
          <div className={`qa${open ? ' open' : ''}`} key={i}>
            <button
              className="qa-btn"
              aria-expanded={open}
              aria-controls={bodyId}
              onClick={() => toggle(i)}
            >
              {item.q}
              <span className="chev">
                <ChevronDown size={14} strokeW={2.4} stroke="#3a3f4c" />
              </span>
            </button>
            <div className="qa-body" id={bodyId}>
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Faq() {
  return (
    <section className="section faq watch" id="faq">
      <div className="container">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <Column items={FAQ_LEFT} col="l" />
          <Column items={FAQ_RIGHT} col="r" />
        </div>
      </div>
    </section>
  );
}
