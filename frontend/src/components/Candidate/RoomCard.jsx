import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function RoomCard({ room }) {
  const navigate = useNavigate()
  const isPast = new Date(room.time) < Date.now()
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '0.5rem',
        background: isPast ? '#f5f5f5' : '#fff',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <p><strong>ID:</strong> {room.roomId}</p>
        <p><strong>Interviewer:</strong> {room.interviewer}</p>
        <p><strong>Time:</strong> {new Date(room.time).toLocaleString()}</p>
      </div>
      <button
        disabled={isPast}
        onClick={() => navigate(`/session/${room.roomId}`)}
      >
        {isPast ? 'View' : 'Join'}
      </button>
    </div>
  )
}
