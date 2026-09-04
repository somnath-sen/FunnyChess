import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://funny-chess-sigma.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/profile',
          '/auth/',
          '/game/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
