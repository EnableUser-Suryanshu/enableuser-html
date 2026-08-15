import type { Metadata } from 'next';
import Script from 'next/script';
import { Poppins, Inter } from 'next/font/google';
import Header from '@/components/Header';
import Ticker from '@/components/Ticker';
import SiteFooter from '@/components/SiteFooter';
import InvestorNotice from '@/components/InvestorNotice';
import Fab from '@/components/Fab';
import ProgressBar from '@/components/ProgressBar';
import PointerFx from '@/components/PointerFx';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kalpataru Multiplier Ltd — Trade & Invest',
  description:
    'Share Market me Trading aur Investment ab hua aur bhi aasan. EQ | Derivative | Mutual Fund | IPO — Sab ek hi jagah.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <ProgressBar />
        <Header />
        <Ticker />
        {children}
        <InvestorNotice />
        <SiteFooter />
        <Fab />
        <PointerFx />

        {/*
          EnableUser accessibility widget (enablestack-widget 1.4.0, GPL-3.0).
          Vendored as a themed build rather than imported, so its 350 KB stays
          out of the app bundle and is cached as a plain static asset.

          Config must be set before the widget script runs, hence
          beforeInteractive on the config and afterInteractive on the widget.
          It is pinned to the LEFT — the support FAB already occupies the
          bottom-right corner.

          Re-theme with:
            npx enablestack-widget-theme "#bb0009" default
          then copy dist/enablestack-widget.js to public/vendor/.
        */}
        <Script id="enablestack-config" strategy="beforeInteractive">
          {`window.ENABLESTACK_CONFIG={colors:{primary:'#bb0009'},icon:'default',widgetPosition:{side:'left'}};`}
        </Script>
        <Script src="/vendor/enablestack-widget.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
