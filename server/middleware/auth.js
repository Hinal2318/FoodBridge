const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * authenticate
 * ─────────────
 * Verifies the Bearer JWT from the Authorization header.
 * On success → attaches the full User document to req.user and calls next().
 * On failure → responds with 401 so the Angular authInterceptor redirects to /login.
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Throws if expired or invalid signature
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch fresh user from DB so we always have up-to-date role/data
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        req.user = user;   // available as req.user in every protected route
        next();
    } catch (err) {
        // jwt.verify throws 'TokenExpiredError' or 'JsonWebTokenError'
        const message = err.name === 'TokenExpiredError'
            ? 'Token expired — please log in again'
            : 'Invalid token';
        return res.status(401).json({ message });
    }
};

/**
 * requireRole(...roles)
 * ──────────────────────
 * Role-based access control factory.
 * Usage:  router.get('/route', authenticate, requireRole('restaurant'), handler)
 *         router.get('/route', authenticate, requireRole('ngo', 'restaurant'), handler)
 *
 * Must be used AFTER authenticate (relies on req.user being set).
 */
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        // Shouldn't happen if middleware order is correct, but guard anyway
        return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            message: `Access denied — requires role: ${roles.join(' or ')}`
        });
    }

    next();
};

module.exports = { authenticate, requireRole };
