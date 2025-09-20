import {signupLimiter, resendLimiter} from '../controller/email.controller.js';
import { Router } from 'express';
// import rateLimit from 'express-rate-limit';
import { signup, resendVerification, login, logout, verifyToken, getLoggedInUsers } from '../controller/auth.controller.js';


const AuthRouter = Router();

// const signupLimiter = rateLimit({ windowMs: 24*60*60*1000, max:300 });
// const resendLimiter = rateLimit({ windowMs: 5*60*1000, max:5 });

AuthRouter.post('/signup', signupLimiter, signup);
AuthRouter.post('/resend-verification', resendLimiter, resendVerification);
AuthRouter.post('/login', login);
AuthRouter.post('/logout', logout);
AuthRouter.get('/verify/:token', verifyToken);
AuthRouter.get('/logged-in-users', getLoggedInUsers);

export default AuthRouter;
