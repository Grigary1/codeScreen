import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';
import RoomList from './pages/RoomList';
import CodeEditor from './pages/CodeEditor';



const App = () => {
  const { user, token } = useAuth();

  useEffect(()=>{

  },[user])
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
       <Route path="/login" element={!user ? <Login /> : <Navigate to="/rooms" />} />
      <Route path="/rooms" element={user ? <RoomList /> : <Navigate to="/login" />} />
      <Route path="/room/:roomId" element={user ? <CodeEditor /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={user ? "/rooms" : "/login"} />} /> 
    </Routes> 
  )
}
export default App