import { getAlternativasByPerguntaId } from "../database/alternativa";
import { getCaracteristicas } from "../database/caracteristica";
import { CaracteristicaWithTags, TipoCaracteristica } from "../types";

export function getTipo(tipo: TipoCaracteristica) {
  switch (tipo) {
    case TipoCaracteristica.CLASSE:
      return "classe";
      break;
    case TipoCaracteristica.BACKGROUND:
      return "background";
      break;
    case TipoCaracteristica.RACA:
      return "raça";
      break;
  }
}

export async function calcularResultado(resultsMap: Map<number, number>) {
  // Calcula a pontuação de cada tag
  const tagsMap: Map<number, number> = await calculateTagPontuation(resultsMap);

  // Calcula a pontuação de cada característica
  const caracteristicaMap: Map<CaracteristicaWithTags, number> = await calculateCaracteristicaPontuation(tagsMap);

  // Converte o Map em um array de entradas e ordena pelo valor da pontuação (decrescente)
  const resultado = Array.from(caracteristicaMap.entries()).sort(
    ([_objA, pontuacaoA], [_objB, pontuacaoB]) => pontuacaoB - pontuacaoA
  );

  return resultado;
}


async function calculateTagPontuation(resultsMap: Map<number, number>) {
  const tagsMap: Map<number, number> = new Map();
  const perguntaIds = Array.from(resultsMap.keys());

  // Consulta todas as alternativas para as perguntas de uma vez
  const alternativasPromises = perguntaIds.map((id) => getAlternativasByPerguntaId(id));
  const alternativasResults = await Promise.all(alternativasPromises);

  // Processa cada alternativa
  for (const [perguntaId, alternativaId] of resultsMap) {
    const alternativas = alternativasResults[perguntaIds.indexOf(perguntaId)];

    // Encontra a alternativa selecionada
    const alternativa = alternativas.find((alt) => alt.id_alternativa === alternativaId);

    if (alternativa) {
      // Contabiliza a pontuação
      for (const tagId of alternativa.tagsIds) {
        tagsMap.set(tagId, (tagsMap.get(tagId) || 0) + 1);
      }
    }
  }

  return tagsMap;
}

async function calculateCaracteristicaPontuation(tagsMap: Map<number, number>) {
  const caracteristicaMap: Map<CaracteristicaWithTags, number> = new Map();
  const caracteristicas = await getCaracteristicas();
  for (const caracteristica of caracteristicas) {
    const tagIds = new Set(caracteristica.tags.map((tag) => tag.id_tag!));

    // Calcula a pontuação da característica com base nas tags
    let pontuacao = 0;
    for (const [tagId, quantidade] of tagsMap) {
      if (tagIds.has(tagId)) {
        pontuacao += quantidade;
      }
    }

    // Armazena a pontuação da característica no mapa
    caracteristicaMap.set(caracteristica, pontuacao);
  }

  return caracteristicaMap;
}