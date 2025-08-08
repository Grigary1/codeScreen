import React, { useEffect, useState } from 'react';
import { createRoom } from '../redux/interviewerSlice';
import { useDispatch } from 'react-redux';

const RoomCreationForm = () => {
    const [name, setName] = useState('');
    const dispatch = useDispatch();
    const [language, setLanguage] = useState('JavaScript');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleCreateRoom = async () => {
        console.log('Create room', { name, language, isPrivate });
        try {
            const res = await dispatch(createRoom({ name, language, isPrivate }));
            const data = res.payload;
            
            if (data.success) {
                alert("Room created");
            }
            console.log("Data new : ", data);
        } catch (error) {
            console.log("Error ", error.message);
        }

    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Room Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                />
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                >
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>Java</option>
                </select>
                <div className="flex items-center">
                    <input
                        id="privateToggle"
                        type="checkbox"
                        checked={isPrivate}
                        onChange={() => setIsPrivate(!isPrivate)}
                        className="mr-2"
                    />
                    <label htmlFor="privateToggle">Private Room</label>
                </div>
                <button
                    onClick={handleCreateRoom}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
                >
                    Create Room
                </button>
            </div>
        </div>
    );
};

export default RoomCreationForm;