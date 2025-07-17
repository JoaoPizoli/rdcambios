import { cadastrarCarro, listarCarrosClientes } from '../services/CarroService.js';
import express from 'express'

const router = express.Router()

router.post('/cadastrar', async (req,res)=>{
    try {
        const dadosCarro = req.body
        const adminId = req.body.adminId
        const carroCadastrado = await cadastrarCarro(dadosCarro, adminId)
        res.status(201).json(carroCadastrado);
        console.log('Carro cadastrado com Sucesso!');
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: `Erro ao cadastrar o carro: ${error.message}` });
    }
})


//Lista os carros registrados ao cliente
router.get('/cliente/:clienteId', async (req, res) => {
    try {
        const clienteId = req.params.clienteId
        const adminId = req.adminId
        const listaCarros = await listarCarrosClientes(clienteId, adminId)
        res.status(201).json(listaCarros)
    } catch (error) {
        console.log(`Erro ao listar carros: ${error.message}`)
        res.status(500).json({message: `Erro ao listar carros: ${error.message}`})
    }
})

export default router
