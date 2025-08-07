import React, { useState } from 'react'

export default function PrivateNotes() {
  const [notes, setNotes] = useState('')
  // TODO: load/save notes via API
  return (
    <div>
      <h4>Your Notes</h4>
      <textarea
        rows={4}
        style={{ width: '100%' }}
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
    </div>
  )
}
