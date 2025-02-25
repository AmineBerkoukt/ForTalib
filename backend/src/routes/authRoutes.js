import express from 'express';
import { validateRegistration, validateLogin } from '../validations/userValidator.js';
import {register, login, forgotPassword, resetPassword} from '../controllers/authController.js';
import {uploadPfp} from "../config/upload.js";

const router = express.Router();

//  { firstName, lastName, email, password, phoneNumber, studies(not required !) }
//router.post('/register', uploadPfp.single('profilePhoto'), validateRegistration, register);


router.post('/register', register);
router.post('/login', validateLogin, login);   // { email, password }

router.post('/forgot-password', forgotPassword);  // { email }
router.post('/reset-password/:token', resetPassword);  // { newPassword }


export default router;