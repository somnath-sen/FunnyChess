'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HackAnalysis } from '@/lib/chess/hackEngine';
import { 
  BrainCircuit, 
  ArrowUpRight, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  Square as SquareIcon, 
  ChevronDown, 
  ChevronUp, 
  X,
  Target,
  Zap
} from 'lucide-react';

interface HackPanelProps {
  analysis: HackAnalysis | null;
  loading: boolean;
  onClose: () => void;
  lang?: 'en' | 'hi' | 'bn';
}

export const HackPanel: React.FC<HackPanelProps> = ({
  analysis,
  loading,
  onClose,
  lang = 'en',
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const labels = {
    en: {
      title: 'HACK Learning Assistant',
      subtitle: 'Understand WHAT to move and WHY to move it',
      bestMove: 'Recommended Best Move',
      why: 'Why is this move good?',
      threats: 'Threat Radar',
      tactics: 'Tactical Opportunity',
      alternatives: 'Good Alternatives',
      learning: 'What You’re Learning',
      checklist: 'Thinking Checklist (Before You Move)',
      analyzing: 'Analyzing position...',
      arrowHint: 'Green arrow drawn on board 🟢',
      advanced: 'Advanced Engine Evaluation',
    },
    hi: {
      title: 'हैक (HACK) लर्निंग असिस्टेंट',
      subtitle: 'समझिए कौन सी चाल चलें और क्यों चलें',
      bestMove: 'सर्वश्रेष्ठ चाल सिफारिश',
      why: 'यह चाल क्यों अच्छी है?',
      threats: 'खतरे का रडार (Threat Radar)',
      tactics: 'सामरिक अवसर (Tactics)',
      alternatives: 'अन्य अच्छे विकल्प',
      learning: 'आप क्या सीख रहे हैं',
      checklist: 'चाल चलने से पहले की चेकलिस्ट',
      analyzing: 'स्थिति का विश्लेषण जारी है...',
      arrowHint: 'बोर्ड पर हरा तीर दिखाया गया है 🟢',
      advanced: 'उन्नत इंजन मूल्यांकन',
    },
    bn: {
      title: 'হ্যাক (HACK) লার্নিং অ্যাসিস্ট্যান্ট',
      subtitle: 'কোন চাল দেবেন এবং কেন দেবেন তা গভীরভাবে বুঝুন',
      bestMove: 'সেরা চালের সুপারিশ',
      why: 'এই চালটি কেন সেরা?',
      threats: 'বিপদের রাডার (Threat Radar)',
      tactics: 'কৌশলগত সুযোগ (Tactics)',
      alternatives: 'অন্যান্য ভালো বিকল্প',
      learning: 'আপনি যা শিখছেন',
      checklist: 'চাল দেওয়ার পূর্ববর্তী চেকলিস্ট',
      analyzing: 'পরিস্থিতি বিশ্লেষণ করা হচ্ছে...',
      arrowHint: 'বোর্ডে সবুজ তীর চিহ্ন আঁকা হয়েছে 🟢',
      advanced: 'উন্নত ইঞ্জিন বিশ্লেষণ',
    },
  }[lang];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        backgroundColor: '#0d131f',
        borderRadius: '20px',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            }}
          >
            <BrainCircuit size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              {labels.title}
            </h3>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {labels.subtitle}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.35rem',
          }}
          title="Close HACK Panel"
        >
          <X size={18} />
        </button>
      </div>

      {loading || !analysis ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem', animation: 'pulseSubtle 0.8s infinite' }}>
            🧠
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
            {labels.analyzing}
          </div>
        </div>
      ) : (
        <>
          {/* Section 1: Best Move Recommendation */}
          {analysis.bestMove && (
            <div
              style={{
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {labels.bestMove}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                  {labels.arrowHint}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <ArrowUpRight size={24} color="#10b981" />
                  <span>{analysis.bestMove.san}</span>
                </div>
                <div
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    color: '#a7f3d0',
                  }}
                >
                  {analysis.bestMove.from} ➔ {analysis.bestMove.to}
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Why is this move good? */}
          <div>
            <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Target size={15} color="var(--accent-gold)" />
              <span>{labels.why}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {analysis.whyPoints.map((point, i) => (
                <li key={i} style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Threat Radar */}
          <div>
            <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={15} color={analysis.threats[0]?.severity === 'high' ? '#ef4444' : '#10b981'} />
              <span>{labels.threats}</span>
            </div>
            {analysis.threats.map((threat, i) => (
              <div
                key={i}
                style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: threat.severity === 'high' ? 'rgba(239, 68, 68, 0.12)' : threat.severity === 'medium' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.08)',
                  border: `1px solid ${threat.severity === 'high' ? 'rgba(239, 68, 68, 0.35)' : threat.severity === 'medium' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                  fontSize: '0.84rem',
                  color: threat.severity === 'high' ? '#fca5a5' : threat.severity === 'medium' ? '#fde68a' : '#a7f3d0',
                  lineHeight: 1.4,
                }}
              >
                {threat.text}
              </div>
            ))}
          </div>

          {/* Section 4: Tactical Opportunities (When clearly present) */}
          {analysis.tactics.length > 0 && (
            <div>
              <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={15} color="#f59e0b" />
                <span>{labels.tactics}</span>
              </div>
              {analysis.tactics.map((tactic, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    marginBottom: '0.4rem',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fbbf24', marginBottom: '0.2rem' }}>
                    {tactic.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#f8fafc', lineHeight: 1.4 }}>
                    {tactic.desc}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Section 5: Good Alternatives */}
          {analysis.alternatives.length > 0 && (
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                {labels.alternatives}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {analysis.alternatives.map((alt, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.82rem',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{alt.san}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({alt.desc})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: What you're learning & Phase 2 link */}
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={14} />
              <span>{labels.learning}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#ffffff', margin: '0 0 0.6rem', lineHeight: 1.45 }}>
              {analysis.principle}
            </p>
            {analysis.lessonLink && (
              <Link
                href={`/learn`}
                target="_blank"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  color: '#c084fc',
                  textDecoration: 'underline',
                  fontWeight: 600,
                }}
              >
                <span>{analysis.lessonLink.title}</span>
                <ArrowUpRight size={12} />
              </Link>
            )}
          </div>

          {/* Section 7: Thinking Checklist */}
          <div>
            <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem' }}>
              {labels.checklist}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {analysis.checklist.map((item, i) => {
                const isChecked = Boolean(checkedItems[i]);
                return (
                  <button
                    key={i}
                    onClick={() => toggleCheck(i)}
                    style={{
                      background: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isChecked ? '#10b981' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isChecked ? (
                      <CheckSquare size={16} color="#10b981" />
                    ) : (
                      <SquareIcon size={16} color="var(--text-muted)" />
                    )}
                    <span
                      style={{
                        fontSize: '0.82rem',
                        color: isChecked ? '#34d399' : 'var(--text-secondary)',
                        textDecoration: isChecked ? 'line-through' : 'none',
                      }}
                    >
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Engine Evaluation (Collapsible) */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: 0,
              }}
            >
              <span>{labels.advanced}</span>
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showAdvanced && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Stockfish Positional Score:{' '}
                <strong style={{ color: '#ffffff' }}>
                  {analysis.evaluation > 0 ? `+${analysis.evaluation.toFixed(1)}` : analysis.evaluation.toFixed(1)}
                </strong>{' '}
                • Depth: 12 nodes
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
