import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn Chess — Free Interactive Lessons & Tactics',
  description:
    'Master chess from scratch with 25 bite-sized interactive lessons, visual board puzzles, and fun quizzes. Learn piece movements, tactics, and opening principles on FunnyChess by Somnath Sen.',
  alternates: {
    canonical: '/learn',
  },
  openGraph: {
    title: 'Learn Chess — Free Interactive Lessons & Tactics | FunnyChess',
    description:
      'Master chess from scratch with 25 bite-sized interactive lessons, visual board puzzles, and fun quizzes. 100% free on FunnyChess.',
    url: 'https://funny-chess-sigma.vercel.app/learn',
    type: 'website',
  },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
