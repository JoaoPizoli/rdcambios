import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function registrarAdmin(dadosAdmin) {
    const { email, password } = dadosAdmin;

    if (!email || !password) {
        throw new Error("Email e senha são obrigatórios.");
    }
    const adminExistente = await prisma.admin.findUnique({
        where: { email: email }
    });

    if (adminExistente) {
        throw new Error("Admin com este email já existe.");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newAdmin = await prisma.admin.create({
        data: {
            email: email,
            password: hashPassword
        }
    });
    return { email: newAdmin.email, id: newAdmin.id };
}

async function loginAdmin(credenciais) {
    const { email, password } = credenciais;

    if (!email || !password) {
        throw new Error("Email e senha são obrigatórios.");
    }

    const admin = await prisma.admin.findUnique({
        where: { email: email }
    });

    if (!admin) {
        throw new Error("Credenciais inválidas");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
        { id: admin.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { token, adminId: admin.id };
}

async function logoutAdmin(token) {
    try {
        // Decodificar o token para obter a data de expiração
        const decoded = jwt.decode(token);
        
        if (!decoded) {
            throw new Error("Token inválido");
        }

        // Converter timestamp para Date
        const expiresAt = new Date(decoded.exp * 1000);

        // Adicionar token à blacklist
        await prisma.tokenBlacklist.create({
            data: {
                token: token,
                expiresAt: expiresAt
            }
        });

        return { message: "Logout realizado com sucesso" };
    } catch (error) {
        throw new Error("Erro ao realizar logout: " + error.message);
    }
}

async function clearExpiredTokens() {
    try {
        const now = new Date();
        const result = await prisma.tokenBlacklist.deleteMany({
            where: {
                expiresAt: {
                    lt: now
                }
            }
        });
        console.log(`${result.count} tokens expirados removidos da blacklist`);
        return result;
    } catch (error) {
        console.error("Erro ao limpar tokens expirados:", error);
    }
}

export { registrarAdmin, loginAdmin, logoutAdmin, clearExpiredTokens };
