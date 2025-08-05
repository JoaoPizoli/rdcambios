import express from 'express'
import { registrarCliente, listarClientes, deleteCliente, updateCliente } from '../services/ClienteService.js'

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

router.delete('/deletar', async (req,res)=>{
    try {
        const idCliente = req.body
        const clienteDeletado = await deleteCliente(idCliente)
        res.status(204).json(clienteDeletado)
        console.log('Cliente deletado com sucesso!')
    } catch (error) {
        res.status(500).json({message: `Erro ao deletar cliente: ${error.message}`})
        console.log(`Erro ao deletar cliente: ${error.message}`)
        }
})

router.patch('/update', async (req,res)=>{
    try {
        const dadosUpdate = req.body
        const clienteUpdated = await updateCliente(dadosUpdate)
        res.status(200).json(clienteUpdated)
        console.log('Dados do cliente alerados com sucesso!')
    } catch (error) {
        res.status(500).json({message: `Erro ao alterar os dados do cliente: ${error.message}`})
        console.log(`Erro ao alterar os dados do cliente: ${error.message}`)
    }
})

export default router
