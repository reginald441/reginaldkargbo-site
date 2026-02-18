import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Github, Twitter, Instagram, Mail, Phone, Calendar, CreditCard, MapPin, Clock, CheckCircle2, AlertTriangle, FileText, ExternalLink, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/reginald-kargbo/' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/reginald441' },
  { icon: Twitter, label: 'X (Twitter)', href: 'https://x.com/ReginaldKargbo2' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/specialregg/?hl=en' },
];

// Generate real time slots for the next 4 weeks (Monday-Friday, 10 AM - 5 PM ET)
const generateTimeSlots = () => {
  const slots: { date: Date; dayName: string; dateStr: string; fullDate: string; time: string; fullTime: string; timestamp: number }[] = [];
  const today = new Date();
  
  // Generate for next 4 weeks
  for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + (weekOffset * 7) + dayOffset);
      
      const dayOfWeek = date.getDay();
      // Only Monday-Friday (1-5)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const times = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        
        times.forEach(time => {
          const [hourStr, minuteStr] = time.split(':');
          const isPM = time.includes('PM');
          let hour = parseInt(hourStr);
          if (isPM && hour !== 12) hour += 12;
          if (!isPM && hour === 12) hour = 0;
          
          const slotDate = new Date(date);
          slotDate.setHours(hour, parseInt(minuteStr), 0, 0);
          
          // Only include future slots (at least 2 hours from now)
          const twoHoursFromNow = new Date();
          twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);
          
          if (slotDate > twoHoursFromNow) {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            slots.push({
              date: slotDate,
              dayName: dayNames[dayOfWeek],
              dateStr: `${monthNames[slotDate.getMonth()]} ${slotDate.getDate()}`,
              fullDate: `${dayNames[dayOfWeek]}, ${monthNames[slotDate.getMonth()]} ${slotDate.getDate()}, ${slotDate.getFullYear()}`,
              time,
              fullTime: `${dayNames[dayOfWeek]}, ${monthNames[slotDate.getMonth()]} ${slotDate.getDate()}, ${slotDate.getFullYear()} at ${time} ET`,
              timestamp: slotDate.getTime(),
            });
          }
        });
      }
    }
  }
  
  return slots.slice(0, 40);
};

const timeSlots = generateTimeSlots();

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  
  // Booking state
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<typeof timeSlots[0] | null>(null);
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '' });
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvv: '', nameOnCard: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  // Load booked slots from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookedSlots');
    if (saved) {
      setBookedSlots(JSON.parse(saved));
    }
  }, []);

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

  const isSlotBooked = (timestamp: number) => bookedSlots.includes(timestamp);

  const handleSlotSelect = (slot: typeof timeSlots[0]) => {
    if (!isSlotBooked(slot.timestamp)) {
      setSelectedSlot(slot);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setPaymentSuccess(true);
    
    // Generate receipt number
    const newReceiptNumber = `RK-${Date.now().toString().slice(-8)}`;
    setReceiptNumber(newReceiptNumber);
  };

  const handleBookingSubmit = () => {
    if (selectedSlot && agreedToPolicy && clientInfo.name && clientInfo.email && paymentSuccess) {
      // Add to booked slots
      const newBookedSlots = [...bookedSlots, selectedSlot.timestamp];
      setBookedSlots(newBookedSlots);
      localStorage.setItem('bookedSlots', JSON.stringify(newBookedSlots));
      
      // Send notification emails
      sendBookingNotifications();
      
      setBookingConfirmed(true);
      setBookingStep(5);
    }
  };

  const sendBookingNotifications = () => {
    // Email to Reginald
    const adminEmailSubject = `NEW BOOKING CONFIRMED: ${clientInfo.name}`;
    const adminEmailBody = `
NEW BOOKING CONFIRMED!

Receipt #: ${receiptNumber}

CLIENT DETAILS:
Name: ${clientInfo.name}
Email: ${clientInfo.email}
Phone: ${clientInfo.phone || 'Not provided'}

BOOKING DETAILS:
Date/Time: ${selectedSlot?.fullTime}
Service: 1-Hour Consultation
Price: $30.00
Payment Status: PAID
Payment Method: ${paymentMethod === 'applepay' ? 'Apple Pay' : 'Credit/Debit Card'}

Location: Indianapolis, IN (Virtual/Remote)

Please send meeting link to client before appointment.
    `;

    // Email to Client with receipt
    const clientEmailSubject = `Booking Confirmed - Receipt #${receiptNumber}`;
    const clientEmailBody = `
Dear ${clientInfo.name},

Thank you for your booking! Your payment has been received and confirmed.

========================================
           BOOKING RECEIPT
========================================
Receipt #: ${receiptNumber}
Date: ${new Date().toLocaleDateString()}

CLIENT INFORMATION:
Name: ${clientInfo.name}
Email: ${clientInfo.email}

SERVICE DETAILS:
Service: 1-Hour Consultation
Date/Time: ${selectedSlot?.fullTime}
Duration: 1 Hour

PAYMENT INFORMATION:
Amount: $30.00
Payment Method: ${paymentMethod === 'applepay' ? 'Apple Pay' : 'Credit/Debit Card'}
Status: PAID

BUSINESS INFORMATION:
Reginald Kargbo - AI & Software Solutions
Indianapolis, IN, United States
Phone: (240) 616-5466
Email: reginaldkargbo987@gmail.com

WHAT HAPPENS NEXT:
1. You'll receive a calendar invite with meeting link
2. Join the meeting at your scheduled time
3. We'll discuss your project needs

POLICY: All bookings are non-refundable. You may reschedule up to 24 hours in advance.

Thank you for your business!

Best regards,
Reginald Kargbo
    `;

    // Open email clients
    window.open(`mailto:reginaldkargbo987@gmail.com?subject=${encodeURIComponent(adminEmailSubject)}&body=${encodeURIComponent(adminEmailBody)}`);
    setTimeout(() => {
      window.open(`mailto:${clientInfo.email}?subject=${encodeURIComponent(clientEmailSubject)}&body=${encodeURIComponent(clientEmailBody)}`);
    }, 500);
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
Service: 1-Hour Consultation
Date/Time: ${selectedSlot?.fullTime}
Duration: 1 Hour

PAYMENT INFORMATION:
Amount: $30.00
Payment Method: ${paymentMethod === 'applepay' ? 'Apple Pay' : 'Credit/Debit Card'}
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

    // Download receipt
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
    setPaymentInfo({ cardNumber: '', expiry: '', cvv: '', nameOnCard: '' });
    setPaymentMethod(null);
    setPaymentSuccess(false);
    setBookingConfirmed(false);
    setReceiptNumber('');
    setBookingDialogOpen(false);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="flowing-section relative z-90 bg-reg-bg-secondary py-20 md:py-32 border-t border-reg-border"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full opacity-8"
        style={{
          backgroundImage: 'url(/images/reg-contact.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-reg-bg-secondary via-reg-bg-secondary/98 to-reg-bg-secondary" />

      <div className="relative z-10 px-6 md:px-[8vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16 md:mb-24">
          {/* Left - Heading */}
          <div ref={headingRef}>
            <span className="eyebrow mb-4 block">Get In Touch</span>
            <h2 className="headline-lg text-reg-text mb-4">
              Let's build something amazing together.
            </h2>
            <p className="body-text max-w-md mb-8">
              Ready to take your business to the next level? Book a consultation 
              and let's discuss how I can help you achieve your goals.
            </p>

            {/* Location */}
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-reg-bg-card border border-reg-border">
              <MapPin size={20} className="text-reg-primary" />
              <div>
                <div className="text-reg-text font-medium text-sm">Location</div>
                <div className="text-reg-text-secondary text-sm">Indianapolis, IN, United States</div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-reg-bg-card border border-reg-border">
              <Clock size={20} className="text-reg-accent" />
              <div>
                <div className="text-reg-text font-medium text-sm">Availability</div>
                <div className="text-reg-text-secondary text-sm">Monday - Friday, 10:00 AM - 5:00 PM ET</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <a 
                href="mailto:reginaldkargbo987@gmail.com"
                className="flex items-center gap-3 text-reg-text-secondary hover:text-reg-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-reg-primary/10 flex items-center justify-center group-hover:bg-reg-primary/20 transition-colors">
                  <Mail size={18} className="text-reg-primary" />
                </div>
                <span>reginaldkargbo987@gmail.com</span>
              </a>
              <a 
                href="tel:+12406165466"
                className="flex items-center gap-3 text-reg-text-secondary hover:text-reg-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-reg-primary/10 flex items-center justify-center group-hover:bg-reg-primary/20 transition-colors">
                  <Phone size={18} className="text-reg-primary" />
                </div>
                <span>(240) 616-5466</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/5 hover:bg-reg-primary/10 flex items-center justify-center transition-colors group"
                  aria-label={link.label}
                >
                  <link.icon
                    size={18}
                    className="text-reg-text-secondary group-hover:text-reg-primary transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right - Booking Card */}
          <div ref={cardRef} className="lg:justify-self-end">
            <div className="card-glass rounded-2xl p-6 md:p-8 w-full max-w-[420px]">
              {/* Booking Price */}
              <div className="text-center mb-6 p-4 rounded-xl bg-reg-primary/10 border border-reg-primary/20">
                <div className="text-reg-text-muted text-sm mb-1">Consultation Fee</div>
                <div className="text-reg-primary font-heading font-bold text-3xl">$30<span className="text-lg">/hour</span></div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <span className="eyebrow mb-3 block">Secure Payment</span>
                <div className="flex items-center gap-2 text-sm text-reg-text-secondary">
                  <Lock size={14} className="text-reg-primary" />
                  <span>Encrypted & Secure</span>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => setBookingDialogOpen(true)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                <span>Book a Consultation</span>
              </button>

              <p className="text-center text-xs text-reg-text-muted mt-4">
                1-hour consultation • Payment required • Non-refundable
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          ref={footerRef}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-reg-border"
        >
          <div className="text-sm text-reg-text-muted">
            © {new Date().getFullYear()} Reginald Kargbo. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://evci4m7bhnmq2.ok.kimi.link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-reg-text-muted hover:text-reg-primary transition-colors flex items-center gap-1"
            >
              <span>Nalvenix Innovations</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="bg-reg-bg-secondary border-reg-border text-reg-text max-w-2xl max-h-[90vh] overflow-y-auto">
          {!bookingConfirmed ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  {bookingStep === 1 && 'Select a Date & Time'}
                  {bookingStep === 2 && 'Your Information'}
                  {bookingStep === 3 && 'Secure Payment'}
                  {bookingStep === 4 && 'Confirm Booking'}
                </DialogTitle>
                <DialogDescription className="text-reg-text-secondary">
                  {bookingStep === 1 && 'Choose an available time for your 1-hour consultation ($30)'}
                  {bookingStep === 2 && 'Please provide your contact details'}
                  {bookingStep === 3 && 'Enter your payment information securely'}
                  {bookingStep === 4 && 'Review and confirm your booking'}
                </DialogDescription>
              </DialogHeader>

              {/* Step 1: Time Selection */}
              {bookingStep === 1 && (
                <div className="mt-6">
                  <div className="mb-4 p-3 rounded-lg bg-reg-bg-card border border-reg-border">
                    <div className="flex items-center gap-2 text-sm text-reg-text-secondary">
                      <MapPin size={14} className="text-reg-primary" />
                      <span>Indianapolis, IN • Virtual/Remote</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-reg-text-secondary mt-1">
                      <Clock size={14} className="text-reg-accent" />
                      <span>All times are Eastern Time (ET)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2">
                    {timeSlots.map((slot, i) => {
                      const isBooked = isSlotBooked(slot.timestamp);
                      const isSelected = selectedSlot?.timestamp === slot.timestamp;
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={isBooked}
                          className={`p-3 rounded-lg text-left text-sm transition-all ${
                            isBooked
                              ? 'bg-red-500/10 border border-red-500/30 opacity-70 cursor-not-allowed'
                              : isSelected
                              ? 'bg-reg-primary/20 border-2 border-reg-primary text-reg-text'
                              : 'bg-reg-bg-card border border-reg-border hover:border-reg-primary/50 text-reg-text-secondary'
                          }`}
                        >
                          <div className="font-medium text-reg-text">{slot.dayName}</div>
                          <div className="text-xs">{slot.dateStr}</div>
                          <div className="text-reg-primary mt-1">{slot.time}</div>
                          {isBooked && <div className="text-xs text-red-400 mt-1 font-medium">✗ Booked</div>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => selectedSlot && setBookingStep(2)}
                      disabled={!selectedSlot}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continue</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Client Info */}
              {bookingStep === 2 && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm text-reg-text-secondary mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      className="w-full p-3 rounded-lg bg-reg-bg-card border border-reg-border text-reg-text placeholder-reg-text-muted focus:border-reg-primary focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-reg-text-secondary mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="w-full p-3 rounded-lg bg-reg-bg-card border border-reg-border text-reg-text placeholder-reg-text-muted focus:border-reg-primary focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-reg-text-secondary mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      className="w-full p-3 rounded-lg bg-reg-bg-card border border-reg-border text-reg-text placeholder-reg-text-muted focus:border-reg-primary focus:outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-reg-bg-card border border-reg-border">
                    <div className="text-sm text-reg-text-secondary mb-2">Selected Time</div>
                    <div className="text-reg-text font-medium">{selectedSlot?.fullTime}</div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setBookingStep(1)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <ChevronLeft size={16} />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => clientInfo.name && clientInfo.email && setBookingStep(3)}
                      disabled={!clientInfo.name || !clientInfo.email}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continue to Payment</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {bookingStep === 3 && (
                <div className="mt-6 space-y-4">
                  {/* Order Summary */}
                  <div className="p-4 rounded-lg bg-reg-bg-card border border-reg-border">
                    <div className="text-sm text-reg-text-secondary mb-3">Order Summary</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Service</span>
                        <span className="text-reg-text">1-Hour Consultation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Date/Time</span>
                        <span className="text-reg-text">{selectedSlot?.fullTime}</span>
                      </div>
                      <div className="flex justify-between border-t border-reg-border pt-2 mt-2">
                        <span className="text-reg-text font-medium">Total</span>
                        <span className="text-reg-primary font-bold">$30.00</span>
                      </div>
                    </div>
                  </div>

                  {!paymentSuccess ? (
                    <>
                      {/* Payment Method Selection */}
                      <div>
                        <label className="block text-sm text-reg-text-secondary mb-2">Select Payment Method</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setPaymentMethod('card')}
                            className={`p-3 rounded-lg border text-left text-sm transition-all ${
                              paymentMethod === 'card'
                                ? 'bg-reg-primary/20 border-reg-primary text-reg-text'
                                : 'bg-reg-bg-card border-reg-border hover:border-reg-primary/50 text-reg-text-secondary'
                            }`}
                          >
                            <CreditCard size={18} className="mb-1" />
                            Credit/Debit Card
                          </button>
                          <button
                            onClick={() => setPaymentMethod('applepay')}
                            className={`p-3 rounded-lg border text-left text-sm transition-all ${
                              paymentMethod === 'applepay'
                                ? 'bg-reg-primary/20 border-reg-primary text-reg-text'
                                : 'bg-reg-bg-card border-reg-border hover:border-reg-primary/50 text-reg-text-secondary'
                            }`}
                          >
                            <span className="text-lg">🍎</span>
                            <div className="mt-1">Apple Pay</div>
                          </button>
                        </div>
                      </div>

                      {/* Card Payment Form */}
                      {paymentMethod === 'card' && (
                        <div className="p-4 rounded-lg bg-reg-bg-card border border-reg-border space-y-4">
                          <div className="flex items-center gap-2 text-sm text-reg-text-secondary mb-2">
                            <Lock size={14} className="text-reg-primary" />
                            <span>Secure Card Payment</span>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-reg-text-muted mb-1">Card Number</label>
                            <input
                              type="text"
                              maxLength={19}
                              value={paymentInfo.cardNumber}
                              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
                              className="w-full p-3 rounded-lg bg-reg-bg border border-reg-border text-reg-text placeholder-reg-text-muted focus:border-reg-primary focus:outline-none font-mono"
                              placeholder="0000 0000 0000 0000"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-reg-text-muted mb-1">Expiry Date</label>
                              <input
                                type="text"
                                maxLength={5}
                                value={paymentInfo.expiry}
                                onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: formatExpiry(e.target.value) })}
                                className="w-full p-3 rounded-lg bg-reg-bg border border-reg-border text-reg-text placeholder-reg-text-muted focus:border-reg-primary focus:outline-none font-mono"
                                placeholder="MM/YY"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-reg-text-muted mb-1">CVV</label>
                              <input
                                type="password"
                                maxLength={4}
                                value={paymentInfo.cvv}
                                onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '') })}
                                className="w-full p-3 rounded-lg bg-reg-bg border border-reg-border text-reg-text placeholder-reg-text-muted focus:border-reg-primary focus:outline-none font-mono"
                                placeholder="123"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-reg-text-muted mb-1">Name on Card</label>
                            <input
                              type="text"
                              value={paymentInfo.nameOnCard}
                              onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                              className="w-full p-3 rounded-lg bg-reg-bg border border-reg-border text-reg-text placeholder-reg-text-muted focus:border-reg-primary focus:outline-none"
                              placeholder="John Doe"
                            />
                          </div>

                          <button
                            onClick={processPayment}
                            disabled={!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv || !paymentInfo.nameOnCard || isProcessing}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <Lock size={16} />
                                <span>Pay $30.00</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Apple Pay */}
                      {paymentMethod === 'applepay' && (
                        <div className="p-4 rounded-lg bg-reg-bg-card border border-reg-border">
                          <button
                            onClick={processPayment}
                            disabled={isProcessing}
                            className="w-full p-4 rounded-xl bg-black border border-white/20 flex items-center justify-center gap-3 hover:bg-white/5 transition-colors disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <span className="text-2xl">🍎</span>
                                <span className="text-white font-medium">Pay with Apple Pay</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Payment Success */
                    <div className="p-4 rounded-lg bg-reg-primary/10 border border-reg-primary/20">
                      <div className="flex items-center gap-2 text-reg-primary">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">Payment Successful!</span>
                      </div>
                      <p className="text-sm text-reg-text-secondary mt-2">
                        Your payment of $30.00 has been processed successfully.
                      </p>
                      <button
                        onClick={() => setBookingStep(4)}
                        className="btn-primary w-full mt-4"
                      >
                        Continue to Confirmation
                      </button>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setBookingStep(2)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <ChevronLeft size={16} />
                      <span>Back</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {bookingStep === 4 && (
                <div className="mt-6 space-y-4">
                  {/* Booking Summary */}
                  <div className="p-4 rounded-lg bg-reg-bg-card border border-reg-border">
                    <div className="text-sm text-reg-text-secondary mb-3">Booking Summary</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Client</span>
                        <span className="text-reg-text">{clientInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Date/Time</span>
                        <span className="text-reg-text">{selectedSlot?.fullTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-reg-text-secondary">Payment Method</span>
                        <span className="text-reg-text">{paymentMethod === 'applepay' ? 'Apple Pay' : 'Credit/Debit Card'}</span>
                      </div>
                      <div className="flex justify-between border-t border-reg-border pt-2 mt-2">
                        <span className="text-reg-text font-medium">Total Paid</span>
                        <span className="text-reg-primary font-bold">$30.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="p-4 rounded-lg bg-reg-primary/10 border border-reg-primary/20">
                    <div className="flex items-center gap-2 text-reg-primary">
                      <CheckCircle2 size={20} />
                      <span className="font-medium">Payment Confirmed</span>
                    </div>
                  </div>

                  {/* No Refund Policy */}
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm text-red-400 font-medium mb-1">No Refund Policy</div>
                        <div className="text-xs text-reg-text-secondary">
                          All bookings are non-refundable. You may reschedule up to 24 hours before your appointment.
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Checkbox
                        id="policy"
                        checked={agreedToPolicy}
                        onCheckedChange={(checked) => setAgreedToPolicy(checked as boolean)}
                      />
                      <label htmlFor="policy" className="text-sm text-reg-text-secondary cursor-pointer">
                        I agree to the no refund policy
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setBookingStep(3)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <ChevronLeft size={16} />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleBookingSubmit}
                      disabled={!agreedToPolicy}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 size={16} />
                      <span>Complete Booking</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Booking Confirmed - Receipt */
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-reg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-reg-primary" />
              </div>
              <DialogTitle className="font-heading text-2xl mb-2">Booking Confirmed!</DialogTitle>
              <DialogDescription className="text-reg-text-secondary mb-6">
                Your consultation is scheduled for {selectedSlot?.fullTime}
              </DialogDescription>

              <div className="p-4 rounded-lg bg-reg-bg-card border border-reg-border text-left mb-6">
                <div className="text-sm text-reg-text-secondary mb-2">Receipt #{receiptNumber}</div>
                <div className="flex items-center gap-2 text-reg-primary">
                  <CheckCircle2 size={16} />
                  <span className="font-medium">$30.00 Paid via {paymentMethod === 'applepay' ? 'Apple Pay' : 'Credit/Debit Card'}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-reg-bg-card border border-reg-border text-left mb-6">
                <div className="text-sm text-reg-text-secondary mb-2">What happens next?</div>
                <ul className="space-y-2 text-sm text-reg-text">
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

              <div className="flex gap-3 justify-center">
                <button onClick={generateReceipt} className="btn-accent flex items-center gap-2">
                  <FileText size={16} />
                  <span>Download Receipt</span>
                </button>
                <button onClick={resetBooking} className="btn-secondary">
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
