import { Alternativa } from "../types";
import { db } from "./db";

// === CRUD Alternativa ===
/**
 *  Adiciona uma alternativa ao banco de dados
 *
 * @param {Alternativa} alternativa Alternativa a ser adicionada
 */

export const addAlternativa = async (alternativa: Alternativa) => {
  await db.alternativa.add(alternativa);
  return alternativa.id_alternativa ?? -1;
};
/**
 * Obtém as alternativas de uma pergunta
 *
 * @param {number} id_pergunta Id da pergunta
 */

export const getAlternativasByPerguntaId = async (id_pergunta: number): Promise<Alternativa[]> => {
  return await db.alternativa.where("id_pergunta").equals(id_pergunta).toArray();
};
/**
 * Atualiza uma alternativa
 *
 * @param {number} id Id da alternativa a ser atualizada
 * @param {Alternativa} updated_alternativa Alternativa atualizada
 */

export const updateAlternativa = async (id: number, updated_alternativa: Alternativa) => {
  await db.alternativa.update(id, updated_alternativa);
};
/**
 * Associa as tags à alternativa
 *
 * @param {number} id Id da alternativa
 * @param {number[]} tag_ids Ids das tags a serem associadas
 */

export const associateAlternativaToTags = async (id: number, tag_ids: number[]) => {
  try {
    await db.transaction("rw", db.alternativa_tag, async () => {
      const entries = tag_ids.map((tag_id) => ({
        id_alternativa: id,
        id_tag: tag_id,
      }));
      await db.alternativa_tag.bulkAdd(entries);
    });
  } catch (error) {
    console.error("Erro ao associar alternativa com tags:", error);
  }
};
/**
 * Atualiza a associação de tags a uma alternativa
 *
 * @param {number} id_alternativa Id da alternativa
 * @param {number[]} tag_ids Ids das tags a serem associadas
 */

export const updateAssociationAlternativeToTags = async (id_alternativa: number, tag_ids: number[]) => {
  try {
    await db.transaction("rw", db.alternativa_tag, async () => {
      // Obtenha as associações existentes para a alternativa
      const existingAssociations = await db.alternativa_tag.where("id_alternativa").equals(id_alternativa).toArray();

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
        id_alternativa: id_alternativa,
        id_tag: tag_id,
      }));
      if (newAssociations.length > 0) {
        await db.alternativa_tag.bulkAdd(newAssociations);
      }

      // Remova associações antigas
      if (tagsToRemove.length > 0) {
        await db.alternativa_tag
          .where("id_alternativa")
          .equals(id_alternativa)
          .and((entry) => tagsToRemove.includes(entry.id_tag))
          .delete();
      }
    });
  } catch (error) {
    console.error("Erro ao atualizar associações de alternativas com tags:", error);
  }
};
/**
 * Deleta uma alternativa específica
 *
 * @param {number} id Id da alternativa
 */

export const deleteAlternativa = async (id: number) => {
  await db.transaction("rw", db.alternativa, db.alternativa_tag, async () => {
    await db.alternativa.delete(id);
    await db.alternativa_tag.where("id_alternativa").equals(id).delete();
  });
};
