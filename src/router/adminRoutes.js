import { PrismaClient } from '../generated/prisma/index.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email e senha são obrigatórios." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newAdmin = await prisma.admin.create({
            data: {
                email: email,
                password: hashPassword
            }
        });

        res.status(201).json({ email: newAdmin.email });
        console.log('Admin Criado com Sucesso!');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Erro no Servidor: ${error.message}` });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await prisma.admin.findUnique({
            where: { email: email }
        });

        
        if (!admin) {
            return res.status(404).json({ message: 'Credenciais inválidas' }); 
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' }); 
        }

        const token = jwt.sign(
            { id: admin.id },
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({ token });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

export default router;
