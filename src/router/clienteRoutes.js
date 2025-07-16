import { PrismaClient } from '../generated/prisma/index.js';
import express from 'express'

const prisma = new PrismaClient()
const router = express.Router()

router.post('/registrar', async (req, res) =>{
    try {
        const { nome, email, telefone } = req.body
        const adminId = req.userId 
        
        const cliente = await prisma.cliente.create({
            data: {
                nome: nome,
                email: email,
                telefone: telefone,
                adminId: adminId 
            }
        })

             if(!cliente){
                return res.status(400).json({message: 'Não foi possivel cadastrar o cliete!'})
             }
             console.log('Cliente Cadastrado com Sucesso!')
             res.status(201).json({message: 'Cliente cadastrado com Sucesso!'})

    } catch (error) {
        console.log(`Erro ao cadastrar cliente: ${error.message}`)
        res.status(401).json({message: `Não foi possível cadastrar um cliente: ${error.message}`})
        
    }
})



export default router
