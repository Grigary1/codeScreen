import React, { useState } from 'react'

export default function JoinByLink() {
  const [link, setLink] = useState('')
  function handleJoin() {
    // TODO: validate and navigate to /session/:roomId
  }
  return (
    <div>
      <input
        type="text"
        placeholder="Paste room link..."
        value={link}
        onChange={e => setLink(e.target.value)}
        style={{ padding: '0.5rem' }}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  )
}
