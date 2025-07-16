import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = decoded.id; 
        
        return next();

    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

export default auth;
