import React, { useEffect, useRef } from 'react';

export const HeroSection: React.FC = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const frameEl = frameRef.current;
    const canvas = canvasRef.current;
    if (!frameEl || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bloom = document.createElement('canvas');
    const bctx = bloom.getContext('2d');
    if (!bctx) return;

    const typedEl = typedRef.current;
    const caretEl = caretRef.current;
    const heroEl = heroRef.current;
    const section = frameEl.closest('.ring-section') as HTMLElement | null;

    const TWO_PI = Math.PI * 2;
    const RI_BASE = 435;
    const RO_BASE = 652;
    const STRANDS = 196;
    const SEG = 40;

    let FW = 0, FH = 0, W = 0, H = 0, U = 1, DPR = 1, shiftPx = 0;
    let RI = 0, RO = 0;

    let bodyGrad: CanvasGradient, edgeGrad: CanvasGradient, edgeGradB: CanvasGradient;
    let ambientGrad: CanvasGradient, haloGrad: CanvasGradient, innerGrad: CanvasGradient;

    const POW = new Float64Array(SEG + 1);
    const QQ = new Float64Array(SEG + 1);
    const SINPQ = new Float64Array(SEG + 1);
    const HWF = new Float64Array(SEG + 1);
    const RSF = new Float64Array(SEG + 1);

    function smoothstep01(x: number) {
      x = x < 0 ? 0 : x > 1 ? 1 : x;
      return x * x * (3 - 2 * x);
    }

    for (let j = 0; j <= SEG; j++) {
      const q = j / SEG;
      POW[j] = Math.pow(1 - q, 4.2);
      QQ[j] = 0.05 * q * q;
      SINPQ[j] = Math.sin(Math.PI * q);
      const s = smoothstep01(q / 0.28);
      HWF[j] = 0.15 + 3.3 * s * (1 - 0.25 * q);
      RSF[j] = RI_BASE + (RO_BASE - RI_BASE) * q;
    }

    const PXa = new Float64Array(SEG + 1), PYa = new Float64Array(SEG + 1);
    const LXa = new Float64Array(SEG + 1), LYa = new Float64Array(SEG + 1);
    const RXa = new Float64Array(SEG + 1), RYa = new Float64Array(SEG + 1);

    function annulusPath(c: CanvasRenderingContext2D, r0: number, r1: number) {
      c.beginPath();
      c.arc(0, 0, r1, 0, TWO_PI, false);
      c.arc(0, 0, r0, 0, TWO_PI, true);
      c.closePath();
    }

    function buildGradients() {
      bodyGrad = ctx!.createRadialGradient(0, 0, RI, 0, 0, RO);
      bodyGrad.addColorStop(0.00, '#b01e50');
      bodyGrad.addColorStop(0.12, '#9c1236');
      bodyGrad.addColorStop(0.40, '#860c18');
      bodyGrad.addColorStop(0.70, '#9c1a0a');
      bodyGrad.addColorStop(0.90, '#c63c0e');
      bodyGrad.addColorStop(1.00, '#e85a18');

      edgeGrad = ctx!.createRadialGradient(0, 0, RI, 0, 0, RO);
      edgeGrad.addColorStop(0.00, 'rgba(255,130,185,.85)');
      edgeGrad.addColorStop(0.08, 'rgba(255,84,138,.95)');
      edgeGrad.addColorStop(0.28, 'rgba(255,56,80,.95)');
      edgeGrad.addColorStop(0.55, 'rgba(255,58,44,.95)');
      edgeGrad.addColorStop(0.80, 'rgba(255,92,36,1)');
      edgeGrad.addColorStop(0.94, 'rgba(255,122,44,1)');
      edgeGrad.addColorStop(1.00, 'rgba(255,150,70,1)');

      edgeGradB = bctx!.createRadialGradient(0, 0, RI, 0, 0, RO);
      edgeGradB.addColorStop(0.00, 'rgba(255,130,185,.85)');
      edgeGradB.addColorStop(0.08, 'rgba(255,84,138,.95)');
      edgeGradB.addColorStop(0.28, 'rgba(255,56,80,.95)');
      edgeGradB.addColorStop(0.55, 'rgba(255,58,44,.95)');
      edgeGradB.addColorStop(0.80, 'rgba(255,92,36,1)');
      edgeGradB.addColorStop(0.94, 'rgba(255,122,44,1)');
      edgeGradB.addColorStop(1.00, 'rgba(255,150,70,1)');

      ambientGrad = ctx!.createRadialGradient(0, 0, RI, 0, 0, RO);
      ambientGrad.addColorStop(0.00, 'rgba(170,14,50,.35)');
      ambientGrad.addColorStop(0.55, 'rgba(120,8,14,.45)');
      ambientGrad.addColorStop(1.00, 'rgba(170,40,6,.40)');

      haloGrad = ctx!.createRadialGradient(0, 0, RO - 16 * U, 0, 0, RO + 70 * U);
      haloGrad.addColorStop(0.00, 'rgba(255,110,30,.42)');
      haloGrad.addColorStop(0.45, 'rgba(255,80,15,.16)');
      haloGrad.addColorStop(1.00, 'rgba(255,60,10,0)');

      innerGrad = ctx!.createRadialGradient(0, 0, RI - 70 * U, 0, 0, RI + 30 * U);
      innerGrad.addColorStop(0.00, 'rgba(255,120,170,0)');
      innerGrad.addColorStop(0.72, 'rgba(255,120,170,.09)');
      innerGrad.addColorStop(1.00, 'rgba(255,120,170,0)');
    }

    function setCSSVars() {
      if (section) {
        section.style.setProperty('--u', U.toFixed(4) + 'px');
        section.style.setProperty('--shift', shiftPx.toFixed(2) + 'px');
      }
    }

    function resize() {
      if (!frameEl || !canvas) return;
      FW = frameEl.clientWidth;
      FH = frameEl.clientHeight;
      if (!FW || !FH) return;

      const phone = window.innerWidth < 768;
      U = phone ? FW / 600 : Math.min(FW / 1052, FH / 780);
      if (!isFinite(U) || U <= 0) U = 1;

      W = FW; H = FH;
      DPR = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';

      bloom.width = Math.max(1, Math.round(W * DPR * 0.32));
      bloom.height = Math.max(1, Math.round(H * DPR * 0.32));

      RI = RI_BASE * U;
      RO = RO_BASE * U;

      shiftPx = 0;
      setCSSVars();

      if (phone && heroEl) {
        const hh = heroEl.offsetHeight;
        const bottom = 420 * U + hh;
        shiftPx = Math.max(0, (FH - bottom) / 2);
        setCSSVars();
      }

      buildGradients();
    }

    let ptrTX = 0, ptrTY = 0, px = 0, py = 0;
    function onPointerMove(e: PointerEvent) {
      if (!frameEl) return;
      const r = frameEl.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      ptrTX = nx < -1 ? -1 : nx > 1 ? 1 : nx;
      ptrTY = ny < -1 ? -1 : ny > 1 ? 1 : ny;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    function drawFins(t: number, spin: number, k: number) {
      const step = TWO_PI / STRANDS;
      let startIdx = Math.round((-Math.PI / 2 - spin) / step) % STRANDS;
      if (startIdx < 0) startIdx += STRANDS;

      const lw = 1.45 * U;
      const blw = 5.3 * U;

      for (let n = 0; n < STRANDS; n++) {
        const i = (startIdx + n) % STRANDS;
        const base = i * step + spin;
        const wob = Math.sin(3 * base + 0.4 * t);

        for (let j = 0; j <= SEG; j++) {
          const r = RSF[j] * U;
          const th = base + k * POW[j] + k * QQ[j] + 0.02 * SINPQ[j] * wob;
          PXa[j] = r * Math.cos(th);
          PYa[j] = r * Math.sin(th);
        }

        for (let j = 0; j <= SEG; j++) {
          const j0 = j > 0 ? j - 1 : 0;
          const j1 = j < SEG ? j + 1 : SEG;
          let tx = PXa[j1] - PXa[j0];
          let ty = PYa[j1] - PYa[j0];
          const len = Math.sqrt(tx * tx + ty * ty) || 1;
          tx /= len; ty /= len;
          const nx = -ty, ny = tx;
          const hw = HWF[j] * U;
          LXa[j] = PXa[j] + nx * hw; LYa[j] = PYa[j] + ny * hw;
          RXa[j] = PXa[j] - nx * hw; RYa[j] = PYa[j] - ny * hw;
        }

        ctx!.beginPath();
        ctx!.moveTo(LXa[0], LYa[0]);
        for (let j = 1; j <= SEG; j++) ctx!.lineTo(LXa[j], LYa[j]);
        for (let j = SEG; j >= 0; j--) ctx!.lineTo(RXa[j], RYa[j]);
        ctx!.closePath();
        ctx!.fillStyle = bodyGrad;
        ctx!.fill();

        ctx!.globalCompositeOperation = 'lighter';
        ctx!.beginPath();
        ctx!.moveTo(LXa[0], LYa[0]);
        for (let j = 1; j <= SEG; j++) ctx!.lineTo(LXa[j], LYa[j]);
        ctx!.lineWidth = lw;
        ctx!.strokeStyle = edgeGrad;
        ctx!.stroke();
        ctx!.globalCompositeOperation = 'source-over';

        bctx!.beginPath();
        bctx!.moveTo(LXa[0], LYa[0]);
        for (let j = 1; j <= SEG; j++) bctx!.lineTo(LXa[j], LYa[j]);
        bctx!.lineWidth = blw;
        bctx!.strokeStyle = edgeGradB;
        bctx!.stroke();
      }
    }

    function render(t: number) {
      if (!ctx || !bctx) return;
      const spin = 0.06 * t;
      const k = 0.42 * (1 + 0.12 * Math.sin(0.55 * t));

      const baseCx = W / 2 + 34 * U;
      const baseCy = -212 * U + shiftPx;

      const cx = baseCx + px * 14 * U;
      const cy = baseCy + py * 10 * U;
      const ys = 1.03 + py * 0.035;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.filter = 'none';
      ctx.clearRect(0, 0, W, H);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, ys);

      annulusPath(ctx, RI, RO);
      ctx.fillStyle = ambientGrad;
      ctx.fill();

      annulusPath(ctx, RI - 70 * U, RI + 30 * U);
      ctx.fillStyle = innerGrad;
      ctx.fill();

      annulusPath(ctx, RO - 16 * U, RO + 70 * U);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.clearRect(0, 0, bloom.width, bloom.height);
      const bs = 0.32 * DPR;
      bctx.setTransform(bs, 0, 0, bs, 0, 0);
      bctx.translate(cx, cy);
      bctx.scale(1, ys);
      bctx.globalAlpha = 0.7;
      bctx.globalCompositeOperation = 'lighter';

      drawFins(t, spin, k);

      ctx.beginPath();
      ctx.arc(0, 0, RO, 0, TWO_PI);
      ctx.lineWidth = 1.6 * U;
      ctx.strokeStyle = 'rgba(255,140,60,.85)';
      ctx.stroke();

      bctx.globalAlpha = 1;
      bctx.lineWidth = 9 * U;
      bctx.strokeStyle = 'rgba(255,120,40,.9)';
      bctx.beginPath(); bctx.arc(0, 0, RO, 0, TWO_PI); bctx.stroke();

      bctx.lineWidth = 5 * U;
      bctx.strokeStyle = 'rgba(255,90,150,.75)';
      bctx.beginPath(); bctx.arc(0, 0, RI, 0, TWO_PI); bctx.stroke();

      ctx.restore();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = 'blur(' + (8 * U * DPR).toFixed(2) + 'px)';
      ctx.drawImage(bloom, 0, 0, canvas!.width, canvas!.height);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'source-over';
    }

    const WORDS = ['Memory', 'Context', 'Recall'];
    const HOLD = 2.6, DEL = 0.07, EMPTY = 0.25, TYPE = 0.10, POST = 0.15, BLINK = 0.55;

    type Seg = { type: string; s: number; d: number; w: number };
    const SEGS: Seg[] = [];
    let PERIOD = 1;

    let acc = 0;
    for (let i = 0; i < WORDS.length; i++) {
      SEGS.push({ type: 'hold', s: acc, d: HOLD, w: i }); acc += HOLD;
      const dDel = WORDS[i].length * DEL;
      SEGS.push({ type: 'del', s: acc, d: dDel, w: i }); acc += dDel;
      SEGS.push({ type: 'empty', s: acc, d: EMPTY, w: i }); acc += EMPTY;
      const nx = (i + 1) % WORDS.length;
      const dType = WORDS[nx].length * TYPE;
      SEGS.push({ type: 'type', s: acc, d: dType, w: nx }); acc += dType;
      SEGS.push({ type: 'post', s: acc, d: POST, w: nx }); acc += POST;
    }
    PERIOD = acc;

    let lastStr: string | null = null;
    let lastOn: string | null = null;

    function updateText(t: number) {
      if (!typedEl || !caretEl) return;
      const p = ((t % PERIOD) + PERIOD) % PERIOD;
      let seg = SEGS[SEGS.length - 1];
      for (let i = 0; i < SEGS.length; i++) {
        const s = SEGS[i];
        if (p >= s.s && p < s.s + s.d) { seg = s; break; }
      }
      const local = p - seg.s;
      const w = WORDS[seg.w];
      let str = '';
      let on = true;
      if (seg.type === 'hold') {
        str = w;
        on = Math.floor(local / BLINK) % 2 === 0;
      } else if (seg.type === 'del') {
        str = w.slice(0, Math.floor(w.length * (1 - local / seg.d)));
      } else if (seg.type === 'empty') {
        str = '';
      } else if (seg.type === 'type') {
        str = w.slice(0, Math.min(w.length, Math.floor(local / TYPE)));
      } else {
        str = w;
        on = Math.floor(local / BLINK) % 2 === 0;
      }
      if (str !== lastStr) { typedEl.textContent = str; lastStr = str; }
      const o = on ? '1' : '0';
      if (o !== lastOn) { caretEl.style.opacity = o; lastOn = o; }
    }

    let rafId = 0;
    function loop() {
      rafId = requestAnimationFrame(loop);
      px += (ptrTX - px) * 0.05;
      py += (ptrTY - py) * 0.05;
      const t = performance.now() / 1000;
      render(t);
      updateText(t);
    }

    resize();
    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <section className="ring-section relative w-full h-[100vh] overflow-hidden" id="hero-section">
      <div
        ref={frameRef}
        id="hero-frame"
        className="frame absolute inset-[7.2vh_5vw] border border-white/[.09] rounded-[calc(14*var(--u))] overflow-hidden bg-black isolate"
      >
        <canvas ref={canvasRef} id="ring-hero" className="ring-canvas absolute inset-0 block w-full h-full z-[1]" aria-hidden="true" />

        <header className="nav absolute top-[calc(24*var(--u))] left-[calc(26*var(--u))] right-[calc(24*var(--u))] flex items-center justify-between z-[3] pointer-events-none">
          <a className="brand flex items-center gap-[calc(9*var(--u))] text-white text-[calc(17.5*var(--u))] font-medium tracking-tight select-none pointer-events-auto" href="#hero-section" aria-label="Synra home">
            <svg className="logo block w-[calc(20*var(--u))] h-[calc(20*var(--u))] shrink-0" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M10 1.6 L15.9 6.1 L10 10.6 L4.1 6.1 Z" />
              <path d="M4.1 11.1 L10 18.4 L15.9 11.1" />
            </svg>
            <span>Synra</span>
          </a>
          <div className="nav-right flex items-center gap-[calc(4*var(--u))] pointer-events-auto">
            <nav className="pill hidden md:flex items-center gap-[calc(18*var(--u))] h-[calc(29*var(--u))] px-[calc(14*var(--u))] rounded-[calc(8*var(--u))] bg-[rgba(150,150,150,.38)] backdrop-blur-[14px] text-[calc(14*var(--u))] leading-none" aria-label="Primary">
              <a href="#benefits" className="text-white/90 hover:text-white transition-colors">Features</a>
              <a href="#features" className="text-white/90 hover:text-white transition-colors">Roadmap</a>
              <a href="#solace-page" className="text-white/90 hover:text-white transition-colors">FAQ</a>
            </nav>
            <a className="connect inline-flex items-center justify-center h-[calc(29*var(--u))] px-[calc(14*var(--u))] rounded-[calc(8*var(--u))] bg-white text-[#0a0a0a] text-[calc(14*var(--u))] font-medium leading-none hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(255,255,255,.18)] transition-all" href="#solace-page">
              Contact
            </a>
          </div>
        </header>

        <div ref={heroRef} id="hero-content" className="hero absolute left-0 right-0 top-[calc(420*var(--u)+var(--shift))] text-center z-[2]">
          <h1 className="headline flex items-center justify-center m-0 text-[clamp(48px,calc(176*var(--u)),22vw)] leading-none font-semibold tracking-[-0.03em]">
            <span ref={typedRef} className="word block whitespace-pre bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(12deg, #fffaf6 28%, #ffe6d6 46%, #ffbc98 66%, #ff8f62 88%, #ff7a4c 100%)' }}>Memory</span>
            <span ref={caretRef} className="caret block shrink-0 w-[calc(1.6*var(--u))] h-[calc(124*var(--u))] ml-[calc(7*var(--u))] rounded-[calc(1*var(--u))] bg-[#ffb48c] shadow-[0_0_calc(10*var(--u))_rgba(255,150,110,.55)]" />
          </h1>
          <p className="subline mt-[calc(26*var(--u))] text-[calc(18*var(--u))] leading-[calc(24*var(--u))] font-normal text-white/90 tracking-tight">
            Your AI forgets everything. Synra doesn't.<br />
            Local-first persistent context for Cursor, Claude, and ChatGPT.
          </p>
          <a className="cta inline-flex items-center justify-center mt-[calc(19*var(--u))] h-[calc(41*var(--u))] px-[calc(17*var(--u))] rounded-[calc(10*var(--u))] bg-white text-[#0a0a0a] text-[calc(15*var(--u))] font-medium leading-none hover:-translate-y-[2px] hover:shadow-[0_calc(10*var(--u))_calc(34*var(--u))_rgba(255,120,60,.45)] transition-all" href="#features">
            Open Synra
          </a>
          <p className="platforms mt-[calc(12*var(--u))] text-[calc(13*var(--u))] leading-tight text-white/50">
            Runs locally via Ollama · Obsidian-style Markdown Vault · MCP Server
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

