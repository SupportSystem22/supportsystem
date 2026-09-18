export interface CreateZoomMeetingOptions {
  topic?: string;
  sessionDate?: string;
  sessionTime?: string;
  durationMinutes?: number;
  agenda?: string;
  menteeName?: string;
}

export interface ZoomMeetingResult {
  success: boolean;
  meetingId: string;
  passcode: string;
  joinUrl: string;
  startUrl?: string;
  rawResponse?: any;
  error?: string;
}

// In-memory token cache for serverless instance lifetime
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Obtain OAuth Access Token from Zoom using Server-to-Server OAuth
 */
async function getZoomAccessToken(): Promise<string> {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error('Zoom credentials (ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET) are missing from environment variables.');
  }

  // Use cached token if still valid (with 5-minute safety buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 300000) {
    return cachedToken;
  }

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to obtain Zoom access token (HTTP ${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as any;
  if (!data.access_token) {
    throw new Error('No access_token returned by Zoom OAuth.');
  }

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;

  return cachedToken;
}

/**
 * Convert user date and time slot into Zoom-friendly local ISO format: YYYY-MM-DDTHH:mm:ss
 */
function parseToZoomStartTime(sessionDate?: string, sessionTime?: string): string {
  try {
    let year: number, month: number, day: number;

    if (sessionDate && /^\d{4}-\d{2}-\d{2}$/.test(sessionDate)) {
      const parts = sessionDate.split('-');
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else if (sessionDate) {
      const parsed = new Date(sessionDate);
      if (!isNaN(parsed.getTime())) {
        year = parsed.getFullYear();
        month = parsed.getMonth() + 1;
        day = parsed.getDate();
      } else {
        const tomorrow = new Date(Date.now() + 86400000);
        year = tomorrow.getFullYear();
        month = tomorrow.getMonth() + 1;
        day = tomorrow.getDate();
      }
    } else {
      const tomorrow = new Date(Date.now() + 86400000);
      year = tomorrow.getFullYear();
      month = tomorrow.getMonth() + 1;
      day = tomorrow.getDate();
    }

    let hours = 14;
    let minutes = 0;

    if (sessionTime) {
      const timeMatch = sessionTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        const meridiem = (timeMatch[3] || '').toUpperCase();
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
      }
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00`;
  } catch (err) {
    const future = new Date(Date.now() + 86400000);
    return future.toISOString().replace(/\.\d+Z$/, '');
  }
}

/**
 * Format raw Zoom meeting ID into user-friendly groups (e.g., "873 2942 4708")
 */
export function formatZoomMeetingId(rawId: string | number): string {
  const str = String(rawId).replace(/\D/g, '');
  if (str.length === 11) {
    return `${str.slice(0, 3)} ${str.slice(3, 7)} ${str.slice(7)}`;
  }
  if (str.length === 10) {
    return `${str.slice(0, 3)} ${str.slice(3, 6)} ${str.slice(6)}`;
  }
  if (str.length === 9) {
    return `${str.slice(0, 3)} ${str.slice(3, 6)} ${str.slice(6)}`;
  }
  return str;
}

/**
 * Create a live Zoom meeting
 */
export async function createZoomMeeting(options: CreateZoomMeetingOptions): Promise<ZoomMeetingResult> {
  try {
    const token = await getZoomAccessToken();
    const startTime = parseToZoomStartTime(options.sessionDate, options.sessionTime);
    const duration = options.durationMinutes || 45;
    const mentee = (options.menteeName || '').trim();
    const topic = options.topic || (mentee ? `SupportSystem 1:1 Session: ${mentee}` : 'SupportSystem Mentorship Session');

    const payload = {
      topic,
      type: 2, // Scheduled meeting
      start_time: startTime,
      duration,
      timezone: 'Asia/Kolkata',
      agenda: options.agenda || 'Private 1-to-1 Mentorship & Clarity Call via SupportSystem',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        waiting_room: true,
        mute_upon_entry: false,
        watermark: false,
        audio: 'both',
        auto_recording: 'none',
      },
    };

    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Zoom API Error]', response.status, errorText);
      throw new Error(`Zoom API responded with HTTP ${response.status}: ${errorText}`);
    }

    const meetingData = (await response.json()) as any;
    const formattedId = formatZoomMeetingId(meetingData.id);

    return {
      success: true,
      meetingId: formattedId,
      passcode: meetingData.password || '',
      joinUrl: meetingData.join_url,
      startUrl: meetingData.start_url,
      rawResponse: {
        id: meetingData.id,
        created_at: meetingData.created_at,
        start_time: meetingData.start_time,
      },
    };
  } catch (error: any) {
    console.error('[Zoom Meeting Creation Failed]:', error.message);
    return {
      success: false,
      meetingId: '',
      passcode: '',
      joinUrl: '',
      error: error.message || 'Unknown error occurred while creating Zoom meeting',
    };
  }
}
