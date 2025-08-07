import interviewerModel from '../models/interviewerModel.js';

export const joinRoom = async (req, res) => {
    const { roomId } = req.body

    try {
        const interviewer = await interviewerModel.findOne({
            'rooms.roomId': roomId,
            'rooms.isActive': true,
            'rooms.isPrivate':false
        })

        if (!interviewer) {
            return res.status(404).json({ success: false, message: 'Room not found or inactive' })
        }

        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' })
    }

}

export const searchRoom = async (req, res) => {
    try {
        const q = req.query.s || '';
        if (q.length == 0) {
            return res.status(400).json({
                success: false,
                message: "No search found"
            })
        }
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const regex = new RegExp(q, 'i');

        const pipeline = [
            { $unwind: '$rooms' },
            {
                $match: {
                    'rooms.isPrivate': false,
                    $or: [
                        { 'rooms.name': { $regex: regex } },
                        { 'rooms.roomId': { $regex: regex } },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    interviewerId: 1,
                    room: '$rooms',
                },
            },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ];

        const results = await interviewerModel.aggregate(pipeline);

        const countPipeline = [
            { $unwind: '$rooms' },
            {
                $match: {
                    'rooms.isPrivate': false,
                    $or: [
                        { 'rooms.name': { $regex: regex } },
                        { 'rooms.roomId': { $regex: regex } },
                    ],
                },
            },
            { $count: 'total' },
        ];

        const countResult = await interviewerModel.aggregate(countPipeline);
        const total = countResult[0]?.total || 0;

        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            results,
        });

    } catch (err) {
        console.error('SearchRoom Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during room search',
        });
    }
};



export const myRooms = async (req, res) => {
    try {
        const interviewerId = req.id;
        const { search } = req.query;

        const pipeline = [
            {
                $match: { interviewerId }
            },
            {
                $unwind: "$rooms"
            },
            {
                $match: search
                    ? { "rooms.language": { $regex: `\\b${search}\\b`, $options: "i" } }
                    : {}
            },
            {
                $project: {
                    _id: 0,
                    room: "$rooms"
                }
            }
        ];

        const result = await interviewerModel.aggregate(pipeline);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: search
                    ? `No rooms found for the search query: ${search}`
                    : "No rooms found for this interviewer."
            });
        }

        return res.status(200).json({
            success: true,
            message: `Rooms fetched successfully.`,
            data: result.map(item => item.room)
        });

    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Could not fetch rooms."
        });
    }
};



export const createRoom = async (req, res) => {
    try {
        const interviewerId = req.id;
        const role = req.role;
        if (role != "interviewer") {
            return res.status(400).json({
                success: false,
                message: "Only interviewer can create room",
            });
        }
        const { name, language, isPrivate } = req.body;

        if (!name || !language || typeof isPrivate !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid fields: name, language, isPrivate are required.",
            });
        }
        const newRoom = {
            name,
            language,
            isPrivate,
            isActive: true
        };
        const existingInterviewer = await interviewerModel.findOne({ interviewerId });

        if (existingInterviewer) {
            existingInterviewer.rooms.push(newRoom);
            await existingInterviewer.save();

            return res.status(200).json({
                success: true,
                message: "New room added successfully to existing interviewer.",
                data: newRoom,
            });
        } else {
            const newInterviewer = await interviewerModel.create({
                interviewerId,
                rooms: [newRoom],
            });

            return res.status(201).json({
                success: true,
                message: "Interviewer created and room added successfully.",
                data: newInterviewer,
            });
        }

    } catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Could not create room.",
        });
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
