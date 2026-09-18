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

/**
 * Sends both Mentee confirmation email and Mentor booking notification email.
 * Adheres strictly to Google Gmail Anti-Spam & Deliverability Standards:
 * - Clean, standard RFC transactional headers
 * - Dual-part Plain Text + HTML format
 * - Zero hidden-div / zero-opacity font tricks (avoiding Gmail spam filter heuristics)
 * - Clean transactional subject lines
 * - Inline CSS styled to SupportSystem's warm brand theme
 */
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
      '⚠️ [Vercel Email] EMAIL_USER or EMAIL_PASS is not configured in environment. Skipping email delivery.'
    );
    return {
      success: true,
      customerSent: false,
      mentorSent: false,
      error: 'EMAIL_USER or EMAIL_PASS not configured',
    };
  }

  const senderEmail = process.env.EMAIL_USER?.trim();
  const senderName = 'SupportSystem';
  const fromHeader = `"${senderName}" <${senderEmail}>`;

  const modeLabel = payload.sessionMode === 'video' ? 'Zoom Video Call' : 'Zoom Audio Call';
  const topicsList =
    payload.reasons && payload.reasons.length > 0
      ? payload.reasons.join(', ')
      : 'General Clarity & Emotional Support';
  const cleanPhone = payload.customerPhone.replace(/[^0-9]/g, '');

  let customerSent = false;
  let mentorSent = false;

  // 1. Mentee Email
  if (payload.customerEmail && payload.customerEmail.includes('@')) {
    const customerSubject = `Booking Confirmation: Your 1-to-1 session with SupportSystem`;

    const customerPlainText = `
SupportSystem - 1-to-1 Mentorship & Clarity
==================================================
Booking Confirmation & Session Details

Hi ${payload.customerName},

Your 1-to-1 private session has been confirmed. Below are your meeting credentials and schedule:

• Package: ${payload.packageTitle} (${payload.packageDuration || 'Session'})
• Date: ${payload.sessionDate}
• Time: ${payload.sessionTime}
• Format: ${modeLabel}

ZOOM MEETING CREDENTIALS:
• Join Link: ${payload.meetingLink}
• Meeting ID: ${payload.zoomMeetingId}
• Passcode: ${payload.zoomPasscode}

PAYMENT RECEIPT:
• Razorpay Payment ID: ${payload.paymentId}
• Amount Paid: ₹${payload.packagePrice}
• Booking ID: ${payload.bookingId}

BEFORE YOUR SESSION:
1. Ensure you have Zoom installed on your device.
2. Join from a quiet, private space.
3. Camera is optional—your comfort comes first.

Have questions or need to reschedule? Reply directly to this email at supportsystem22@gmail.com.

Warm regards,
SupportSystem Team
supportsystem22@gmail.com
    `.trim();

    const customerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${customerSubject}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #fbf9f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fbf9f5; color: #1c1a18;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fbf9f5;">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #ebe3d5; border-radius: 16px; overflow: hidden;">
          
          <tr>
            <td align="center" style="background-color: #1c1a18; padding: 24px 20px; border-bottom: 3px solid #dc3c1c;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">SupportSystem</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 4px;">
                    <span style="font-size: 12px; color: #c4b9aa; font-weight: 500;">Private 1-to-1 Mentorship & Clarity</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 24px;">
              
              <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="background-color: #eaf7ed; border: 1px solid #c2e8c9; border-radius: 20px; padding: 4px 12px;">
                    <span style="color: #1b5e20; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                      ✓ Booking & Payment Confirmed
                    </span>
                  </td>
                </tr>
              </table>

              <h1 style="margin: 0 0 10px 0; font-size: 19px; font-weight: 700; color: #1c1a18; line-height: 1.3;">
                Hi ${payload.customerName},
              </h1>
              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.6; color: #5b534a;">
                Your upcoming 1-to-1 session has been confirmed. Below are your meeting credentials, schedule, and preparation notes.
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff9f8; border: 1px solid #f2ded8; border-radius: 14px; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9c8e7e; letter-spacing: 0.5px;">Package</div>
                          <div style="font-size: 15px; font-weight: 800; color: #1c1a18; margin-top: 2px;">
                            ${payload.packageTitle}
                            <span style="font-size: 12px; font-weight: 700; color: #dc3c1c; margin-left: 4px;">(${payload.packageDuration || 'Session'})</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9c8e7e; letter-spacing: 0.5px;">Scheduled Date & Time</div>
                          <div style="font-size: 15px; font-weight: 700; color: #dc3c1c; margin-top: 2px;">
                            📅 ${payload.sessionDate}
                          </div>
                          <div style="font-size: 13px; font-weight: 600; color: #1c1a18; margin-top: 2px;">
                            ⏰ ${payload.sessionTime}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9c8e7e; letter-spacing: 0.5px;">Session Format</div>
                          <div style="font-size: 13px; font-weight: 700; color: #1c1a18; margin-top: 2px;">
                            ${modeLabel}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="background-color: #dc3c1c; border-radius: 12px;">
                          <a href="${payload.meetingLink}" target="_blank" style="display: block; padding: 15px 24px; font-size: 14px; font-weight: 800; color: #ffffff; text-decoration: none; text-align: center; letter-spacing: 0.2px;">
                            Join Zoom Meeting
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f4ed; border: 1px solid #eae2d3; border-radius: 10px; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding-bottom: 4px;">
                          <strong>Meeting ID:</strong>
                          <span style="font-family: Consolas, Monaco, monospace; font-size: 13px; font-weight: 700; color: #1c1a18; margin-left: 4px;">${payload.zoomMeetingId}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b534a;">
                          <strong>Passcode:</strong>
                          <span style="font-family: Consolas, Monaco, monospace; font-size: 13px; font-weight: 700; color: #1c1a18; margin-left: 4px;">${payload.zoomPasscode}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #ebe4d8; padding-top: 16px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #8c8072; letter-spacing: 0.5px; margin-bottom: 6px;">
                      Payment Receipt
                    </div>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;">Amount Paid:</td>
                        <td align="right" style="font-size: 13px; font-weight: 800; color: #1c1a18;">₹${payload.packagePrice} (Paid via Razorpay)</td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; color: #7a7064; padding: 2px 0;">Payment ID:</td>
                        <td align="right" style="font-size: 11px; font-family: monospace; color: #1c1a18;">${payload.paymentId}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; color: #7a7064; padding: 2px 0;">Booking ID:</td>
                        <td align="right" style="font-size: 11px; font-family: monospace; color: #1c1a18;">${payload.bookingId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf9f6; border-left: 3px solid #dc3c1c; border-radius: 4px;">
                <tr>
                  <td style="padding: 12px 14px;">
                    <div style="font-size: 12px; font-weight: 700; color: #1c1a18; margin-bottom: 4px;">
                      Before your session:
                    </div>
                    <div style="font-size: 12px; line-height: 1.5; color: #5b534a;">
                      • Ensure you have the Zoom app installed on your phone or laptop.<br>
                      • Sit in a quiet, private space where you feel calm and unhurried.<br>
                      • Camera is completely optional—your comfort comes first.
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="background-color: #f7f4ee; padding: 20px 24px; border-top: 1px solid #ebe4d8; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #5b534a;">
                SupportSystem &bull; 1-to-1 Mentorship & Clarity Space
              </p>
              <p style="margin: 0 0 6px 0; font-size: 11px; line-height: 1.4; color: #877c70;">
                Have questions or need to reschedule? Contact us at <a href="mailto:supportsystem22@gmail.com" style="color: #dc3c1c; text-decoration: underline;">supportsystem22@gmail.com</a>.
              </p>
              <p style="margin: 0; font-size: 10px; color: #9c9183;">
                You received this transactional receipt because you completed a booking on SupportSystem.
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
        replyTo: senderEmail,
        subject: customerSubject,
        text: customerPlainText,
        html: customerHtml,
        headers: {
          'X-Entity-Ref-ID': payload.bookingId,
          'Auto-Submitted': 'auto-generated',
          'X-Auto-Response-Suppress': 'All',
        },
      });
      customerSent = true;
      console.log(`✅ [Vercel Email] Confirmation sent to mentee: ${payload.customerEmail}`);
    } catch (err: any) {
      console.error(`❌ [Vercel Email] Failed to send email to mentee (${payload.customerEmail}):`, err);
    }
  }

  // 2. Mentor Email
  if (mentorEmail && mentorEmail.includes('@')) {
    const mentorSubject = `[New Booking] ${payload.customerName} - ${payload.packageTitle}`;

    const mentorPlainText = `
SupportSystem - New Booking Received
==================================================
Customer: ${payload.customerName} has booked a session!

CUSTOMER PROFILE:
• Full Name: ${payload.customerName}
• Email: ${payload.customerEmail}
• Phone / WhatsApp: ${payload.customerPhone}
• Age: ${payload.customerAge || 'Not specified'}
• Gender: ${payload.customerGender || 'Not specified'}
• Preferred Language: ${payload.preferredLanguage || 'English'}

SESSION DETAILS:
• Package: ${payload.packageTitle} (${payload.packageDuration || 'Session'})
• Scheduled Date: ${payload.sessionDate}
• Scheduled Time: ${payload.sessionTime}
• Mode: ${modeLabel}
• Zoom Link: ${payload.meetingLink}
• Meeting ID: ${payload.zoomMeetingId}
• Passcode: ${payload.zoomPasscode}

TOPICS & INTAKE CONTEXT:
• Selected Topics: ${topicsList}
• Mentee Notes: ${payload.notes || 'None'}

TRANSACTION DETAILS:
• Razorpay Payment ID: ${payload.paymentId}
• Razorpay Order ID: ${payload.orderId || 'N/A'}
• Amount Paid: ₹${payload.packagePrice}
• Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    `.trim();

    const mentorHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mentorSubject}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0 !important; padding: 0 !important; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; color: #1c1a18;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f5f0;">
    <tr>
      <td align="center" style="padding: 26px 15px;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e5ded2; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1c1a18; padding: 22px 24px; border-bottom: 3px solid #dc3c1c;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #dc3c1c; letter-spacing: 0.8px;">
                      New Booking Notification
                    </div>
                    <div style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 4px;">
                      ${payload.customerName} has booked a session!
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 26px 22px;">
              
              <!-- Customer Profile Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff8f6; border: 1px solid #f6dbd4; border-radius: 12px; margin-bottom: 18px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #dc3c1c; letter-spacing: 0.5px; margin-bottom: 6px;">
                      Mentee Profile & Contact
                    </div>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;"><strong>Full Name:</strong></td>
                        <td align="right" style="font-size: 13px; font-weight: 700; color: #1c1a18;">${payload.customerName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;"><strong>Email:</strong></td>
                        <td align="right" style="font-size: 12px; color: #dc3c1c;">
                          <a href="mailto:${payload.customerEmail}" style="color: #dc3c1c; text-decoration: none;">${payload.customerEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;"><strong>Phone:</strong></td>
                        <td align="right" style="font-size: 12px;">
                          <a href="https://wa.me/${cleanPhone}" target="_blank" style="display: inline-block; background-color: #e8f5e9; color: #2e7d32; font-weight: 700; padding: 2px 8px; border-radius: 6px; text-decoration: none; font-size: 11px;">
                            ${payload.customerPhone} (Open WhatsApp)
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;"><strong>Age / Gender:</strong></td>
                        <td align="right" style="font-size: 12px; color: #1c1a18;">${payload.customerAge || 'N/A'} yrs &bull; ${payload.customerGender || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;"><strong>Preferred Language:</strong></td>
                        <td align="right" style="font-size: 12px; font-weight: 600; color: #1c1a18;">${payload.preferredLanguage || 'English'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Scheduled Slot & Zoom Info -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fbf9f6; border: 1px solid #ebe4d8; border-radius: 12px; margin-bottom: 18px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #877c70; letter-spacing: 0.5px; margin-bottom: 6px;">
                      Session & Schedule
                    </div>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;"><strong>Package:</strong></td>
                        <td align="right" style="font-size: 13px; font-weight: 700; color: #1c1a18;">${payload.packageTitle}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;"><strong>Date:</strong></td>
                        <td align="right" style="font-size: 13px; font-weight: 700; color: #dc3c1c;">📅 ${payload.sessionDate}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;"><strong>Time:</strong></td>
                        <td align="right" style="font-size: 13px; font-weight: 700; color: #dc3c1c;">⏰ ${payload.sessionTime}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;"><strong>Mode:</strong></td>
                        <td align="right" style="font-size: 12px; font-weight: 600; color: #1c1a18;">${modeLabel}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding: 2px 0;"><strong>Zoom Link:</strong></td>
                        <td align="right" style="font-size: 12px;">
                          <a href="${payload.meetingLink}" target="_blank" style="color: #dc3c1c; font-weight: 700; text-decoration: underline;">Open Zoom Meeting</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; color: #7a7064; padding: 2px 0;">Meeting ID / Passcode:</td>
                        <td align="right" style="font-size: 11px; font-family: monospace; color: #1c1a18;">${payload.zoomMeetingId} &bull; ${payload.zoomPasscode}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Topics / Intake Notes -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf8f4; border: 1px solid #ebe4d8; border-radius: 12px; margin-bottom: 18px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #877c70; letter-spacing: 0.5px; margin-bottom: 4px;">
                      Selected Dilemmas / Topics
                    </div>
                    <div style="font-size: 12px; font-weight: 600; color: #1c1a18; margin-bottom: 10px;">
                      ${topicsList}
                    </div>
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #877c70; letter-spacing: 0.5px; margin-bottom: 4px;">
                      Mentee's Personal Note
                    </div>
                    <div style="font-size: 12px; font-style: italic; color: #4a443e; line-height: 1.4;">
                      ${payload.notes ? `"${payload.notes}"` : 'None provided.'}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Transaction Summary -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #eee8de; padding-top: 12px;">
                <tr>
                  <td style="font-size: 11px; color: #7a7268;">
                    <strong>Payment ID:</strong> <span style="font-family: monospace; color: #1c1a18;">${payload.paymentId}</span><br>
                    ${payload.orderId ? `<strong>Order ID:</strong> <span style="font-family: monospace; color: #1c1a18;">${payload.orderId}</span><br>` : ''}
                    <strong>Amount:</strong> <span style="color: #2e7d32; font-weight: 800;">₹${payload.packagePrice}</span> (Razorpay)<br>
                    <strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1c1a18; padding: 14px 20px; text-align: center;">
              <span style="color: #9c9183; font-size: 11px;">
                SupportSystem Internal Notification &bull; supportsystem22@gmail.com
              </span>
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
        replyTo: payload.customerEmail,
        subject: mentorSubject,
        text: mentorPlainText,
        html: mentorHtml,
        headers: {
          'X-Entity-Ref-ID': payload.bookingId,
          'Auto-Submitted': 'auto-generated',
          'X-Auto-Response-Suppress': 'All',
        },
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
