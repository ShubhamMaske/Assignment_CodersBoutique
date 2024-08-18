import express from 'express';

import { signUp, login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', signUp)
router.post('/login', login)
router.get('/forget-password', forgotPassword)
router.get('/reset-aassword', resetPassword)

export default router;