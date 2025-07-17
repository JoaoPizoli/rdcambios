import express from 'express'
import { registrarCliente, listarClientes } from '../services/ClienteService.js'

const router = express.Router()

router.post('/registrar', async (req, res) =>{
    try {
        const dadosCliente = req.body
        const adminId = req.adminId
        const cliente = await registrarCliente(dadosCliente, adminId)
        res.status(201).json(cliente);
        console.log('Cliente registrado com sucesso!')
    } catch (error) {
        console.log(`Erro ao cadastrar cliente: ${error.message}`)
        res.status(401).json({message: `Não foi possível cadastrar um cliente: ${error.message}`})
    }
})


router.get('/listar', async (req, res) => {
    try {
        const adminId = req.adminId
        const listaClientes = await listarClientes(adminId)
        res.status(200).json(listaClientes)
        console.log('Clientes Listados com sucesso!')
    } catch (error) {
        console.log(`Erro ao listar clientes: ${error.message}`)
        res.status(500).json({message: `Erro ao listar clientes: ${error.message}`})
    }
})

export default router
