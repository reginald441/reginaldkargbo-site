import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Bot, GraduationCap, FileText, Shield, Code, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Globe,
    title: 'Custom Website Development',
    description:
      'Modern, responsive business websites designed to increase your online presence and convert visitors into customers. Built with the latest technologies for speed and performance.',
    price: 'Starting at $1,500',
    details: [
      'Responsive design for all devices',
      'SEO optimization for better rankings',
      'Fast loading speeds',
      'CMS integration (WordPress, custom)',
      'E-commerce functionality',
      'Ongoing maintenance support',
    ],
  },
  {
    icon: Bot,
    title: 'AI-Powered Automation',
    description:
      'Intelligent automation systems that streamline your workflows, reduce manual tasks, and help your business operate more efficiently. From chatbots to process automation.',
    price: 'Custom Quote',
    details: [
      'Customer service chatbots',
      'Appointment scheduling systems',
      'Email automation',
      'Data processing automation',
      'Workflow optimization',
      'AI integration with existing tools',
    ],
  },
  {
    icon: Shield,
    title: 'Cybersecurity Solutions',
    description:
      'Comprehensive security assessments and implementations to protect your business from cyber threats. From vulnerability testing to security policy development.',
    price: 'Custom Quote',
    details: [
      'Security vulnerability assessments',
      'Penetration testing',
      'Security policy development',
      'Employee security training',
      'Network security configuration',
      'Incident response planning',
      'Compliance consulting (GDPR, HIPAA)',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Coding Mentorship',
    description:
      'One-on-one guidance for aspiring developers and professionals looking to strengthen their technical skills. Personalized learning paths and career advice.',
    price: '$75/hour',
    details: [
      'Personalized learning plans',
      'Code review and feedback',
      'Project guidance',
      'Interview preparation',
      'Career path planning',
      'Portfolio development',
    ],
  },
  {
    icon: FileText,
    title: 'Resume Optimization',
    description:
      'Professional resume writing and optimization specifically for technical careers. Stand out to recruiters and land your dream job in tech.',
    price: 'Starting at $200',
    details: [
      'ATS-optimized resumes',
      'LinkedIn profile optimization',
      'Cover letter writing',
      'Portfolio building guidance',
      'Interview coaching',
      'Salary negotiation tips',
    ],
  },
  {
    icon: Code,
    title: 'Software Development',
    description:
      'Custom software solutions tailored to your business needs. From web applications to automation tools, built with modern technologies.',
    price: 'Custom Quote',
    details: [
      'Web application development',
      'API development and integration',
      'Database design and management',
      'Cloud deployment (AWS, Azure)',
      'Mobile-responsive applications',
      'Ongoing support and maintenance',
    ],
  },
];

const courses = [
  {
    title: 'Software Developer Fundamentals',
    description: 'Learn the core concepts of software development including HTML, CSS, JavaScript, and Python. Perfect for beginners.',
    duration: '8 weeks',
    price: '$499',
  },
  {
    title: 'Software Engineering Bootcamp',
    description: 'Comprehensive training in software engineering principles, data structures, algorithms, and system design.',
    duration: '12 weeks',
    price: '$899',
  },
];

const ExpertiseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: true,
          },
        }
      );

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.service-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
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

      // Courses animation
      const courseCards = coursesRef.current?.querySelectorAll('.course-card');
      if (courseCards) {
        gsap.fromTo(
          courseCards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: coursesRef.current,
              start: 'top 80%',
              end: 'top 60%',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openServiceDetails = (service: typeof services[0]) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="flowing-section relative z-30 bg-reg-bg py-20 md:py-32"
    >
      {/* Tech Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/tech-footer-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          opacity: 0.15,
        }}
      />
      
      {/* Subtle radial gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        }}
      />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(16, 185, 129, 0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 px-6 md:px-[8vw]">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 md:mb-16">
          <span className="eyebrow mb-4 block">Services</span>
          <h2 className="headline-lg text-reg-text mb-4">
            Solutions tailored to your goals.
          </h2>
          <p className="body-text max-w-2xl">
            Whether you're launching a new business, upgrading your online presence, 
            or looking to strengthen your career in tech, I provide strategic, 
            high-quality solutions that deliver innovation, efficiency, and long-term value.
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16"
        >
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => openServiceDetails(service)}
              className="service-card card-glass rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-reg-primary/10 flex items-center justify-center group-hover:bg-reg-primary/20 transition-colors">
                  <service.icon size={24} className="text-reg-primary" />
                </div>
                <span className="text-xs font-mono text-reg-accent px-3 py-1 rounded-full bg-reg-accent/10">
                  {service.price}
                </span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-reg-text mb-3 group-hover:text-reg-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-reg-text-secondary text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-reg-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View details</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Courses Section */}
        <div className="mb-8">
          <span className="eyebrow mb-4 block">Courses I Teach</span>
          <h3 className="headline-md text-reg-text mb-6">Learn from an experienced engineer</h3>
        </div>

        <div ref={coursesRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="course-card card-glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-reg-accent/10 flex items-center justify-center">
                  <GraduationCap size={20} className="text-reg-accent" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-reg-text-muted">{course.duration}</span>
                  <span className="text-xs font-mono text-reg-primary px-2 py-1 rounded-full bg-reg-primary/10">
                    {course.price}
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-heading font-semibold text-reg-text mb-2 group-hover:text-reg-accent transition-colors">
                {course.title}
              </h4>
              <p className="text-reg-text-secondary text-sm">
                {course.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Service Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-reg-bg-secondary border-reg-border text-reg-text max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {selectedService && (
                <div className="w-10 h-10 rounded-lg bg-reg-primary/10 flex items-center justify-center">
                  <selectedService.icon size={20} className="text-reg-primary" />
                </div>
              )}
              <DialogTitle className="font-heading text-xl">{selectedService?.title}</DialogTitle>
            </div>
            <DialogDescription className="text-reg-text-secondary">
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            {/* What's Included */}
            <div>
              <h4 className="text-reg-text font-semibold mb-3">What's Included:</h4>
              <ul className="space-y-2">
                {selectedService?.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-reg-text-secondary">
                    <span className="text-reg-primary mt-0.5">✓</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="p-4 rounded-xl bg-reg-primary/10 border border-reg-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-reg-text-secondary text-sm">Starting Price</span>
                <span className="text-reg-primary font-heading font-bold text-lg">
                  {selectedService?.price}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <a 
                href="#contact"
                onClick={() => setDialogOpen(false)}
                className="btn-primary flex-1 text-center"
              >
                Book a Consultation
              </a>
              <a 
                href={`mailto:reginaldkargbo987@gmail.com?subject=Inquiry: ${selectedService?.title}`}
                onClick={() => setDialogOpen(false)}
                className="btn-secondary"
              >
                Email Me
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ExpertiseSection;
