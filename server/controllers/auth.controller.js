const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, location } = req.body;

        if (!name || !email || !password || !role || !location) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (await User.findOne({ email }))
            return res.status(400).json({ message: 'Email already registered' });

        const user = await User.create({ name, email, password, role, location });

        res.status(201).json({
            message: 'Registration successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, location: user.location }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user);

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, location: user.location }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMe = (req, res) => {
    res.json({ user: req.user });
};