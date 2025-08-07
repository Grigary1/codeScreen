import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function JoinByLink() {
  const [link, setLink] = useState('')
  const navigate = useNavigate()

  function handleJoin() {
    try {
      const url = new URL(link)
      const pathParts = url.pathname.split('/')

      // Validate the link structure
      if (pathParts.length === 3 && pathParts[1] === 'session') {
        const roomId = pathParts[2]
        navigate(`/session/${roomId}`)
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
