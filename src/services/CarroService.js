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

async function deleteCarro(idCarro){
    const carroId = idCarro
    const carroDeletado = await prisma.carro.delete({
        where:{
            id: carroId
        }
    })
    return carroDeletado
}

async function updateCarro(dadosCarro){
    const { placa, modelo, id } = dadosCarro ?? {}
    const dados = {}
    if(placa !== undefined) dados.placa = placa
    if(modelo!== undefined) dados.modelo = modelo
    const updateCarro = await prisma.carro.update({
        where:{
            id: id
        },
        data: dados
    })
    return updateCarro    
}

export { cadastrarCarro, listarCarrosClientes, deleteCarro, updateCarro }
