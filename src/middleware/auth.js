import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ message: 'Erro no formato do token.' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: 'Token mal formatado.' });
    }
    
    try {
        // Verificar se o token está na blacklist
        const blacklistedToken = await prisma.tokenBlacklist.findUnique({
            where: { token }
        });

        if (blacklistedToken) {
            return res.status(401).json({ message: 'Token foi invalidado. Faça login novamente.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.adminId = decoded.id; 
        
        return next();

    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

export default auth;
