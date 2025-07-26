import React, { useState } from 'react';
import {AgeIcon,EmailIcon,OTPSIcon,PasswordIcon,UserIcon} from '../assets/svgIcons.jsx'
import { useDispatch } from 'react-redux';
import { sendOtp } from '../redux/Auth.js';
const InputIcon = ({ children }) => (
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    {children}
  </div>
);

// Form input component
const FormInput = ({ id, name, type, placeholder, value, onChange, icon, disabled = false }) => (
  <div className="relative">
    <InputIcon>{icon}</InputIcon>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition duration-300 disabled:opacity-50"
      required
    />
  </div>
);

// Main button component
const ActionButton = ({ onClick, type = "submit", disabled = false, children }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-300 ease-in-out transform hover:scale-105"
  >
    {children}
  </button>
);


export default function Signup() {

    const dispatch=useDispatch();

  // 'signup' or 'login'
  const [view, setView] = useState('signup'); 
  // 'details', 'otp', 'password'
  const [signupStep, setSignupStep] = useState('details'); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); 
  };

  const handleSendOtp = async(e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.age) {
      setError('Please fill in all details.');
      return;
    }
    try {
        const res=await dispatch(sendOtp(formData)).unwrap();
        setMessage(res.message);
        setSignupStep('otp');
    } catch (error) {
        setError(error);
    }finally{
        setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // API call to verify OTP
    console.log('Verifying OTP:', formData.otp);
    setTimeout(() => {
      if (formData.otp === '123456') {
        setIsLoading(false);
        setMessage('OTP verified successfully! Please set your password.');
        setSignupStep('password');
      } else {
        setIsLoading(false);
        setError('Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setIsLoading(true);
    setError('');
    // API call to create account
    console.log('Creating account with data:', formData);
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Account created successfully! You can now log in.');
      // reset form 
      setTimeout(() => setView('login'), 2000);
    }, 1500);
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // API call for login
    console.log('Logging in with:', formData.email, formData.password);
     setTimeout(() => {
      setIsLoading(false);
      setMessage('Logged in successfully!');
    }, 1500);
  }

  const renderSignupForm = () => (
    <form className="space-y-6">
      {signupStep === 'details' && (
        <div className="space-y-4 animate-fade-in">
          <FormInput id="name" name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleInputChange} icon={<UserIcon />} />
          <FormInput id="email" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} icon={<EmailIcon />} />
          <FormInput id="age" name="age" type="number" placeholder="Age" value={formData.age} onChange={handleInputChange} icon={<AgeIcon />} />
          <ActionButton onClick={handleSendOtp} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send OTP'}
          </ActionButton>
        </div>
      )}

      {signupStep === 'otp' && (
        <div className="space-y-4 animate-fade-in">
           <p className="text-sm text-gray-400">Name: {formData.name} | Email: {formData.email}</p>
          <FormInput id="otp" name="otp" type="text" placeholder="Enter 6-digit OTP" value={formData.otp} onChange={handleInputChange} icon={<OTPSIcon />} />
          <ActionButton onClick={handleVerifyOtp} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </ActionButton>
           <button type="button" onClick={() => setSignupStep('details')} className="text-sm text-green-400 hover:text-green-300 w-full text-center">
            Change Details
          </button>
        </div>
      )}

      {signupStep === 'password' && (
        <div className="space-y-4 animate-fade-in">
          <FormInput id="password" name="password" type="password" placeholder="Create Password" value={formData.password} onChange={handleInputChange} icon={<PasswordIcon />} />
          <FormInput id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} icon={<PasswordIcon />} />
          <ActionButton onClick={handleCreateAccount} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </ActionButton>
        </div>
      )}
    </form>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
        <FormInput id="email" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} icon={<EmailIcon />} />
        <FormInput id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} icon={<PasswordIcon />} />
        <ActionButton disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Login'}
        </ActionButton>
    </form>
  );


  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto bg-blue-900/30 backdrop-blur-sm border border-green-500/20 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-green-400">
            {view === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400">
            {view === 'signup' ? 'Join us and start your journey.' : 'Log in to continue.'}
          </p>
        </div>

        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center animate-shake">{error}</p>}
        {message && <p className="text-green-300 bg-green-900/50 p-3 rounded-lg text-center">{message}</p>}

        {view === 'signup' ? renderSignupForm() : renderLoginForm()}

        <div className="text-center text-gray-400">
          {view === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => { setView('login'); setError(''); setMessage('');}} className="font-medium text-green-400 hover:text-green-300 transition">
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => { setView('signup'); setError(''); setMessage(''); setSignupStep('details'); }} className="font-medium text-green-400 hover:text-green-300 transition">
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
