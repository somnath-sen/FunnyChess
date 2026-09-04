import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Multiplayer Chess Match',
  description: 'Real-time chess duel in progress on FunnyChess.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
