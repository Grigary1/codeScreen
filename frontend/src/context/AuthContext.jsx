
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role,setRole]=useState(null);
  const [token, setToken] = useState(null);

  const setUserCred = (userData, token,userRole) => {
    setUser(userData);
    setToken(token);
    setRole(userRole);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
  };

  useEffect(()=>{
    if(!user){
      setUser(localStorage.getItem("user"));
      setToken(localStorage.getItem("token"));
    }
  },[])
  return (
    <AuthContext.Provider
    value={{ user, token, setUserCred, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
