import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase/client';
import { sanitizeRedirectPath } from '@/lib/url';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // 1. Check query param ?next=
  let targetPath = requestUrl.searchParams.get('next');

  // 2. Fallback to cookie if query param was stripped by OAuth provider
  if (!targetPath) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/funnychess_auth_return=([^;]+)/);
    if (match) {
      try {
        targetPath = decodeURIComponent(match[1]);
      } catch {}
    }
  }

  const safeNext = sanitizeRedirectPath(targetPath, '/');

  // Determine true external origin (handles reverse proxy headers from Vercel)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';

  let origin = '';
  if (forwardedHost) {
    origin = `${forwardedProto}://${forwardedHost}`;
  } else if (process.env.NEXT_PUBLIC_SITE_URL) {
    origin = process.env.NEXT_PUBLIC_SITE_URL;
    if (!origin.startsWith('http://') && !origin.startsWith('https://')) {
      origin = `https://${origin}`;
    }
  } else if (process.env.NODE_ENV === 'production') {
    origin = 'https://funny-chess-sigma.vercel.app';
  } else {
    origin = requestUrl.origin;
  }
  origin = origin.replace(/\/$/, '');

  if (code) {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  // URL to redirect to after sign in process completes
  const response = NextResponse.redirect(`${origin}${safeNext}`);
  // Clear the auth return cookie
  response.cookies.set('funnychess_auth_return', '', { maxAge: 0, path: '/' });
  return response;
}

