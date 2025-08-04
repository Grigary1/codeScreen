import React from 'react'

export default function Settings() {
  // function updateSettings() { /* API stub */ }

  return (
    <div>
      <h3>Settings</h3>
      <label>
        <input type="checkbox" /> Vim keybindings
      </label><br/>
      <label>
        Editor font size:
        <select>
          <option>12px</option>
          <option>14px</option>
          <option>16px</option>
        </select>
      </label>
    </div>
  )
}
