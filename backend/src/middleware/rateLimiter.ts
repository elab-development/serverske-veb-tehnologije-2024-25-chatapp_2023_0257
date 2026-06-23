import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuta
  max: 100,
  message: { error: 'Previše zahteva sa ove IP adrese, pokušajte ponovo kasnije.' },
  standardHeaders: true, 
  legacyHeaders: false,
});