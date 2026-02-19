import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize empty bookings file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ bookings: [] }, null, 2));
}

interface Booking {
  id: string;
  timestamp: number;
  slotTime: string;
  slotDate: string;
  fullTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

function readBookings(): { bookings: Booking[] } {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { bookings: [] };
  }
}

function writeBookings(data: { bookings: Booking[] }) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { bookings } = readBookings();

  // GET - Fetch all bookings or check slot availability
  if (req.method === 'GET') {
    const { slot, checkAvailability } = req.query;
    
    if (checkAvailability && slot) {
      const slotTimestamp = parseInt(slot as string);
      const isBooked = bookings.some(
        b => b.timestamp === slotTimestamp && b.paymentStatus === 'completed'
      );
      return res.status(200).json({ available: !isBooked });
    }
    
    return res.status(200).json({ bookings });
  }

  // POST - Create new booking
  if (req.method === 'POST') {
    const { 
      timestamp, 
      slotTime, 
      slotDate, 
      fullTime, 
      clientName, 
      clientEmail, 
      clientPhone,
      stripeSessionId 
    } = req.body;

    // Check if slot is already booked
    const isAlreadyBooked = bookings.some(
      b => b.timestamp === timestamp && b.paymentStatus === 'completed'
    );

    if (isAlreadyBooked) {
      return res.status(409).json({ 
        error: 'Slot already booked',
        message: 'This time slot has already been reserved. Please select another time.'
      });
    }

    const newBooking: Booking = {
      id: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      slotTime,
      slotDate,
      fullTime,
      clientName,
      clientEmail,
      clientPhone,
      paymentStatus: stripeSessionId ? 'completed' : 'pending',
      stripeSessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    writeBookings({ bookings });

    // Send email notification (in production, this would use a real email service)
    console.log(`[BOOKING NOTIFICATION] New booking: ${clientName} - ${fullTime}`);

    return res.status(201).json({ 
      success: true, 
      booking: newBooking,
      message: 'Booking created successfully'
    });
  }

  // PUT - Update booking status
  if (req.method === 'PUT') {
    const { id, paymentStatus, stripeSessionId } = req.body;
    
    const bookingIndex = bookings.findIndex(b => b.id === id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      paymentStatus: paymentStatus || bookings[bookingIndex].paymentStatus,
      stripeSessionId: stripeSessionId || bookings[bookingIndex].stripeSessionId,
      updatedAt: new Date().toISOString(),
    };

    writeBookings({ bookings });

    return res.status(200).json({ 
      success: true, 
      booking: bookings[bookingIndex] 
    });
  }

  // DELETE - Cancel booking
  if (req.method === 'DELETE') {
    const { id } = req.query;
    
    const filteredBookings = bookings.filter(b => b.id !== id);
    
    if (filteredBookings.length === bookings.length) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    writeBookings({ bookings: filteredBookings });

    return res.status(200).json({ 
      success: true, 
      message: 'Booking cancelled successfully' 
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
