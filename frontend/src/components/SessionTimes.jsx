import React, { useState, useEffect } from 'react';

const SessionTimer = () => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Session Timer</h3>
      <p className="text-xl">{formatTime(seconds)}</p>
    </div>
  );
};

export default SessionTimer;