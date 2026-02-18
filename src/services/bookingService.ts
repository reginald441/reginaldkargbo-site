const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface TimeSlot {
  timestamp: number;
  dayName: string;
  dateStr: string;
  fullDate: string;
  time: string;
  fullTime: string;
}

export interface Booking {
  id: string;
  timestamp: number;
  slotTime: string;
  slotDate: string;
  fullTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface BookingRequest {
  timestamp: number;
  slotTime: string;
  slotDate: string;
  fullTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  stripeSessionId?: string;
}

// Generate time slots for the next 4 weeks (Monday-Friday, 10 AM - 5 PM ET)
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + (weekOffset * 7) + dayOffset);
      
      const dayOfWeek = date.getDay();
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
          
          const twoHoursFromNow = new Date();
          twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);
          
          if (slotDate > twoHoursFromNow) {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            slots.push({
              timestamp: slotDate.getTime(),
              dayName: dayNames[dayOfWeek],
              dateStr: `${monthNames[slotDate.getMonth()]} ${slotDate.getDate()}`,
              fullDate: `${dayNames[dayOfWeek]}, ${monthNames[slotDate.getMonth()]} ${slotDate.getDate()}, ${slotDate.getFullYear()}`,
              time,
              fullTime: `${dayNames[dayOfWeek]}, ${monthNames[slotDate.getMonth()]} ${slotDate.getDate()}, ${slotDate.getFullYear()} at ${time} ET`,
            });
          }
        });
      }
    }
  }
  
  return slots.slice(0, 40);
}

// Fetch all bookings
export async function fetchBookings(): Promise<Booking[]> {
  try {
    const response = await fetch(`${API_URL}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const data = await response.json();
    return data.bookings || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    // Fallback to localStorage
    const saved = localStorage.getItem('bookedSlots');
    return saved ? JSON.parse(saved).map((timestamp: number) => ({ timestamp })) : [];
  }
}

// Check if a slot is available
export async function checkSlotAvailability(timestamp: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/bookings?checkAvailability=true&slot=${timestamp}`);
    if (!response.ok) throw new Error('Failed to check availability');
    const data = await response.json();
    return data.available;
  } catch (error) {
    console.error('Error checking availability:', error);
    // Fallback to localStorage
    const saved = localStorage.getItem('bookedSlots');
    const bookedSlots = saved ? JSON.parse(saved) : [];
    return !bookedSlots.includes(timestamp);
  }
}

// Create a new booking
export async function createBooking(bookingData: BookingRequest): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to create booking' };
    }
    
    // Also save to localStorage as backup
    const saved = localStorage.getItem('bookedSlots');
    const bookedSlots = saved ? JSON.parse(saved) : [];
    bookedSlots.push(bookingData.timestamp);
    localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
    
    return { success: true, booking: data.booking };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Update booking status
export async function updateBooking(id: string, updates: { paymentStatus?: string; stripeSessionId?: string }): Promise<{ success: boolean; booking?: Booking }> {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    
    if (!response.ok) throw new Error('Failed to update booking');
    const data = await response.json();
    return { success: true, booking: data.booking };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { success: false };
  }
}

// Get booked timestamps (for UI display)
export async function getBookedTimestamps(): Promise<number[]> {
  try {
    const bookings = await fetchBookings();
    return bookings
      .filter(b => b.paymentStatus === 'completed')
      .map(b => b.timestamp);
  } catch {
    const saved = localStorage.getItem('bookedSlots');
    return saved ? JSON.parse(saved) : [];
  }
}

// Send email notification (client-side fallback)
export function sendBookingEmail(
  clientInfo: { name: string; email: string; phone?: string },
  slot: TimeSlot,
  receiptNumber: string
): void {
  const adminEmailSubject = `NEW BOOKING CONFIRMED: ${clientInfo.name}`;
  const adminEmailBody = `
NEW BOOKING CONFIRMED!

Receipt #: ${receiptNumber}

CLIENT DETAILS:
Name: ${clientInfo.name}
Email: ${clientInfo.email}
Phone: ${clientInfo.phone || 'Not provided'}

BOOKING DETAILS:
Date/Time: ${slot.fullTime}
Service: 30-Minute Consultation
Price: $30.00
Payment Status: PAID (via Stripe)

Location: Indianapolis, IN (Virtual/Remote)

Please send meeting link to client before appointment.
  `;

  const clientEmailSubject = `Booking Confirmed - Receipt #${receiptNumber}`;
  const clientEmailBody = `
Dear ${clientInfo.name},

Thank you for your booking! Your payment has been received and confirmed via Stripe.

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
Date/Time: ${slot.fullTime}
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

WHAT HAPPENS NEXT:
1. You'll receive a calendar invite with meeting link
2. Join the meeting at your scheduled time
3. We'll discuss your project needs

POLICY: All bookings are non-refundable. You may reschedule up to 24 hours in advance.

Thank you for your business!

Best regards,
Reginald Kargbo
  `;

  // Open email client
  window.open(`mailto:reginaldkargbo987@gmail.com?subject=${encodeURIComponent(adminEmailSubject)}&body=${encodeURIComponent(adminEmailBody)}`);
  
  setTimeout(() => {
    window.open(`mailto:${clientInfo.email}?subject=${encodeURIComponent(clientEmailSubject)}&body=${encodeURIComponent(clientEmailBody)}`);
  }, 500);
}
