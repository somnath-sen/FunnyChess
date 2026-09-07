import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Chess with Friends — Real-Time Multiplayer Duel',
  description:
    'Challenge your friends to an online chess match on FunnyChess. Share a private room invite link with live cloud move synchronization.',
  alternates: {
    canonical: '/play/friend',
  },
  openGraph: {
    title: 'Play Chess with Friends — Real-Time Multiplayer | FunnyChess',
    description:
      'Play online chess with friends in real-time on FunnyChess by Somnath Sen. Share private game room invite links.',
    url: 'https://funny-chess-sigma.vercel.app/play/friend',
    type: 'website',
  },
};

export default function PlayFriendLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
