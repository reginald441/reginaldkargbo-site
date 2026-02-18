import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Business Website Development',
    description:
      'Custom websites for small businesses including restaurants, law firms, real estate agencies, and e-commerce stores. Mobile-responsive, SEO-optimized, and built for conversions.',
    features: ['Responsive Design', 'SEO Optimization', 'Fast Loading', 'CMS Integration'],
    link: '#',
  },
  {
    title: 'AI Automation Systems',
    description:
      'Intelligent automation solutions including customer service chatbots, appointment scheduling systems, email automation, and workflow optimization tools.',
    features: ['Chatbot Integration', 'Process Automation', 'Data Analytics', '24/7 Availability'],
    link: '#',
  },
  {
    title: 'Technical Career Services',
    description:
      'Resume optimization, portfolio development, and interview preparation for software engineering and technical roles. Helping professionals land jobs at top tech companies.',
    features: ['ATS-Optimized Resumes', 'Portfolio Building', 'Interview Prep', 'LinkedIn Optimization'],
    link: '#',
  },
];

const WorkSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', message: '' });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.7,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        bgRef.current,
        { x: '12vw', scale: 1.1, opacity: 0.5 },
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
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.14
      );

      // Projects cards entrance
      const projectCards = projectsRef.current?.querySelectorAll('.project-card');
      if (projectCards) {
        scrollTl.fromTo(
          projectCards,
          { x: '6vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.18
        );
      }

      // SETTLE (30% - 70%) - hold

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        contentRef.current,
        { x: 0, opacity: 1 },
        { x: '-14vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, x: 0 },
        { scale: 1.06, x: '-5vw', ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleProjectClick = (title: string) => {
    setDialogContent({
      title: title,
      message: `This would open a detailed case study for ${title}. Contact me to discuss your project needs.`,
    });
    setDialogOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="pin-section relative z-40"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/images/reg-work.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 left-gradient" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-center px-6 md:px-[8vw]"
      >
        <div className="max-w-[44vw] mb-8">
          {/* Eyebrow */}
          <span
            ref={eyebrowRef}
            className="eyebrow mb-4 md:mb-6 block"
          >
            Selected Work
          </span>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="headline-lg text-reg-text mb-4 md:mb-6"
          >
            Projects that deliver results.
          </h2>

          {/* Body */}
          <p ref={bodyRef} className="body-text max-w-lg">
            From business websites to AI automation systems, I build solutions 
            that help my clients grow, save time, and achieve their goals.
          </p>
        </div>

        {/* Project Cards */}
        <div
          ref={projectsRef}
          className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:overflow-visible scrollbar-hide"
        >
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={() => handleProjectClick(project.title)}
              className="project-card flex-shrink-0 w-[300px] md:w-[340px] card-glass rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer"
            >
              <h3 className="text-lg font-heading font-semibold text-reg-text mb-2 group-hover:text-reg-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-reg-text-secondary text-sm mb-4 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.features.map((feature, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-mono bg-reg-primary/10 rounded-full text-reg-primary"
                  >
                    <CheckCircle2 size={10} />
                    {feature}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-reg-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View details</span>
                <ExternalLink size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-reg-bg-secondary border-reg-border text-reg-text max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{dialogContent.title}</DialogTitle>
            <DialogDescription className="text-reg-text-secondary">
              {dialogContent.message}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <button 
              onClick={() => {
                setDialogOpen(false);
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary w-full"
            >
              Contact Me
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WorkSection;
