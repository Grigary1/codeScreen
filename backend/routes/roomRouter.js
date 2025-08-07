import express from 'express'
import { createRoom, searchRoom } from '../controllers/roomController.js';

const roomRouter=express.Router();

roomRouter.post('/create-room',createRoom);
roomRouter.get('/search-room',searchRoom);


export default roomRouter;