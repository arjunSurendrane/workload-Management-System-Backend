import express from 'express';
import { login, signup } from '../controller/userAuth.js';
const router = express.Router();


// User Registration
router.post('/login', login)
router.post('/signup', signup)





export default router