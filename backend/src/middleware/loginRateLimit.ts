import rateLimit from "express-rate-limit";

// Throttles brute-force password guessing. Keyed by IP; a single IP gets 10
// attempts per 15 minutes regardless of which email it's trying.
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});
