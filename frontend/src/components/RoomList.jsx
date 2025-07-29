import React from 'react';

const RoomList = ({ interviewerId }) => {
  // TODO: fetch rooms by interviewerId
  const rooms = [
    { id: 'r1', name: 'React Interview', isActive: true },
    { id: 'r2', name: 'Node.js Deep Dive', isActive: false },
  ];

  const endRoom = (roomId) => {
    // TODO: API call to set isActive=false
    console.log('End room', roomId);
  };

  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <div
          key={room.id}
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
              onClick={() => navigator.clipboard.writeText(window.location.origin + `/room/${room.id}`)}
              className="text-blue-500 hover:underline"
            >
              Copy Link
            </button>
            <button
              onClick={() => endRoom(room.id)}
              className="text-red-500 hover:underline"
            >
              {room.isActive ? 'End' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;