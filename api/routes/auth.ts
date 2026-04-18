import express from 'express';
const router = express.Router();
import { register, login, profile, logout } from '../controllers/authController.js';

router.post('/register', register);
router.post('/login', login);
router.get('/profile', profile);
router.post('/logout', logout);

export default router;
