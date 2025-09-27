import dns from 'dns/promises';
import rateLimit from 'express-rate-limit';

export const signupLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,       
  max: 300,                            
  message: { message: 'Too many signup attempts from this IP. Please try again tomorrow.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resendLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,             
  max: 5,                             
  message: { message: 'Too many resend attempts. Please try again in 5 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const trustedDomains = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
];

export const validateEmailDomain = async (email) => {
  const domain = email.split('@')[1];
  if (!trustedDomains.includes(domain)) {
    throw new Error(
      'Email domain not trusted. Please use a Gmail, Yahoo, Outlook, Hotmail, or iCloud email.'
    );
  }

  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      throw new Error('Invalid email domain. Please use a valid email address.');
    }
    return true;
  } catch (error) {
    throw new Error('Invalid email domain. Please use a valid email address.');
  }
};
