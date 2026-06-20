import fs from 'fs';
import { google } from 'googleapis';
import crypto from 'crypto';

const env = fs.readFileSync('.env.local', 'utf8');
const calendarId = env.match(/GOOGLE_CALENDAR_ID="([^"]+)"/)[1];
const credMatch = env.match(/GOOGLE_CALENDAR_CREDENTIALS_JSON='([^']+)'/);
const credentials = credMatch ? credMatch[1] : env.match(/GOOGLE_CALENDAR_CREDENTIALS_JSON="([^"]+)"/)[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');

async function test() {
  try {
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
