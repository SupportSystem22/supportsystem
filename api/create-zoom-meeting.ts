import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createZoomMeeting, CreateZoomMeetingOptions } from './_zoom.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body as CreateZoomMeetingOptions;
    const result = await createZoomMeeting(payload || {});
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in create-zoom-meeting handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create Zoom meeting',
    });
  }
}
