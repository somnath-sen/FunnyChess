import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AchievementToast } from '@/components/Profile/AchievementToast';
import { StructuredData } from '@/components/StructuredData';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0d14',
};

const siteUrl = 'https://funny-chess-sigma.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FunnyChess — Learn. Laugh. Play.',
    template: '%s | FunnyChess — Learn. Laugh. Play.',
  },
  description:
    'FunnyChess is a fun, beginner-friendly chess platform created by Somnath Sen. Learn chess with 25 interactive lessons, play against witty AI with multilingual spoken voice commentary, challenge friends in real-time, and analyze mistakes with HACK mode.',
  applicationName: 'FunnyChess',
  keywords: [
    'FunnyChess',
    'Funny Chess',
    'FunnyChess chess',
    'FunnyChess game',
    'FunnyChess learn chess',
    'Somnath Sen FunnyChess',
    'Somnath Sen',
    '@thesomishere',
    'thesomeishere',
    'FunnyChess by Somnath Sen',
    'learn chess free',
    'chess for beginners',
    'interactive chess lessons',
    'play chess with AI',
    'online chess with friends',
    'chess blunder analysis',
  ],
  authors: [
    {
      name: 'Somnath Sen (@thesomishere)',
      url: 'https://somnath-sen.github.io/somnathsen/',
    },
  ],
  creator: 'Somnath Sen',
  publisher: 'Somnath Sen',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'FunnyChess',
    title: 'FunnyChess — Learn. Laugh. Play.',
    description:
      'A fun and beginner-friendly way to learn and play chess. Play against AI, learn chess lessons, challenge friends, and use HACK mode to understand mistakes. Created by Somnath Sen.',
    images: [
      {
        url: '/images/brand/chess-king.png',
        width: 512,
        height: 512,
        alt: 'FunnyChess Mascot — King & Queen Pieces',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'FunnyChess — Learn. Laugh. Play.',
    description:
      'A fun, free, and beginner-friendly chess platform created by Somnath Sen (@thesomishere). Learn chess, play with AI, challenge friends, and master moves with HACK mode.',
    creator: '@thesomishere',
    site: '@thesomishere',
    images: ['/images/brand/chess-king.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/images/brand/chess-king.png',
    shortcut: '/images/brand/chess-king.png',
    apple: '/images/brand/chess-queen.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <div className="ambient-glow" />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                {children}
              </main>
              <Footer />
            </div>
            <AchievementToast />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

