import express from 'express'
import { createRoom, joinRoom, searchRoom } from '../controllers/roomController.js';

const roomRouter=express.Router();

roomRouter.post('/create-room',createRoom);
roomRouter.get('/search-room',searchRoom);
roomRouter.post('/join-room',joinRoom);


export default roomRouter;