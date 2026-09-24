'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Calculator, Shield, ArrowRight } from '../icons';

/** Compact wire format from /api/margin-rates. */
interface Rate {
  s: string;  // symbol
  x: string;  // series (EQ | BE)
  a: number;  // applicable margin rate %
  v: number;  // VaR %
  e: number;  // extreme loss margin %
  d: number;  // adhoc %
  c?: number; // last close
}

type Product = 'intraday' | 'delivery';

const inr = (n: number) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Cash-market margin calculator.
 *
 * Every percentage comes from NSE Clearing's daily VaR file — nothing here is
 * an estimate. The figure shown is the *exchange minimum*; Kalpataru's own
 * risk policy may call for more on a given scrip, which the copy says plainly
 * rather than implying the number is a guaranteed limit.
 */
export default function MarginCalculator() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [meta, setMeta] = useState<{ asOf?: string; priceStamp?: string | null; count?: number }>({});
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  const [query, setQuery] = useState('RELIANCE');
  const [picked, setPicked] = useState<Rate | null>(null);
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState('100');
  const [price, setPrice] = useState('');
  const [product, setProduct] = useState<Product>('intraday');
  const boxRef = useRef<HTMLDivElement>(null);

  /* ---- load the rate table once ---- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/margin-rates', { cache: 'no-store' });
        const j = (await r.json()) as { rates?: Rate[]; asOf?: string; priceStamp?: string; count?: number };
        if (cancelled) return;
        if (!j.rates?.length) { setLoadState('error'); return; }
        setRates(j.rates);
        setMeta({ asOf: j.asOf, priceStamp: j.priceStamp, count: j.count });
        setLoadState('ready');
        const seed = j.rates.find((x) => x.s === 'RELIANCE') ?? j.rates[0];
        if (seed) {
          setPicked(seed);
          setQuery(seed.s);
          if (seed.c) setPrice(String(seed.c));
        }
      } catch {
        if (!cancelled) setLoadState('error');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ---- close the suggestion list on an outside click ---- */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return [];
    const starts: Rate[] = [];
    const contains: Rate[] = [];
    for (const r of rates) {
      if (r.s === q) starts.unshift(r);
      else if (r.s.startsWith(q)) starts.push(r);
      else if (contains.length < 8 && r.s.includes(q)) contains.push(r);
      if (starts.length >= 8) break;
    }
    return [...starts, ...contains].slice(0, 8);
  }, [query, rates]);

  const choose = (r: Rate) => {
    setPicked(r);
    setQuery(r.s);
    if (r.c) setPrice(String(r.c));
    setOpen(false);
  };

  /* ---- the arithmetic ---- */
  const calc = useMemo(() => {
    const q = Math.max(0, Number(qty) || 0);
    const p = Math.max(0, Number(price) || 0);
    const value = q * p;
    if (!picked || !value) return null;

    // Intraday: the exchange's applicable margin rate (VaR + ELM + adhoc).
    // Delivery: settled in full, so the whole trade value must be funded.
    const rate = product === 'intraday' ? picked.a : 100;
    const margin = (value * rate) / 100;

    return {
      value,
      rate,
      margin,
      leverage: rate > 0 ? 100 / rate : 1,
      varAmt: (value * picked.v) / 100,
      elmAmt: (value * picked.e) / 100,
      adhocAmt: (value * picked.d) / 100,
      shortfall: value - margin,
    };
  }, [picked, qty, price, product]);

  if (loadState === 'error') {
    return (
      <div className="mcalc-error" role="alert">
        <Shield size={26} strokeW={1.8} />
        <p>
          NSE Clearing&apos;s margin file could not be reached just now, so the calculator
          cannot show live rates. Rather than estimate them, it is showing nothing —
          please try again shortly, or call the dealing desk on{' '}
          <a href="tel:07554350141">0755-4350141</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="mcalc">
      <div className="mcalc-form">
        {/* Symbol */}
        <div className="mcalc-field" ref={boxRef}>
          <label htmlFor="mc-sym">Stock symbol</label>
          <div className="mcalc-search">
            <Search size={15} strokeW={2.2} />
            <input
              id="mc-sym"
              type="text"
              autoComplete="off"
              value={query}
              disabled={loadState === 'loading'}
              placeholder={loadState === 'loading' ? 'Loading NSE rates…' : 'e.g. RELIANCE'}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mc-suggest"
              role="combobox"
              aria-autocomplete="list"
            />
          </div>
          {open && matches.length > 0 && (
            <ul className="mcalc-suggest" id="mc-suggest" role="listbox">
              {matches.map((r) => (
                <li key={`${r.s}-${r.x}`}>
                  <button type="button" role="option" aria-selected={picked?.s === r.s} onClick={() => choose(r)}>
                    <span className="mc-sym">{r.s}</span>
                    <span className="mc-series">{r.x}</span>
                    <span className="mc-rate">{r.a.toFixed(2)}%</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quantity */}
        <div className="mcalc-field">
          <label htmlFor="mc-qty">Quantity</label>
          <input id="mc-qty" type="number" min="1" step="1" inputMode="numeric"
            value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>

        {/* Price */}
        <div className="mcalc-field">
          <label htmlFor="mc-price">Price (₹)</label>
          <input id="mc-price" type="number" min="0" step="0.05" inputMode="decimal"
            value={price} onChange={(e) => setPrice(e.target.value)} />
          {picked?.c && (
            <button type="button" className="mcalc-hint" onClick={() => setPrice(String(picked.c))}>
              Last close ₹{inr(picked.c)}
            </button>
          )}
        </div>

        {/* Product */}
        <fieldset className="mcalc-field mcalc-product">
          <legend>Product</legend>
          <div className="mcalc-toggle" role="radiogroup" aria-label="Product type">
            {(['intraday', 'delivery'] as Product[]).map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={product === p}
                className={product === p ? 'on' : undefined}
                onClick={() => setProduct(p)}
              >
                {p === 'intraday' ? 'Intraday (MIS)' : 'Delivery (CNC)'}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Result */}
      {calc && picked ? (
        <div className="mcalc-out" aria-live="polite">
          <div className="mcalc-headline">
            <span className="mo-label">Margin required</span>
            <span className="mo-big">₹{inr(calc.margin)}</span>
            <span className="mo-sub">
              on a trade worth ₹{inr(calc.value)}
              {product === 'intraday' && <> · up to <strong>{calc.leverage.toFixed(2)}×</strong> leverage</>}
            </span>
          </div>

          <dl className="mcalc-break">
            <div>
              <dt>Trade value</dt>
              <dd>₹{inr(calc.value)}</dd>
            </div>
            {product === 'intraday' ? (
              <>
                <div>
                  <dt>VaR margin <span>{picked.v.toFixed(2)}%</span></dt>
                  <dd>₹{inr(calc.varAmt)}</dd>
                </div>
                <div>
                  <dt>Extreme loss margin <span>{picked.e.toFixed(2)}%</span></dt>
                  <dd>₹{inr(calc.elmAmt)}</dd>
                </div>
                {picked.d > 0 && (
                  <div>
                    <dt>Adhoc margin <span>{picked.d.toFixed(2)}%</span></dt>
                    <dd>₹{inr(calc.adhocAmt)}</dd>
                  </div>
                )}
                <div className="total">
                  <dt>Total margin <span>{picked.a.toFixed(2)}%</span></dt>
                  <dd>₹{inr(calc.margin)}</dd>
                </div>
                <div>
                  <dt>Balance funded by exposure</dt>
                  <dd>₹{inr(calc.shortfall)}</dd>
                </div>
              </>
            ) : (
              <div className="total">
                <dt>Payable on settlement <span>100%</span></dt>
                <dd>₹{inr(calc.value)}</dd>
              </div>
            )}
          </dl>

          <p className="mcalc-note">
            <Shield size={16} strokeW={1.9} />
            <span>
              {product === 'intraday' ? (
                <>
                  This is the <strong>exchange minimum</strong> for {picked.s}, from NSE Clearing&apos;s
                  VaR file{meta.asOf ? ` dated ${meta.asOf}` : ''}. Kalpataru&apos;s risk policy may
                  require more on individual scrips, and rates are revised through the session.
                </>
              ) : (
                <>
                  Delivery trades settle in full, so the entire trade value must be funded by
                  settlement. The upfront margin collected at order placement is{' '}
                  {picked.a.toFixed(2)}% under NSE rules.
                </>
              )}{' '}
              Brokerage, STT, exchange charges, GST, SEBI turnover fees and stamp duty are not
              included.
            </span>
          </p>
        </div>
      ) : (
        <div className="mcalc-out mcalc-idle">
          <p>Pick a stock and enter a quantity and price to see the margin required.</p>
        </div>
      )}

      {meta.count && (
        <p className="mcalc-source">
          <span className="mkt-live-dot on" aria-hidden="true"></span>
          Live rates for <strong>{meta.count.toLocaleString('en-IN')}</strong> NSE securities
          {meta.asOf ? <> · VaR file {meta.asOf}</> : null}
          {meta.priceStamp ? <> · prices as at {meta.priceStamp}</> : null}
        </p>
      )}

      <p className="mcalc-fno">
        <Calculator size={17} strokeW={1.9} />
        <span>
          <strong>Futures &amp; options?</strong> F&amp;O initial margin is SPAN plus exposure,
          recomputed by the clearing corporation several times a session against the whole
          portfolio — it cannot be derived from a single contract. Your live requirement is shown
          in the trading terminal before you place the order.{' '}
          <a href="tel:07554350141" className="link-red">
            Or call the dealing desk <ArrowRight size={14} strokeW={2.2} />
          </a>
        </span>
      </p>
    </div>
  );
}
