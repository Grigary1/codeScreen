import express from 'express'
import { createRoom, deleteRoom, endRoom, joinRoom, searchRoom } from '../controllers/roomController.js';
import userAuth from '../middlewares/userAuth.js';

const roomRouter=express.Router();

roomRouter.post('/create-room',createRoom);
roomRouter.get('/search-room',searchRoom);
roomRouter.post('/join-room',joinRoom);
roomRouter.post('/end-room',userAuth,endRoom);
roomRouter.post('/delete-room',userAuth,deleteRoom);


export default roomRouter;