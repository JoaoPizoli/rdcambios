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

export { registrarAdmin, loginAdmin };
