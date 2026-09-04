import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Player Profile & Game Statistics',
  description:
    'View your FunnyChess player profile, XP progression, unlocked achievement badges, and interactive match replay history.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
