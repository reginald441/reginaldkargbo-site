import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Network, Database, ExternalLink, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Tech stack links configuration
const techStackLinks = [
  { name: 'Smart Contracts', url: 'https://etherscan.io/', color: 'hover:border-blue-500 hover:text-blue-400' },
  { name: 'DeFi Protocols', url: 'https://defillama.com/', color: 'hover:border-green-500 hover:text-green-400' },
  { name: 'AI Trading Bots', url: 'https://www.tradingview.com/markets/cryptocurrencies/', color: 'hover:border-purple-500 hover:text-purple-400' },
  { name: 'Web3 Integration', url: 'https://ethereum.org/en/developers/', color: 'hover:border-cyan-500 hover:text-cyan-400' },
  { name: 'Machine Learning', url: 'https://huggingface.co/models', color: 'hover:border-orange-500 hover:text-orange-400' },
  { name: 'Data Analytics', url: 'https://www.kaggle.com/datasets', color: 'hover:border-pink-500 hover:text-pink-400' },
];

const TechVideoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
          },
        }
      );

      // Animate tech cards
      const cards = videoContainerRef.current?.querySelectorAll('.tech-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: videoContainerRef.current,
              start: 'top 80%',
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
      id="tech-showcase"
      className="flowing-section relative z-40 bg-reg-bg py-20 md:py-28 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(16, 185, 129, 0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-reg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-reg-accent/5 rounded-full blur-3xl" />
      </div>

      <div ref={contentRef} className="relative z-10 px-6 md:px-[8vw]">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="eyebrow mb-4 block">Innovation Showcase</span>
          <h2 className="headline-lg text-reg-text mb-4">
            Blockchain & AI Systems
          </h2>
          <p className="body-text max-w-2xl mx-auto">
            Building the future of decentralized technology and intelligent automation. 
            From smart contracts to AI-driven trading systems.
          </p>
        </div>

        {/* TradingView Live Chart Widget */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-reg-primary" />
              <span className="text-sm text-reg-text-secondary">Live Market Data</span>
            </div>
            <a 
              href="https://www.tradingview.com/markets/cryptocurrencies/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-reg-primary hover:underline flex items-center gap-1"
            >
              View on TradingView <ExternalLink size={12} />
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden border border-reg-border shadow-xl bg-reg-bg-card">
            {/* TradingView Widget */}
            <div className="tradingview-widget-container" style={{ height: '400px' }}>
              <iframe 
                src="https://s.tradingview.com/embed-widget/market-quotes/?locale=en#%7B%22width%22%3A%22100%25%22%2C%22height%22%3A400%2C%22symbolsGroups%22%3A%5B%7B%22name%22%3A%22Cryptocurrency%22%2C%22originalName%22%3A%22Cryptocurrency%22%2C%22symbols%22%3A%5B%7B%22name%22%3A%22BINANCE%3ABTCUSDT%22%2C%22displayName%22%3A%22BTC%2FUSDT%22%7D%2C%7B%22name%22%3A%22BINANCE%3AETHUSDT%22%2C%22displayName%22%3A%22ETH%2FUSDT%22%7D%2C%7B%22name%22%3A%22BINANCE%3ASOLUSDT%22%2C%22displayName%22%3A%22SOL%2FUSDT%22%7D%2C%7B%22name%22%3A%22BINANCE%3AXRPUSDT%22%2C%22displayName%22%3A%22XRP%2FUSDT%22%7D%2C%7B%22name%22%3A%22BINANCE%3ADOGEUSDT%22%2C%22displayName%22%3A%22DOGE%2FUSDT%22%7D%5D%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22isTransparent%22%3Afalse%2C%22colorTheme%22%3A%22dark%22%2C%22utm_source%22%3A%22reginaldkargbo.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22marketquotes%22%7D"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="TradingView Market Quotes"
              />
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div ref={videoContainerRef} className="relative max-w-5xl mx-auto">
          {/* Tech Cards - Floating */}
          <a 
            href="https://huggingface.co/models"
            target="_blank"
            rel="noopener noreferrer"
            className="tech-card absolute -left-4 md:-left-16 top-1/4 z-20 hidden md:block"
          >
            <div className="p-4 rounded-xl bg-reg-bg-card/90 border border-reg-border backdrop-blur-sm hover:border-reg-primary/50 transition-all cursor-pointer group">
              <Cpu size={24} className="text-reg-primary mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs text-reg-text-secondary">AI Processing</div>
              <div className="text-sm text-reg-text font-medium">Real-time Analysis</div>
              <ExternalLink size={12} className="text-reg-text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>

          <a 
            href="https://ethereum.org/en/developers/"
            target="_blank"
            rel="noopener noreferrer"
            className="tech-card absolute -right-4 md:-right-16 top-1/3 z-20 hidden md:block"
          >
            <div className="p-4 rounded-xl bg-reg-bg-card/90 border border-reg-border backdrop-blur-sm hover:border-reg-accent/50 transition-all cursor-pointer group">
              <Network size={24} className="text-reg-accent mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs text-reg-text-secondary">Blockchain</div>
              <div className="text-sm text-reg-text font-medium">Decentralized</div>
              <ExternalLink size={12} className="text-reg-text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>

          <a 
            href="https://www.kaggle.com/datasets"
            target="_blank"
            rel="noopener noreferrer"
            className="tech-card absolute -left-4 md:-left-12 bottom-1/4 z-20 hidden md:block"
          >
            <div className="p-4 rounded-xl bg-reg-bg-card/90 border border-reg-border backdrop-blur-sm hover:border-reg-primary/50 transition-all cursor-pointer group">
              <Database size={24} className="text-reg-primary mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs text-reg-text-secondary">Data Systems</div>
              <div className="text-sm text-reg-text font-medium">Secure Storage</div>
              <ExternalLink size={12} className="text-reg-text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>

          {/* YouTube Video Player */}
          <div className="relative rounded-2xl overflow-hidden border border-reg-border shadow-2xl bg-reg-bg-secondary">
            <div className="relative aspect-video">
              {showVideo ? (
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/QJn28fFKUR0?autoplay=1&rel=0"
                  title="Decentralized Intelligence - Blockchain + AI"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <>
                  {/* Thumbnail */}
                  <img 
                    src="/images/tech-video-thumb.png" 
                    alt="Decentralized Intelligence - Blockchain + AI"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-reg-bg/90 via-reg-bg/40 to-transparent" />
                  
                  {/* Play Button */}
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="w-24 h-24 rounded-full bg-red-600/90 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-red-600 transition-all shadow-2xl">
                      <svg 
                        className="w-10 h-10 text-white ml-1" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </button>

                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-red-500 mb-1 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                          </svg>
                          YouTube
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-reg-text">
                          Decentralized Intelligence
                        </h3>
                        <p className="text-sm text-reg-text-secondary mt-1">
                          Blockchain + AI: The Future of Digital Systems
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tech Stack Tags - With Real Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {techStackLinks.map((item, index) => (
              <a 
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-full bg-reg-bg-card border border-reg-border text-xs text-reg-text-secondary transition-all flex items-center gap-1 ${item.color} hover:bg-white/5`}
              >
                {item.name}
                <ExternalLink size={10} className="opacity-50" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechVideoSection;
