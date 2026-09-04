import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Chess with Friends — Real-Time Multiplayer Duel',
  description:
    'Challenge your friends to an instant real-time chess match on FunnyChess. Share a 1-click room link with live cloud move synchronization and zero friction.',
  alternates: {
    canonical: '/play/friend',
  },
  openGraph: {
    title: 'Play Chess with Friends — Real-Time Multiplayer | FunnyChess',
    description:
      'Instant multiplayer chess invite links. Play online with friends in real-time on FunnyChess by Somnath Sen.',
    url: 'https://funny-chess-sigma.vercel.app/play/friend',
    type: 'website',
  },
};

export default function PlayFriendLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
