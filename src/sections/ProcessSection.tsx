import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, PenTool, Code2, Rocket, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    icon: MessageSquare,
    title: 'Discovery Call',
    description: 'We discuss your goals, challenges, and vision. I listen to understand exactly what you need.',
    deliverables: ['Requirements document', 'Project scope', 'Timeline'],
  },
  {
    icon: PenTool,
    title: 'Strategy & Design',
    description: 'I create a detailed plan and design that aligns with your brand and business objectives.',
    deliverables: ['Wireframes', 'Design mockups', 'Technical architecture'],
  },
  {
    icon: Code2,
    title: 'Development',
    description: 'I build your solution with regular updates and feedback loops to ensure it meets expectations.',
    deliverables: ['Working prototype', 'Regular demos', 'Code reviews'],
  },
  {
    icon: Rocket,
    title: 'Launch & Support',
    description: 'Your project goes live with full documentation and ongoing support to ensure success.',
    deliverables: ['Deployment', 'Documentation', '30-day support'],
  },
];

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            end: 'top 60%',
            scrub: true,
          },
        }
      );

      // Timeline line animation
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true,
          },
        }
      );

      // Steps animation
      const steps = timelineRef.current?.querySelectorAll('.process-step');
      if (steps) {
        gsap.fromTo(
          steps,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: true,
            },
          }
        );
      }

      // Dots animation
      const dots = timelineRef.current?.querySelectorAll('.step-dot');
      if (dots) {
        gsap.fromTo(
          dots,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 65%',
              end: 'top 35%',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="flowing-section relative z-70 bg-reg-bg py-20 md:py-32"
    >
      <div className="relative z-10 px-6 md:px-[8vw]">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 md:mb-16">
          <span className="eyebrow mb-4 block">How It Works</span>
          <h2 className="headline-lg text-reg-text mb-4">A simple, transparent process.</h2>
          <p className="body-text max-w-xl">
            From initial consultation to final delivery, I keep you informed and involved every step of the way.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-3xl">
          {/* Vertical Line */}
          <div
            ref={lineRef}
            className="absolute left-[23px] md:left-[27px] top-0 w-[2px] h-full bg-reg-border origin-top"
          />

          {/* Steps */}
          <div className="space-y-8 md:space-y-12">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="process-step flex items-start gap-5 md:gap-8"
              >
                {/* Dot */}
                <div className="step-dot relative flex-shrink-0 z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-reg-primary/10 border-2 border-reg-primary flex items-center justify-center">
                    <step.icon size={22} className="text-reg-primary" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-reg-primary/20 animate-pulse-glow" />
                </div>

                {/* Content */}
                <div className="pt-2 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-reg-primary">Step {index + 1}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-heading font-semibold text-reg-text mb-2">
                    {step.title}
                  </h3>
                  <p className="text-reg-text-secondary text-sm md:text-base mb-4 max-w-lg">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.deliverables.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-mono bg-white/5 rounded-full text-reg-text-muted"
                      >
                        <CheckCircle2 size={10} className="text-reg-primary" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
