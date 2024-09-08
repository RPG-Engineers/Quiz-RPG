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
