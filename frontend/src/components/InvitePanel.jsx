import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { myRooms } from '../redux/interviewerSlice';

const InvitePanel = () => {
    const dispatch = useDispatch();
    const [rooms, setRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);


    const fetchRooms = async () => {
        try {
            const res = await dispatch(myRooms({ search: "" }));
            const data = res.payload;
            console.log("Rooms ", data)
            if (data.success) {
                setRooms(data.data);
            } else {
                setRooms([]);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const sendInvite = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow relative">
            <h3 className="font-semibold mb-2">Invite Candidates</h3>
            <button
                onClick={sendInvite}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Generate Invite Link
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50  bg-gray-400 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
                        <h2 className="text-xl font-semibold mb-4">Select a Room</h2>

                        {rooms.length > 0 ? (
                            <ul className="space-y-3 max-h-64 overflow-y-auto">
                                {rooms.map((room) => (
                                    <li
                                        key={room.roomId}
                                        className="border rounded p-3 hover:bg-gray-100 flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-semibold">{room.name}</p>
                                            <p className="text-sm text-gray-600">Language: {room.language}</p>
                                            <p className="text-sm text-gray-600">
                                                Privacy: {room.isPrivate ? 'Private' : 'Public'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    `${window.location.origin}/invite/${room.roomId}?role=candidate`
                                                )
                                            }
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                        >
                                            Copy Link
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No rooms available.</p>
                        )}

                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvitePanel;
