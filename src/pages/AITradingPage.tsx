import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowLeft, TrendingUp, Cpu, Shield, Zap, BarChart3, 
  Wallet, Globe, Lock, LineChart, Bitcoin, Database,
  ChevronRight, Sparkles, Activity
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AITradingPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        '.hero-content',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );

      // Features animation
      gsap.fromTo(
        '.feature-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
        }
      );

      // Services animation
      gsap.fromTo(
        '.service-item',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: servicesRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Analysis',
      description: 'Machine learning algorithms analyze market patterns and predict price movements with high accuracy.',
      color: 'text-reg-primary',
      bgColor: 'bg-reg-primary/10',
    },
    {
      icon: TrendingUp,
      title: 'Algorithmic Trading',
      description: 'Automated trading bots execute strategies 24/7 based on predefined rules and real-time data.',
      color: 'text-reg-accent',
      bgColor: 'bg-reg-accent/10',
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Advanced portfolio protection with stop-losses, position sizing, and volatility controls.',
      color: 'text-reg-primary',
      bgColor: 'bg-reg-primary/10',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Live dashboards tracking portfolio performance, market trends, and trading signals.',
      color: 'text-reg-accent',
      bgColor: 'bg-reg-accent/10',
    },
    {
      icon: Globe,
      title: 'Multi-Exchange Support',
      description: 'Connect to major crypto exchanges and stock brokers through unified APIs.',
      color: 'text-reg-primary',
      bgColor: 'bg-reg-primary/10',
    },
    {
      icon: Lock,
      title: 'Secure Infrastructure',
      description: 'Enterprise-grade security with encrypted API keys and secure transaction handling.',
      color: 'text-reg-accent',
      bgColor: 'bg-reg-accent/10',
    },
  ];

  const services = [
    {
      icon: Bitcoin,
      title: 'Crypto Trading Bots',
      description: 'Custom-built automated trading systems for cryptocurrency markets.',
      features: ['Arbitrage detection', 'Market making', 'Trend following', 'Grid trading'],
    },
    {
      icon: LineChart,
      title: 'Stock Market AI',
      description: 'Intelligent systems for equities, options, and futures trading.',
      features: ['Technical analysis', 'Fundamental scoring', 'News sentiment', 'Earnings prediction'],
    },
    {
      icon: Database,
      title: 'Blockchain Solutions',
      description: 'Smart contract development and decentralized application integration.',
      features: ['Smart contracts', 'DeFi protocols', 'NFT platforms', 'Web3 integration'],
    },
    {
      icon: Activity,
      title: 'Portfolio Optimization',
      description: 'AI-driven asset allocation and rebalancing strategies.',
      features: ['Risk profiling', 'Diversification', 'Rebalancing', 'Tax optimization'],
    },
  ];

  return (
    <div className="min-h-screen bg-reg-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-reg-bg/80 backdrop-blur-md border-b border-reg-border">
        <div className="px-6 md:px-[8vw] py-4">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-reg-text hover:text-reg-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Portfolio</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20"
      >
        {/* Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/ai-trading-hero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-reg-bg via-reg-bg/95 to-reg-bg/70" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(16, 185, 129, 0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="hero-content relative z-10 px-6 md:px-[8vw] py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-reg-primary/10 border border-reg-primary/20 mb-6">
              <Sparkles size={14} className="text-reg-primary" />
              <span className="text-xs font-mono text-reg-primary uppercase tracking-wider">
                Innovation Lab
              </span>
            </div>

            <h1 className="headline-xl text-reg-text mb-6">
              AI Trading &<br />
              <span className="text-gradient">Crypto Systems</span>
            </h1>

            <p className="text-lg text-reg-text-secondary mb-8 max-w-xl leading-relaxed">
              Building the future of financial technology with intelligent trading systems, 
              blockchain solutions, and AI-powered market analysis.
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href="https://stoic.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                <span>Explore Services</span>
                <ChevronRight size={18} />
              </a>
              <a 
                href="/#/#contact"
                className="btn-secondary"
              >
                Get in Touch
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-reg-border">
              <div>
                <div className="text-3xl font-bold text-reg-primary">24/7</div>
                <div className="text-sm text-reg-text-secondary">Automated Trading</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-reg-accent">AI</div>
                <div className="text-sm text-reg-text-secondary">Powered Analysis</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-reg-primary">99.9%</div>
                <div className="text-sm text-reg-text-secondary">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 md:py-28 px-6 md:px-[8vw]">
        <div className="text-center mb-16">
          <span className="eyebrow mb-4 block">Capabilities</span>
          <h2 className="headline-lg text-reg-text mb-4">
            Cutting-Edge Technology
          </h2>
          <p className="body-text max-w-2xl mx-auto">
            Leveraging artificial intelligence, machine learning, and blockchain 
            technology to build next-generation trading systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card p-6 rounded-xl bg-reg-bg-card border border-reg-border hover:border-reg-primary/40 transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="text-lg font-semibold text-reg-text mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-reg-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 md:py-28 px-6 md:px-[8vw] bg-reg-bg-secondary">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow mb-4 block">Technology</span>
            <h2 className="headline-lg text-reg-text mb-4">
              Intelligent Trading Bots
            </h2>
            <p className="body-text mb-6">
              Our AI trading systems analyze millions of data points in real-time, 
              identifying profitable opportunities and executing trades with precision. 
              From crypto arbitrage to stock market predictions, we build bots that 
              work around the clock.
            </p>
            <ul className="space-y-3">
              {[
                'Real-time market analysis and pattern recognition',
                'Automated execution with sub-second latency',
                'Multi-exchange arbitrage detection',
                'Customizable risk management parameters',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Zap size={18} className="text-reg-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-reg-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-reg-border shadow-2xl">
              <img 
                src="/images/ai-trading-bot.png" 
                alt="AI Trading Bot" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 p-4 rounded-xl bg-reg-bg-card border border-reg-border shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-reg-primary/20 flex items-center justify-center">
                  <Activity size={20} className="text-reg-primary" />
                </div>
                <div>
                  <div className="text-xs text-reg-text-secondary">System Status</div>
                  <div className="text-sm font-medium text-reg-primary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-reg-primary animate-pulse" />
                    Live Trading
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} id="services" className="py-20 md:py-28 px-6 md:px-[8vw]">
        <div className="text-center mb-16">
          <span className="eyebrow mb-4 block">Services</span>
          <h2 className="headline-lg text-reg-text mb-4">
            What We Build
          </h2>
          <p className="body-text max-w-2xl mx-auto">
            From automated trading bots to blockchain smart contracts, 
            we deliver cutting-edge fintech solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="service-item p-6 md:p-8 rounded-2xl bg-reg-bg-card border border-reg-border hover:border-reg-primary/40 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-reg-primary/10 flex items-center justify-center flex-shrink-0">
                  <service.icon size={24} className="text-reg-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-reg-text mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-reg-text-secondary">
                    {service.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {service.features.map((feature, fIndex) => (
                  <span 
                    key={fIndex}
                    className="px-3 py-1 rounded-full bg-white/5 text-xs text-reg-text-secondary border border-white/10"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Showcase */}
      <section className="py-20 md:py-28 px-6 md:px-[8vw] bg-reg-bg-secondary">
        <div className="text-center mb-12">
          <span className="eyebrow mb-4 block">Dashboard</span>
          <h2 className="headline-lg text-reg-text mb-4">
            Real-Time Analytics
          </h2>
          <p className="body-text max-w-2xl mx-auto">
            Comprehensive dashboards providing live insights into your portfolios, 
            trading performance, and market conditions.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-reg-border shadow-2xl">
            <img 
              src="/images/crypto-dashboard.png" 
              alt="Crypto Dashboard" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-6 md:px-[8vw]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-reg-primary/10 to-reg-accent/10 border border-reg-primary/20">
            <Wallet size={48} className="text-reg-primary mx-auto mb-6" />
            <h2 className="headline-md text-reg-text mb-4">
              Ready to Build Your Trading System?
            </h2>
            <p className="body-text mb-8 max-w-xl mx-auto">
              Let's discuss how AI and blockchain technology can transform 
              your trading strategy and maximize your returns.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://www.quantconnect.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                <span>Start a Project</span>
                <ChevronRight size={18} />
              </a>
              <a 
                href="/#/"
                className="btn-secondary"
              >
                View Portfolio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-[8vw] border-t border-reg-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-reg-text-muted">
            © {new Date().getFullYear()} Reginald Kargbo. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="text-sm text-reg-text-muted hover:text-reg-primary transition-colors">
              Portfolio
            </a>
            <a href="/#contact" className="text-sm text-reg-text-muted hover:text-reg-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AITradingPage;
