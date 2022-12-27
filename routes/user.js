import express from 'express';
import { emailVerifiction, generateOtpForOtpLogin, login, sendEmail, signup, verifyOtp } from '../controller/userAuth.js';
const router = express.Router();


// User Registration
router.post('/login', login)
router.post('/signup', signup)
router.post('/emailVerifiction', sendEmail)
router.post('/otpVerification', emailVerifiction)
router.post('/otpLogin', generateOtpForOtpLogin)
router.post('/verifyOtpLogin', verifyOtp)





export default router