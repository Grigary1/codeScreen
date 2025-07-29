import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { myRooms } from '../redux/interviewerSlice';

const RoomList = ({ interviewerId }) => {
    const [languageFilter, setLanguageFilter] = useState('');
    const dispatch = useDispatch();
    const [rooms, setRooms] = useState([]);

    const fetchRooms = async () => {
        try {
            const res = await dispatch(myRooms({ search: languageFilter }));
            const data = res.payload;
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
    }, [languageFilter]);

    const endRoom = (roomId) => {
        // TODO: implement API call to mark isActive=false
        console.log('End room', roomId);
    };

    const languages = ['JavaScript', 'Java', 'Python'];

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                {languages.map((lang) => (
                    <button
                        key={lang}
                        onClick={() =>
                            setLanguageFilter((prev) =>
                                prev === lang ? '' : lang
                            )
                        }
                        className={`px-4 py-2 rounded ${
                            languageFilter === lang
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-black'
                        }`}
                    >
                        {lang}
                    </button>
                ))}
            </div>

            {rooms && rooms.length > 0 ? (
                rooms.map((room) => (
                    <div
                        key={room.roomId}
                        className="flex justify-between items-center bg-white p-4 rounded shadow"
                    >
                        <div>
                            <h3 className="font-semibold">{room.name}</h3>
                            <p className="text-sm text-gray-600">
                                Status: {room.isActive ? 'Active' : 'Inactive'}
                            </p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}/room/${room.roomId}`
                                    )
                                }
                                className="text-blue-500 hover:underline"
                            >
                                Copy Link
                            </button>
                            <button
                                onClick={() => endRoom(room.roomId)}
                                className="text-red-500 hover:underline"
                            >
                                {room.isActive ? 'End' : 'Delete'}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No rooms found.</p>
            )}
        </div>
    );
};

export default RoomList;
