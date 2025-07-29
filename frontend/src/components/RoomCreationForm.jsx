import React, { useState } from 'react';

const RoomCreationForm = ({ interviewerId }) => {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreateRoom = () => {
    // TODO: call API to create room with { interviewerId, name, language, isPrivate }
    console.log('Create room', { interviewerId, name, language, isPrivate });
    
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Room
        </button>
      </div>
    </div>
  );
};

export default RoomCreationForm;