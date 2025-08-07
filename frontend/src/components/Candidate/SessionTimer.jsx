import React, { useState, useEffect } from 'react'

export default function SessionTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div>
      <h2>Session Timer</h2>
      <p>{mins}m {secs}s elapsed</p>
    </div>
  )
}
