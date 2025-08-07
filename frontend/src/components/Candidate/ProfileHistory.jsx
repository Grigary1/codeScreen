import React from 'react'

export default function ProfileHistory() {
  // useEffect(() => fetchHistory(), [])
  // async function fetchHistory() { /* API stub */ }

  return (
    <div>
      <h3>Session History</h3>
      <ul>
        <li>2025-07-20 with Bob (Java) — <a href="#">View</a></li>
        <li>2025-06-30 with Carol (Python) — <a href="#">View</a></li>
      </ul>
    </div>
  )
}
