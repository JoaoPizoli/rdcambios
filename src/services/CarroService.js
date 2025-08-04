import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();


async function cadastrarCarro(dadosCarro, idAdmin){
    const {placa, modelo, clienteId} = dadosCarro
    const adminId = idAdmin

    const cliente = await prisma.cliente.findFirst({
        where: {
            id: clienteId,
            adminId: adminId
        }
    })

    if (!cliente) {
        throw new Error('Cliente não encontrado ou não pertence a este admin')
    }
    
    const carro = await prisma.carro.create({
        data: {
            placa: placa,
            modelo: modelo,
            clienteId: clienteId
        }
    })

    return { placa: carro.placa, modelo: carro.modelo}
}


async function listarCarrosClientes(dadosCliente, idAdmin){
    const { clienteId }  = dadosCliente
    const adminId = idAdmin
    const cliente = await prisma.cliente.findFirst({
    where: {
        id: clienteId,
        adminId: adminId
      }
    })

    if (!cliente) {
    throw new Error('Cliente não encontrado ou não pertence a este admin')
    }

    const carros = await prisma.carro.findMany({
    where: {
        clienteId: clienteId
    },
    include: {
        cliente: {
            select: {
                nome: true,
                email: true
            }
        }
     }
    })

    return carros
}


export { cadastrarCarro, listarCarrosClientes }
