'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation, LANGUAGES, Language } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { UserAvatar } from '@/components/UserAvatar';
import { 
  BookOpen, 
  Bot, 
  Users, 
  User, 
  Globe, 
  LogIn, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useTranslation();
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const navLinks = [
    { href: '/', label: t('nav.home', 'Home') },
    { href: '/learn', label: t('nav.learn', 'Learn Chess'), icon: BookOpen },
    { href: '/play/ai', label: t('nav.playAi', 'Play AI'), icon: Bot },
    { href: '/play/friend', label: t('nav.playFriend', 'Play Friend'), icon: Users },
    { href: '/profile', label: t('nav.profile', 'Profile'), icon: User },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(10, 13, 20, 0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                width: '44px',
                height: '44px',
              }}
            >
              <img
                src="/images/brand/chess-queen.png"
                alt="FunnyChess Queen"
                style={{
                  width: '32px',
                  height: '32px',
                  position: 'absolute',
                  left: '-2px',
                  bottom: '2px',
                  filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))',
                  transform: 'rotate(-10deg)',
                  zIndex: 1,
                }}
              />
              <img
                src="/images/brand/chess-king.png"
                alt="FunnyChess King"
                style={{
                  width: '38px',
                  height: '38px',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  filter: 'drop-shadow(0 4px 12px rgba(245, 158, 11, 0.4))',
                  transform: 'rotate(6deg)',
                  zIndex: 2,
                }}
              />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 40%, #fbbf24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                FunnyChess
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {t('nav.tagline', 'Learn. Laugh. Play.')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {Icon && <Icon size={16} />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions: Language + User Button + Mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Language Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Select Language"
              >
                <span>{currentLang.flag}</span>
                <span style={{ display: 'none' }} className="desktop-lang-label">
                  {currentLang.nativeName}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {isLangOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '160px',
                    padding: '0.4rem',
                    backgroundColor: '#111622',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    zIndex: 200,
                  }}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: language === lang.code ? 700 : 500,
                        color: language === lang.code ? 'var(--accent-gold)' : 'var(--text-primary)',
                        backgroundColor: language === lang.code ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth / Profile Pill */}
            {user ? (
              <Link
                href="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                <UserAvatar
                  src={user.avatar_url}
                  name={user.name}
                  size={24}
                  borderRadius="50%"
                  border="1px solid var(--accent-gold)"
                />
                <span
                  style={{
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'none',
                  }}
                  className="desktop-username"
                >
                  {user.name}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="btn-primary"
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.88rem',
                }}
              >
                <LogIn size={15} />
                <span>{t('nav.signIn', 'Sign In')}</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)',
              }}
              className="mobile-menu-btn"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              padding: '1rem 1.25rem 1.5rem',
              backgroundColor: '#0d121c',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
            className="mobile-drawer"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-primary)',
                    backgroundColor: isActive ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  }}
                >
                  {Icon && <Icon size={18} />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <style jsx global>{`
        @media (min-width: 820px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-lang-label {
            display: inline !important;
          }
          .desktop-username {
            display: inline !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
