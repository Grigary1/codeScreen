import nodemailer from 'nodemailer';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const otpStore = new Map();
const saltRounds = 10;

export const signUp = async (req, res) => {
  try {
    const { email, password, age, name, role } = req.body;
    if (!email || !password || !age || !name || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    const exists = await userModel.findOne({ email });
    if (exists) {
      res.status(400).json({
        success: false,
        message: "Email already exists. Try to login"
      })
    }
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Enter a strong password"
      })
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      age,
      role
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User created"
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
}



export const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email,role:user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.status(200).json({
      success:true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role:user.role
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: "False",
        "message": "User already exists"
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Hello ${name},</p><p>Your OTP code is: <b>${otp}</b></p><p>This code will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    return res.status(200).json({
      message: 'OTP sent successfully to your email',
    });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record) return res.status(400).json({ message: 'No OTP found for this email' });
  if (record.expiresAt < Date.now()) {
    otpStore.delete(email);
    return res.status(400).json({ message: 'OTP has expired' });
  }
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  otpStore.delete(email);
  res.status(200).json({ message: 'OTP verified successfully' });
};
