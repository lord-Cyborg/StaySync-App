const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db-operations');
const logger = require('../utils/logger');
const emailService = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Em produção, usar variável de ambiente
const EMAIL_VERIFICATION_ENABLED = false; // Temporariamente desativado

class AuthService {
    constructor() {
        this.saltRounds = 10;
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    generateToken(userId, role) {
        return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '24h' });
    }

    async registerUser(userData) {
        try {
            const users = await db.readDb('users');
            
            // Verificar se email já existe
            if (users.users[userData.email]) {
                throw new Error('Email already registered');
            }

            // Criar novo usuário
            const userId = uuidv4();
            const hashedPassword = await this.hashPassword(userData.password);

            const newUser = {
                id: userId,
                email: userData.email,
                password: hashedPassword,
                role: userData.role || 'financial_operator', // Role padrão
                name: userData.name,
                created: new Date().toISOString(),
                status: EMAIL_VERIFICATION_ENABLED ? 'pending_verification' : 'active',
                verified: !EMAIL_VERIFICATION_ENABLED // Temporariamente true
            };

            // Salvar usuário
            users.users[userData.email] = newUser;
            await db.writeDb('users', users);

            // Enviar email de verificação apenas se estiver habilitado
            if (EMAIL_VERIFICATION_ENABLED) {
                const verificationToken = emailService.generateVerificationToken(userId);
                await emailService.sendVerificationEmail(userData.email, verificationToken);
            }

            // Log da operação
            await logger.info('New user registered', { email: userData.email, role: userData.role });

            // Retornar usuário sem a senha
            const { password, ...userWithoutPassword } = newUser;
            return {
                ...userWithoutPassword,
                message: EMAIL_VERIFICATION_ENABLED 
                    ? 'Registration successful. Please check your email to verify your account.'
                    : 'Registration successful. You can now login.'
            };
        } catch (error) {
            await logger.error('User registration failed', { error: error.message });
            throw error;
        }
    }

    async verifyEmail(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            if (decoded.purpose !== 'email-verification') {
                throw new Error('Invalid verification token');
            }

            const users = await db.readDb('users');
            const user = Object.values(users.users).find(u => u.id === decoded.userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Atualizar status do usuário
            user.status = 'active';
            user.verified = true;
            user.verifiedAt = new Date().toISOString();

            await db.writeDb('users', users);
            await logger.info('Email verified', { userId: decoded.userId });

            return true;
        } catch (error) {
            await logger.error('Email verification failed', { error: error.message });
            throw error;
        }
    }

    async login(email, password) {
        try {
            const users = await db.readDb('users');
            const user = users.users[email];

            if (!user) {
                throw new Error('User not found');
            }

            // Verificar email apenas se a verificação estiver habilitada
            if (EMAIL_VERIFICATION_ENABLED && user.status === 'pending_verification') {
                throw new Error('Please verify your email before logging in');
            }

            const isValid = await this.comparePassword(password, user.password);
            if (!isValid) {
                throw new Error('Invalid password');
            }

            // Gerar token
            const token = this.generateToken(user.id, user.role);

            // Log do login
            await logger.info('User logged in', { email });

            // Retornar usuário e token
            const { password: _, ...userWithoutPassword } = user;
            return {
                user: userWithoutPassword,
                token
            };
        } catch (error) {
            await logger.error('Login failed', { email, error: error.message });
            throw error;
        }
    }

    async validateToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    async checkPermission(userId, permission) {
        try {
            const users = await db.readDb('users');
            const user = Object.values(users.users).find(u => u.id === userId);
            
            if (!user) {
                throw new Error('User not found');
            }

            const roles = users.roles;
            const userRole = roles[user.role];

            if (!userRole) {
                throw new Error('Role not found');
            }

            return userRole.permissions.includes('*') || 
                   userRole.permissions.includes(permission);
        } catch (error) {
            await logger.error('Permission check failed', { userId, permission, error: error.message });
            throw error;
        }
    }
}

module.exports = new AuthService();
