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
 * Safely sanitizes an internal redirect path, preventing open redirect vulnerabilities.
 * Only allows relative paths on the same origin (starting with / but not // or /\).
 */
export function sanitizeRedirectPath(path: string | null | undefined, fallback: string = '/play/friend'): string {
  if (!path || typeof path !== 'string') return fallback;
  const trimmed = path.trim();
  // Must start with single slash, not double slash (//evil.com) or protocol-relative (/\evil.com)
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }
  // Disallow colon before a slash or anywhere in the path (blocks javascript:, http:, https:, data:)
  if (trimmed.includes(':') || trimmed.includes('\\')) {
    return fallback;
  }
  return trimmed;
}

/**
 * Resolves the OAuth callback redirect URL with an optional safe internal return path.
 *
 * Guaranteed output:
 * - Production: https://funny-chess-sigma.vercel.app/auth/callback
 * - Localhost:   http://localhost:3000/auth/callback
 */
export function getAuthCallbackUrl(returnUrl?: string): string {
  const base = getSiteUrl();
  let callbackUrl = `${base.replace(/\/$/, '')}/auth/callback`;
  if (returnUrl) {
    const safePath = sanitizeRedirectPath(returnUrl);
    callbackUrl += `?next=${encodeURIComponent(safePath)}`;
  }
  return callbackUrl;
}
