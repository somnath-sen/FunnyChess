import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Chess with AI — Witty Trash Talk & Voice Commentary',
  description:
    'Play chess against funny AI opponents (Novice to Master). Featuring real-time spoken voice commentary in English, Hindi, and Bengali, and tactical HACK move assistance on FunnyChess.',
  alternates: {
    canonical: '/play/ai',
  },
  openGraph: {
    title: 'Play Chess with AI — Funny Chess Opponent | FunnyChess',
    description:
      'Challenge FunnyBot, Prof. Morphy, and Lord Checkmate. Multilingual spoken commentary and tactical HACK mode.',
    url: 'https://funny-chess-sigma.vercel.app/play/ai',
    type: 'website',
  },
};

export default function PlayAILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
