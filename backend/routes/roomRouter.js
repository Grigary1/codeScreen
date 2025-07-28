import express from 'express'

const roomRouter=express.Router();

roomRouter.post('/create-room',createRoom);


export default roomRouter