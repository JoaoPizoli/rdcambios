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


async function findClienteById(idCliente){
    const clienteId = idCliente
    const cliente = await prisma.cliente.findFirst({
        where:{
            id: clienteId
        }
    })

    return cliente
}


async function deleteCliente(idCliente){
    const clienteId = idCliente
    const clienteDeletado = await prisma.cliente.delete({
        where:{
            id: clienteId
        }
    })

    return clienteDeletado
}


async function updateCliente(dadosUpdate){
    const { nome, email, telefone, idCliente } = dadosUpdate ?? {}
    const dados = {}
    if (nome !== undefined) dados.nome = nome;
    if (email !== undefined) dados.email = email;
    if (telefone !== undefined) dados.telefone = telefone;
    const cliente = await findClienteById(idCliente)
    if(!cliente){
        console.log('Cliente não encontrado!')
        return null
    }
    const { id } = cliente
    const clienteUpdate = await prisma.cliente.update({
        where:{
            id:id
        },
        data: dados
    })
    return clienteUpdate
}


export { registrarCliente, listarClientes, deleteCliente, updateCliente }
