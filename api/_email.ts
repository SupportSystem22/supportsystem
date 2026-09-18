import nodemailer from 'nodemailer';

export interface BookingEmailPayload {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAge?: string | number;
  customerGender?: string;
  preferredLanguage?: string;
  sessionMode: 'video' | 'audio' | string;
  packageTitle: string;
  packageDuration?: string;
  packagePrice: number;
  sessionDate: string;
  sessionTime: string;
  meetingLink: string;
  zoomMeetingId: string;
  zoomPasscode: string;
  reasons?: string[];
  notes?: string;
  paymentId: string;
  orderId?: string;
}

function getEmailTransporter() {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

export async function sendBookingNotificationEmails(payload: BookingEmailPayload): Promise<{
  success: boolean;
  customerSent: boolean;
  mentorSent: boolean;
  error?: string;
}> {
  const transporter = getEmailTransporter();
  const mentorEmail = (process.env.MENTOR_NOTIFICATION_EMAIL || process.env.EMAIL_USER || '').trim();

  if (!transporter) {
    console.warn(
      '⚠️ [Email Notification] EMAIL_USER or EMAIL_PASS is not configured in environment. Skipping email delivery.'
    );
    return {
      success: true,
      customerSent: false,
      mentorSent: false,
      error: 'EMAIL_USER or EMAIL_PASS not configured',
    };
  }

  const senderEmail = process.env.EMAIL_USER?.trim();
  const senderName = 'SupportSystem Mentorship';
  const fromHeader = `"${senderName}" <${senderEmail}>`;

  const modeLabel = payload.sessionMode === 'video' ? 'Zoom Video Call' : 'Zoom Audio Call';
  const topicsList = payload.reasons && payload.reasons.length > 0 ? payload.reasons.join(', ') : 'General Clarity & Emotional Support';

  let customerSent = false;
  let mentorSent = false;

  // 1. Mentee Email
  if (payload.customerEmail && payload.customerEmail.includes('@')) {
    const customerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Session is Confirmed</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f8f6f0;color:#22201e;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8f6f0;padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #eae2d5;">
          <tr>
            <td style="background-color:#dc3c1c;padding:32px 30px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">SupportSystem</h1>
              <p style="margin:6px 0 0 0;color:#ffe6e0;font-size:13px;font-weight:500;">Private 1-to-1 Mentorship & Clarity</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;">
              <div style="display:inline-block;padding:4px 12px;border-radius:20px;background-color:#e8f5e9;color:#2e7d32;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px;">
                ✓ Booking & Payment Confirmed
              </div>
              <h2 style="margin:0 0 12px 0;color:#1c1a18;font-size:20px;font-weight:700;">
                Hello ${payload.customerName},
              </h2>
              <p style="margin:0 0 24px 0;color:#5c544b;font-size:14px;line-height:1.6;">
                Your upcoming private 1-to-1 session has been confirmed. Below are your meeting credentials, schedule, and preparation notes.
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#fffaf8;border:1px solid #ffd6cc;border-radius:18px;margin-bottom:28px;overflow:hidden;">
                <tr>
                  <td style="padding:22px 24px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <span style="font-size:11px;color:#857a6e;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;">Package</span><br>
                          <strong style="font-size:16px;color:#1c1a18;">${payload.packageTitle}</strong>
                          <span style="font-size:13px;color:#dc3c1c;font-weight:700;margin-left:6px;">(${payload.packageDuration || 'Session'})</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <span style="font-size:11px;color:#857a6e;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;">Date & Time</span><br>
                          <strong style="font-size:16px;color:#dc3c1c;">📅 ${payload.sessionDate}</strong>
                          <span style="font-size:14px;color:#1c1a18;font-weight:600;margin-left:6px;">⏰ ${payload.sessionTime}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="font-size:11px;color:#857a6e;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;">Communication Mode</span><br>
                          <strong style="font-size:14px;color:#1c1a18;">${modeLabel}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${payload.meetingLink}" target="_blank" style="display:inline-block;padding:16px 36px;background-color:#dc3c1c;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;border-radius:14px;box-shadow:0 4px 12px rgba(220,60,28,0.25);">
                      👉 Click Here to Join Zoom Meeting
                    </a>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f5f2eb;border-radius:14px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:12px;color:#5c544b;margin-bottom:6px;">
                      <strong>Meeting ID:</strong> <span style="font-family:monospace;font-size:13px;color:#1c1a18;font-weight:700;">${payload.zoomMeetingId}</span>
                    </div>
                    <div style="font-size:12px;color:#5c544b;">
                      <strong>Passcode:</strong> <span style="font-family:monospace;font-size:13px;color:#1c1a18;font-weight:700;">${payload.zoomPasscode}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:1px solid #eee7db;padding-top:20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <h4 style="margin:0 0 10px 0;font-size:13px;color:#1c1a18;text-transform:uppercase;letter-spacing:0.5px;">Payment Details</h4>
                    <div style="font-size:12px;color:#6b6256;line-height:1.7;">
                      • <strong>Payment ID:</strong> <span style="font-family:monospace;">${payload.paymentId}</span><br>
                      • <strong>Amount Paid:</strong> ₹${payload.packagePrice} (Paid via Razorpay)<br>
                      • <strong>Booking ID:</strong> <span style="font-family:monospace;">${payload.bookingId}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="background-color:#f9f9f9;border-left:3px solid #dc3c1c;padding:14px 16px;border-radius:4px;font-size:12px;color:#6b6256;line-height:1.6;">
                <strong>Before your session:</strong><br>
                1. Ensure you have the Zoom app installed or join via web browser.<br>
                2. Sit in a quiet, comfortable space where you feel relaxed and safe.<br>
                3. Camera is always optional—your comfort comes first.
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#22201e;padding:24px 30px;text-align:center;">
              <p style="margin:0;color:#c2b9af;font-size:12px;">
                SupportSystem Mentorship &bull; Safe, Empathetic & Confidential Space
              </p>
              <p style="margin:6px 0 0 0;color:#7a7268;font-size:11px;">
                Need to reschedule or have questions? Simply reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    try {
      await transporter.sendMail({
        from: fromHeader,
        to: payload.customerEmail,
        subject: `✨ Session Confirmed: ${payload.packageTitle} on ${payload.sessionDate} at ${payload.sessionTime}`,
        html: customerHtml,
      });
      customerSent = true;
      console.log(`✅ [Vercel Email] Confirmation sent to mentee: ${payload.customerEmail}`);
    } catch (err: any) {
      console.error(`❌ [Vercel Email] Failed to send email to mentee (${payload.customerEmail}):`, err);
    }
  }

  // 2. Mentor Email
  if (mentorEmail && mentorEmail.includes('@')) {
    const mentorHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Session Booking Received</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f4f1ea;color:#1c1a18;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:25px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.06);border:1px solid #e5dcce;">
          <tr>
            <td style="background-color:#1c1a18;padding:26px 30px;">
              <div style="color:#dc3c1c;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">🚨 New Booking Received</div>
              <h2 style="margin:6px 0 0 0;color:#ffffff;font-size:20px;font-weight:700;">${payload.customerName} has booked a session!</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#fff7f5;border:1px solid #ffdcd4;border-radius:14px;margin-bottom:22px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <h3 style="margin:0 0 12px 0;font-size:14px;color:#dc3c1c;text-transform:uppercase;letter-spacing:0.5px;">Mentee Contact & Profile</h3>
                    <div style="font-size:13px;color:#332f2b;line-height:1.7;">
                      • <strong>Full Name:</strong> ${payload.customerName}<br>
                      • <strong>Email:</strong> <a href="mailto:${payload.customerEmail}" style="color:#dc3c1c;">${payload.customerEmail}</a><br>
                      • <strong>WhatsApp / Phone:</strong> <a href="https://wa.me/${payload.customerPhone.replace(/[^0-9]/g, '')}" target="_blank" style="color:#2e7d32;font-weight:700;">${payload.customerPhone} (Open WhatsApp)</a><br>
                      • <strong>Age:</strong> ${payload.customerAge || 'Not specified'}<br>
                      • <strong>Gender:</strong> ${payload.customerGender || 'Not specified'}<br>
                      • <strong>Preferred Language:</strong> ${payload.preferredLanguage || 'English'}
                    </div>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#fbfaf8;border:1px solid #ece4d8;border-radius:14px;margin-bottom:22px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <h3 style="margin:0 0 12px 0;font-size:14px;color:#1c1a18;text-transform:uppercase;letter-spacing:0.5px;">Schedule & Meeting Details</h3>
                    <div style="font-size:13px;color:#332f2b;line-height:1.7;">
                      • <strong>Package:</strong> ${payload.packageTitle} (${payload.packageDuration || 'Session'})<br>
                      • <strong>Scheduled Date:</strong> <span style="font-weight:700;color:#dc3c1c;">${payload.sessionDate}</span><br>
                      • <strong>Scheduled Time:</strong> <span style="font-weight:700;color:#dc3c1c;">${payload.sessionTime}</span><br>
                      • <strong>Communication Mode:</strong> ${modeLabel}<br>
                      • <strong>Zoom Meeting Link:</strong> <a href="${payload.meetingLink}" target="_blank" style="color:#dc3c1c;font-weight:700;">Join Meeting</a><br>
                      • <strong>Meeting ID:</strong> <span style="font-family:monospace;">${payload.zoomMeetingId}</span> &bull; <strong>Passcode:</strong> <span style="font-family:monospace;">${payload.zoomPasscode}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="background-color:#f9f8f5;border:1px solid #e8e2d5;border-radius:14px;padding:16px 20px;margin-bottom:22px;">
                <h4 style="margin:0 0 8px 0;font-size:12px;color:#6b6256;text-transform:uppercase;">Selected Topics / Dilemmas:</h4>
                <p style="margin:0 0 12px 0;font-size:13px;color:#1c1a18;font-weight:600;">${topicsList}</p>
                <h4 style="margin:0 0 8px 0;font-size:12px;color:#6b6256;text-transform:uppercase;">Mentee's Message / Notes:</h4>
                <p style="margin:0;font-size:13px;color:#3a3530;font-style:italic;line-height:1.5;">${payload.notes ? `"${payload.notes}"` : 'No personal note provided.'}</p>
              </div>
              <div style="font-size:12px;color:#7a7268;border-top:1px solid #eee8de;padding-top:16px;">
                <strong>Transaction Details:</strong><br>
                Razorpay Payment ID: <span style="font-family:monospace;color:#1c1a18;">${payload.paymentId}</span><br>
                ${payload.orderId ? `Razorpay Order ID: <span style="font-family:monospace;color:#1c1a18;">${payload.orderId}</span><br>` : ''}
                Amount Paid: <span style="color:#2e7d32;font-weight:700;">₹${payload.packagePrice}</span><br>
                Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    try {
      await transporter.sendMail({
        from: fromHeader,
        to: mentorEmail,
        subject: `🚨 New Booking: ${payload.customerName} - ${payload.packageTitle} (${payload.sessionDate} at ${payload.sessionTime})`,
        html: mentorHtml,
      });
      mentorSent = true;
      console.log(`✅ [Vercel Email] Alert sent to mentor: ${mentorEmail}`);
    } catch (err: any) {
      console.error(`❌ [Vercel Email] Failed to send email to mentor (${mentorEmail}):`, err);
    }
  }

  return {
    success: true,
    customerSent,
    mentorSent,
  };
}
