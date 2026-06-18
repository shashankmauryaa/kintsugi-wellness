import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { addDays, startOfDay, endOfDay, isWeekend, isBefore, isAfter, parseISO } from 'date-fns';

// In a real scenario, Khushi would define her working hours
const WORKING_HOURS = {
  start: 10, // 10:00 AM
  end: 18,   // 6:00 PM
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');
  
  if (!dateStr) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  const requestedDate = new Date(dateStr);
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId || !process.env.GOOGLE_CALENDAR_CREDENTIALS_JSON) {
    // Return mock slots for development if credentials aren't set
    return NextResponse.json({
      slots: mockAvailableSlots(requestedDate),
      isMock: true,
      message: 'Google Calendar credentials not configured. Returning mock data.'
    });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CALENDAR_CREDENTIALS_JSON),
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Define the time window for the requested day
    const timeMin = startOfDay(requestedDate).toISOString();
    const timeMax = endOfDay(requestedDate).toISOString();

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: calendarId }],
      },
    });

    const busySlots = response.data.calendars?.[calendarId]?.busy || [];
    const availableSlots = generateAvailableSlots(requestedDate, busySlots);

    return NextResponse.json({ slots: availableSlots, isMock: false });
  } catch (error) {
    console.error('Google Calendar API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar availability' }, { status: 500 });
  }
}

// Helper to generate available 50-minute slots based on working hours and busy periods
function generateAvailableSlots(date: Date, busySlots: any[]) {
  if (isWeekend(date)) return []; // Example: No weekends

  const slots = [];
  let currentSlot = new Date(date);
  currentSlot.setHours(WORKING_HOURS.start, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(WORKING_HOURS.end, 0, 0, 0);

  const now = new Date();

  while (currentSlot < endOfDay) {
    const slotEnd = new Date(currentSlot);
    slotEnd.setMinutes(slotEnd.getMinutes() + 50); // 50 minute session

    // Check if slot is in the past
    if (isBefore(currentSlot, now)) {
      currentSlot.setHours(currentSlot.getHours() + 1);
      continue;
    }

    // Check if slot overlaps with any busy period
    const isBusy = busySlots.some(busy => {
      const busyStart = parseISO(busy.start);
      const busyEnd = parseISO(busy.end);
      return (
        (isBefore(currentSlot, busyEnd) || currentSlot.getTime() === busyEnd.getTime()) &&
        (isAfter(slotEnd, busyStart) || slotEnd.getTime() === busyStart.getTime())
      );
    });

    if (!isBusy) {
      slots.push({
        time: currentSlot.toISOString(),
        label: currentSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    // Move to next hour slot
    currentSlot.setHours(currentSlot.getHours() + 1);
  }

  return slots;
}

function mockAvailableSlots(date: Date) {
  return generateAvailableSlots(date, []); // Generate all slots assuming no busy times
}
