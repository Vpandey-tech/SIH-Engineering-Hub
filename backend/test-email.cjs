require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendTestEmail() {
  try {
    await transporter.verify();
    console.log('SMTP connection verified');
    const info = await transporter.sendMail({
      from: '"Engineering Hub" <engineeringhub0001@gmail.com>',
      to: 'snket2005d@gmail.com', // Replace with your email
      subject: 'Test Email from Engineering Hub',
      text: 'This is a test email to verify Brevo SMTP setup for Engineering Hub. Please check your inbox or spam/junk folder.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Welcome to Engineering Hub</h2>
          <p>Thank you for testing the Brevo SMTP setup.</p>
          <p>This is a test email to confirm email delivery. If you see this, our setup is working!</p>
          <p>Please check your inbox or spam/junk folder. If you don’t see this email, contact our support team.</p>
          <p style="font-size: 12px; color: #777;">
            Sent by Engineering Hub, a platform for smart study solutions.<br>
            If you did not request this email, please ignore it.
          </p>
        </div>
      `,
    });
    console.log('Test email sent:', info.messageId, info.response);
  } catch (error) {
    console.error('Error:', error.message, error.response);
  }
}

sendTestEmail();