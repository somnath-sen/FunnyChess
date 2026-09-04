'use client';

import React from 'react';
import { AnimatedChessBackground } from '@/components/home/AnimatedChessBackground';
import { HeroSection } from '@/components/home/HeroSection';
import { WhyFunnyChess } from '@/components/home/WhyFunnyChess';
import { MasterLoopSection } from '@/components/home/MasterLoopSection';
import { FunnyAISection } from '@/components/home/FunnyAISection';
import { HackShowcase } from '@/components/home/HackShowcase';
import { FriendPlaySection } from '@/components/home/FriendPlaySection';
import { FounderSection } from '@/components/home/FounderSection';
import { FinalCTA } from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* 1. Ambient Living Chessboard Background */}
      <AnimatedChessBackground />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Why FunnyChess Pillars */}
      <WhyFunnyChess />

      {/* 4. Connected Master Product Loop */}
      <MasterLoopSection />

      {/* 5. Meet Your New Favorite Opponent (Funny AI & Voice) */}
      <FunnyAISection />

      {/* 6. HACK Mode Showcase with Interactive Mini Board */}
      <HackShowcase />

      {/* 7. Real-Time Friend Duel Showcase */}
      <FriendPlaySection />

      {/* 8. Founder Story: Somnath Sen */}
      <FounderSection />

      {/* 9. Final Call to Action */}
      <FinalCTA />
    </div>
  );
}
