// controllers/roomController.js
// import Room from '../models/Room.js';

export const createRoom = async (req, res) => {
    try {
        const { name } = req.body;
        //const room = new Room({ name, createdBy: req.user.id });
        //await room.save();
        //res.json(room);
    } catch (error) {

    }

};

// export const listRooms = async (req, res) => {
//     const rooms = await Room.find().populate('participants', 'name email');
//     res.json(rooms);
// };

// export const getRoom = async (req, res) => {
//     const room = await Room.findById(req.params.roomId)
//         .populate('participants', 'name email');
//     if (!room) return res.status(404).json({ message: 'Room not found' });
//     // auto-join for candidate if not already
//     if (!room.participants.includes(req.user.id)) {
//         room.participants.push(req.user.id);
//         await room.save();
//     }
//     res.json(room);
// };
