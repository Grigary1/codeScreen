import React from 'react';

const LiveStatusPanel = () => {
  // TODO: subscription to live status
  const activeRooms = [
    { id: 'r1', candidate: 'Alice' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Live Rooms</h3>
      {activeRooms.length > 0 ? (
        <ul className="space-y-1">
          {activeRooms.map((r) => (
            <li key={r.id} className="flex justify-between">
              <span>{r.candidate}</span>
              <span className="text-sm text-green-600">In {r.id}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No active rooms</p>
      )}
    </div>
  );
};

export default LiveStatusPanel;
