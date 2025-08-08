import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function JoinByLink() {
  const [link, setLink] = useState('')
  const navigate = useNavigate()
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  async function handleJoin() {
    try {
      const url = new URL(link)
      const pathParts = url.pathname.split('/')

      if (pathParts.length === 3 && pathParts[1] === 'room') {
        const roomId = pathParts[2]

        // 🔁 Send to backend for validation
        const res = await axios.post(`${backendUrl}/api/join-room`, { roomId })

        if (res.data.success) {
          navigate(`/session/${roomId}`)
        } else {
          alert('Room not found or is inactive/private.')
        }
      } else {
        alert('Invalid room link format.')
      }
    } catch (err) {
      alert('Please enter a valid URL.')
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Paste room link..."
        value={link}
        onChange={e => setLink(e.target.value)}
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <button onClick={handleJoin} style={{ marginLeft: '10px' }}>Join</button>
    </div>
  )
}
