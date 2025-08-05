import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient()

async function criarTrocaOleo(dadosOleo){
    const { oleoDataTroca, oleoDataProximaTroca, carroId } = dadosOleo
    const status = true
    const carro = await prisma.carro.findFirst({
        where: {
            id: carroId
        }
    })

    if (!carro) {
        throw new Error('Carro não encontrado ou não pertence a este cliente!')
    }

    const trocaOleo = await prisma.TrocaOleo.create({
        data: {
            oleoDataTroca: oleoDataTroca,
            oleoDataProximaTroca: oleoDataProximaTroca,
            status: status,
            carroId: carroId
        }
    })

    return { trocaOleo: trocaOleo.oleoDataTroca, oleoDataProximaTroca: trocaOleo.oleoDataProximaTroca, status: trocaOleo.status }

}


async function listarTrocaOleoAtivas(idCarro){
    const carro = await prisma.carro.findFirst({
        where:{
            id: idCarro
        }
    })
    if (!carro) {
        throw new Error('Carro não encontrado ou não pertence a este cliente!')
    }
    const troca = await prisma.TrocaOleo.findFirst({
        where:{
            carroId: idCarro,
            status: true
        }
    })
    return troca
}


async function deleteTrocaOleo(idTrocaOleo){
    const trocaOleoId = idTrocaOleo
    const deleteTrocaOleo = await prisma.TrocaOleo.delete({
        where:{
            id: trocaOleoId
        }
    })
    return deleteTrocaOleo
}


async function statusTrocaOleo(idCarro) {
  const trocaAtiva = await listarTrocaOleoAtivas(idCarro);
  if (!trocaAtiva) {
    console.log('Não há troca de óleo ativa para esse carro.');
    return null;
  }

  const { id, oleoDataProximaTroca } = trocaAtiva;

  const proxima = new Date(oleoDataProximaTroca);
  const agora = new Date();

  proxima.setHours(0, 0, 0, 0);
  agora.setHours(0, 0, 0, 0);

  if (proxima <= agora) {
    try {
      const update = await prisma.trocaOleo.update({
        where: { id },
        data: { status: false },
      });
      return update;
    } catch (error) {
      console.error(`Erro ao atualizar status da troca de óleo: ${error.message}`);
      throw error;
    }
  } else {
    console.log('Ainda não chegou a data da troca de óleo!');
    return null;
  }
}


async function updateTrocaOleo(dadosUpdate){
    const { oleoDataTroca, oleoDataProximaTroca, idCarro } = dadosUpdate ?? {}
    const trocasAtivas = await listarTrocaOleoAtivas(idCarro)
    if (!trocasAtivas) {
    console.log('Não há troca de óleo ativa para esse carro.');
    return null;
     }
    const { id } = trocasAtivas
    const dados = {}
    if( oleoDataTroca !== undefined) dados.oleoDataTroca = oleoDataTroca
    if( oleoDataProximaTroca !== undefined) dados.oleoDataProximaTroca = oleoDataProximaTroca
    const updateTroca = await prisma.TrocaOleo.update({
        where: {
            id: id
        },
        data: dados  
    })
    return updateTroca
}

export { criarTrocaOleo, listarTrocaOleoAtivas, deleteTrocaOleo, statusTrocaOleo, updateTrocaOleo }