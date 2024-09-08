import Dexie from "dexie";
import { Tag } from "../types";
import { db } from "./db";

// === CRUD Tag ===
/**
 * Adiciona uma tag ao banco de dados
 *
 * @param {Tag} tag
 */

export const addTag = async (tag: Tag) => {
  await db.tag.add(tag);
};
/**
 * Obtém todas as tags do banco de dados
 *
 */

export const getTags = async (): Promise<Tag[]> => {
  return await db.tag.toArray();
};
/**
 * Obtém uma tag do banco de dados
 *
 * @param {number} id Id da tag a ser obtida
 */

export const getTagById = async (id: number): Promise<Tag> => {
  const tag = await db.tag.get(id);
  if (typeof tag === "undefined") {
    throw new Error("Tag não encontrada");
  }
  return tag;
};
/**
 * Obtém as tags de uma determinada alternativa
 *
 * @param {number} id_alternativa Id da alternativa
 */

export const getTagsByAlternativaId = async (id_alternativa: number): Promise<Tag[]> => {
  return await db.transaction("r", db.caracteristica_tag, db.pergunta, async () => {
    const tags_ids = await db.alternativa_tag.where("id_alternativa").equals(id_alternativa).toArray();
    const tags = await Dexie.Promise.all(
      tags_ids.map(async (tags_carac) => {
        const tag = await db.tag.get(tags_carac.id_tag);
        if (typeof tag === "undefined") {
          throw new Error("Tag não encontrada");
        }
        return tag;
      })
    );
    return tags;
  });
};
/**
 * Obtém as tags de uma determinada característica
 *
 * @param {number} id_caracteristica Id da característica
 */

export const getTagsByCaracteristicaId = async (id_caracteristica: number): Promise<Tag[]> => {
  return await db.transaction("r", db.caracteristica_tag, db.tag, async () => {
    const tags_ids = await db.caracteristica_tag.where("id_caracteristica").equals(id_caracteristica).toArray();
    const tags = await Dexie.Promise.all(
      tags_ids.map(async (tags_carac) => {
        const tag = await db.tag.get(tags_carac.id_tag);
        if (typeof tag === "undefined") {
          throw new Error("Tag não encontrada");
        }
        return tag;
      })
    );
    return tags;
  });
};
/**
 * Atualiza uma tag do banco de dados
 *
 * @param {number} id Id da tag a ser atualizada
 * @param {Tag} updated_tag Tag atualizada
 */

export const updateTag = async (id: number, updated_tag: Tag) => {
  await db.tag.update(id, updated_tag);
};
/**
 * Deleta uma tag do banco de dados
 *
 * @param {number} id Id da tag a ser deletada
 */

export const deleteTag = async (id: number) => {
  await db.transaction("rw", db.tag, db.caracteristica_tag, db.alternativa_tag, async () => {
    await db.tag.delete(id);
    await db.caracteristica_tag.where("id_tag").equals(id).delete();
    await db.alternativa_tag.where("id_tag").equals(id).delete();
  });
};
