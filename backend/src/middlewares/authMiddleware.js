import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config()

export const authenticateToken = (req, res, next) => {
    if (req.originalUrl.startsWith('/api/auth') || req.originalUrl.startsWith('/uploads')) {
        return next();
    }


    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            message: 'No token provided, authentication denied (error in authMiddleware)'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'Q1FA:m%t/]MD&ad#/dx%){!V7mP=tBrfX1$t1J8DU+:cz*1]txiuY4vuCdb!nzzD', {
        algorithms: ['HS256']
    }, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Token invalid or expired',
                error: err.message,
                details: {
                    name: err.name,
                    tokenExpired: err instanceof jwt.TokenExpiredError
                }
            });
        }

        req.user = decoded;
        next();
    });
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have the necessary permissions'
            });
        }

        next();
    };
};

export const protectRoute = [
    authenticateToken,
    (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Not authenticated'
            });
        }
        next();
    }
];
