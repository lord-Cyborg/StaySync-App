const authService = require('./auth');
const logger = require('../utils/logger');

const authMiddleware = {
    async authenticate(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const decoded = await authService.validateToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            await logger.error('Authentication failed', { error: error.message });
            res.status(401).json({ error: 'Invalid token' });
        }
    },

    requirePermission(permission) {
        return async (req, res, next) => {
            try {
                const hasPermission = await authService.checkPermission(req.user.userId, permission);
                
                if (!hasPermission) {
                    await logger.warning('Permission denied', { 
                        userId: req.user.userId, 
                        permission 
                    });
                    return res.status(403).json({ error: 'Permission denied' });
                }

                next();
            } catch (error) {
                await logger.error('Permission check failed', { error: error.message });
                res.status(500).json({ error: 'Internal server error' });
            }
        };
    }
};

module.exports = authMiddleware;
