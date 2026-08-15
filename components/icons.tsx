import type { SVGProps, ReactNode } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  strokeW?: number;
}

/** Generic stroked-icon wrapper (lucide-style outline icons). */
function I({ size = 20, strokeW = 2, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeW}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const CheckCircle = (p: IconProps) => (
  <I {...p}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></I>
);
export const Warning = (p: IconProps) => (
  <I {...p}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" /><path d="M12 17h.01" />
  </I>
);
export const TrendUp = (p: IconProps) => (
  <I {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></I>
);
export const DocLines = (p: IconProps) => (
  <I {...p}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h5" /></I>
);
export const Swap = (p: IconProps) => (
  <I {...p}><path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="m16 21 4-4-4-4" /><path d="M20 17H4" /></I>
);
export const ArrowRight = (p: IconProps) => (
  <I {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></I>
);
export const Devices = (p: IconProps) => (
  <I {...p}><rect x="3" y="6" width="10" height="15" rx="2" /><rect x="10" y="3" width="11" height="13" rx="2" /></I>
);
export const BarChart = (p: IconProps) => (
  <I {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 16v-5M12 16V8M16 16v-3" /></I>
);
export const Handshake = (p: IconProps) => (
  <I {...p}><path d="M12 5.5 9.5 3a3.2 3.2 0 0 0-4.6 4.5L12 14.7l7.1-7.2A3.2 3.2 0 0 0 14.5 3L12 5.5Z" /><path d="m8 13-4 4 3 3 4-4" /><path d="m16 13 4 4-3 3-4-4" /></I>
);
export const CalendarCheck = (p: IconProps) => (
  <I {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /><path d="m9.5 15 1.5 1.5 3.5-3.5" /></I>
);
export const IdCard = (p: IconProps) => (
  <I {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h4M7 13h2" /><circle cx="16" cy="11" r="2" /><path d="M13.5 17a2.5 2.5 0 0 1 5 0" /></I>
);
export const Building = (p: IconProps) => (
  <I {...p}><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 9h1M9 12h1M9 15h1M14 9h1M14 12h1M14 15h1" /></I>
);
export const OfficeBuilding = (p: IconProps) => (
  <I {...p}><path d="M3 21h18" /><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /><path d="M9 7h1M9 11h1M9 15h1M14 7h1M14 11h1M14 15h1" /></I>
);
export const Headset = (p: IconProps) => (
  <I {...p}><path d="M3 12a9 9 0 0 1 18 0" /><rect x="2" y="12" width="4" height="7" rx="1.5" /><rect x="18" y="12" width="4" height="7" rx="1.5" /><path d="M20 19a3 3 0 0 1-3 3h-3" /></I>
);
export const FileText = (p: IconProps) => (
  <I {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h4" /></I>
);
export const FilePdf = (p: IconProps) => (
  <I {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M9 15h6" /></I>
);
export const Shield = (p: IconProps) => (
  <I {...p}><path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></I>
);
export const Bank = (p: IconProps) => (
  <I {...p}><path d="M3 21h18" /><path d="M4 10h16" /><path d="m12 3 8 7H4l8-7Z" /><path d="M6 10v11M10 10v11M14 10v11M18 10v11" /></I>
);
export const History = (p: IconProps) => (
  <I {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 3" /></I>
);
export const Users = (p: IconProps) => (
  <I {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></I>
);
export const Rocket = (p: IconProps) => (
  <I {...p}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></I>
);
export const Download = (p: IconProps) => (
  <I {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></I>
);
export const ChevronDown = (p: IconProps) => (
  <I {...p}><path d="m6 9 6 6 6-6" /></I>
);
export const Phone = (p: IconProps) => (
  <I {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></I>
);
export const Mail = (p: IconProps) => (
  <I {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></I>
);
export const MapPin = (p: IconProps) => (
  <I {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></I>
);
export const Map = (p: IconProps) => (
  <I {...p}><path d="M9 6.6 3 4v14l6 2.4 6-2.4 6 2.4V6l-6-2.4L9 6.6Z" /><path d="M9 6.6V20M15 4v13.6" /></I>
);
export const Person = (p: IconProps) => (
  <I {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></I>
);
export const Target = (p: IconProps) => (
  <I {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></I>
);
export const Smartphone = (p: IconProps) => (
  <I {...p}><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18h2" /></I>
);
export const Pencil = (p: IconProps) => (
  <I {...p}><path d="m16 3 5 5-9 9H7v-5l9-9Z" /><path d="M3 21h18" /></I>
);
export const ListCheck = (p: IconProps) => (
  <I {...p}><path d="M3 6h13M3 12h13M3 18h9" /><path d="m17 15 2 2 4-4" /></I>
);
export const Home = (p: IconProps) => (
  <I {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></I>
);
export const Globe = (p: IconProps) => (
  <I {...p}><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></I>
);
export const ContactCard = (p: IconProps) => (
  <I {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M15 8h2M15 12h2M7 16h10" /></I>
);
export const Cart = (p: IconProps) => (
  <I {...p}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></I>
);
export const Send = (p: IconProps) => (
  <I {...p}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></I>
);
export const Bell = (p: IconProps) => (
  <I {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></I>
);
export const Search = (p: IconProps) => (
  <I {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></I>
);
export const SortArrows = (p: IconProps) => (
  <I {...p}><path d="m7 15 5 5 5-5M7 9l5-5 5 5" /></I>
);
export const Rupee = (p: IconProps) => (
  <I {...p}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></I>
);
export const PauseIcon = (p: IconProps) => (
  <I {...p}><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></I>
);
export const PlayIcon = (p: IconProps) => (
  <I {...p}><path d="m7 4 13 8-13 8V4Z" /></I>
);

/* ---- Filled brand icons ---- */

export const Facebook = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.1 16 2 14.77 2 12.2 2 10.5 3.56 10.5 6.7v2.8H8v4h2.5V22h3.5v-8.5Z" />
  </svg>
);
export const Instagram = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.6" cy="6.4" r=".9" fill="currentColor" stroke="none" />
  </svg>
);
export const XTwitter = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.4Z" />
  </svg>
);
export const LinkedIn = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.31h4.52V23H.24V8.31Zm7.44 0h4.33v2h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.92V23h-4.5v-7.1c0-1.7-.03-3.88-2.37-3.88-2.37 0-2.73 1.85-2.73 3.76V23H7.68V8.31Z" />
  </svg>
);
export const WhatsApp = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.77 14.03c-.24.68-1.42 1.32-1.96 1.37-.53.05-1.03.24-3.46-.72-2.93-1.15-4.78-4.14-4.93-4.33-.14-.19-1.17-1.56-1.17-2.97 0-1.41.74-2.1 1-2.39.26-.29.57-.36.76-.36l.55.01c.18.01.41-.07.65.49.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48l-.43.5c-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.17-.19.69-.8.87-1.08.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.14.44.2.51.31.06.12.06.68-.18 1.36z" />
  </svg>
);
