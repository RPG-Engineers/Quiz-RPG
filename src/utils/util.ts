import { CardType } from "../components/CardResultado";
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

  // Converta o Map em um array de entradas
  const caracteristicasArray = Array.from(caracteristicaMap.entries());

  // Função para filtrar, ordenar e pegar os 3 principais para uma categoria específica
  const getTop3ByCategory = (tipo: TipoCaracteristica) => {
    const filtradoArray = caracteristicasArray.filter(([caracteristica, _]) => {
      return caracteristica.tipo === tipo;
    });
    const ordenadoArray = filtradoArray.sort(([_objA, pontuacaoA], [_objB, pontuacaoB]) => pontuacaoB - pontuacaoA);
    return ordenadoArray.slice(0, 3);
  };

  // Obter os 3 principais resultados para cada categoria
  const TopClasse = getTop3ByCategory(TipoCaracteristica.CLASSE);
  const TopRaca = getTop3ByCategory(TipoCaracteristica.RACA);
  const TopBackground = getTop3ByCategory(TipoCaracteristica.BACKGROUND);

  return { TopClasse, TopRaca, TopBackground };
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

export const getCardType = (index: number): CardType => {
  switch (index) {
    case 0:
      return CardType.Gold;
    case 1:
      return CardType.Silver;
    case 2:
      return CardType.Bronze;
    default:
      return CardType.Bronze; // Default fallback
  }
}