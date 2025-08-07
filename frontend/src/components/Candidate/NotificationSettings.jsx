import React from 'react'

export default function NotificationSettings() {
  return (
    <div>
      <h4>Reminders</h4>
      <label><input type="checkbox" /> 15 min before</label><br/>
      <label><input type="checkbox" /> 1 hour before</label><br/>
      <label><input type="checkbox" /> Email alerts</label>
    </div>
  )
}
