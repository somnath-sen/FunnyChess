'use client';

import React, { useState, useEffect } from 'react';

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
  borderRadius?: string;
  fontSize?: string;
  border?: string;
  boxShadow?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Robust UserAvatar component that gracefully displays user's avatar image
 * (Google OAuth profile picture, custom uploaded photo, or initials fallback).
 *
 * Prevents broken image icons by:
 * 1. Setting `referrerPolicy="no-referrer"` (critical for Google lh3 CDN hotlinking).
 * 2. Setting `crossOrigin="anonymous"`.
 * 3. Handling `onError` to fall back instantly to high-contrast initials.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name = 'Player',
  size = 40,
  borderRadius = '50%',
  fontSize,
  border,
  boxShadow,
  className,
  style,
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state if image source changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initial = (name || 'P').trim().charAt(0).toUpperCase() || 'P';
  const calculatedFontSize = fontSize || `${Math.max(12, Math.round(size * 0.44))}px`;

  if (src && src.trim() !== '' && !hasError) {
    return (
      <img
        src={src.trim()}
        alt={name}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        loading="eager"
        onError={() => setHasError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius,
          border: border || 'none',
          objectFit: 'cover',
          boxShadow: boxShadow || 'none',
          display: 'block',
          flexShrink: 0,
          ...style,
        }}
        className={className}
      />
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        border: border || 'none',
        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: calculatedFontSize,
        fontWeight: 900,
        color: '#ffffff',
        boxShadow: boxShadow || 'none',
        userSelect: 'none',
        flexShrink: 0,
        ...style,
      }}
      className={className}
      aria-label={name}
    >
      {initial}
    </div>
  );
};
