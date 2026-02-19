import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background entrance
      tl.fromTo(
        bgRef.current,
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.1 },
        0
      );

      // Badge
      tl.fromTo(
        badgeRef.current,
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 },
        0.15
      );

      // Eyebrow
      tl.fromTo(
        eyebrowRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.25
      );

      // Headline words
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { y: 40, opacity: 0, rotateX: 18 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.06 },
          0.35
        );
      }

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.65
      );

      // CTA
      tl.fromTo(
        ctaRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5 },
        0.8
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set([eyebrowRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current, badgeRef.current], {
              opacity: 1,
              x: 0,
              y: 0,
            });
            gsap.set(bgRef.current, { scale: 1, x: 0 });
          },
        },
      });

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        contentRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, x: 0 },
        { scale: 1.06, x: '-6vw', ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        ctaRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="pin-section relative z-10"
    >
      {/* Background Image - User's Photo */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/images/reg-hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      {/* Gradient Overlay - Darker for text readability */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(13, 17, 23, 0.92) 0%, rgba(13, 17, 23, 0.75) 40%, rgba(13, 17, 23, 0.4) 100%)'
      }} />

      {/* Animated grid background */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-center px-6 md:px-[8vw]"
      >
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-reg-primary/10 border border-reg-primary/20 w-fit mb-6"
        >
          <Sparkles size={14} className="text-reg-primary" />
          <span className="text-xs font-mono text-reg-primary uppercase tracking-wider">
            Blockchain & AI Systems Builder
          </span>
        </div>

        {/* Eyebrow */}
        <span
          ref={eyebrowRef}
          className="eyebrow mb-4 md:mb-6"
        >
          AI & Software Solutions Consultant
        </span>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="headline-xl text-reg-text max-w-[62vw] mb-4 md:mb-6"
          style={{ perspective: '1000px' }}
        >
          <span className="word inline-block">Reginald</span>{' '}
          <span className="word inline-block">Kargbo</span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="text-base md:text-lg text-reg-text-secondary max-w-xl mb-8 leading-relaxed"
        >
          AI-driven systems, scalable software architecture, and automation platforms 
          that transform operations and drive measurable growth.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4">
          <button onClick={scrollToContact} className="btn-primary flex items-center gap-2">
            <span>Book a Consultation</span>
          </button>
          <button 
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary"
          >
            View My Work
          </button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        ref={ctaRef}
        className="absolute bottom-10 right-[8vw] z-10 flex items-center gap-3 text-reg-text-muted"
      >
        <span className="text-sm font-mono uppercase tracking-wider">Scroll to explore</span>
        <ArrowDown size={18} className="animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
