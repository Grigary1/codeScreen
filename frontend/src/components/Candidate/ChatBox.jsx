import React, { useState } from 'react'

export default function ChatBox() {
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')

  function sendMsg() {
    // socket.emit('chat', input)
    setMsgs(m => [...m, { from: 'You', text: input }])
    setInput('')
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
      <h3>Chat</h3>
      <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
        {msgs.map((m,i) => <p key={i}><strong>{m.from}:</strong> {m.text}</p>)}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type..."
      />
      <button onClick={sendMsg}>Send</button>
    </div>
  )
}
