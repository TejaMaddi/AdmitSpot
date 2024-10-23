const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// User Registration
exports.register = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });

    try {
        await user.save();
        // Send verification email
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const url = `http://localhost:${process.env.PORT}/api/users/verify/${token}`;
        await transporter.sendMail({
            to: user.email,
            subject: 'Email Verification',
            html: `<h1>Welcome!</h1><p>Click <a href="${url}">here</a> to verify your email.</p>`,
        });
        res.status(201).json({ message: 'User registered, please verify your email.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

// Email Verification
exports.verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOneAndUpdate({ email: decoded.email }, { isVerified: true }, { new: true });
        res.json({ message: 'Email verified successfully', user });
    } catch (error) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};

// Password Reset
exports.resetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const url = `http://localhost:${process.env.PORT}/api/users/reset/${token}`;
    
    // Send reset email
    await transporter.sendMail({
        to: user.email,
        subject: 'Password Reset',
        html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
    });

    res.json({ message: 'Password reset email sent.' });
};
