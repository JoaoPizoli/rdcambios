import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient()

async function criarTrocaOleo(dadosOleo){
    const { oleoDataTroca, oleoDataProximaTroca, kmTroca, KmProximaTroca, tipoOleo,  carroId } = dadosOleo
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
            kmTroca: kmTroca,
            KmProximaTroca: KmProximaTroca,
            tipoOleo: tipoOleo,
            status: status,
            carroId: carroId
        }
    })

    return { 
        trocaOleo: trocaOleo.oleoDataTroca, 
        oleoDataProximaTroca: trocaOleo.oleoDataProximaTroca,
        kmTroca:trocaOleo.kmTroca,
        KmProximaTroca: trocaOleo.KmProximaTroca,
        tipoOleo: trocaOleo.tipoOleo,
        status: trocaOleo.status
     }

}


async function listarTrocas(dados){
    const { carroId } = dados
    const carro = await prisma.carro.findFirst({
        where:{
            id: carroId
        }
    })
    if (!carro) {
        throw new Error('Carro não encontrado ou não pertence a este cliente!')
    } else {
        console.log(carro)
        const idCarroCliente = carro.id
        const troca = await prisma.TrocaOleo.findMany({
        where:{
            carroId: idCarroCliente,
        }
    })
    return troca
    }
}


async function deleteTrocaOleo(idTrocaOleo){
    const { id } = idTrocaOleo
    const deleteTrocaOleo = await prisma.TrocaOleo.delete({
        where:{
            id: id
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
    const { oleoDataTroca, oleoDataProximaTroca, kmTroca, KmProximaTroca, tipoOleo, idCarro } = dadosUpdate ?? {}
    const trocasAtivas = await listarTrocaOleoAtivas(idCarro)
    if (!trocasAtivas) {
    console.log('Não há troca de óleo ativa para esse carro.');
    return null;
     }
    const { id } = trocasAtivas
    const dados = {}
    if( oleoDataTroca !== undefined) dados.oleoDataTroca = oleoDataTroca
    if( oleoDataProximaTroca !== undefined) dados.oleoDataProximaTroca = oleoDataProximaTroca
    if( kmTroca !== undefined) dados.kmTroca = kmTroca
    if( KmProximaTroca !== undefined) dados.KmProximaTroca = KmProximaTroca
    if( tipoOleo !== undefined) dados.tipoOleo = tipoOleo
    const updateTroca = await prisma.TrocaOleo.update({
        where: {
            id: id
        },
        data: dados  
    })
    return updateTroca
}

export { criarTrocaOleo, deleteTrocaOleo, statusTrocaOleo, updateTrocaOleo, listarTrocas}
