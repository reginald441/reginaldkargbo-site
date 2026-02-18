import { useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Github, Twitter, Instagram, Mail, Phone, Calendar, CreditCard, MapPin, Clock, CheckCircle2, AlertTriangle, FileText, ExternalLink, ChevronLeft, ChevronRight, Lock, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  generateTimeSlots, 
  checkSlotAvailability, 
  createBooking, 
  getBookedTimestamps,
  sendBookingEmail,
  type TimeSlot 
} from '@/services/bookingService';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/reginald-kargbo/' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/reginald441' },
  { icon: Twitter, label: 'X (Twitter)', href: 'https://x.com/ReginaldKargbo2' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/specialregg/?hl=en' },
];

// Stripe Payment Link
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/cNi9AV74G03HeW2getasg00';

const timeSlots = generateTimeSlots();

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookedTimestamps, setBookedTimestamps] = useState<number[]>([]);
  const [slotAvailability, setSlotAvailability] = useState<Map<number, boolean>>(new Map());
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '' });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch booked slots on mount and periodically
  useEffect(() => {
    const fetchBookedSlots = async () => {
      const timestamps = await getBookedTimestamps();
      setBookedTimestamps(timestamps);
    };
    
    fetchBookedSlots();
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchBookedSlots, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check availability when dialog opens
  useEffect(() => {
    if (bookingDialogOpen && bookingStep === 1) {
      checkAllSlotsAvailability();
    }
  }, [bookingDialogOpen, bookingStep]);

  const checkAllSlotsAvailability = async () => {
    setIsCheckingAvailability(true);
    const availabilityMap = new Map<number, boolean>();
    
    // Check first 20 slots to avoid too many requests
    const slotsToCheck = timeSlots.slice(0, 20);
    
    await Promise.all(
      slotsToCheck.map(async (slot) => {
        const isAvailable = await checkSlotAvailability(slot.timestamp);
        availabilityMap.set(slot.timestamp, isAvailable);
      })
    );
    
    setSlotAvailability(availabilityMap);
    setIsCheckingAvailability(false);
  };

  const isSlotBooked = useCallback((timestamp: number) => {
    // Check local state first
    if (bookedTimestamps.includes(timestamp)) return true;
    // Check server availability
    if (slotAvailability.has(timestamp)) {
      return !slotAvailability.get(timestamp);
    }
    return false;
  }, [bookedTimestamps, slotAvailability]);

  const handleSlotSelect = async (slot: TimeSlot) => {
    if (isSlotBooked(slot.timestamp)) return;
    
    // Double-check availability before selecting
    const isAvailable = await checkSlotAvailability(slot.timestamp);
    if (!isAvailable) {
      // Refresh availability
      await checkAllSlotsAvailability();
      return;
    }
    
    setSelectedSlot(slot);
    setBookingError('');
  };

  const redirectToStripe = () => {
    if (selectedSlot && agreedToPolicy && clientInfo.name && clientInfo.email) {
      // Store booking data temporarily
      const bookingData = {
        slot: selectedSlot,
        clientInfo,
        timestamp: Date.now(),
      };
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      
      // Open Stripe in new tab with pre-filled email
      const stripeUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(clientInfo.email)}`;
      window.open(stripeUrl, '_blank');
      
      // Move to confirmation step
      setBookingStep(4);
    }
  };

  const completeBooking = async () => {
    if (!selectedSlot) return;
    
    setIsProcessing(true);
    setBookingError('');
    
    // Final availability check
    const isAvailable = await checkSlotAvailability(selectedSlot.timestamp);
    if (!isAvailable) {
      setBookingError('This slot has just been booked by someone else. Please select another time.');
      setIsProcessing(false);
      await checkAllSlotsAvailability();
      setBookingStep(1);
      return;
    }
    
    // Create booking in database
    const result = await createBooking({
      timestamp: selectedSlot.timestamp,
      slotTime: selectedSlot.time,
      slotDate: selectedSlot.dateStr,
      fullTime: selectedSlot.fullTime,
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
    });
    
    if (!result.success) {
      setBookingError(result.error || 'Failed to create booking. Please try again.');
      setIsProcessing(false);
      return;
    }
    
    // Update local state
    const newBookedTimestamps = [...bookedTimestamps, selectedSlot.timestamp];
    setBookedTimestamps(newBookedTimestamps);
    localStorage.setItem('bookedSlots', JSON.stringify(newBookedTimestamps));
    
    // Generate receipt
    const newReceiptNumber = `RK-${Date.now().toString().slice(-8)}`;
    setReceiptNumber(newReceiptNumber);
    
    // Send email notifications
    sendBookingEmail(clientInfo, selectedSlot, newReceiptNumber);
    
    setBookingConfirmed(true);
    setBookingStep(5);
    setIsProcessing(false);
    
    localStorage.removeItem('pendingBooking');
  };

  const generateReceipt = () => {
    const receiptText = `
========================================
           BOOKING RECEIPT
========================================
Receipt #: ${receiptNumber}
Date: ${new Date().toLocaleDateString()}

CLIENT INFORMATION:
Name: ${clientInfo.name}
Email: ${clientInfo.email}

SERVICE DETAILS:
Service: 30-Minute Consultation
Date/Time: ${selectedSlot?.fullTime}
Duration: 30 Minutes

PAYMENT INFORMATION:
Amount: $30.00
Payment Method: Stripe (Credit/Debit Card)
Status: PAID

BUSINESS INFORMATION:
Reginald Kargbo - AI & Software Solutions
Indianapolis, IN, United States
Phone: (240) 616-5466
Email: reginaldkargbo987@gmail.com

POLICY: All bookings are non-refundable.

Thank you for your business!
========================================
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${receiptNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetBooking = () => {
    setBookingStep(1);
    setSelectedSlot(null);
    setAgreedToPolicy(false);
    setClientInfo({ name: '', email: '', phone: '' });
    setBookingConfirmed(false);
    setReceiptNumber('');
    setBookingError('');
    setBookingDialogOpen(false);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
            end: 'top 60%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        cardRef.current,
        { x: '6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
            end: 'top 60%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            end: 'top 80%',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="flowing-section relative z-90 py-20 md:py-32 border-t border-reg-border"
    >
      {/* Tech Footer Background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/images/tech-footer-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-reg-bg via-reg-bg/95 to-reg-bg/80" />
      
      {/* Additional Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-reg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-reg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-6 md:px-[8vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16 md:mb-24">
          {/* Left - Heading */}
          <div ref={headingRef}>
            <span className="eyebrow mb-4 block">Get In Touch</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-reg-text mb-4">
              Let's build something amazing together.
            </h2>
            <p className="text-base text-reg-text-secondary max-w-md mb-8 leading-relaxed">
              Ready to take your business to the next level? Book a consultation 
              and let's discuss how I can help you achieve your goals.
            </p>

            {/* Location */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-reg-bg-card/80 border border-reg-border">
              <MapPin size={18} className="text-reg-primary" />
              <div>
                <div className="text-reg-text text-sm font-medium">Location</div>
                <div className="text-reg-text-secondary text-sm">Indianapolis, IN, United States</div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-reg-bg-card/80 border border-reg-border">
              <Clock size={18} className="text-reg-accent" />
              <div>
                <div className="text-reg-text text-sm font-medium">Availability</div>
                <div className="text-reg-text-secondary text-sm">Monday - Friday, 10:00 AM - 5:00 PM ET</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <a 
                href="mailto:reginaldkargbo987@gmail.com"
                className="flex items-center gap-3 text-reg-text-secondary hover:text-reg-primary transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-reg-primary/10 flex items-center justify-center group-hover:bg-reg-primary/20 transition-colors">
                  <Mail size={16} className="text-reg-primary" />
                </div>
                <span className="text-sm">reginaldkargbo987@gmail.com</span>
              </a>
              <a 
                href="tel:+12406165466"
                className="flex items-center gap-3 text-reg-text-secondary hover:text-reg-primary transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-reg-primary/10 flex items-center justify-center group-hover:bg-reg-primary/20 transition-colors">
                  <Phone size={16} className="text-reg-primary" />
                </div>
                <span className="text-sm">(240) 616-5466</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-reg-primary/10 flex items-center justify-center transition-colors group"
                  aria-label={link.label}
                >
                  <link.icon
                    size={16}
                    className="text-reg-text-secondary group-hover:text-reg-primary transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right - Booking Card */}
          <div ref={cardRef} className="lg:justify-self-end">
            <div className="card-glass rounded-xl p-5 md:p-6 w-full max-w-[380px]">
              {/* Booking Price */}
              <div className="text-center mb-5 p-3 rounded-lg bg-reg-primary/10 border border-reg-primary/20">
                <div className="text-reg-text-muted text-xs mb-1">Consultation Fee</div>
                <div className="text-reg-primary font-heading font-bold text-2xl">$30<span className="text-base">/30min</span></div>
              </div>

              {/* Payment Methods */}
              <div className="mb-5">
                <span className="eyebrow mb-2 block">Secure Payment</span>
                <div className="flex items-center gap-2 text-xs text-reg-text-secondary">
                  <Lock size={12} className="text-reg-primary" />
                  <span>Powered by Stripe</span>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => setBookingDialogOpen(true)}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3"
              >
                <Calendar size={16} />
                <span>Book a Consultation</span>
              </button>

              <p className="text-center text-xs text-reg-text-muted mt-3">
                30-minute consultation • Secure payment • Non-refundable
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          ref={footerRef}
          className="relative"
        >
          <div className="absolute inset-0 -mx-[8vw] overflow-hidden">
            <svg className="absolute bottom-0 left-0 w-full h-24 opacity-10" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path 
                d="M0,60 Q300,120 600,60 T1200,60" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="1"
                className="animate-pulse"
              />
            </svg>
            <div className="absolute bottom-4 left-1/4 w-1.5 h-1.5 bg-reg-primary rounded-full animate-pulse" />
            <div className="absolute bottom-6 left-1/2 w-1 h-1 bg-reg-accent rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute bottom-4 left-3/4 w-1.5 h-1.5 bg-reg-primary rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-reg-border">
            <div className="text-xs text-reg-text-muted">
              © {new Date().getFullYear()} Reginald Kargbo. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <a 
                href="https://evci4m7bhnmq2.ok.kimi.link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-reg-text-muted hover:text-reg-primary transition-colors flex items-center gap-1"
              >
                <span>Nalvenix Innovations</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="bg-reg-bg-secondary border-reg-border text-reg-text max-w-xl max-h-[90vh] overflow-y-auto">
          {!bookingConfirmed ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">
                  {bookingStep === 1 && 'Select a Date & Time'}
                  {bookingStep === 2 && 'Your Information'}
                  {bookingStep === 3 && 'Review & Payment'}
                  {bookingStep === 4 && 'Payment Confirmation'}
                </DialogTitle>
                <DialogDescription className="text-reg-text-secondary text-sm">
                  {bookingStep === 1 && 'Choose an available time for your 30-minute consultation ($30)'}
                  {bookingStep === 2 && 'Please provide your contact details'}
                  {bookingStep === 3 && 'Review your booking and proceed to secure Stripe payment'}
                  {bookingStep === 4 && 'Confirm your payment was successful'}
                </DialogDescription>
              </DialogHeader>

              {/* Error Message */}
              {bookingError && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-red-400">{bookingError}</p>
                </div>
              )}

              {/* Step 1: Time Selection */}
              {bookingStep === 1 && (
                <div className="mt-4">
                  <div className="mb-3 p-2 rounded-lg bg-reg-bg-card border border-reg-border text-xs">
                    <div className="flex items-center gap-2 text-reg-text-secondary">
                      <MapPin size={12} className="text-reg-primary" />
                      <span>Indianapolis, IN • Virtual/Remote</span>
                    </div>
                    <div className="flex items-center gap-2 text-reg-text-secondary mt-1">
                      <Clock size={12} className="text-reg-accent" />
                      <span>All times are Eastern Time (ET)</span>
                    </div>
                  </div>

                  {/* Refresh Button */}
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={checkAllSlotsAvailability}
                      disabled={isCheckingAvailability}
                      className="text-xs text-reg-text-secondary hover:text-reg-primary flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw size={12} className={isCheckingAvailability ? 'animate-spin' : ''} />
                      {isCheckingAvailability ? 'Refreshing...' : 'Refresh availability'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[350px] overflow-y-auto pr-1">
                    {timeSlots.map((slot, i) => {
                      const isBooked = isSlotBooked(slot.timestamp);
                      const isSelected = selectedSlot?.timestamp === slot.timestamp;
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={isBooked}
                          className={`p-2 rounded-lg text-left text-xs transition-all ${
                            isBooked
                              ? 'bg-red-500/10 border border-red-500/30 opacity-70 cursor-not-allowed'
                              : isSelected
                              ? 'bg-reg-primary/20 border-2 border-reg-primary text-reg-text'
                              : 'bg-reg-bg-card border border-reg-border hover:border-reg-primary/50 text-reg-text-secondary'
                          }`}
                        >
                          <div className="font-medium text-reg-text text-xs">{slot.dayName}</div>
                          <div className="text-[10px]">{slot.dateStr}</div>
                          <div className="text-reg-primary mt-0.5 text-xs">{slot.time}</div>
                          {isBooked && (
                            <div className="flex items-center gap-1 text-[10px] text-red-400 mt-0.5 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                              BOOKED
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => selectedSlot && setBookingStep(2)}
                      disabled={!selectedSlot}
                      className="btn-primary text-sm px-4 py-2 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continue</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Client Info */}
              {bookingStep === 2 && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs text-reg-text-secondary mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-reg-bg-card border border-reg-border text-reg-text text-sm placeholder-reg-text-muted focus:border-reg-primary focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-reg-text-secondary mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-reg-bg-card border border-reg-border text-reg-text text-sm placeholder-reg-text-muted focus:border-reg-primary focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-reg-text-secondary mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-reg-bg-card border border-reg-border text-reg-text text-sm placeholder-reg-text-muted focus:border-reg-primary focus:outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-reg-bg-card border border-reg-border">
                    <div className="text-xs text-reg-text-secondary mb-1">Selected Time</div>
                    <div className="text-reg-text text-sm font-medium">{selectedSlot?.fullTime}</div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setBookingStep(1)}
                      className="btn-secondary text-sm px-4 py-2 flex items-center gap-1"
                    >
                      <ChevronLeft size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => clientInfo.name && clientInfo.email && setBookingStep(3)}
                      disabled={!clientInfo.name || !clientInfo.email}
                      className="btn-primary text-sm px-4 py-2 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continue</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Stripe Payment */}
              {bookingStep === 3 && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 rounded-lg bg-reg-bg-card border border-reg-border">
                    <div className="text-xs text-reg-text-secondary mb-2">Booking Summary</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Service</span>
                        <span className="text-reg-text">30-Minute Consultation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Date/Time</span>
                        <span className="text-reg-text">{selectedSlot?.fullTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Client</span>
                        <span className="text-reg-text">{clientInfo.name}</span>
                      </div>
                      <div className="flex justify-between border-t border-reg-border pt-1 mt-1">
                        <span className="text-reg-text font-medium">Total</span>
                        <span className="text-reg-primary font-bold">$30.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-red-400 font-medium mb-0.5">No Refund Policy</div>
                        <div className="text-[10px] text-reg-text-secondary">
                          All bookings are non-refundable. You may reschedule up to 24 hours before your appointment.
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Checkbox
                        id="policy"
                        checked={agreedToPolicy}
                        onCheckedChange={(checked) => setAgreedToPolicy(checked as boolean)}
                      />
                      <label htmlFor="policy" className="text-xs text-reg-text-secondary cursor-pointer">
                        I agree to the no refund policy
                      </label>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-reg-bg-card border border-reg-border">
                    <div className="flex items-center gap-2 text-xs text-reg-text-secondary mb-2">
                      <Lock size={12} className="text-reg-primary" />
                      <span>Secure payment powered by Stripe</span>
                    </div>
                    <button
                      onClick={redirectToStripe}
                      disabled={!agreedToPolicy}
                      className="w-full p-3 rounded-lg bg-[#635BFF] hover:bg-[#4f48cc] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CreditCard size={16} />
                      <span>Pay $30.00 with Stripe</span>
                    </button>
                    <p className="text-[10px] text-reg-text-muted mt-2 text-center">
                      You'll be redirected to Stripe's secure checkout page
                    </p>
                  </div>

                  <div className="mt-3 flex justify-between">
                    <button
                      onClick={() => setBookingStep(2)}
                      className="btn-secondary text-sm px-4 py-2 flex items-center gap-1"
                    >
                      <ChevronLeft size={14} />
                      <span>Back</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Payment Confirmation */}
              {bookingStep === 4 && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 rounded-lg bg-reg-primary/10 border border-reg-primary/20">
                    <div className="flex items-center gap-2 text-reg-primary mb-1">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-medium">Did you complete the payment?</span>
                    </div>
                    <p className="text-xs text-reg-text-secondary">
                      After completing payment on Stripe, click the button below to confirm your booking.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-reg-bg-card border border-reg-border">
                    <div className="text-xs text-reg-text-secondary mb-2">Booking Details</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Service</span>
                        <span className="text-reg-text">30-Minute Consultation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Date/Time</span>
                        <span className="text-reg-text">{selectedSlot?.fullTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Amount</span>
                        <span className="text-reg-primary font-bold">$30.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const stripeUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(clientInfo.email)}`;
                        window.open(stripeUrl, '_blank');
                      }}
                      className="flex-1 btn-secondary text-sm py-2"
                    >
                      Return to Stripe
                    </button>
                    <button
                      onClick={completeBooking}
                      disabled={isProcessing}
                      className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} />
                          <span>I've Paid - Confirm</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Booking Confirmed - Receipt */
            <div className="py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-reg-primary/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} className="text-reg-primary" />
              </div>
              <DialogTitle className="font-heading text-xl mb-1">Booking Confirmed!</DialogTitle>
              <DialogDescription className="text-reg-text-secondary text-sm mb-4">
                Your consultation is scheduled for {selectedSlot?.fullTime}
              </DialogDescription>

              <div className="p-3 rounded-lg bg-reg-bg-card border border-reg-border text-left mb-4">
                <div className="text-xs text-reg-text-secondary mb-1">Receipt #{receiptNumber}</div>
                <div className="flex items-center gap-2 text-reg-primary text-sm">
                  <CheckCircle2 size={14} />
                  <span className="font-medium">$30.00 Paid via Stripe</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-reg-bg-card border border-reg-border text-left mb-4">
                <div className="text-xs text-reg-text-secondary mb-2">What happens next?</div>
                <ul className="space-y-1 text-xs text-reg-text">
                  <li className="flex items-start gap-2">
                    <span className="text-reg-primary">1.</span>
                    Check your email for booking confirmation and receipt
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-reg-primary">2.</span>
                    You'll receive a meeting link before your appointment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-reg-primary">3.</span>
                    Join the meeting at your scheduled time
                  </li>
                </ul>
              </div>

              <div className="flex gap-2 justify-center">
                <button onClick={generateReceipt} className="btn-accent text-sm px-4 py-2 flex items-center gap-1">
                  <FileText size={14} />
                  <span>Download Receipt</span>
                </button>
                <button onClick={resetBooking} className="btn-secondary text-sm px-4 py-2">
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ContactSection;
