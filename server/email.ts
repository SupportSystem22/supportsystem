import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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

/**
 * Creates and returns Nodemailer transporter using Gmail SMTP.
 */
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
 * - Includes both clean Multipart Text and Responsive HTML
 * - Proper From, Reply-To, and Message-ID headers
 * - Accurate Preheaders and CAN-SPAM compliant footers
 * - Inline CSS styled to SupportSystem's warm terracotta brand theme
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
      '⚠️ [Email Notification] EMAIL_USER or EMAIL_PASS is not configured in .env. Skipping email delivery.'
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

  // ==========================================
  // 1. MENTEE CONFIRMATION EMAIL
  // ==========================================
  if (payload.customerEmail && payload.customerEmail.includes('@')) {
    const customerSubject = `Session Confirmed: ${payload.packageTitle} on ${payload.sessionDate} at ${payload.sessionTime}`;
    const preheaderText = `Your 1-to-1 session with SupportSystem is confirmed. Zoom Meeting Link: ${payload.meetingLink}`;

    // Plain text alternative (Google anti-spam requirement)
    const customerPlainText = `
SupportSystem - 1-to-1 Mentorship & Clarity
--------------------------------------------------
Session Confirmed & Scheduled

Hi ${payload.customerName},

Your 1-to-1 private session has been confirmed. Below are your meeting credentials and schedule details:

• Package: ${payload.packageTitle} (${payload.packageDuration || 'Session'})
• Date: ${payload.sessionDate}
• Time: ${payload.sessionTime}
• Mode: ${modeLabel}

ZOOM MEETING DETAILS:
• Direct Join Link: ${payload.meetingLink}
• Meeting ID: ${payload.zoomMeetingId}
• Passcode: ${payload.zoomPasscode}

PAYMENT RECEIPT:
• Razorpay Payment ID: ${payload.paymentId}
• Amount Paid: ₹${payload.packagePrice}
• Status: Confirmed & Paid

BEFORE YOUR SESSION:
1. Ensure you have the Zoom app installed on your phone or laptop.
2. Join from a quiet, private space where you feel relaxed.
3. Camera is always optional—your comfort comes first.

Need to reschedule or have questions? Simply reply directly to this email or contact supportsystem22@gmail.com.

Warm regards,
SupportSystem Team
supportsystem22@gmail.com
    `.trim();

    // Responsive HTML with SupportSystem Brand Styling
    const customerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
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
  
  <!-- Inbox Preheader (visible only in mail client preview) -->
  <div style="display: none; font-size: 1px; color: #fbf9f5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheaderText} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fbf9f5;">
    <tr>
      <td align="center" style="padding: 35px 15px;">
        
        <!-- Main Card -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #ebe3d5; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(28,26,24,0.04);">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="background-color: #1c1a18; padding: 28px 24px; border-bottom: 3px solid #dc3c1c;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; text-decoration: none;">SupportSystem</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 4px;">
                    <span style="font-size: 12px; color: #c4b9aa; font-weight: 500; letter-spacing: 0.3px;">Private 1-to-1 Mentorship & Clarity</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              
              <!-- Status Pill -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 18px;">
                <tr>
                  <td style="background-color: #eaf7ed; border: 1px solid #c2e8c9; border-radius: 20px; padding: 5px 14px;">
                    <span style="color: #1b5e20; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                      ✓ Booking & Payment Confirmed
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <h1 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1c1a18; line-height: 1.3;">
                Hi ${payload.customerName},
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #5b534a;">
                Your upcoming 1-to-1 session has been confirmed. Below are your meeting credentials, schedule, and preparation notes.
              </p>

              <!-- Session Highlights Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff9f8; border: 1px solid #f2ded8; border-radius: 16px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px 22px;">
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 14px;">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9c8e7e; letter-spacing: 0.5px;">Package</div>
                          <div style="font-size: 16px; font-weight: 800; color: #1c1a18; margin-top: 2px;">
                            ${payload.packageTitle}
                            <span style="font-size: 13px; font-weight: 700; color: #dc3c1c; margin-left: 6px;">(${payload.packageDuration || 'Session'})</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 14px;">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9c8e7e; letter-spacing: 0.5px;">Scheduled Date & Time</div>
                          <div style="font-size: 15px; font-weight: 700; color: #dc3c1c; margin-top: 2px;">
                            📅 ${payload.sessionDate}
                          </div>
                          <div style="font-size: 14px; font-weight: 600; color: #1c1a18; margin-top: 2px;">
                            ⏰ ${payload.sessionTime}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9c8e7e; letter-spacing: 0.5px;">Session Format</div>
                          <div style="font-size: 14px; font-weight: 700; color: #1c1a18; margin-top: 2px;">
                            ${modeLabel}
                          </div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Bulletproof CTA Join Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="background-color: #dc3c1c; border-radius: 14px; box-shadow: 0 4px 14px rgba(220,60,28,0.28);">
                          <a href="${payload.meetingLink}" target="_blank" style="display: block; padding: 16px 28px; font-size: 15px; font-weight: 800; color: #ffffff; text-decoration: none; text-align: center; letter-spacing: 0.2px;">
                            👉 Join Zoom Meeting Directly
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Direct Credentials Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f4ed; border: 1px solid #eae2d3; border-radius: 12px; margin-bottom: 26px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 12px; color: #5b534a; padding-bottom: 4px;">
                          <strong>Meeting ID:</strong>
                          <span style="font-family: Consolas, Monaco, monospace; font-size: 13px; font-weight: 700; color: #1c1a18; margin-left: 6px;">${payload.zoomMeetingId}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #5b534a;">
                          <strong>Passcode:</strong>
                          <span style="font-family: Consolas, Monaco, monospace; font-size: 13px; font-weight: 700; color: #1c1a18; margin-left: 6px;">${payload.zoomPasscode}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment Receipt Summary -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #ebe4d8; padding-top: 18px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #8c8072; letter-spacing: 0.5px; margin-bottom: 8px;">
                      Payment Receipt
                    </div>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 2px 0;">Amount Paid:</td>
                        <td align="right" style="font-size: 14px; font-weight: 800; color: #1c1a18;">₹${payload.packagePrice} (Paid via Razorpay)</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #7a7064; padding: 2px 0;">Payment ID:</td>
                        <td align="right" style="font-size: 12px; font-family: monospace; color: #1c1a18;">${payload.paymentId}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #7a7064; padding: 2px 0;">Booking ID:</td>
                        <td align="right" style="font-size: 12px; font-family: monospace; color: #1c1a18;">${payload.bookingId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Before Your Session Checklist -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf9f6; border-left: 3px solid #dc3c1c; border-radius: 4px; margin-bottom: 12px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <div style="font-size: 12px; font-weight: 700; color: #1c1a18; margin-bottom: 6px;">
                      Before your session:
                    </div>
                    <div style="font-size: 12px; line-height: 1.6; color: #5b534a;">
                      • Ensure you have the Zoom app installed on your phone or laptop.<br>
                      • Sit in a quiet, private space where you feel calm and unhurried.<br>
                      • Camera is completely optional—your comfort comes first.
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer (Anti-Spam & CAN-SPAM compliant) -->
          <tr>
            <td style="background-color: #f7f4ee; padding: 24px 28px; border-top: 1px solid #ebe4d8; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #5b534a;">
                SupportSystem &bull; 1-to-1 Mentorship & Clarity Space
              </p>
              <p style="margin: 0 0 8px 0; font-size: 11px; line-height: 1.5; color: #877c70;">
                Have questions or need to reschedule? Simply reply directly to this email at <a href="mailto:supportsystem22@gmail.com" style="color: #dc3c1c; text-decoration: underline;">supportsystem22@gmail.com</a>.
              </p>
              <p style="margin: 0; font-size: 10px; color: #9c9183;">
                You received this transactional confirmation because you completed a booking on SupportSystem.
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
          'X-Mailer': 'SupportSystem Booking Notifier',
        },
      });
      customerSent = true;
      console.log(`✅ [Email Notification] Confirmation sent to mentee: ${payload.customerEmail}`);
    } catch (err: any) {
      console.error(`❌ [Email Notification] Failed to send email to mentee (${payload.customerEmail}):`, err);
    }
  }

  // ==========================================
  // 2. MENTOR NOTIFICATION EMAIL
  // ==========================================
  if (mentorEmail && mentorEmail.includes('@')) {
    const mentorSubject = `New Booking: ${payload.customerName} - ${payload.packageTitle} (${payload.sessionDate} at ${payload.sessionTime})`;
    const mentorPreheader = `New booking from ${payload.customerName} (${payload.customerPhone}). Mode: ${modeLabel}. Paid: ₹${payload.packagePrice}.`;

    const mentorPlainText = `
SupportSystem - New Booking Received
--------------------------------------------------
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
  
  <div style="display: none; font-size: 1px; color: #f7f5f0; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${mentorPreheader} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f5f0;">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e5ded2; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1c1a18; padding: 24px 26px; border-bottom: 3px solid #dc3c1c;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #dc3c1c; letter-spacing: 0.8px;">
                      🚨 New Booking Notification
                    </div>
                    <div style="font-size: 19px; font-weight: 800; color: #ffffff; margin-top: 4px;">
                      ${payload.customerName} has booked a session!
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 24px;">
              
              <!-- Customer Profile Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff8f6; border: 1px solid #f6dbd4; border-radius: 14px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #dc3c1c; letter-spacing: 0.5px; margin-bottom: 8px;">
                      Mentee Profile & Contact
                    </div>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 3px 0;"><strong>Full Name:</strong></td>
                        <td align="right" style="font-size: 14px; font-weight: 700; color: #1c1a18;">${payload.customerName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 3px 0;"><strong>Email:</strong></td>
                        <td align="right" style="font-size: 13px; color: #dc3c1c;">
                          <a href="mailto:${payload.customerEmail}" style="color: #dc3c1c; text-decoration: none;">${payload.customerEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 3px 0;"><strong>Phone:</strong></td>
                        <td align="right" style="font-size: 13px;">
                          <a href="https://wa.me/${cleanPhone}" target="_blank" style="display: inline-block; background-color: #e8f5e9; color: #2e7d32; font-weight: 700; padding: 3px 10px; border-radius: 8px; text-decoration: none; font-size: 12px;">
                            💬 ${payload.customerPhone} (WhatsApp)
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 3px 0;"><strong>Age / Gender:</strong></td>
                        <td align="right" style="font-size: 13px; color: #1c1a18;">${payload.customerAge || 'N/A'} yrs &bull; ${payload.customerGender || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 3px 0;"><strong>Preferred Language:</strong></td>
                        <td align="right" style="font-size: 13px; font-weight: 600; color: #1c1a18;">${payload.preferredLanguage || 'English'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Scheduled Slot & Zoom Info -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fbf9f6; border: 1px solid #ebe4d8; border-radius: 14px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #877c70; letter-spacing: 0.5px; margin-bottom: 8px;">
                      Session & Schedule
                    </div>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 3px 0;"><strong>Package:</strong></td>
                        <td align="right" style="font-size: 14px; font-weight: 700; color: #1c1a18;">${payload.packageTitle}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 3px 0;"><strong>Date:</strong></td>
                        <td align="right" style="font-size: 14px; font-weight: 700; color: #dc3c1c;">📅 ${payload.sessionDate}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 3px 0;"><strong>Time:</strong></td>
                        <td align="right" style="font-size: 14px; font-weight: 700; color: #dc3c1c;">⏰ ${payload.sessionTime}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 3px 0;"><strong>Mode:</strong></td>
                        <td align="right" style="font-size: 13px; font-weight: 600; color: #1c1a18;">${modeLabel}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #5b534a; padding: 3px 0;"><strong>Zoom Link:</strong></td>
                        <td align="right" style="font-size: 13px;">
                          <a href="${payload.meetingLink}" target="_blank" style="color: #dc3c1c; font-weight: 700; text-decoration: underline;">Open Zoom Meeting</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #7a7064; padding: 3px 0;">Meeting ID / Passcode:</td>
                        <td align="right" style="font-size: 12px; font-family: monospace; color: #1c1a18;">${payload.zoomMeetingId} &bull; ${payload.zoomPasscode}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Topics / Intake Notes -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf8f4; border: 1px solid #ebe4d8; border-radius: 14px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #877c70; letter-spacing: 0.5px; margin-bottom: 6px;">
                      Selected Dilemmas / Topics
                    </div>
                    <div style="font-size: 13px; font-weight: 600; color: #1c1a18; margin-bottom: 12px;">
                      ${topicsList}
                    </div>
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #877c70; letter-spacing: 0.5px; margin-bottom: 6px;">
                      Mentee's Personal Note
                    </div>
                    <div style="font-size: 13px; font-style: italic; color: #4a443e; line-height: 1.5;">
                      ${payload.notes ? `"${payload.notes}"` : 'None provided.'}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Transaction Summary -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #eee8de; padding-top: 14px;">
                <tr>
                  <td style="font-size: 12px; color: #7a7268;">
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
            <td style="background-color: #1c1a18; padding: 18px 24px; text-align: center;">
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
          'X-Mailer': 'SupportSystem Booking Notifier',
        },
      });
      mentorSent = true;
      console.log(`✅ [Email Notification] Alert sent to mentor: ${mentorEmail}`);
    } catch (err: any) {
      console.error(`❌ [Email Notification] Failed to send email to mentor (${mentorEmail}):`, err);
    }
  }

  return {
    success: true,
    customerSent,
    mentorSent,
  };
}
