import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Code2, Cpu, Briefcase } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FounderSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        bgRef.current,
        { x: '10vw', scale: 1.08, opacity: 0.6 },
        { x: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        eyebrowRef.current,
        { x: '-6vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headlineRef.current,
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.06
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      );

      scrollTl.fromTo(
        statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.16
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.20
      );

      // SETTLE (30% - 70%) - hold position

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        contentRef.current,
        { x: 0, opacity: 1 },
        { x: '-12vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, x: 0 },
        { scale: 1.05, x: '-4vw', ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { icon: Code2, label: 'Computer Science Background' },
    { icon: Cpu, label: 'Reliability Maintenance Engineering' },
    { icon: Briefcase, label: 'Business-Focused Solutions' },
  ];

  return (
    <section
      ref={sectionRef}
      id="founder"
      className="pin-section relative z-20"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/images/reg-about.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 left-gradient" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-center px-6 md:px-[8vw]"
      >
        <div className="max-w-[48vw]">
          {/* Eyebrow with accent line */}
          <div ref={eyebrowRef} className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-[2px] h-[18px] bg-reg-primary" />
            <span className="eyebrow">About Me</span>
          </div>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="headline-lg text-reg-text mb-4 md:mb-6"
          >
            Engineering solutions that drive real business results.
          </h2>

          {/* Body */}
          <p ref={bodyRef} className="body-text mb-6 md:mb-8 max-w-lg">
            I'm an AI and Software Solutions Consultant specializing in helping 
            small businesses and professionals build powerful digital systems. 
            With a background in Computer Science and hands-on engineering experience 
            in Reliability Maintenance Engineering, I combine technical expertise with 
            real-world problem solving to deliver modern business websites, intelligent 
            automation systems, and scalable digital solutions.
          </p>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-wrap gap-4 mb-6 md:mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10"
              >
                <stat.icon size={16} className="text-reg-primary" />
                <span className="text-xs text-reg-text-secondary">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            ref={ctaRef}
            onClick={scrollToWork}
            className="group flex items-center gap-2 text-reg-text hover:text-reg-primary transition-colors"
          >
            <span className="text-sm font-medium">View my services</span>
            <ArrowRight
              size={18}
              className="transform transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
