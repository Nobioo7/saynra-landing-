import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const BenefitsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-[1400px] mx-auto bg-black py-16 px-4 sm:py-24 sm:px-6 md:px-10 text-white overflow-hidden"
      id="benefits"
      aria-labelledby="benefits-heading"
    >
      {/* Subtle radial ambient */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(30,58,138,0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Heading */}
      <FadeUp className="relative z-10">
        <h2
          id="benefits-heading"
          className="text-white text-[1.875rem] sm:text-[2.25rem] md:text-[3rem] font-light text-center leading-[1.1] tracking-[-0.04em] mb-12 sm:mb-24"
        >
          Key Benefits
        </h2>
      </FadeUp>

      {/* Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1 */}
        <FadeUp delay={0.1}>
          <motion.article
            className="relative h-[380px] sm:h-[460px] rounded-2xl bg-[#0a0a0a] overflow-hidden p-6 sm:p-8"
            whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
          >
            <div
              className="absolute rounded-full bg-[#1e3a8a] opacity-40 pointer-events-none top-1/2 -translate-y-1/2 -left-[420px] w-[460px] h-[460px]"
              style={{ filter: 'blur(64px)' }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-white text-[1.25rem] sm:text-[1.5rem] font-light leading-[1.25] m-0">
                Persistent Context<br />Across Every Tool
              </h3>
              <p className="text-[13px] sm:text-[14px] leading-[1.625] text-white/70 font-light mt-12 sm:mt-20 max-w-[280px]">
                Synra integrates with Cursor and Claude via its MCP Server, and captures web chats via a Chrome Extension. It remembers your architecture, codebase, and past decisions, retrieving the right knowledge the moment you need it.
              </p>
            </div>
          </motion.article>
        </FadeUp>

        {/* Card 2 — Video */}
        <FadeUp delay={0.2}>
          <motion.article
            className="relative h-[380px] sm:h-[460px] rounded-2xl bg-[#0a0a0a] overflow-hidden flex flex-col p-0"
            whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
          >
            <div className="relative w-full overflow-hidden h-[75%] shrink-0">
              <video
                className="w-full h-full object-cover block"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_072701_f6a01abb-eb30-4559-9d6e-774362defbc3.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0a0a0a]"
                aria-hidden="true"
              />
            </div>
            <div className="grow flex items-center justify-start p-6 sm:p-8">
              <h3 className="text-white text-[1.25rem] sm:text-[1.5rem] font-light leading-[1.25] m-0 text-left">
                Dual-Write Storage<br />Local-First Vault
              </h3>
            </div>
          </motion.article>
        </FadeUp>

        {/* Card 3 */}
        <FadeUp delay={0.3}>
          <motion.article
            className="relative h-[380px] sm:h-[460px] rounded-2xl bg-[#0a0a0a] overflow-hidden p-6 sm:p-8"
            whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
          >
            <div
              className="absolute rounded-full bg-[#1e3a8a] opacity-40 pointer-events-none -top-28 -right-28 w-56 h-56"
              style={{ filter: 'blur(64px)' }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-white text-[1.25rem] sm:text-[1.5rem] font-light leading-[1.25] m-0">
                Anatomical Brain Graph<br />Of Your Knowledge
              </h3>
              <p className="text-[13px] sm:text-[14px] leading-[1.625] text-white/70 font-light mt-auto max-w-[320px]">
                Synra uses a local LLM to extract concepts as [[wikilinks]] and maps them to a 4K Canvas2D anatomical brain. Your knowledge compounds, visualized by Frontal, Temporal, and Parietal regions, not just a list.
              </p>
            </div>
          </motion.article>
        </FadeUp>
      </div>
    </section>
  );
};

export default BenefitsSection;
