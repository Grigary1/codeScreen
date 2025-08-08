  import React, { useEffect, useState } from 'react'
  import { Routes, Route, Navigate } from 'react-router-dom'
  import Login from './pages/Login'
  import Signup from './pages/Signup'
  import { useAuth } from './context/AuthContext'
  import RoomList from './pages/RoomList'
  import InterviewerDashboard from './pages/InterviewerDashboard'
  import CandidateDashboard from './pages/CandidateDashboard'
  import RoomEditor from './components/RoomEditor'
  import CodeEditor from './components/Editor.jsx'

  const App = () => {
    const { user } = useAuth()
    const [role, setRole] = useState(null)

    useEffect(() => {
      const storedRole = localStorage.getItem('role')  // "interviewer" or "candidate"
      setRole(storedRole)
    }, [])

    // Helper to choose the right dashboard
    const DashboardRedirect = () => {
      if (!user) return <Navigate to="/login" replace />
      return role === 'interviewer'
        ? <Navigate to="/interviewer-dashboard" replace />
        : <Navigate to="/candidate-dashboard" replace />
    }

    return (
      <Routes>
        {/* public */}
        <Route
          path="/login"
          element={user ? <DashboardRedirect /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <DashboardRedirect /> : <Signup />}
        />

        {/* protected routes */}
        <Route
          path="/interviewer-dashboard"
          element={
            user && role === 'interviewer'
              ? <InterviewerDashboard />
              : <Navigate to={user ? '/candidate-dashboard' : '/login'} replace />
          }
        />
        <Route
          path="/candidate-dashboard"
          element={
            user && role === 'candidate'
              ? <CandidateDashboard />
              : <Navigate to={user ? '/interviewer-dashboard' : '/login'} replace />
          }
        />

        {/* shared (both roles) */}
        <Route
          path="/rooms"
          element={user ? <RoomList /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/room-editor"
          element={user ? <RoomEditor /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/session/:roomId"
          element={user ? <CodeEditor /> : <Navigate to="/login" replace />}
        />

        {/* default */}
        <Route path="/" element={<DashboardRedirect />} />
        {/* catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  export default App