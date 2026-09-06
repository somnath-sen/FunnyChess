'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

export type ProtectedFeature = 'learn' | 'ai' | 'friend' | 'profile' | 'game' | 'daily' | 'general';

interface ProtectedRouteProps {
  children: React.ReactNode;
  feature?: ProtectedFeature;
  title?: string;
  subtitle?: string;
  icon?: string;
  gameId?: string;
}

export function ProtectedRoute({
  children,
  feature = 'general',
  title,
  subtitle,
  icon,
  gameId,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading: authLoading, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [signingIn, setSigningIn] = useState(false);

  // 1. Loading State: check auth without flashing protected UI or sign-in card
  if (authLoading) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center p-4">
        <div
          className="glass-panel"
          style={{
            maxWidth: '460px',
            width: '100%',
            padding: '3rem 2rem',
            textAlign: 'center',
            borderRadius: '1.25rem',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              display: 'inline-block',
              animation: 'bounce 1.5s infinite',
            }}
          >
            ♟️
          </div>
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.5rem',
            }}
          >
            {t('auth.checkingAccount', 'Checking your account...')}
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('auth.pleaseSignInToContinue', 'Please wait while we verify your session')}
          </p>
        </div>
      </main>
    );
  }

  // 2. Authenticated State: render the protected feature seamlessly
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 3. Unauthenticated State: Render polished FunnyChess sign-in card
  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      const returnDestination = pathname || (feature === 'learn' ? '/learn' : feature === 'ai' ? '/play/ai' : feature === 'friend' ? '/play/friend' : feature === 'profile' ? '/profile' : feature === 'daily' ? '/daily' : '/');
      await signInWithGoogle(returnDestination);
    } catch {
      setSigningIn(false);
    }
  };

  // Determine localized title, subtitle, and icon based on feature
  const resolveHeader = () => {
    switch (feature) {
      case 'daily':
        return {
          icon: icon || '♟️',
          title: title || t('auth.signInToPlayDaily', 'Sign in to play Daily Challenge'),
          subtitle: subtitle || t('auth.subtitleDaily', 'Solve daily tactical puzzles, claim your +25 XP streak, and level up your chess profile.'),
        };
      case 'learn':
        return {
          icon: icon || '📚',
          title: title || t('auth.signInToStartLearning', 'Sign in to start learning'),
          subtitle: subtitle || t('auth.subtitleLearn', 'Create your chess learning journey, save your progress, earn XP, and unlock achievements.'),
        };
      case 'ai':
        return {
          icon: icon || '🤖',
          title: title || t('auth.signInToPlay', 'Sign in to play'),
          subtitle: subtitle || t('auth.subtitlePlayAI', 'Save your games, track your progress, and challenge FunnyChess AI.'),
        };
      case 'friend':
        return {
          icon: icon || '👥',
          title: title || t('auth.signInToPlayFriend', 'Sign in to play with a friend'),
          subtitle: subtitle || t('auth.subtitlePlayFriend', 'Create private chess rooms, invite your friends, and keep your games synchronized across devices.'),
        };
      case 'game':
        return {
          icon: icon || '⚔️',
          title: title || t('auth.signInToJoinGame', 'Sign in to join this game'),
          subtitle: subtitle || (gameId ? `${t('auth.subtitleJoinGame', 'Sign in to join this match and play live against your friend.')} (${gameId})` : t('auth.subtitleJoinGame', 'Sign in to join this match and play live against your friend.')),
        };
      case 'profile':
        return {
          icon: icon || '👑',
          title: title || t('auth.signInToContinue', 'Sign in to continue'),
          subtitle: subtitle || t('auth.subtitleContinue', 'Your chess journey, game history, and achievements are saved to your account.'),
        };
      default:
        return {
          icon: icon || '♟️',
          title: title || t('auth.signInToContinue', 'Sign in to continue'),
          subtitle: subtitle || t('auth.subtitleContinue', 'Your chess journey, game history, and achievements are saved to your account.'),
        };
    }
  };


  const headerInfo = resolveHeader();

  return (
    <main
      style={{
        minHeight: '78vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.75rem 2.25rem',
          textAlign: 'center',
          borderRadius: '1.5rem',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle accent glow behind icon */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '260px',
            height: '160px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Feature Icon Badge */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(168, 85, 247, 0.2))',
            border: '2px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 20px -5px rgba(245, 158, 11, 0.2)',
          }}
        >
          {headerInfo.icon}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: '0.75rem',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}
        >
          {headerInfo.title}
        </h1>

        {/* Subtitle description */}
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55,
            marginBottom: '2rem',
            padding: '0 0.5rem',
          }}
        >
          {headerInfo.subtitle}
        </p>

        {/* Sign in with Google Button */}
        <button
          onClick={handleSignIn}
          disabled={signingIn}
          style={{
            width: '100%',
            padding: '0.95rem 1.5rem',
            borderRadius: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: '#ffffff',
            color: '#1f2937',
            fontWeight: 700,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            cursor: signingIn ? 'not-allowed' : 'pointer',
            opacity: signingIn ? 0.8 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.35)',
            marginBottom: '1.5rem',
          }}
          onMouseEnter={(e) => {
            if (!signingIn) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(0, 0, 0, 0.45)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.35)';
          }}
        >
          {signingIn ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-gray-700" />
              <span>{t('auth.checkingAccount', 'Connecting to Google...')}</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t('auth.signInWithGoogle', 'Sign in with Google')}</span>
            </>
          )}
        </button>

        {/* Security & Free Guarantee */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            color: '#10b981',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
          }}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t('auth.secureFree', 'Secure • 100% Free Forever • No Ads')}</span>
        </div>

        {/* Back to Home Navigation */}
        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('nav.home', 'Back to Home')}</span>
        </a>
      </div>
    </main>
  );
}
