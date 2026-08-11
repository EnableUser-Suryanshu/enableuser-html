'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global scroll/pointer effects that operate on static, server-rendered markup:
 *  - .reveal / .stagger  → fade-slide in when scrolled into view
 *  - .watch              → gets .in-view (drives section-title underline + steps connector)
 *  - card 3D tilt        → .card/.ncard/.hcard/.why-card/.stat/.bcard/.bank-card
 *  - magnetic buttons    → hero CTAs, steps CTA, nav Open Account
 *
 * These sections never re-render, so direct DOM class/style writes are safe.
 */
export default function PointerFx() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            revealIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal, .stagger').forEach((el) => revealIo.observe(el));

    const watchIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            watchIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll('.watch').forEach((el) => watchIo.observe(el));

    const cleanups: Array<() => void> = [() => revealIo.disconnect(), () => watchIo.disconnect()];

    if (!reduce && matchMedia('(pointer:fine)').matches) {
      document
        .querySelectorAll<HTMLElement>(
          '.card,.ncard,.hcard,.why-card,.stat,.bcard,.bank-card,.svc-card,.value-card,.leader-card',
        )
        .forEach((c) => {
          const onMove = (e: MouseEvent) => {
            const r = c.getBoundingClientRect();
            const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
            const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
            c.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
          };
          const onLeave = () => {
            c.style.transform = '';
          };
          c.addEventListener('mousemove', onMove);
          c.addEventListener('mouseleave', onLeave);
          cleanups.push(() => {
            c.removeEventListener('mousemove', onMove);
            c.removeEventListener('mouseleave', onLeave);
          });
        });

      document
        .querySelectorAll<HTMLElement>(
          '.hero-actions .btn, .steps-cta .btn, .nav-cta .btn-navy, .cta-band .btn',
        )
        .forEach((b) => {
          const onMove = (e: MouseEvent) => {
            const r = b.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            b.style.transform = `translate(${(x * 0.22).toFixed(1)}px, ${(y * 0.38).toFixed(1)}px)`;
          };
          const onLeave = () => {
            b.style.transform = '';
          };
          b.addEventListener('mousemove', onMove);
          b.addEventListener('mouseleave', onLeave);
          cleanups.push(() => {
            b.removeEventListener('mousemove', onMove);
            b.removeEventListener('mouseleave', onLeave);
          });
        });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]); // re-attach observers/handlers after client-side navigation

  return null;
}
