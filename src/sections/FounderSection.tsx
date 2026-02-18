import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Code2, Cpu, Briefcase, Blocks } from 'lucide-react';

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
  const photosRef = useRef<HTMLDivElement>(null);

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

      // Photos animation
      const photoItems = photosRef.current?.querySelectorAll('.photo-item');
      if (photoItems) {
        scrollTl.fromTo(
          photoItems,
          { x: '8vw', opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, stagger: 0.04, ease: 'none' },
          0.10
        );
      }

      // SETTLE (30% - 70%) - hold position

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        contentRef.current,
        { x: 0, opacity: 1 },
        { x: '-12vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        photosRef.current,
        { x: 0, opacity: 1 },
        { x: '12vw', opacity: 0, ease: 'power2.in' },
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
    { icon: Code2, label: 'Computer Science' },
    { icon: Cpu, label: 'AI & Software Engineering' },
    { icon: Blocks, label: 'Blockchain Systems' },
    { icon: Briefcase, label: 'Business Solutions' },
  ];

  const photos = [
    { src: '/images/reg-photo-1.png', alt: 'Reginald Kargbo - Professional Portrait' },
    { src: '/images/reg-photo-2.png', alt: 'Reginald Kargbo - Tech Consultant' },
    { src: '/images/reg-photo-3.png', alt: 'Reginald Kargbo - AI Engineer' },
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
          backgroundImage: 'url(/images/tech-about.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 left-gradient" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-center px-6 md:px-[8vw]"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left - Text Content */}
          <div className="max-w-[48vw] lg:max-w-[42vw]">
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
            <p ref={bodyRef} className="body-text mb-6 md:mb-8 max-w-md">
              AI and Software Solutions Consultant helping small businesses build 
              powerful digital systems. Combining Computer Science expertise with 
              real-world problem solving to deliver modern websites, intelligent 
              automation, blockchain solutions, and scalable systems.
            </p>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-3 mb-6 md:mb-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <stat.icon size={14} className="text-reg-primary" />
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

          {/* Right - Photo Gallery - FULLY VISIBLE IMAGES */}
          <div 
            ref={photosRef}
            className="hidden lg:block relative"
          >
            {/* Photo Grid with proper spacing */}
            <div className="relative w-[400px] h-[500px]">
              {/* Main Large Photo */}
              <div className="photo-item absolute top-0 left-0 w-[260px] h-[320px] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-10">
                <img 
                  src={photos[0].src} 
                  alt={photos[0].alt}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-reg-bg/40 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* Second Photo - Offset */}
              <div className="photo-item absolute top-[60px] right-0 w-[180px] h-[220px] rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl z-20">
                <img 
                  src={photos[1].src} 
                  alt={photos[1].alt}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-reg-bg/30 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* Third Photo - Bottom */}
              <div className="photo-item absolute bottom-0 left-[40px] w-[200px] h-[180px] rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl z-30">
                <img 
                  src={photos[2].src} 
                  alt={photos[2].alt}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-reg-bg/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-reg-primary/10 blur-2xl" />
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-reg-accent/10 blur-2xl" />
            </div>
          </div>

          {/* Mobile Photo - Single visible on mobile */}
          <div className="lg:hidden flex justify-center">
            <div className="photo-item w-[280px] h-[350px] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
              <img 
                src={photos[0].src} 
                alt={photos[0].alt}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center top' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-reg-bg/50 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
