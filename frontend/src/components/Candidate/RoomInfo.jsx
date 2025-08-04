import React, { useState, useEffect } from 'react'

export default function RoomInfo() {
  const [roomInfo, setRoomInfo] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState("Connected")

  useEffect(() => {
    fetchRoomInfo()
  }, [])

  async function fetchRoomInfo() {
    // Example stub
    setRoomInfo({
      roomId: 'abc123',
      interviewerName: 'Alice Johnson',
      language: 'JavaScript',
      startedAt: '2025-08-04T10:00:00Z',
    })
  }

  function handleLeaveRoom() {
    // Cleanup sockets, notify server
    // Navigate to /dashboard
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem' }}>
      <h3>Room Info</h3>
      {roomInfo ? (
        <>
          <p><strong>Room ID:</strong> {roomInfo.roomId}</p>
          <p><strong>Interviewer:</strong> {roomInfo.interviewerName}</p>
          <p><strong>Language:</strong> {roomInfo.language}</p>
          <p><strong>Started At:</strong> {new Date(roomInfo.startedAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {connectionStatus}</p>
          <button onClick={handleLeaveRoom}>Leave Room</button>
        </>
      ) : (
        <p>Loading room details...</p>
      )}
    </div>
  )
}
