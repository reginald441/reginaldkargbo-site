import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Reginald built our company website from scratch and exceeded all expectations. Professional, responsive, and delivered on time. Highly recommend!",
    author: 'Michael Johnson',
    role: 'Business Owner',
    rating: 5,
  },
  {
    quote:
      "The AI chatbot Reginald created for our customer service has saved us countless hours. Our response time improved by 80% and customers are happier.",
    author: 'Sarah Chen',
    role: 'Operations Manager',
    rating: 5,
  },
  {
    quote:
      "Reginald optimized my resume and helped me land interviews at top tech companies. His insights into what recruiters look for are invaluable.",
    author: 'David Park',
    role: 'Software Engineer',
    rating: 5,
  },
  {
    quote:
      "Working with Reginald was a game-changer for our business. The automation system he built streamlined our entire workflow.",
    author: 'Amanda Rodriguez',
    role: 'Marketing Director',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.testimonial-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, rotateX: 8 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.14,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              end: 'top 50%',
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
      id="testimonials"
      className="flowing-section relative z-80 bg-reg-bg py-20 md:py-32"
    >
      {/* Subtle gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(245, 158, 11, 0.06) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 px-6 md:px-[8vw]">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 md:mb-16 text-center">
          <span className="eyebrow mb-4 block">Testimonials</span>
          <h2 className="headline-lg text-reg-text">What clients say</h2>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          style={{ perspective: '1000px' }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card card-glass rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-reg-accent fill-reg-accent" />
                ))}
              </div>
              <Quote
                size={28}
                className="text-reg-primary/30 mb-4"
                fill="currentColor"
              />
              <p className="text-reg-text text-base leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-reg-primary/10 flex items-center justify-center">
                  <span className="text-reg-primary font-heading font-semibold text-sm">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-reg-text font-medium text-sm">
                    {testimonial.author}
                  </div>
                  <div className="text-reg-text-muted text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
