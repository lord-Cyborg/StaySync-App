const express = require('express');
const router = express.Router();
const authService = require('../auth/auth');
const { authenticate } = require('../auth/middleware');
const logger = require('../utils/logger');

// Registro de novo usuário
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await authService.registerUser({ email, password, name, role });
        res.status(201).json({
            ...user,
            message: 'Registration successful. Please check your email to verify your account.'
        });
    } catch (error) {
        await logger.error('Registration route error', { error: error.message });
        res.status(400).json({ error: error.message });
    }
});

// Verificação de email
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Verification token is required' });
        }

        await authService.verifyEmail(token);
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        await logger.error('Email verification route error', { error: error.message });
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing credentials' });
        }

        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        await logger.error('Login route error', { error: error.message });
        res.status(401).json({ error: error.message });
    }
});

// Verificar token
router.get('/verify', authenticate, async (req, res) => {
    res.json({ user: req.user });
});

// Recuperar perfil do usuário
router.get('/profile', authenticate, async (req, res) => {
    try {
        const users = await db.readDb('users');
        const user = Object.values(users.users).find(u => u.id === req.user.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        await logger.error('Profile route error', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
