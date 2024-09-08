import { Caracteristica, TipoCaracteristica } from "../types";
import { db } from "./db";

// === CRUD Caracteristica ===
/**
 * Adiciona uma pergunta ao banco de dados
 *
 * @param {Caracteristica} caracteristica Característica a ser adicionada
 */

export const addCaracteristica = async (caracteristica: Caracteristica) => {
  await db.caracteristica.add(caracteristica);
  return caracteristica.id_caracteristica ?? -1;
};
/**
 * Obtém todas as características do banco de dados
 *
 */

export const getCaracteristicas = async (): Promise<Caracteristica[]> => {
  return await db.caracteristica.toArray();
};
/**
 * Obtém todas as características de um tipo banco de dados
 *
 */

export const getCaracteristicasByTipo = async (tipo: TipoCaracteristica): Promise<Caracteristica[]> => {
  return await db.caracteristica.where("tipo").equals(tipo).toArray();
};
/**
 * Obtém uma característica do banco de dados
 *
 * @param {number} id Id da característica a ser obtida
 */

export const getCaracteristicaById = async (id: number): Promise<Caracteristica> => {
  const caracteristica = await db.caracteristica.get(id);
  if (typeof caracteristica === "undefined") {
    throw new Error("Caracteristica não encontrada");
  }
  return caracteristica;
};
/**
 * Atualiza uma característica do banco de dados
 *
 * @param {number} id Id da característica a ser atualizada
 * @param {Caracteristica} updated_caracteristica Característica atualizada
 */

export const updateCaracteristica = async (id: number, updated_caracteristica: Caracteristica) => {
  await db.caracteristica.update(id, updated_caracteristica);
};
/**
 * Associa as tags à característica
 *
 * @param {number} id Id da característica
 * @param {number[]} tag_ids Ids das tags a serem associadas
 */

export const associateCaracteristicaToTags = async (id: number, tag_ids: number[]) => {
  try {
    await db.transaction("rw", db.caracteristica_tag, async () => {
      const entries = tag_ids.map((tag_id) => ({
        id_caracteristica: id,
        id_tag: tag_id,
      }));
      await db.caracteristica_tag.bulkAdd(entries);
    });
  } catch (error) {
    console.error("Erro ao associar características com tags:", error);
  }
};
/**
 * Atualiza a associação de tags a uma característica
 *
 * @param {number} id Id da característica
 * @param {number[]} tag_ids Ids das tags a serem associadas
 */

export const updateAssociationCaracteristicaToTags = async (id: number, tag_ids: number[]) => {
  try {
    await db.transaction("rw", db.caracteristica_tag, async () => {
      // Obtenha as associações existentes para a característica
      const existingAssociations = await db.caracteristica_tag.where("id_caracteristica").equals(id).toArray();

      // Crie um Set com IDs fornecidos para facilitar a verificação
      const tagIdsSet = new Set(tag_ids);

      // Determine as associações a adicionar e remover
      const currentTagIdsSet = new Set(existingAssociations.map((entry) => entry.id_tag));
      const tagsToAdd = tag_ids.filter((tag_id) => !currentTagIdsSet.has(tag_id));
      const tagsToRemove = existingAssociations
        .filter((entry) => !tagIdsSet.has(entry.id_tag))
        .map((entry) => entry.id_tag);

      // Adicione novas associações
      const newAssociations = tagsToAdd.map((tag_id) => ({
        id_caracteristica: id,
        id_tag: tag_id,
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
  }
};

/**
 * Deleta uma característica do banco de dados
 *
 * @param {number} id Id da característica a ser deletada
 */

export const deleteCaracteristica = async (id: number) => {
  await db.transaction("rw", db.caracteristica, db.caracteristica_tag, async () => {
    await db.caracteristica.delete(id);
    await db.caracteristica_tag.where("id_caracteristica").equals(id).delete();
  });
};
/**
 * Filtra as características com base em um termo
 * ela filtra tanto por nome da característica
 * quanto por nome da tag
 *
 * @param {string} termo Termo a ser pesquisado
 */

export const filtrarCaracteristicas = async (termo: string): Promise<Caracteristica[]> => {
  try {
    // Buscar IDs das tags que correspondem ao termo
    const tagIds = await db.tag.where("nome").startsWithIgnoreCase(termo).primaryKeys();

    // Buscar IDs das características associadas às tags encontradas
    const caracteristicasPorTagsIds = tagIds.length > 0 ? await db.caracteristica_tag.where("id_tag").anyOf(tagIds).toArray() : [];

    const idsPorTags = caracteristicasPorTagsIds.map((item) => item.id_caracteristica);

    // Buscar características pelo nome das características ou pelo nome das tags
    const caracteristicasPorNome = await db.caracteristica.where("nome").startsWithIgnoreCase(termo).toArray();

    const caracteristicasPorTags = idsPorTags.length > 0 ? await db.caracteristica.where("id_caracteristica").anyOf(idsPorTags).toArray() : [];

    // Combina e remove os duplicados
    const todasCaracteristicas = [...caracteristicasPorNome, ...caracteristicasPorTags];
    const resultado = Array.from(new Set(todasCaracteristicas.map((c) => c.id_caracteristica))).map(
      (id) => todasCaracteristicas.find((c) => c.id_caracteristica === id) as Caracteristica
    );

    return resultado;
  } catch (error) {
    console.error("Erro ao filtrar características:", error);
    throw error;
  }
};
