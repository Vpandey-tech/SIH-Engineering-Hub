import { Router } from 'express';
import { signup, resendVerification, login, logout, me, getLoggedInUsers } from '../controller/auth.controller.js';
import { verifyFirebaseToken, requireAdmin } from '../middlewares/verifyFirebaseToken.js';

const router = Router();

router.post('/signup', signup);
router.post('/resend-verification', resendVerification);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyFirebaseToken, me);

router.get('/logged-in-users', verifyFirebaseToken, requireAdmin, getLoggedInUsers);

export default router;
