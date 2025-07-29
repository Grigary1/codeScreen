import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';
import RoomList from './pages/RoomList';
import CodeEditor from './pages/CodeEditor';
import InterviewerDashboard from './pages/InterviewerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import RoomEditor from './components/RoomEditor';



const App = () => {
  const { user, token } = useAuth();
  const [role, setRole] = useState(null);
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);
  // if (!token) {
  //   return (
  //     <div className="min-h-screen bg-gray-900 flex items-center justify-center">
  //       <div className="text-white text-xl">Loading...</div>
  //     </div>
  //   );
  // }
  return (
    <Routes>
      {/* // <Login/> */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/interviewer-dashboard" />} />
      <Route
        path="/interviewer-dashboard"
        element={
          !user ? (
            <Login />
          ) : role === "interviewer" ? (
            <InterviewerDashboard />
          ) : (
            <CandidateDashboard />
          )
        }
      />
      <Route path="/room-editor" element={role ? <RoomEditor /> : <RoomEditor/>} />
      <Route path="/room/:roomId" element={user ? <CodeEditor /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={user ? "/rooms" : "/login"} />} />
    </Routes>
  )
}
export default App