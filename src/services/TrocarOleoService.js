import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient()

async function criarTrocaOleo(dadosOleo, carroId){
    const { oleoDataTroca, oleoDataProximaTroca } = dadosOleo
    const idCarro = carroId

    const carro = await prisma.carro.findFirst({
        where: {
            id: idCarro
        }
    })

    if (!carro) {
        throw new Error('Carro não encontrado ou não pertence a este cliente!')
    }

    const trocaOleo = await prisma.TrocaOleo.create({
        data: {
            oleoDataTroca: oleoDataTroca,
            oleoDataProximaTroca: oleoDataProximaTroca,
            status: True
        }
    })

    return { trocaOleo: trocaOleo.oleoDataTroca, oleoDataProximaTroca: trocaOleo.oleoDataProximaTroca, status: trocaOleo.status }

}


async function listarTrocaOleoAtivas(carroId){
    const idCarro = carroId
    const carro = await prisma.carro.findFirst({
        where:{
            id: idCarro
        }
    })
    if (!carro) {
        throw new Error('Carro não encontrado ou não pertence a este cliente!')
    }
    const troca = await prisma.TrocaOleo.findMany({
        where:{
            carroId: idCarro,
            status: True
        }
    })
    return troca
}

export { criarTrocaOleo, listarTrocaOleoAtivas }