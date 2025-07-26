import express from 'express';

const userRouter=express.Router();

userRouter.post('/send-otp',sendOtp);