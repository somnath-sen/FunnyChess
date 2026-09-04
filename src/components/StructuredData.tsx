import React from 'react';

/**
 * High-quality JSON-LD structured data for FunnyChess.
 * Establishes WebSite, WebApplication, and Person entities
 * to maximize Google search visibility and brand knowledge graph recognition.
 */
export const StructuredData: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://funny-chess-sigma.vercel.app/#website',
        'url': 'https://funny-chess-sigma.vercel.app',
        'name': 'FunnyChess',
        'alternateName': [
          'Funny Chess',
          'FunnyChess Chess',
          'FunnyChess Game',
          'FunnyChess by Somnath Sen',
        ],
        'description':
          'FunnyChess is a fun, free, and beginner-friendly chess learning and playing platform. Play with witty AI, master 25 interactive lessons, challenge friends, and analyze blunders with HACK mode.',
        'inLanguage': ['en', 'hi', 'bn'],
        'publisher': {
          '@type': 'Person',
          '@id': 'https://funny-chess-sigma.vercel.app/#creator',
          'name': 'Somnath Sen',
          'alternateName': ['@thesomishere', 'thesomeishere'],
          'url': 'https://somnath-sen.github.io/somnathsen/',
          'sameAs': [
            'https://github.com/somnath-sen',
            'https://www.linkedin.com/in/thesomishere/',
            'https://www.instagram.com/thesomishere/',
          ],
        },
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://funny-chess-sigma.vercel.app/#application',
        'name': 'FunnyChess',
        'alternateName': ['Funny Chess', 'FunnyChess App'],
        'url': 'https://funny-chess-sigma.vercel.app',
        'applicationCategory': 'GameApplication',
        'operatingSystem': 'All modern web browsers',
        'description':
          'Interactive web chess application featuring 25 beginner lessons, AI opponent with multilingual spoken voice commentary in English, Hindi, and Bengali, real-time multiplayer duel, and tactical HACK analysis.',
        'author': {
          '@type': 'Person',
          '@id': 'https://funny-chess-sigma.vercel.app/#creator',
        },
        'creator': {
          '@type': 'Person',
          '@id': 'https://funny-chess-sigma.vercel.app/#creator',
        },
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock',
        },
        'screenshot': 'https://funny-chess-sigma.vercel.app/images/brand/chess-king.png',
      },
      {
        '@type': 'Person',
        '@id': 'https://funny-chess-sigma.vercel.app/#creator',
        'name': 'Somnath Sen',
        'alternateName': ['@thesomishere', 'thesomeishere', 'Somnath'],
        'jobTitle': 'Founder & Creator of FunnyChess',
        'description':
          'Somnath Sen is the founder and developer of FunnyChess, an open-source, free-first chess learning platform.',
        'url': 'https://somnath-sen.github.io/somnathsen/',
        'sameAs': [
          'https://github.com/somnath-sen',
          'https://www.linkedin.com/in/thesomishere/',
          'https://www.instagram.com/thesomishere/',
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
