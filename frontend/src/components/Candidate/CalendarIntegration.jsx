import React from 'react'

export default function CalendarIntegration() {
  function handleSync() {
    // TODO: trigger Google/Outlook calendar API
  }
  return (
    <div>
      <h4>Calendar</h4>
      <button onClick={handleSync}>Sync to Google Calendar</button>
    </div>
  )
}
