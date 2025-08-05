import { cadastrarCarro, listarCarrosClientes, deleteCarro, updateCarro } from '../services/CarroService.js';
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
router.post('/cliente', async (req, res) => {
    try {
        const clienteId = req.body
        const adminId = req.adminId
        const listaCarros = await listarCarrosClientes(clienteId, adminId)
        res.status(201).json(listaCarros)
    } catch (error) {
        console.log(`Erro ao listar carros: ${error.message}`)
        res.status(500).json({message: `Erro ao listar carros: ${error.message}`})
    }
})

router.delete('/deletar', async (req,res)=>{
    try {
        const carroId = req.body
        const carroDeletado = await deleteCarro(carroId)
        res.status(204).json(carroDeletado)
        console.log('Carro deletado com sucesso!')
    } catch (error) {
        res.status(500).json({message: `Erro ao deletar carro: ${error.message}`})
        console.log(`Erro ao deletar carro: ${error.message}`)
    }
})

router.patch('/uptade', async(req,res)=>{
    try {
        const dadosCarro = req.body
        const carroUpdate = await updateCarro(dadosCarro)
        res.status(200).json(carroUpdate)
        console.log('Dados do Carro atualizado com sucesso!')
    } catch (error) {
        res.status(500).json({message: `Erro ao alterar os dados do carro: ${error.message}`})
        console.log(`Erro ao atualizar os dados do carro: ${error.message}`)
    }
})

export default router
