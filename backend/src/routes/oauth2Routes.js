import express from 'express';
import passport from '../config/passport.js';
import {googleOAuthRegister} from '../controllers/oauth2Controller.js';

const router = express.Router();



// Redirect to Google for authentication
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.post(
    '/google/register',
    //passport.authenticate('google', { session: false }),
    googleOAuthRegister
);

export default router;
