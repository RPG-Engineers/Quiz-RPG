import { Caracteristica, CaracteristicaTag, CaracteristicaWithTags, TipoCaracteristica } from "../types";
import { db } from "./db";
import { getTagsByCaracteristicaId } from "./tag";

/**
 * Adiciona uma característica ao banco de dados e retorna
 * o id da característica adicionada
 *
 * @param {Caracteristica} caracteristica  Característica a ser adicionada
 */
export async function addCaracteristica(caracteristica: Caracteristica): Promise<number> {
  await db.caracteristica.add(caracteristica);
  if (caracteristica.id_caracteristica !== undefined) {
    return caracteristica.id_caracteristica;
  } else {
    throw new Error("ID da característica não foi definido.");
  }
}

/**
 * Associa as tags à característica
 *
 * @param {number} id Id da característica
 * @param {Set<number>} tagsIds Ids das tags a serem associadas
 */
export async function associateCaracteristicaToTags(id: number, tagsIds: Set<number>) {
  const tagsIdsArray = Array.from(tagsIds);
  try {
    await db.transaction("rw", db.caracteristica_tag, async () => {
      const entries: CaracteristicaTag[] = tagsIdsArray.map((tagId) => ({
        id_caracteristica: id,
        id_tag: tagId,
      }));
      await db.caracteristica_tag.bulkAdd(entries);
    });
  } catch (error) {
    console.error("Erro ao associar características com tags:", error);
    throw error;
  }
}

/**
 * Obtém todas as características do banco de dados e associa as tags a cada uma delas
 */
export async function getCaracteristicas(): Promise<CaracteristicaWithTags[]> {
  // Obtém as características
  const caracteristicas = await db.caracteristica.toArray();

  // Para cada característica obtém suas tags e associa
  return await associateTagsToCaracteristicas(caracteristicas);
}

/**
 * Obtém todas as características de um tipo do banco de dados
 */
export async function getCaracteristicasByTipo(tipo: TipoCaracteristica): Promise<CaracteristicaWithTags[]> {
  // Obtém as características do tipo
  const caracteristicas = await db.caracteristica.where("tipo").equals(tipo).toArray();

  // Para cada característica obtém suas tags e associa
  return await associateTagsToCaracteristicas(caracteristicas);
}

/**
 * Obtém uma característica do banco de dados
 *
 * @param {number} id Id da característica a ser obtida
 */
export async function getCaracteristicaById(id: number): Promise<Caracteristica> {
  const caracteristica = await db.caracteristica.get(id);
  if (caracteristica === undefined || caracteristica === null) {
    throw new Error("Caracteristica não encontrada");
  }
  return caracteristica;
}

/**
 * Filtra as características com base em um termo
 * ela filtra tanto por nome da característica
 * quanto por nome da tag
 *
 * @param {string} termo Termo a ser pesquisado
 */
export async function filtrarCaracteristicas(termo: string): Promise<CaracteristicaWithTags[]> {
  try {
    // Buscar IDs das tags que correspondem ao termo
    const tagIds = await db.tag.where("nome").startsWithIgnoreCase(termo).primaryKeys();

    // Buscar IDs das características associadas às tags encontradas
    const caracteristicasPorTagsIds =
      tagIds.length > 0 ? await db.caracteristica_tag.where("id_tag").anyOf(tagIds).toArray() : [];

    const idsPorTags = caracteristicasPorTagsIds.map((item) => item.id_caracteristica);

    // Buscar características pelo nome das características ou pelo nome das tags
    const caracteristicasPorNome = await db.caracteristica.where("nome").startsWithIgnoreCase(termo).toArray();

    const caracteristicasPorTags =
      idsPorTags.length > 0 ? await db.caracteristica.where("id_caracteristica").anyOf(idsPorTags).toArray() : [];

    // Combina e remove os duplicados
    const todasCaracteristicas = [...caracteristicasPorNome, ...caracteristicasPorTags];
    const resultado = Array.from(new Set(todasCaracteristicas.map((c) => c.id_caracteristica))).map(
      (id) => todasCaracteristicas.find((c) => c.id_caracteristica === id) as Caracteristica
    );

    // Para cada característica obtém suas tags e associa
    return await associateTagsToCaracteristicas(resultado);
  } catch (error) {
    console.error("Erro ao filtrar características:", error);
    throw error;
  }
}

/**
 * Atualiza uma característica do banco de dados
 *
 * @param {number} id Id da característica a ser atualizada
 * @param {Caracteristica} updatedCaracteristica Característica atualizada
 */
export async function updateCaracteristica(id: number, updatedCaracteristica: Caracteristica) {
  await db.caracteristica.update(id, updatedCaracteristica);
}

/**
 * Atualiza a associação de tags a uma característica
 *
 * @param {number} id Id da característica
 * @param {Set<number>} tagsIds Ids das tags a serem associadas
 */
export async function updateAssociationCaracteristicaToTags(id: number, tagsIds: Set<number>) {
  try {
    await db.transaction("rw", db.caracteristica_tag, async () => {
      // Obtenha as associações existentes para a característica
      const existingAssociations = await db.caracteristica_tag.where("id_caracteristica").equals(id).toArray();

      // Determine as associações a adicionar e remover
      const currentTagIdsSet = new Set(existingAssociations.map((entry) => entry.id_tag));
      const tagsToAdd = Array.from(tagsIds).filter((tagId) => !currentTagIdsSet.has(tagId));
      const tagsToRemove = existingAssociations
        .filter((entry) => !tagsIds.has(entry.id_tag))
        .map((entry) => entry.id_tag);

      // Adicione novas associações
      const newAssociations: CaracteristicaTag[] = tagsToAdd.map((tagId) => ({
        id_caracteristica: id,
        id_tag: tagId,
      }));
      if (newAssociations.length > 0) {
        await db.caracteristica_tag.bulkAdd(newAssociations);
      }

      // Remova associações antigas
      if (tagsToRemove.length > 0) {
        await db.caracteristica_tag
          .where("id_caracteristica")
          .equals(id)
          .and((entry) => tagsToRemove.includes(entry.id_tag))
          .delete();
      }
    });
  } catch (error) {
    console.error("Erro ao atualizar associações de características com tags:", error);
    throw error;
  }
}

/**
 * Deleta uma característica do banco de dados
 *
 * @param {number} id Id da característica a ser deletada
 */
export async function deleteCaracteristica(id: number) {
  await db.transaction("rw", db.caracteristica, db.caracteristica_tag, async () => {
    await db.caracteristica.delete(id);
    await db.caracteristica_tag.where("id_caracteristica").equals(id).delete();
  });
}

// === Funções Auxiliares ===

/**
 * Associa as tags respectivas de cada característica criando um objeto
 * CaracteristicaWithTags e o retorna
 *
 * @param {Caracteristica[]} caracteristicas
 */
async function associateTagsToCaracteristicas(caracteristicas: Caracteristica[]): Promise<CaracteristicaWithTags[]> {
  return await Promise.all(
    caracteristicas.map(async (caracteristica) => {
      // Obtém as tags da cada característica
      const tagsCaracteristica = await getTagsByCaracteristicaId(caracteristica.id_caracteristica!);

      // Associa as tags no objeto
      const caracteristicaWithTags: CaracteristicaWithTags = {
        ...caracteristica,
        tags: tagsCaracteristica,
      };

      return caracteristicaWithTags;
    })
  );
}
