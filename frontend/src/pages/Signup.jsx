// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [step, setStep] = useState('details'); // 'details' → 'otp' → 'password'
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'candidate',
    otp: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <div style={{ maxWidth: 320, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      {step === 'details' && (
        <div>
          <h2>Create Account</h2>
          <div>
            <label>Name</label><br/>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label>Email</label><br/>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label>Role</label><br/>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="candidate">Candidate</option>
              <option value="interviewer">Interviewer</option>
            </select>
          </div>
          <button onClick={() => setStep('otp')} style={{ marginTop: '1rem' }}>
            Send OTP
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div>
          <h2>Enter OTP</h2>
          <div>
            <label>OTP</label><br/>
            <input name="otp" value={form.otp} onChange={handleChange} />
          </div>
          <button onClick={() => setStep('password')} style={{ marginTop: '1rem' }}>
            Verify OTP
          </button>
        </div>
      )}

      {step === 'password' && (
        <div>
          <h2>Create Password</h2>
          <div>
            <label>Password</label><br/>
            <input name="password" type="password" value={form.password} onChange={handleChange} />
          </div>
          <button style={{ marginTop: '1rem' }}>
            Complete Signup
          </button>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        <Link to="/login">Click here to login</Link>
      </div>
    </div>
  );
}
