import express from 'express';

import { getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/users', auth, getUsers);
router.put('/users/:id', auth, updateUser);
router.delete('/users/:id', auth, deleteUser)

export default router;