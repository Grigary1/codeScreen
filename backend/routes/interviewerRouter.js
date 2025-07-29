import express from 'express'
import { createRoom, myRooms } from '../controllers/roomController.js';
import userAuth from '../middlewares/userAuth.js';

const interviewerRouter=express.Router();

interviewerRouter.post('/create-room',userAuth,createRoom);
interviewerRouter.get('/my-rooms',userAuth,myRooms);


export default interviewerRouter;