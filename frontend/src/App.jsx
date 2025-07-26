import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'


const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/rooms" />} />
      <Route path="/rooms" element={user ? <RoomList /> : <Navigate to="/login" />} />
      <Route path="/room/:roomId" element={user ? <CodeEditor /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={user ? "/rooms" : "/login"} />} />
    </Routes>
  )
}
export default App