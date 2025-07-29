import express from 'express'
import { createRoom } from '../controllers/roomController.js';

const interviewerRouter=express.Router();

interviewerRouter.post('/create-room',createRoom);


export default roomRouter;