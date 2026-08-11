import type { Metadata } from 'next';
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
      </body>
    </html>
  );
}
