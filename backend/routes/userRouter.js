import express from 'express';
import { sendOtp, signUp, verifyLogin, verifyOtp } from '../controllers/userController.js';

const userRouter=express.Router();

userRouter.post('/send-otp',sendOtp);
userRouter.post('/verify-otp',verifyOtp);
userRouter.post('/signup',signUp)
userRouter.post('/login',verifyLogin)


export default userRouter;