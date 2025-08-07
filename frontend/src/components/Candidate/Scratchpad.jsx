import React, { useState } from 'react'

export default function Scratchpad() {
  const [notes, setNotes] = useState('')
  return (
    <div>
      <h3>Scratchpad</h3>
      <textarea
        rows={5}
        style={{ width: '100%' }}
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Write your thoughts..."
      />
    </div>
  )
}
