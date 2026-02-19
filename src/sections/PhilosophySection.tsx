import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Lightbulb, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'Every solution is designed to achieve measurable business outcomes.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'Leveraging cutting-edge AI and software to stay ahead of the curve.',
  },
  {
    icon: Zap,
    title: 'Efficiency Focused',
    description: 'Building systems that save time, reduce costs, and scale with growth.',
  },
];

const PhilosophySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

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
        { x: '-5vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headlineRef.current,
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.14
      );

      // Values animation
      const valueItems = valuesRef.current?.querySelectorAll('.value-item');
      if (valueItems) {
        scrollTl.fromTo(
          valueItems,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.03, ease: 'none' },
          0.18
        );
      }

      // SETTLE (30% - 70%) - hold

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        contentRef.current,
        { x: 0, opacity: 1 },
        { x: '-12vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1 },
        { scale: 1.05, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="pin-section relative z-50"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/images/tech-philosophy.png)',
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
        <div className="max-w-[46vw]">
          {/* Eyebrow */}
          <span
            ref={eyebrowRef}
            className="eyebrow mb-4 md:mb-6 block"
          >
            My Approach
          </span>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="headline-lg text-reg-text mb-4 md:mb-6"
          >
            Function over fluff.
          </h2>

          {/* Body */}
          <p ref={bodyRef} className="body-text mb-8 md:mb-10 max-w-md">
            I design and build AI-driven systems, scalable software architecture, 
            and automation platforms that transform operations and drive measurable growth. 
            Every project starts with understanding your business goals and ends 
            with delivering measurable value.
          </p>

          {/* Values */}
          <div ref={valuesRef} className="space-y-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-item flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-reg-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-reg-primary/10 flex items-center justify-center flex-shrink-0">
                  <value.icon size={20} className="text-reg-primary" />
                </div>
                <div>
                  <h4 className="text-reg-text font-semibold mb-1">{value.title}</h4>
                  <p className="text-reg-text-secondary text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
