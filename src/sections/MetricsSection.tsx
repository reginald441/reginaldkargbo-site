import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: 5, suffix: '+', label: 'Years Experience', description: 'In software & engineering' },
  { value: 50, suffix: '+', label: 'Projects Completed', description: 'Websites & automation systems' },
  { value: 30, suffix: '+', label: 'Happy Clients', description: 'Businesses & professionals' },
  { value: 100, suffix: '%', label: 'Client Satisfaction', description: 'Commitment to excellence' },
];

const MetricsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState(metrics.map(() => 0));
  const hasAnimated = useRef(false);

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

      // Metrics animation
      const metricItems = metricsRef.current?.querySelectorAll('.metric-item');
      if (metricItems && metricItems.length > 0) {
        gsap.fromTo(
          metricItems,
          { y: 50, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: metricsRef.current,
              start: 'top 75%',
              end: 'top 50%',
              scrub: true,
              onEnter: () => {
                if (!hasAnimated.current) {
                  hasAnimated.current = true;
                  // Animate numbers
                  metrics.forEach((metric, index) => {
                    const counter = { value: 0 };
                    gsap.to(counter, {
                      value: metric.value,
                      duration: 1.5,
                      ease: 'power2.out',
                      onUpdate: () => {
                        setCounts((prev) => {
                          const newCounts = [...prev];
                          newCounts[index] = Math.round(counter.value);
                          return newCounts;
                        });
                      },
                    });
                  });
                }
              },
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
      id="metrics"
      className="flowing-section relative z-60 bg-reg-bg py-20 md:py-32"
    >
      {/* Tech Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/tech-about.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          opacity: 0.1,
        }}
      />
      
      {/* Subtle gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        }}
      />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-reg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-reg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 px-6 md:px-[8vw]">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12 md:mb-16">
          <span className="eyebrow mb-4 block">Track Record</span>
          <h2 className="headline-lg text-reg-text">Impact in numbers</h2>
        </div>

        {/* Metrics Grid */}
        <div
          ref={metricsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="metric-item text-center p-6 md:p-8 card-glass rounded-2xl"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-reg-primary mb-2">
                {counts[index]}
                {metric.suffix}
              </div>
              <div className="text-reg-text font-medium text-sm mb-1">{metric.label}</div>
              <div className="text-reg-text-muted text-xs">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
