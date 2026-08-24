'use client';

import { useEffect, useRef, useState } from 'react';
import { CHART_CLOSES, FUNDS, TYPEWRITER_PHRASES } from '@/lib/data';
import { PORTALS, EXT } from '@/lib/links';
import CountUp from './CountUp';
import {
  CheckCircle, TrendUp, Shield, Rupee, Cart, Send, Bell, Search, SortArrows,
  Home, Users, Globe, ContactCard,
} from './icons';

/* ---------- static pieces ---------- */

const HEADLINE: Array<{ text: string; red?: boolean }> = [
  { text: 'Invest' }, { text: 'With' }, { text: 'Kalpataru', red: true },
];

const COINS = [
  { left: '6%', top: '62%', dur: '8s', del: '.5s', s: 0.9 },
  { left: '13%', top: '26%', dur: '10s', del: '2.2s', s: 0.7 },
  { left: '88%', top: '16%', dur: '9s', del: '1.2s', s: 1 },
  { left: '92%', top: '66%', dur: '11s', del: '3.4s', s: 0.75 },
  { left: '2%', top: '42%', dur: '12s', del: '4.6s', s: 0.6 },
];

function Chart() {
  const W = 560, H = 220, step = W / CHART_CLOSES.length, bw = 15;
  let prev = CHART_CLOSES[0] - 10;
  const pts: string[] = [];
  const candles = CHART_CLOSES.map((c, i) => {
    const o = prev;
    const up = c >= o;
    const x = i * step + step / 2;
    const top = H - Math.max(o, c);
    const bh = Math.max(Math.abs(c - o), 3);
    const hi = H - (Math.max(o, c) + 7);
    const lo = H - (Math.min(o, c) - 7);
    const col = up ? '#16a34a' : '#dc2626';
    pts.push(`${x},${H - c - 14}`);
    prev = c;
    return (
      <g className="candle" style={{ '--i': i } as React.CSSProperties} key={i}>
        <line x1={x} y1={hi} x2={x} y2={lo} stroke={col} strokeWidth={2} />
        <rect x={x - bw / 2} y={top} width={bw} height={bh} rx={2} fill={col} />
      </g>
    );
  });
  return (
    <svg className="hero-chart" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {candles}
      <polyline
        className="trend"
        points={pts.join(' ')}
        fill="none"
        stroke="#bb0009"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- interactive hero ---------- */

export default function Hero() {
  const phoneRef = useRef<HTMLDivElement>(null);
  // Real interactions on the mock: the sort control actually reorders the
  // list, and tapping it pauses the scroll (hover already did, but touch
  // users had no way to stop it). Chips are left inert — the funds carry no
  // category, so a working filter would mean inventing fund data.
  const [sortDesc, setSortDesc] = useState(true);
  const [held, setHeld] = useState(false);
  const visualRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(TYPEWRITER_PHRASES[0]);
  const [fcReturn, setFcReturn] = useState('44.43%');

  // Phone tilt toward cursor + hero depth parallax on scroll
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const visual = visualRef.current;
    const phone = phoneRef.current;
    const copy = copyRef.current;
    if (!visual || !phone || !copy) return;

    const onMove = (e: MouseEvent) => {
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      phone.style.transform = `rotateY(${x * 14}deg) rotateX(${y * -12}deg)`;
    };
    const onLeave = () => {
      phone.style.transform = 'rotateY(0) rotateX(0)';
    };
    const onScroll = () => {
      if (window.scrollY < 900) {
        visual.style.transform = `translateY(${window.scrollY * 0.08}px)`;
        copy.style.transform = `translateY(${window.scrollY * 0.16}px)`;
      }
    };

    if (!reduce && matchMedia('(pointer:fine)').matches) {
      visual.addEventListener('mousemove', onMove);
      visual.addEventListener('mouseleave', onLeave);
    }
    if (!reduce) window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      visual.removeEventListener('mousemove', onMove);
      visual.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Typewriter in the phone search bar
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let pi = 0;
    let ci = TYPEWRITER_PHRASES[0].length;
    let dir = -1;
    const id = setInterval(() => {
      if (document.documentElement.classList.contains('motion-paused')) return;
      ci += dir;
      if (ci <= 0) {
        dir = 1;
        pi = (pi + 1) % TYPEWRITER_PHRASES.length;
      }
      if (ci >= TYPEWRITER_PHRASES[pi].length) dir = -1;
      setTyped(TYPEWRITER_PHRASES[pi].slice(0, Math.max(ci, 0)));
    }, 110);
    return () => clearInterval(id);
  }, []);

  // Floating badge cycles through top returns
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const vals = ['44.43%', '44.34%', '44.21%', '44.19%'];
    let vi = 0;
    const id = setInterval(() => {
      if (document.documentElement.classList.contains('motion-paused')) return;
      vi = (vi + 1) % vals.length;
      setFcReturn(vals[vi]);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  let wordIndex = 0;

  const num = (r: string) => parseFloat(r);
  const sortedFunds = [...FUNDS].sort((a, b) =>
    sortDesc ? num(b.ret) - num(a.ret) : num(a.ret) - num(b.ret));

  return (
    <section className="hero" id="hero">
      <div className="container hero-grid">
        <Chart />
        <div className="hero-copy" ref={copyRef}>
          {/* Headline is English now, so it inherits the page language. The
              lead below still has a Hinglish clause and keeps its own lang. */}
          <h1>
            {HEADLINE.map((w, i) => (
              <span key={i}>
                <span
                  className={w.red ? 'red word' : 'word'}
                  style={{ '--i': wordIndex++ } as React.CSSProperties}
                >
                  {w.text}
                </span>{' '}
              </span>
            ))}
          </h1>
          <p className="hero-sub">
            EQ | Derivative | Mutual Fund | IPO – <span lang="hi-Latn">Sab ek hi jagah.</span>{' '}
            Experience seamless trading with institutional grade stability.
          </p>
          <div className="hero-actions">
            <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-navy">
              Open Free Account
            </a>
            <a href={PORTALS.webTrading} {...EXT} className="btn btn-outline">
              Start Trading
            </a>
          </div>
          <div className="hero-badges">
            <span className="hero-badge">
              <CheckCircle />
              <span>
                <b><CountUp target={35000} suffix="+" /></b> Clients
              </span>
            </span>
            <span className="hero-badge">
              <CheckCircle />
              SEBI Registered
            </span>
          </div>
        </div>

        <div
          className="hero-visual"
          ref={visualRef}
          role="img"
          aria-label="Kalpataru mobile trading app preview showing live mutual fund returns"
        >
          <div className="blob b1"></div>
          <div className="blob b2"></div>
          <div className="ring"></div>
          {COINS.map((c, i) => (
            <span
              key={i}
              className="coin"
              aria-hidden="true"
              style={{ left: c.left, top: c.top, '--dur': c.dur, '--del': c.del, '--s': c.s } as React.CSSProperties}
            >
              ₹
            </span>
          ))}

          <div className="phone-float">
            <div className="phone" ref={phoneRef}>
              <span className="side"></span>
              <span className="side s2"></span>
              <span className="side s3"></span>
              <div className="screen">
                <div className="app-top">
                  <div className="notch"></div>
                  <div className="app-status">
                    <span>5:01</span>
                    <span>●●● 📶 100%</span>
                  </div>
                  <div className="app-bar">
                    <span className="menu" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span className="app-title">Explore</span>
                    <span className="app-icons">
                      <span className="cart-dot"><Cart size={15} stroke="#fff" /></span>
                      <Send size={15} stroke="#fff" />
                      <Bell size={15} stroke="#fff" />
                    </span>
                  </div>
                </div>
                <div className="app-search">
                  <Search size={13} strokeW={2.4} />
                  <span>{typed}</span>
                  <span className="caret"></span>
                </div>
                <div className="chips">
                  <span className="chip on">Equity</span>
                  <span className="chip">Debt</span>
                  <span className="chip">Hybrid</span>
                  <span className="chip">Solution Ori</span>
                </div>
                <div className="list-head">
                  <span>Mutual Funds</span>
                  <span
                    className={`sort${sortDesc ? '' : ' asc'}`}
                    onClick={() => setSortDesc((v) => !v)}
                  >
                    3Y Return <SortArrows size={9} strokeW={2.4} />
                  </span>
                </div>
                <div
                  className="fund-viewport"
                  onClick={() => setHeld((v) => !v)}
                >
                  <div className={`fund-list${held ? ' held' : ''}`}>
                    {[...sortedFunds, ...sortedFunds].map((f, i) => (
                      <div className="fund" key={i}>
                        <span className="flogo" style={{ background: f.color }}>{f.initials}</span>
                        <span className="fmeta">
                          <span className="fname">{f.name}</span>
                          <br />
                          <span className="fsub">{f.sub}</span>
                        </span>
                        <span className="fret">{f.ret}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="app-nav">
                  <span className="nv-on"><Home size={17} /></span>
                  <span><Users size={17} /></span>
                  <span><Globe size={17} /></span>
                  <span><ContactCard size={17} /></span>
                </div>
              </div>
            </div>
          </div>

          <div className="float-card fc1">
            <span className="fc-icon"><TrendUp size={18} strokeW={2.2} /></span>
            <span>
              <span className="fc-t">{fcReturn}</span>
              <br />
              <span className="fc-s">Top 3Y Return</span>
            </span>
          </div>
          <div className="float-card fc2">
            <span className="fc-icon"><Rupee size={18} strokeW={2.2} /></span>
            <span>
              <span className="fc-t">₹500</span>
              <br />
              <span className="fc-s">SIP Start se</span>
            </span>
          </div>
          <div className="float-card fc3">
            <span className="fc-icon"><Shield size={18} strokeW={2.2} /></span>
            <span>
              <span className="fc-t">SEBI</span>
              <br />
              <span className="fc-s">Registered Broker</span>
            </span>
          </div>

          <div className="hero-dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span className="on"></span>
          </div>
        </div>
      </div>
    </section>
  );
}
