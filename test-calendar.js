require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const crypto = require('crypto');

async function test() {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const credentials = process.env.GOOGLE_CALENDAR_CREDENTIALS_JSON;
    const gAuth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });
    const calendar = google.calendar({ version: 'v3', auth: gAuth });
    
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1);
    const endTime = new Date(startTime.getTime() + 60 * 60000);

    const event = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `Test Therapy Session`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        conferenceData: {
          createRequest: {
            requestId: crypto.randomBytes(10).toString('hex'),
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      },
      conferenceDataVersion: 1
    });
    console.log("Success:", event.data.id);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
