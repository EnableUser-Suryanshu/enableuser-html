'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PORTALS, EXT } from '@/lib/links';
import { ChevronDown } from './icons';

interface NavChild {
  href: string;
  label: string;
  desc: string;
}
interface NavItem {
  label: string;
  href?: string;
  /** Routes that should light this item up as the current section. */
  match: string[];
  children?: NavChild[];
}

const NAV: NavItem[] = [
  { label: 'Markets', href: '/markets', match: ['/markets'] },
  {
    label: 'Invest',
    match: ['/services', '/mf-online', '/new-to-market'],
    children: [
      { href: '/services', label: 'Our Services', desc: 'Equity, F&O, commodity, currency, IPO and more' },
      { href: '/mf-online', label: 'MF Online', desc: 'Invest across 13 fund-house portals' },
      { href: '/new-to-market', label: 'New to Market', desc: 'A beginner’s guide to investing' },
    ],
  },
  {
    label: 'Company',
    match: ['/about', '/business-partners'],
    children: [
      { href: '/about', label: 'About Us', desc: 'Our story, leadership and registrations' },
      { href: '/business-partners', label: 'Business Partners', desc: 'Franchise, sub-broker and ARN models' },
    ],
  },
  {
    label: 'Support',
    match: ['/contact', '/customer-care', '/account-services', '/downloads', '/bank-details', '/circulars'],
    children: [
      { href: '/contact', label: 'Contact Us', desc: '22 branches and key contacts' },
      { href: '/customer-care', label: 'Customer Care', desc: 'Support desks, escalation and feedback' },
      { href: '/account-services', label: 'Account Services', desc: 'Nomination, Re-KYC and closure — online' },
      { href: '/downloads', label: 'Downloads', desc: '80 forms, guides and software' },
      { href: '/bank-details', label: 'Bank & DP Details', desc: 'Verified accounts for funds and securities' },
      { href: '/circulars', label: 'Circulars & Policies', desc: 'Regulatory circulars and investor documents' },
    ],
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);          // mobile drawer
  const [menu, setMenu] = useState<string | null>(null); // open dropdown
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on route change.
  useEffect(() => {
    setMenu(null);
    setOpen(false);
  }, [pathname]);

  // Click outside closes the open dropdown.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menu]);

  const isActive = (item: NavItem) =>
    item.match.some((m) => (m === '/' ? pathname === '/' : pathname.startsWith(m)));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (menu) { setMenu(null); return; }
    if (open) { setOpen(false); burgerRef.current?.focus(); }
  };

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`} onKeyDown={onKeyDown}>
      <div className="container nav" ref={navRef as React.RefObject<HTMLDivElement>}>
        <Link className="brand" href="/" aria-label="Kalpataru Multiplier Ltd — home">
          <img src="/assets/logo.png" alt="" />
          <span className="brand-text">
            <span className="brand-name">Kalpataru</span>
            <span className="brand-tag">Multiplier Ltd</span>
          </span>
        </Link>

        <nav className={`nav-links${open ? ' open' : ''}`} id="navLinks" aria-label="Main navigation">
          <Link href="/" className={pathname === '/' ? 'nav-top active' : 'nav-top'}
            aria-current={pathname === '/' ? 'page' : undefined}>
            Home
          </Link>

          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className={`nav-group${menu === item.label ? ' open' : ''}`}
                onMouseEnter={() => setMenu(item.label)}
                onMouseLeave={() => setMenu((m) => (m === item.label ? null : m))}
              >
                <button
                  type="button"
                  className={`nav-top nav-trigger${isActive(item) ? ' active' : ''}`}
                  aria-expanded={menu === item.label}
                  aria-haspopup="true"
                  onClick={() => setMenu((m) => (m === item.label ? null : item.label))}
                >
                  {item.label}
                  <ChevronDown size={13} strokeW={2.6} />
                </button>
                <div className="nav-panel" role="group" aria-label={item.label}>
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={pathname === c.href ? 'nav-sub current' : 'nav-sub'}
                      aria-current={pathname === c.href ? 'page' : undefined}
                    >
                      <span className="nav-sub-l">{c.label}</span>
                      <span className="nav-sub-d">{c.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className={`nav-top${isActive(item) ? ' active' : ''}`}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="nav-cta">
          <a href={PORTALS.backOfficeLogin} {...EXT} className="btn btn-outline">
            Back Office
          </a>
          <a href={PORTALS.ekycAccountOpening} {...EXT} className="btn btn-navy">
            Open Account
          </a>
          <button
            ref={burgerRef}
            className="hamburger"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="navLinks"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
