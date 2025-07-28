import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../redux/Auth';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setUserCred } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPassVisible, setIsPassVisible] = useState(false);

  const handleLoginSubmit = async (e) => {
  
    e.preventDefault();
    try {

      const result = await dispatch(handleLogin({email, password}));
      const data=result.payload;
    
      if (data.success) {

        setUserCred(data.user.id, data.token);
        localStorage.setItem("user",data.user.id);
        localStorage.setItem("token", data.token);
        navigate('/rooms')
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return (
      <div>{error}</div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleLoginSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <div className="space-y-2">
          <label className="block text-gray-600">Email</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-600">Password</label>
          <div className="relative">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type={isPassVisible ? 'text' : 'password'}
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
              onClick={() => setIsPassVisible(!isPassVisible)}
            >
              {isPassVisible ? '🙈' : '👁️'}
            </span>
          </div>
        </div>

        <button
          onSubmit={handleLoginSubmit}
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition hover:cursor-pointer"
        >
          {loading ? <Loader /> : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login; 
