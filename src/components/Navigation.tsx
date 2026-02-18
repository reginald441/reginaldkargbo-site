import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Services', id: 'expertise' },
    { label: 'Work', id: 'work' },
    { label: 'Process', id: 'process' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-reg-bg/95 backdrop-blur-md border-b border-reg-border'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-[8vw] py-4 md:py-5">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => isHomePage && window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-heading text-xl md:text-2xl font-bold text-reg-text hover:text-reg-primary transition-colors"
          >
            RK<span className="text-reg-primary">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-sm text-reg-text-secondary hover:text-reg-text transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-reg-primary transition-all duration-300 group-hover:w-full" />
                  </button>
                ))}
                <Link
                  to="/ai-trading"
                  className="text-sm text-reg-accent hover:text-reg-primary transition-colors relative group flex items-center gap-1"
                >
                  <Sparkles size={14} />
                  <span>AI Trading</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-reg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              </>
            ) : (
              <Link
                to="/ai-trading"
                className="text-sm text-reg-accent hover:text-reg-primary transition-colors relative group flex items-center gap-1"
              >
                <Sparkles size={14} />
                <span>AI Trading</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-reg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-primary text-sm py-2.5 px-5"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-reg-text p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-reg-bg/98 backdrop-blur-lg transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {isHomePage && navLinks.map((link, index) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-2xl font-heading font-semibold text-reg-text hover:text-reg-primary transition-colors"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/ai-trading"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-heading font-semibold text-reg-accent hover:text-reg-primary transition-colors flex items-center gap-2"
          >
            <Sparkles size={20} />
            AI Trading
          </Link>
          <button
            onClick={() => scrollToSection('contact')}
            className="btn-primary mt-4"
          >
            Book Now
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
