import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AchievementToast } from '@/components/Profile/AchievementToast';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0d14',
};

export const metadata: Metadata = {
  title: 'FunnyChess — Chess is not hard. You just haven’t learned it the fun way yet.',
  description: 'A free-first, playful chess learning and playing platform for beginners. Learn piece movements with jokes, practice with witty AI, and master chess with HACK mode!',
  keywords: ['chess for beginners', 'funny chess', 'learn chess free', 'play chess online', 'chess engine', 'free chess learning'],
  authors: [{ name: 'Somnath Sen' }],
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
