import express from 'express'

import { criarTrocaOleo, listarTrocaOleoAtivas } from '../services/TrocarOleoService.js'

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

router.get('/listar', async (req,res) =>{
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


export default router
