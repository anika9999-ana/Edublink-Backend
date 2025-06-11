import express from 'express'
import {  register, login} from '../controllers/customerController.js';

const customerRouter = express.Router();

customerRouter.post('/register',register)
customerRouter.post('/login',login);
// customerRouter.post('/logout',logout);
// customerRouter.post('/send-reset-otp',sendResetOtp);
// customerRouter.post('/reset-password',resetPassword);



export default customerRouter
