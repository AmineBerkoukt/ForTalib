import rateLimit from 'express-rate-limit';

export const registerLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 8,
    message: { error: 'You have created many accounts !\n Try again after 30 minutes !' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5, // Max 5 requests per IP
    message: { error: 'Too many failed logins please try again after 5 minutes !' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const createPostLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { error: 'Too many posts creations !\n Try again after an hour !' },
    standardHeaders: true,
    legacyHeaders: false,
});
