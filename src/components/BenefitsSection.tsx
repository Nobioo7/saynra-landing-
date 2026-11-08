import React from 'react';

export const BenefitsSection: React.FC = () => {
  return (
    <section className="benefits-section relative w-full max-w-[1400px] mx-auto bg-black py-12 px-4 sm:py-20 sm:px-6 md:px-10 text-white" id="benefits" aria-labelledby="benefits-heading">
      <h2 className="benefits-heading text-white text-[1.875rem] sm:text-[2.25rem] md:text-[3rem] font-light text-center leading-[1.1] tracking-[-0.04em] mb-12 sm:mb-24" id="benefits-heading">
        Key Benefits
      </h2>

      <div className="benefits-grid grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Benefit Card 1 */}
        <article className="benefit-card relative h-[380px] sm:h-[460px] rounded-2xl bg-[#0a0a0a] overflow-hidden p-6 sm:p-8">
          <div className="benefit-blob absolute rounded-full bg-[#1e3a8a] blur-[64px] opacity-40 pointer-events-none top-1/2 -translate-y-1/2 -left-[420px] w-[460px] h-[460px]" aria-hidden="true" />
          <div className="benefit-content relative z-10 flex flex-col h-full">
            <h3 className="benefit-title text-white text-[1.25rem] sm:text-[1.5rem] font-light leading-[1.25] m-0">
              Persistent Context<br />Across Every Tool
            </h3>
            <p className="benefit-body text-[13px] sm:text-[14px] leading-[1.625] text-white/70 font-light mt-12 sm:mt-20 max-w-[280px]">
              Synra integrates with Cursor and Claude via its MCP Server, and captures web chats via a Chrome Extension. It remembers your architecture, codebase, and past decisions, retrieving the right knowledge the moment you need it.
            </p>
          </div>
        </article>

        {/* Benefit Card 2 (Video) */}
        <article className="benefit-card relative h-[380px] sm:h-[460px] rounded-2xl bg-[#0a0a0a] overflow-hidden flex flex-col p-0">
          <div className="benefit-video-wrap relative w-full overflow-hidden h-[75%] shrink-0">
            <video
              className="benefit-video w-full h-full object-cover block"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260421_072701_f6a01abb-eb30-4559-9d6e-774362defbc3.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="benefit-video-fade pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0a0a0a]" aria-hidden="true" />
          </div>
          <div className="benefit-video-text grow flex items-center justify-start p-6 sm:p-8">
            <h3 className="benefit-title text-white text-[1.25rem] sm:text-[1.5rem] font-light leading-[1.25] m-0 text-left">
              Dual-Write Storage<br />Local-First Vault
            </h3>
          </div>
        </article>

        {/* Benefit Card 3 */}
        <article className="benefit-card relative h-[380px] sm:h-[460px] rounded-2xl bg-[#0a0a0a] overflow-hidden p-6 sm:p-8">
          <div className="benefit-blob absolute rounded-full bg-[#1e3a8a] blur-[64px] opacity-40 pointer-events-none -top-28 -right-28 w-56 h-56" aria-hidden="true" />
          <div className="benefit-content relative z-10 flex flex-col h-full">
            <h3 className="benefit-title text-white text-[1.25rem] sm:text-[1.5rem] font-light leading-[1.25] m-0">
              Anatomical Brain Graph<br />Of Your Knowledge
            </h3>
            <p className="benefit-body text-[13px] sm:text-[14px] leading-[1.625] text-white/70 font-light mt-auto max-w-[320px]">
              Synra uses a local LLM to extract concepts as [[wikilinks]] and maps them to a 4K Canvas2D anatomical brain. Your knowledge compounds, visualized by Frontal, Temporal, and Parietal regions, not just a list.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default BenefitsSection;
