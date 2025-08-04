import React from 'react'
import RoomCard from './RoomCard'

export default function RoomList({ rooms }) {
  return (
    <div>
      {rooms.map(r => (
        <RoomCard key={r.roomId} room={r} />
      ))}
    </div>
  )
}
