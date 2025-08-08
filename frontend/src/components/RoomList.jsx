import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { myRooms } from '../redux/interviewerSlice';
import { Link } from 'react-router-dom';

const RoomList = ({ interviewerId }) => {
    const [languageFilter, setLanguageFilter] = useState('');
    const dispatch = useDispatch();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const res = await dispatch(myRooms({ search: languageFilter }));
            const data = res.payload;
            console.log("Fetched Rooms:", data);
    
            if (Array.isArray(data)) {
                setRooms(data);
            } else if (data?.rooms && Array.isArray(data.rooms)) {
                setRooms(data.rooms);
            } else {
                setRooms([]);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [languageFilter]);

    const endRoom = (roomId) => {
        console.log('End room', roomId);
    };

    const languages = ['JavaScript', 'Java', 'Python'];

    return (
        <div className="space-y-4">
            {/* Language Filter Buttons */}
            <div className="flex gap-2">
                {languages.map((lang) => (
                    <button
                        key={lang}
                        onClick={() =>
                            setLanguageFilter((prev) => (prev === lang ? '' : lang))
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

            {/* Status Messages */}
            {loading ? (
                <p className="text-gray-500">Loading rooms...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : rooms.length === 0 ? (
                <p className="text-gray-500">
                    {languageFilter
                        ? `No rooms found for "${languageFilter}".`
                        : 'No rooms found.'}
                </p>
            ) : (
                rooms.map((room) => (
                    <div
                        key={room.roomId}
                        className="flex justify-between items-center bg-white p-4 rounded shadow hover:bg-gray-50"
                    >
                        <Link
                            to={`/session/${room.roomId}`}
                            className="flex-1 cursor-pointer"
                        >
                            <h3 className="font-semibold text-blue-600 hover:underline">
                                {room.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Status: {room.isActive ? 'Active' : 'Inactive'}
                            </p>
                        </Link>
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
            )}
        </div>
    );
};

export default RoomList;
