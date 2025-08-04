import React from 'react'

export default function FilterSort() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <select>
        <option>All Statuses</option>
        <option>Upcoming</option>
        <option>Past</option>
      </select>
      <select>
        <option>All Languages</option>
        <option>JavaScript</option>
        <option>Python</option>
        <option>C++</option>
      </select>
      <select>
        <option>Sort by Time</option>
        <option>Earliest</option>
        <option>Latest</option>
      </select>
    </div>
  )
}
