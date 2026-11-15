import React, { useEffect, useRef, useState } from 'react';

export const BenchmarksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('.synra-bench-card');
    if (!cards.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((c) => c.classList.add('visible'));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    cards.forEach((c) => obs.observe(c));

    return () => obs.disconnect();
  }, [activeTab]);

  const categories = [
    { id: 'all', label: 'All Benchmarks' },
    { id: 'memory', label: 'Memory Retention' },
    { id: 'efficiency', label: 'Efficiency' },
    { id: 'privacy', label: 'Privacy Protection' },
    { id: 'reliability', label: 'Reliability' },
  ];

  return (
    <section className="synra-benchmarks" id="benchmarks" ref={sectionRef} aria-labelledby="bench-heading">
      <style>{`
        .synra-benchmarks {
          position: relative;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          background: #000000;
          padding: 6rem 1.25rem 8rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #fff;
          box-sizing: border-box;
        }
        .synra-benchmarks *, .synra-benchmarks *::before, .synra-benchmarks *::after {
          box-sizing: inherit;
        }
        .synra-benchmarks::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 750px;
          max-width: 100%;
          height: 380px;
          background: radial-gradient(ellipse at 50% 0%, rgba(213, 186, 146, 0.08) 0%, rgba(0,0,0,0) 70%);
          pointer-events: none;
          z-index: 0;
        }

        .synra-bench-header {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .synra-bench-logo {
          width: 48px;
          height: 48px;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 14px rgba(255,255,255,0.15));
        }
        .synra-bench-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #D5BA92;
          margin-bottom: 0.9rem;
          font-weight: 500;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          background: rgba(213, 186, 146, 0.08);
          border: 1px solid rgba(213, 186, 146, 0.2);
        }
        .synra-bench-header h2 {
          margin: 0 0 1rem;
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: #ffffff;
          font-family: 'Futura Md BT Medium', system-ui, sans-serif;
        }
        @media (min-width: 768px) { .synra-bench-header h2 { font-size: 3.25rem; } }
        
        .synra-bench-lead {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.6);
          font-weight: 400;
          max-width: 600px;
        }

        /* Category Filter Tabs */
        .synra-bench-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }
        .synra-bench-tab {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          padding: 0.45rem 0.95rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .synra-bench-tab:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: rgba(255,255,255,0.18);
        }
        .synra-bench-tab.active {
          background: #F9F3EA;
          color: #0c0c0c;
          border-color: #D5BA92;
          font-weight: 600;
          box-shadow: 0 0 14px rgba(249, 243, 234, 0.2);
        }

        /* Hero Stats */
        .synra-bench-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 4rem;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 768px) { .synra-bench-stats { grid-template-columns: repeat(4, 1fr); gap: 1rem; } }

        .synra-stat-card {
          position: relative;
          background: #0A0A0A;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.9rem;
          padding: 1.5rem 1.25rem;
          overflow: hidden;
          transition: all .3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .synra-stat-card:hover { 
          border-color: rgba(213, 186, 146, 0.45);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -10px rgba(0,0,0,0.8), 0 0 18px rgba(213, 186, 146, 0.1);
        }
        .synra-stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #D5BA92, transparent);
        }
        .synra-stat-num {
          display: block;
          font-size: 2.2rem;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: #fff;
          line-height: 1;
          margin-bottom: 0.4rem;
          font-variant-numeric: tabular-nums;
        }
        .synra-stat-label {
          display: block;
          font-size: 0.75rem;
          line-height: 1.4;
          color: rgba(255,255,255,0.6);
        }
        .synra-stat-label em {
          display: block;
          margin-top: 0.25rem;
          font-style: normal;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.35);
        }

        /* Groups */
        .synra-bench-group { 
          margin-bottom: 3.5rem; 
          position: relative;
          z-index: 1;
        }
        .synra-bench-group-title {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin: 0 0 1.5rem;
        }
        .synra-bench-group-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(213, 186, 146, 0.3), rgba(255,255,255,0.06) 50%, transparent);
        }

        .synra-bench-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 860px) { .synra-bench-grid { grid-template-columns: 1fr 1fr; gap: 1.25rem; } }

        .synra-bench-card {
          background: #0A0A0A;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 0.9rem;
          padding: 1.6rem 1.4rem 1.85rem;
          transition: border-color .3s ease, transform .3s ease, box-shadow .3s ease;
        }
        .synra-bench-card:hover {
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-3px);
          box-shadow: 0 16px 36px -12px rgba(0,0,0,0.85);
        }
        .synra-bench-card h4 {
          margin: 0 0 0.35rem;
          font-size: 1.05rem;
          font-weight: 500;
          color: #fff;
          letter-spacing: -0.01em;
        }
        .synra-bench-card .desc {
          margin: 0 0 1.4rem;
          font-size: 0.76rem;
          line-height: 1.5;
          color: rgba(255,255,255,0.45);
        }

        /* Bar Rows */
        .synra-bar-list { display: flex; flex-direction: column; gap: 0.65rem; }
        .synra-bar-row {
          display: grid;
          grid-template-columns: 110px 1fr 60px;
          align-items: center;
          gap: 0.6rem;
          padding: 0.2rem 0.3rem;
          border-radius: 6px;
          margin: -0.2rem -0.3rem;
          transition: background .2s ease;
        }
        .synra-bar-row:hover {
          background: rgba(255,255,255,0.035);
        }
        @media (min-width: 480px) { .synra-bar-row { grid-template-columns: 125px 1fr 65px; } }

        .synra-bar-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.55);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .synra-bar-row.is-synra .synra-bar-label {
          color: #fff;
          font-weight: 600;
        }

        /* Badges */
        .synra-badge {
          display: inline-grid;
          place-items: center;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          flex: none;
          font-family: 'Inter', sans-serif;
          line-height: 1;
        }
        .synra-badge.b-synra { 
          background: #F9F3EA; 
          border: 1px solid #D5BA92;
          color: #1b0d05;
          box-shadow: 0 0 10px rgba(213, 186, 146, 0.25);
        }
        .synra-badge.b-synra svg {
          width: 12px; height: 12px;
        }
        .synra-badge.b-mem0 { background: #C86A51; }
        .synra-badge.b-zep { background: #7A63D9; }
        .synra-badge.b-byterover { background: #9A8A85; }
        .synra-badge.b-memobase { background: #A89C94; }
        .synra-badge.b-letta { background: #8D817A; }
        .synra-badge.b-mastra { background: #7D8F9C; }
        .synra-badge.b-emergence { background: #8696A5; }
        .synra-badge.b-supermemory { background: #A4B0B9; }
        .synra-badge.b-naive-rag { background: #C86A51; }
        .synra-badge.b-naive-rag-blue { background: #4C6EF5; }
        .synra-badge.b-presidio { background: #2E9F5A; }
        .synra-badge.b-spacy { background: #EB7A29; }
        .synra-badge.b-gliner { background: #7F73D9; }
        .synra-badge.b-precision { background: #2E9F5A; }
        .synra-badge.b-recall { background: #EB7A29; }
        .synra-badge.b-f1 { background: #7A63D9; }
        .synra-badge.b-detect { background: #DE2863; }
        .synra-badge.b-evidence { background: #2E8FE0; }
        .synra-badge.b-auto { background: #2E9F5A; }
        .synra-badge.b-first { background: #CF7459; }
        .synra-badge.b-retry { background: #D5BA92; color: #1b0d05; }

        .synra-bar-track {
          height: 22px;
          background: rgba(255,255,255,0.035);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .synra-bar-fill {
          height: 100%;
          width: 0;
          border-radius: 4px;
          transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .synra-bench-card.visible .synra-bar-fill { width: var(--pct); }
        .synra-bar-row:nth-child(1) .synra-bar-fill { transition-delay: 0.05s; }
        .synra-bar-row:nth-child(2) .synra-bar-fill { transition-delay: 0.12s; }
        .synra-bar-row:nth-child(3) .synra-bar-fill { transition-delay: 0.19s; }
        .synra-bar-row:nth-child(4) .synra-bar-fill { transition-delay: 0.26s; }
        .synra-bar-row:nth-child(5) .synra-bar-fill { transition-delay: 0.33s; }
        .synra-bar-row:nth-child(6) .synra-bar-fill { transition-delay: 0.40s; }

        /* SYNRA Bar */
        .synra-bar-fill.f-synra {
          background: #F9F3EA;
          border: 1.5px solid #D5BA92;
          box-shadow: 0 0 14px rgba(249, 243, 234, 0.2);
        }
        
        /* Competitor Bars */
        .synra-bar-fill.f-mem0 { background: #C86A51; }
        .synra-bar-fill.f-zep { background: #7A63D9; }
        .synra-bar-fill.f-byterover { background: #9A8A85; }
        .synra-bar-fill.f-memobase { background: #A89C94; }
        .synra-bar-fill.f-letta { background: #8D817A; }
        .synra-bar-fill.f-mastra { background: #7D8F9C; }
        .synra-bar-fill.f-emergence { background: #8696A5; }
        .synra-bar-fill.f-supermemory { background: #A4B0B9; }
        .synra-bar-fill.f-naive-rag { background: #C86A51; }
        .synra-bar-fill.f-naive-rag-blue { background: #4C6EF5; }
        .synra-bar-fill.f-presidio { background: #2E9F5A; }
        .synra-bar-fill.f-spacy { background: #EB7A29; }
        .synra-bar-fill.f-gliner { background: #7F73D9; }
        .synra-bar-fill.f-precision { background: #2E9F5A; }
        .synra-bar-fill.f-recall { background: #EB7A29; }
        .synra-bar-fill.f-f1 { background: #7A63D9; }
        .synra-bar-fill.f-detect { background: #DE2863; }
        .synra-bar-fill.f-evidence { background: #2E8FE0; }
        .synra-bar-fill.f-auto { background: #2E9F5A; }
        .synra-bar-fill.f-first { background: #CF7459; }
        .synra-bar-fill.f-retry { background: #D5BA92; }

        .synra-bar-value {
          text-align: right;
          font-size: 0.78rem;
          font-variant-numeric: tabular-nums;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
          white-space: nowrap;
        }
        .synra-bar-row.is-synra .synra-bar-value { 
          color: #F9F3EA; 
          font-weight: 600;
          text-shadow: 0 0 10px rgba(213, 186, 146, 0.3);
        }

        .synra-bench-note {
          margin-top: 3.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 0.75rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.4);
          text-align: center;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* Header with Logo */}
      <div className="synra-bench-header">
        <svg className="synra-bench-logo" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 4v32" />
            <path d="M20 4v32" />
            <path d="M27 4v32" />
            <path d="M4 13h32" />
            <path d="M4 20h32" />
            <path d="M4 27h32" />
          </g>
          <g fill="#000000">
            <rect x="10.5" y="11.5" width="5" height="5" rx="1" />
            <rect x="24.5" y="11.5" width="5" height="5" rx="1" />
            <rect x="10.5" y="25.5" width="5" height="5" rx="1" />
            <rect x="24.5" y="25.5" width="5" height="5" rx="1" />
          </g>
        </svg>
        <span className="synra-bench-eyebrow">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D5BA92', display: 'inline-block' }}></span>
          Benchmarks
        </span>
        <h2 id="bench-heading">Measured, not claimed.</h2>
        <p className="synra-bench-lead">
          Measured results across context size, answer quality, privacy protection, and memory control. Here is how today's tools score, and where Synra fits.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="synra-bench-stats">
        <div className="synra-stat-card">
          <span className="synra-stat-num">94%</span>
          <span className="synra-stat-label">Recall on long conversations<em>vs 74% for Letta</em></span>
        </div>
        <div className="synra-stat-card">
          <span className="synra-stat-num">95.5%</span>
          <span className="synra-stat-label">Recall across many chats<em>vs 71.2% for Zep</em></span>
        </div>
        <div className="synra-stat-card">
          <span className="synra-stat-num">118</span>
          <span className="synra-stat-label">Tokens per query<em>vs 4,184 for Naive RAG</em></span>
        </div>
        <div className="synra-stat-card">
          <span className="synra-stat-num">96.5%</span>
          <span className="synra-stat-label">PII redaction precision<em>Combined regex, NER, credentials</em></span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="synra-bench-tabs" role="tablist" aria-label="Benchmark Categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`synra-bench-tab ${activeTab === cat.id ? 'active' : ''}`}
            onClick={() => setActiveTab(cat.id)}
            role="tab"
            aria-selected={activeTab === cat.id}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Group 1: Memory Retention */}
      {(activeTab === 'all' || activeTab === 'memory') && (
        <div className="synra-bench-group">
          <h3 className="synra-bench-group-title">Memory Retention</h3>
          <div className="synra-bench-grid">
            
            {/* Long conversations */}
            <div className="synra-bench-card">
              <h4>Remembering long conversations</h4>
              <p className="desc">Can the AI recall what was said weeks ago? Longer bar is better.</p>
              <div className="synra-bar-list">
                <div className="synra-bar-row is-synra">
                  <span className="synra-bar-label">
                    <span className="synra-badge b-synra">
                      <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="4" r="1.5"/><circle cx="10" cy="4" r="1.5"/><circle cx="16" cy="4" r="1.5"/><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/><circle cx="4" cy="16" r="1.5"/><circle cx="10" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/></svg>
                    </span>
                    SYNRA
                  </span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-synra" style={{ ['--pct' as any]: '94%' }}></div></div>
                  <span className="synra-bar-value">94%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-mem0">M</span>Mem0</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-mem0" style={{ ['--pct' as any]: '92.5%' }}></div></div>
                  <span className="synra-bar-value">92.5%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-byterover">B</span>ByteRover</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-byterover" style={{ ['--pct' as any]: '92.2%' }}></div></div>
                  <span className="synra-bar-value">92.2%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-memobase">M</span>Memobase</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-memobase" style={{ ['--pct' as any]: '75.8%' }}></div></div>
                  <span className="synra-bar-value">75.8%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-zep">Z</span>Zep</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-zep" style={{ ['--pct' as any]: '75.1%' }}></div></div>
                  <span className="synra-bar-value">75.1%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-letta">L</span>Letta</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-letta" style={{ ['--pct' as any]: '74%' }}></div></div>
                  <span className="synra-bar-value">74%</span>
                </div>
              </div>
            </div>

            {/* Across many chats */}
            <div className="synra-bench-card">
              <h4>Remembering across many chats</h4>
              <p className="desc">Can the AI keep track of facts over many separate chats? Longer bar is better.</p>
              <div className="synra-bar-list">
                <div className="synra-bar-row is-synra">
                  <span className="synra-bar-label">
                    <span className="synra-badge b-synra">
                      <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="4" r="1.5"/><circle cx="10" cy="4" r="1.5"/><circle cx="16" cy="4" r="1.5"/><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/><circle cx="4" cy="16" r="1.5"/><circle cx="10" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/></svg>
                    </span>
                    SYNRA
                  </span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-synra" style={{ ['--pct' as any]: '95.5%' }}></div></div>
                  <span className="synra-bar-value">95.5%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-mastra">M</span>Mastra</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-mastra" style={{ ['--pct' as any]: '94.87%' }}></div></div>
                  <span className="synra-bar-value">94.87%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-mem0">M</span>Mem0</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-mem0" style={{ ['--pct' as any]: '94.4%' }}></div></div>
                  <span className="synra-bar-value">94.4%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-emergence">E</span>Emergence</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-emergence" style={{ ['--pct' as any]: '86%' }}></div></div>
                  <span className="synra-bar-value">86%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-supermemory">S</span>Supermemory</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-supermemory" style={{ ['--pct' as any]: '85.2%' }}></div></div>
                  <span className="synra-bar-value">85.2%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-zep">Z</span>Zep</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-zep" style={{ ['--pct' as any]: '71.2%' }}></div></div>
                  <span className="synra-bar-value">71.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group 2: Efficiency */}
      {(activeTab === 'all' || activeTab === 'efficiency') && (
        <div className="synra-bench-group">
          <h3 className="synra-bench-group-title">Efficiency</h3>
          <div className="synra-bench-grid">
            
            {/* Tokens per query */}
            <div className="synra-bench-card">
              <h4>Tokens per query</h4>
              <p className="desc">Context sent to the model. Lower is better.</p>
              <div className="synra-bar-list">
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-mem0">M</span>Mem0</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-mem0" style={{ ['--pct' as any]: '100%' }}></div></div>
                  <span className="synra-bar-value">6,900</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-naive-rag">N</span>Naive RAG</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-naive-rag" style={{ ['--pct' as any]: '60.6%' }}></div></div>
                  <span className="synra-bar-value">4,184</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-zep">Z</span>Zep</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-zep" style={{ ['--pct' as any]: '23.1%' }}></div></div>
                  <span className="synra-bar-value">1,600</span>
                </div>
                <div className="synra-bar-row is-synra">
                  <span className="synra-bar-label">
                    <span className="synra-badge b-synra">
                      <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="4" r="1.5"/><circle cx="10" cy="4" r="1.5"/><circle cx="16" cy="4" r="1.5"/><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/><circle cx="4" cy="16" r="1.5"/><circle cx="10" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/></svg>
                    </span>
                    SYNRA
                  </span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-synra" style={{ ['--pct' as any]: '1.7%' }}></div></div>
                  <span className="synra-bar-value">118</span>
                </div>
              </div>
            </div>

            {/* Response relevance */}
            <div className="synra-bench-card">
              <h4>Response relevance</h4>
              <p className="desc">Mean score out of 5. Higher is better.</p>
              <div className="synra-bar-list">
                <div className="synra-bar-row is-synra">
                  <span className="synra-bar-label">
                    <span className="synra-badge b-synra">
                      <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="4" r="1.5"/><circle cx="10" cy="4" r="1.5"/><circle cx="16" cy="4" r="1.5"/><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/><circle cx="4" cy="16" r="1.5"/><circle cx="10" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/></svg>
                    </span>
                    SYNRA
                  </span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-synra" style={{ ['--pct' as any]: '83%' }}></div></div>
                  <span className="synra-bar-value">4.15</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-naive-rag-blue">N</span>Naive RAG</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-naive-rag-blue" style={{ ['--pct' as any]: '76%' }}></div></div>
                  <span className="synra-bar-value">3.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group 3: Privacy Protection */}
      {(activeTab === 'all' || activeTab === 'privacy') && (
        <div className="synra-bench-group">
          <h3 className="synra-bench-group-title">Privacy Protection</h3>
          <div className="synra-bench-grid">
            
            {/* Spotting private data in documents */}
            <div className="synra-bench-card">
              <h4>Spotting private data in documents</h4>
              <p className="desc">Names, ID numbers, emails. Score from 0 to 1. Longer bar is better.</p>
              <div className="synra-bar-list">
                <div className="synra-bar-row is-synra">
                  <span className="synra-bar-label">
                    <span className="synra-badge b-synra">
                      <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="4" r="1.5"/><circle cx="10" cy="4" r="1.5"/><circle cx="16" cy="4" r="1.5"/><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/><circle cx="4" cy="16" r="1.5"/><circle cx="10" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/></svg>
                    </span>
                    SYNRA
                  </span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-synra" style={{ ['--pct' as any]: '91%' }}></div></div>
                  <span className="synra-bar-value">0.91</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-presidio">P</span>Presidio</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-presidio" style={{ ['--pct' as any]: '63%' }}></div></div>
                  <span className="synra-bar-value">0.63</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-spacy">S</span>spaCy</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-spacy" style={{ ['--pct' as any]: '52%' }}></div></div>
                  <span className="synra-bar-value">0.52</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-gliner">G</span>GLiNER</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-gliner" style={{ ['--pct' as any]: '44%' }}></div></div>
                  <span className="synra-bar-value">0.44</span>
                </div>
              </div>
            </div>

            {/* Spotting private data in chats */}
            <div className="synra-bench-card">
              <h4>Spotting private data in chats</h4>
              <p className="desc">Same task, but inside chat messages. Score from 0 to 1. Longer bar is better.</p>
              <div className="synra-bar-list">
                <div className="synra-bar-row is-synra">
                  <span className="synra-bar-label">
                    <span className="synra-badge b-synra">
                      <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="4" r="1.5"/><circle cx="10" cy="4" r="1.5"/><circle cx="16" cy="4" r="1.5"/><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/><circle cx="4" cy="16" r="1.5"/><circle cx="10" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/></svg>
                    </span>
                    SYNRA
                  </span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-synra" style={{ ['--pct' as any]: '74%' }}></div></div>
                  <span className="synra-bar-value">0.74</span>
                </div>
              </div>
            </div>

            {/* PII redaction accuracy */}
            <div className="synra-bench-card">
              <h4>PII redaction accuracy</h4>
              <p className="desc">Combined regex, NER and credential layers. Higher is better.</p>
              <div className="synra-bar-list">
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-precision">P</span>Precision</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-precision" style={{ ['--pct' as any]: '96.5%' }}></div></div>
                  <span className="synra-bar-value">96.5%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-recall">R</span>Recall</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-recall" style={{ ['--pct' as any]: '96%' }}></div></div>
                  <span className="synra-bar-value">96%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-f1">F</span>F1</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-f1" style={{ ['--pct' as any]: '96.2%' }}></div></div>
                  <span className="synra-bar-value">96.2%</span>
                </div>
              </div>
            </div>

            {/* Decision extraction */}
            <div className="synra-bench-card">
              <h4>Decision extraction</h4>
              <p className="desc">2,000 synthetic communications, 875 decisions. Higher is better.</p>
              <div className="synra-bar-list">
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-detect">D</span>Detection F1</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-detect" style={{ ['--pct' as any]: '86.3%' }}></div></div>
                  <span className="synra-bar-value">86.3%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-evidence">E</span>Evidence binding</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-evidence" style={{ ['--pct' as any]: '99.4%' }}></div></div>
                  <span className="synra-bar-value">99.4%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-auto">A</span>Auto-confirm</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-auto" style={{ ['--pct' as any]: '96.5%' }}></div></div>
                  <span className="synra-bar-value">96.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group 4: Reliability */}
      {(activeTab === 'all' || activeTab === 'reliability') && (
        <div className="synra-bench-group">
          <h3 className="synra-bench-group-title">Reliability</h3>
          <div className="synra-bench-grid">
            
            {/* Deletion completeness */}
            <div className="synra-bench-card">
              <h4>Deletion completeness</h4>
              <p className="desc">Derived memory nodes removed. Higher is better.</p>
              <div className="synra-bar-list">
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-first">F</span>First pass</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-first" style={{ ['--pct' as any]: '94.3%' }}></div></div>
                  <span className="synra-bar-value">94.3%</span>
                </div>
                <div className="synra-bar-row">
                  <span className="synra-bar-label"><span className="synra-badge b-retry">A</span>After retries</span>
                  <div className="synra-bar-track"><div className="synra-bar-fill f-retry" style={{ ['--pct' as any]: '99.4%' }}></div></div>
                  <span className="synra-bar-value">99.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="synra-bench-note">
        Sources: Mem0 2026 report; arXiv 2608.29606 and 2609.22200; Tonic.ai benchmark. Published results and Synra internal benchmarks. Some scores are reported by the companies themselves, so setups differ.
      </p>
    </section>
  );
};

export default BenchmarksSection;
