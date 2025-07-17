import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient()

async function registrarCliente(dadosCliente, idAdmin){
    const { nome, email, telefone } = dadosCliente
    const adminId = idAdmin

    const cliente = await prisma.cliente.create({
        data: {
            nome: nome,
            email: email,
            telefone: telefone,
            adminId: adminId
        }
    })
    if(!cliente){
        throw new Error('Não foi possivel cadastrar o cliete!')
    }

    return cliente
}

async function listarClientes(idAdmin){
    const adminId = idAdmin

    const listaClientes = await prisma.cliente.findMany({
        where: {
            adminId: adminId
        },
        select: {
            id: true,
            nome: true,
            email: true,
            telefone: true
        }
    })

    return listaClientes
}

export { registrarCliente, listarClientes }
