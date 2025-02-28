import express from 'express';
import { validateLogin } from '../validations/login/validateLogin.js';
import { validateSignup} from "../validations/signup/validateSignup.js";
import {register, login, forgotPassword, resetPassword} from '../controllers/authController.js';

const router = express.Router();

//router.post('/register', uploadPfp.single('profilePhoto'), validateRegistration, register);


router.post('/register', validateSignup, register);
router.post('/login', validateLogin, login);   // { email, password }

router.post('/forgot-password', forgotPassword);  // { email }
router.post('/reset-password/:token', resetPassword);  // { newPassword }


export default router;