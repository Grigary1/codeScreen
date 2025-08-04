import React from 'react'

export default function ProblemPanel() {
  // Load problem statement via API stub:
  // async function fetchProblem() { /* ... */ }

  return (
    <div style={{ border: '1px solid #ccc', height: '300px', overflow: 'auto' }}>
      <h3>Problem Statement</h3>
      <p><strong>Title:</strong> Two Sum</p>
      <p>Given an array of integers, return indices of the two numbers such that they add up to a specific target.</p>
      {/* constraints, sample I/O, etc. */}
    </div>
  )
}
