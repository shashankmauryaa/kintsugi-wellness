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
  const durationParam = searchParams.get('duration');
  
  if (!dateStr) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  const duration = durationParam ? parseInt(durationParam, 10) : 60; // Default to 60 mins
  const requestedDate = new Date(dateStr);
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!calendarId || !clientId || !clientSecret || !refreshToken) {
    return NextResponse.json({ error: "Missing Google Calendar or OAuth configuration" }, { status: 500 });
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Define the time window for the requested day
  const timeMin = startOfDay(requestedDate).toISOString();
  const timeMax = endOfDay(requestedDate).toISOString();

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: calendarId }],
      },
    });

    const busySlots = response.data.calendars?.[calendarId]?.busy || [];
    const availableSlots = generateAvailableSlots(dateStr, busySlots, duration);

    return NextResponse.json({ slots: availableSlots, isMock: false });
  } catch (error) {
    console.error('Google Calendar API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar availability' }, { status: 500 });
  }
}

// Helper to generate available slots based on working hours and busy periods
function generateAvailableSlots(dateStr: string, busySlots: any[], durationMinutes: number) {
  // We explicitly construct the date object using the IST timezone offset (+05:30)
  // This guarantees that regardless of where the server is physically located (Vercel uses UTC),
  // the slots start at exactly 10:00 AM and end at exactly 6:00 PM Indian Standard Time.
  const startHourStr = WORKING_HOURS.start.toString().padStart(2, '0');
  const endHourStr = WORKING_HOURS.end.toString().padStart(2, '0');
  
  const startSlotStr = `${dateStr}T${startHourStr}:00:00+05:30`;
  const endSlotStr = `${dateStr}T${endHourStr}:00:00+05:30`;
  
  let currentSlot = new Date(startSlotStr);
  const endOfDayWindow = new Date(endSlotStr);

  // --------------------------------------------------------------------------------
  // ⚙️ WEEKEND CONFIGURATION
  // To work on weekends, simply comment out the line below.
  // To only block Sundays, use: if (currentSlot.getDay() === 0) return [];
  // --------------------------------------------------------------------------------
  if (isWeekend(currentSlot)) return []; 

  // ================================================================================
  // 🕒 REWIND / BUFFER TIME CONFIGURATION
  // This is the number of minutes automatically blocked off AFTER every session.
  // Change this number to adjust your cooldown time (e.g., 15, 30, 0).
  // ================================================================================
  const REWIND_TIME_MINUTES = 30;

  const slots = [];
  const now = new Date();

  // Step by 15-minute intervals
  while (currentSlot < endOfDayWindow) {
    const slotEnd = new Date(currentSlot);
    // Add the session duration AND the rewind time to ensure the whole block is free
    const totalRequiredTime = durationMinutes + REWIND_TIME_MINUTES;
    slotEnd.setMinutes(slotEnd.getMinutes() + totalRequiredTime);

    // If this specific session + rewind time would push past working hours, break
    if (slotEnd > endOfDayWindow) {
      break;
    }

    // Check if slot is in the past
    if (isBefore(currentSlot, now)) {
      currentSlot.setMinutes(currentSlot.getMinutes() + 15);
      continue;
    }

    // Check if this window (currentSlot to slotEnd) overlaps with ANY busy period
    const isBusy = busySlots.some(busy => {
      const busyStart = parseISO(busy.start);
      const busyEnd = parseISO(busy.end);
      
      // Overlap logic: A overlaps B if (StartA < EndB) and (EndA > StartB)
      // Adding 1 minute buffer to avoid edge cases where they touch perfectly
      const startWithBuffer = new Date(currentSlot.getTime() + 60000); // +1 min
      const endWithBuffer = new Date(slotEnd.getTime() - 60000);       // -1 min

      return (
        isBefore(startWithBuffer, busyEnd) &&
        isAfter(endWithBuffer, busyStart)
      );
    });

    if (!isBusy) {
      slots.push({
        time: currentSlot.toISOString(),
        label: currentSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    // Move forward by 15 minutes for maximum flexibility
    currentSlot.setMinutes(currentSlot.getMinutes() + 15);
  }

  return slots;
}

function mockAvailableSlots(dateStr: string, durationMinutes: number) {
  return generateAvailableSlots(dateStr, [], durationMinutes); // Generate all slots assuming no busy times
}
