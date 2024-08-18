import express from 'express';

import { signUp, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', signUp)
router.post('/login', login)
router.post('/forget-password', auth, forgotPassword)
router.post('/reset-password', auth, resetPassword)

export default router;