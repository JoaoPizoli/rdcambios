import express from 'express'

import { criarTrocaOleo, listarTrocaOleoAtivas, deleteTrocaOleo, statusTrocaOleo, updateTrocaOleo, listarTrocasCliente } from '../services/TrocarOleoService.js'

const router = express.Router()

router.post('/registrar', async (req, res) =>{
    try {
        const dadosOleo = req.body
        const criarTroca = await criarTrocaOleo(dadosOleo)
        res.status(201).json(criarTroca)
        console.log('Troca de Óleo registrada com sucesso!')
    } catch (error) {
        console.log(`Erro ao cadastrar troca de óleo: ${error.message}`)
        res.status(401).json({message: `Não foi possível cadastrar a troca de óleo: ${error.message}`})
    }
})

router.post('/listarAtivo', async (req,res) =>{
    try {
        const carroId  = req.body
        const trocas = await listarTrocaOleoAtivas(carroId)
        res.status(200).json(trocas)
        console.log('Trocas listadas com Sucesso!')
    } catch (error) {
        console.log(`Erro ao listar as trocas de óleo: ${error.message}`)
        res.status(500).json({message: `Erro ao listar as trocas de óleo: ${error.message}`})
    }
})

router.delete('/deletar', async (req,res)=>{
    try {
        const idOleo = req.body
        const deletarTroca = await deleteTrocaOleo(idOleo)
        res.status(204).json(deletarTroca)
        console.log('Troca de óleo deletada com Sucesso!')
    } catch (error) {
        console.log(`Errp ap deletar a troca de óleo: ${error.message}`)
        res.status(500).json({message: `Erro ao deletar a troca de óleo: ${error.message}`})
    }
})

router.patch('/verificarStatus', async (req,res)=>{
    try {
        const carroId = req.body
        const trocaStatus = await statusTrocaOleo(carroId)
        res.status(200).json(trocaStatus)
        console.log('Status da troca de óleo alterado para Falso!')
    } catch (error) {
        res.status(500).json({message: `Erro ao alterar o status da troca de óleo: ${error.message}`})
    }
})

router.patch('/update', async (req,res)=>{
    try {
        const dadosUpdate = req.body
        const update = await updateTrocaOleo(dadosUpdate)
        res.status(200).json(update)
        console.log('Data(s) da troca de óleo atualizadas com sucesso!')
    } catch (error) {
        res.status(500).json({message: `Erro ao atualizar os dados da troca de óleo: ${error.message}`})
        console.log(`Erro ao fazer o update da troca de óleo: ${error.message}`)
    }
})


router.post('/listar', async(req,res)=>{
    try {
        const clienteId = req.body
        const lista = await listarTrocasCliente(clienteId)
        res.status(200).json(lista)
    } catch (error) {
        console.log(`Erro ao listar as trocas disponíveis para o Cliente: ${error.message} `)
        res.status(500).json({message:`Erro ao listar as trocas disponíveis para o Cliente: ${error.message}`})
    }
})


export default router
