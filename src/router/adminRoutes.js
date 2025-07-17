import express from 'express';
import { registrarAdmin, loginAdmin } from '../services/AdminService.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const adminCriado = await registrarAdmin(req.body);
        res.status(201).json(adminCriado);
        console.log('Admin Criado com Sucesso!');
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: `Erro ao criar Admin: ${error.message}` });
    }
});

router.post('/login', async (req, res) => {
    try {
        const resultado = await loginAdmin(req.body);
        res.status(200).json({ token: resultado.token });
    } catch (error) {
        console.error("Erro no login:", error)
        if (error.message === "Email e senha são obrigatórios.") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Credenciais inválidas") {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

export default router;
