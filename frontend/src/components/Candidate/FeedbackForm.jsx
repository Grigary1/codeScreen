import React, { useState } from 'react'

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('')
  function submitFeedback() {
    // TODO: POST to `/api/candidate/feedback`
  }
  return (
    <div>
      <h4>Post-Session Feedback</h4>
      <textarea
        rows={4}
        style={{ width: '100%' }}
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
      />
      <button onClick={submitFeedback}>Submit</button>
    </div>
  )
}
