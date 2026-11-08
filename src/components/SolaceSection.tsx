import React, { useEffect, useRef, useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'What exactly is Synra?',
    answer:
      'Synra is a local-first AI context OS. It acts as a persistent memory layer for your AI tools, combining an Obsidian-style Markdown vault, a local LLM, and an anatomical brain graph.',
  },
  {
    question: 'How does it remember my context?',
    answer:
      'Every memory is dual-written to a Supabase database and saved as a local .md file in your synra-vault folder. A local Llama 3.2 model parses your conversations and extracts [[wikilinks]] to connect the dots.',
  },
  {
    question: 'Is my data private?',
    answer:
      'Yes. Unlike other tools, Synra uses your local GPU via Ollama to process LLM requests. Your Markdown files stay on your hard drive, and your database runs on your own Supabase instance. Nothing is used to train third-party models.',
  },
  {
    question: 'What tools does Synra connect to?',
    answer:
      'Synra connects to Cursor and Claude Desktop via an MCP Server. It captures context from ChatGPT and Claude Web via a Chrome Extension. It also features a built-in voice assistant powered by the Web Speech API.',
  },
];

export const SolaceSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let step = 0;
    let cols = 0;
    let rows = 0;
    let seed: [number, number, number][] = [];
    let mx = -9999;
    let my = -9999;
    let tmx = -9999;
    let tmy = -9999;

    const hash = (i: number, j: number) => {
      const h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
      return h - Math.floor(h);
    };

    function size() {
      if (!cv || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      step = Math.max(14, Math.min(W / 1600, H / 940) * 20.5);
      cols = Math.ceil(W / step) + 1;
      rows = Math.ceil(H / step) + 1;
      seed = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          seed.push([hash(i, j), hash(i + 71, j + 13), hash(i + 9, j + 97)]);
        }
      }
    }

    size();
    window.addEventListener('resize', size);

    const onPointerMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      tmx = e.clientX - r.left;
      tmy = e.clientY - r.top;
    };
    const onPointerLeave = () => {
      tmx = -9999;
      tmy = -9999;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    const C0 = [226, 106, 24];
    const C1 = [248, 150, 64];
    const C2 = [255, 214, 170];
    const mix = (a: number[], b: number[], t: number) =>
      a.map((v, k) => Math.round(v + (b[k] - v) * t));

    let rafId = 0;
    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      mx += (tmx - mx) * 0.12;
      my += (tmy - my) * 0.12;
      const top = H * 0.1;
      const full = H * 0.36;
      const R = step * 0.37;

      for (let j = 0; j < rows; j++) {
        const y = j * step + step * 0.5;
        if (y < top - step * 2) continue;
        const v = Math.min(1, Math.max(0, (y - top) / (full - top)));
        const col =
          v < 0.55
            ? mix(C0, C1, v / 0.55)
            : mix(
                C1,
                C2,
                ((v - 0.55) / 0.45) * 0.85 + Math.max(0, (y - H * 0.9) / (H * 0.1)) * 0.15
              );
        ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;

        for (let i = 0; i < cols; i++) {
          const x = i * step + step * 0.5;
          const sIndex = j * cols + i;
          if (!seed[sIndex]) continue;
          const [a, b, c] = seed[sIndex];
          const wave = calm
            ? 0.7
            : 0.5 +
              0.5 *
                Math.sin(
                  t * (1.6 + b * 2.6) + a * 6.283 + Math.sin(t * 0.7 + i * 0.21 + j * 0.13) * 1.4
                );
          const keep = Math.min(1, v * 1.6 + 0.12) - a * 0.6;
          if (keep <= 0 && c > 0.08) continue;
          let s =
            (0.42 + 0.58 * Math.pow(wave, 1.3)) *
            Math.min(1, 0.5 + v * 0.6) *
            (keep > 0 ? 1 : 0.8);
          const dx = x - mx;
          const dy = y - my;
          const d2 = dx * dx + dy * dy;
          const hov = Math.exp(-d2 / (step * step * 22));
          s = Math.min(1.05, s + hov * 0.7);
          const r = R * s;
          if (r < 0.6) continue;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.2832);
          ctx.fill();
        }
      }
    }

    function loop(ms: number) {
      draw(ms / 1000);
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', size);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div id="solace-page" className="relative bg-[#050302] text-[#fbefe2] font-sans overflow-hidden">
      <main className="wrap relative min-h-screen overflow-hidden bg-[#050302] flex flex-col justify-between">
        {/* Halftone canvas background */}
        <canvas ref={canvasRef} id="dots" className="absolute inset-0 w-full h-full block z-0 pointer-events-none" aria-hidden="true" />

        <div className="content relative z-10 flex flex-col items-center min-h-screen w-full px-4 sm:px-8 py-16 sm:py-20 max-w-[1200px] mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center text-[#fbefe2]">
            Questions, answered
          </h2>

          {/* Accordion */}
          <div className="faq w-full max-w-[688px] mt-8 p-3 sm:p-5 bg-[rgba(34,18,8,.42)] border border-[rgba(255,190,120,.14)] rounded-xl backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,.45)]">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq.question} className="border-b border-[rgba(255,214,170,.14)] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                    className="flex items-center justify-between gap-4 w-full py-4 text-left font-medium text-base sm:text-lg tracking-tight text-[#fbefe2] hover:text-white transition-colors"
                  >
                    <span>{faq.question}</span>
                    <svg
                      viewBox="0 0 14 14"
                      className={`w-3.5 h-3.5 shrink-0 fill-none stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <path d="M3 5l4 4 4-4" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-4 pr-4 text-sm sm:text-base leading-relaxed text-[#d9c3ad]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact and Founder Section */}
          <footer className="w-full mt-24 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 sm:gap-12 p-8 sm:p-12 bg-gradient-to-b from-[rgba(40,20,8,.5)] to-[rgba(84,40,14,.44)] border border-[rgba(255,190,120,.12)] rounded-2xl backdrop-blur-xl">
            <div>
              <a className="brand flex items-center gap-3 text-2xl font-medium tracking-tight text-[#fbefe2]" href="#hero-section" aria-label="Synra home">
                <span className="mark grid place-items-center w-9 h-9 bg-[#fbefe2] rounded-md">
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="w-[56%] h-[56%] fill-[#1b0d05]">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="14" cy="6" r="3" />
                    <circle cx="6" cy="14" r="3" />
                    <circle cx="14" cy="14" r="3" />
                  </svg>
                </span>
                <span>Synra</span>
              </a>
              <p className="tag mt-4 max-w-md text-sm sm:text-base leading-relaxed text-[#f0dcc6]">
                A local-first developer context OS. Persistent memory for AI coding tools, complete with an Obsidian-style vault, local LLM, and anatomical 3D brain graph.
              </p>
              <p className="copy mt-6 text-xs sm:text-sm text-[#ecd8c2]">
                © Synra 2026 · All rights reserved
              </p>
            </div>

            <div className="contact-box flex flex-col justify-center gap-3 md:border-l md:border-[rgba(255,190,120,.15)] md:pl-8 pt-6 md:pt-0 border-t md:border-t-0 border-[rgba(255,190,120,.15)]">
              <p className="text-xs uppercase tracking-[0.25em] text-[#ffb48c] font-semibold">
                Founder &amp; Contact
              </p>
              <div>
                <p className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  Nabeel Khan
                </p>
                <p className="text-sm text-[#d4af37] mt-0.5 mb-2">
                  Founder &amp; Chief Technologist — Synra OS
                </p>
              </div>
              <div className="contact-list flex flex-col gap-2.5">
                <a
                  href="mailto:orbitmind595@gmail.com"
                  className="contact-item inline-flex items-center gap-2.5 text-sm sm:text-base text-[#f0dcc6] hover:text-white hover:translate-x-1 transition-all"
                  aria-label="Email Nabeel Khan"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[1.6] shrink-0">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  <span>orbitmind595@gmail.com</span>
                </a>
                <a
                  href="https://github.com/Nobioo7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item inline-flex items-center gap-2.5 text-sm sm:text-base text-[#f0dcc6] hover:text-white hover:translate-x-1 transition-all"
                  aria-label="GitHub Profile"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[1.6] shrink-0">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  <span>github.com/Nobioo7</span>
                </a>
                <a
                  href="tel:+919838336162"
                  className="contact-item inline-flex items-center gap-2.5 text-sm sm:text-base text-[#f0dcc6] hover:text-white hover:translate-x-1 transition-all"
                  aria-label="Call Nabeel Khan"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[1.6] shrink-0">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  <span>+91 98383 36162</span>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default SolaceSection;
