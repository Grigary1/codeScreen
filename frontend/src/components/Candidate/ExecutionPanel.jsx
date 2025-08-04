import React from 'react'

export default function ExecutionPanel() {
  // function runCode() { /* call sandbox API */ }
  // function fetchHistory() { /* load past runs */ }

  return (
    <div>
      <h3>Run & Test</h3>
      <button onClick={() => {/* runCode() */}}>Run</button>
      <div>
        <p>Output:</p>
        <pre>// stdout / stderr here</pre>
      </div>
      {/* Test case results, history links */}
    </div>
  )
}
