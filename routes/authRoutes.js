import express, { Router } from 'express'
import { login, logout, register} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register',register)
authRouter.post('/login',login);
authRouter.post('/logout',logout);
// authRouter.post('/send-reset-otp',sendResetOtp);
// authRouter.post('/reset-password',resetPassword);



export default authRouter

