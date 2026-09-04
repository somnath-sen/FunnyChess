/**
 * Environment-aware URL resolution utility for FunnyChess.
 *
 * Ensures authentication callbacks, share links, and redirects
 * correctly point to the active deployment domain in production
 * (https://funny-chess-sigma.vercel.app) while maintaining seamless
 * local development support (http://localhost:3000).
 */

export function getSiteUrl(): string {
  // 1. Browser runtime: window.location.origin is always the exact active domain
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  // 2. Explicit environment variable (Vercel / production config)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL.trim();
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
      siteUrl = `https://${siteUrl}`;
    }
    return siteUrl.replace(/\/$/, '');
  }

  // 3. Vercel deployment URL (auto-populated by Vercel deployments)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    let vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL.trim();
    if (!vercelUrl.startsWith('http://') && !vercelUrl.startsWith('https://')) {
      vercelUrl = `https://${vercelUrl}`;
    }
    return vercelUrl.replace(/\/$/, '');
  }

  // 4. Production fallback
  if (process.env.NODE_ENV === 'production') {
    return 'https://funny-chess-sigma.vercel.app';
  }

  // 5. Local development fallback
  return 'http://localhost:3000';
}

/**
 * Resolves the OAuth callback redirect URL.
 *
 * Guaranteed output:
 * - Production: https://funny-chess-sigma.vercel.app/auth/callback
 * - Localhost:   http://localhost:3000/auth/callback
 */
export function getAuthCallbackUrl(): string {
  const base = getSiteUrl();
  return `${base.replace(/\/$/, '')}/auth/callback`;
}
