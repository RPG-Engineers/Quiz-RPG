import Dexie from "dexie";
import { Tag } from "../types";
import { db } from "./db";

/**
 * Adiciona uma tag ao banco de dados
 *
 * @param {Tag} tag
 */
export async function addTag(tag: Tag) {
  await db.tag.add(tag);
}

/**
 * Obtém todas as tags do banco de dados
 *
 */
export async function getTags(): Promise<Tag[]> {
  return await db.tag.toArray();
}

/**
 * Obtém uma tag do banco de dados
 *
 * @param {number} id Id da tag a ser obtida
 */
export async function getTagById(id: number): Promise<Tag> {
  const tag = await db.tag.get(id);
  if (tag === undefined || tag === null) {
    throw new Error("Tag não encontrada");
  }
  return tag;
}

/**
 * Obtém as tags de uma determinada característica
 *
 * @param {number} caracteristicaId Id da característica
 */
export async function getTagsByCaracteristicaId(caracteristicaId: number): Promise<Tag[]> {
  return await db.transaction("r", db.caracteristica_tag, db.tag, async () => {
    const tagsIds = await db.caracteristica_tag.where("id_caracteristica").equals(caracteristicaId).toArray();
    const tags = await Dexie.Promise.all(
      tagsIds.map(async (tags_carac) => {
        const tag = await db.tag.get(tags_carac.id_tag);
        if (tag === undefined || tag === null) {
          throw new Error("Tag não encontrada, dados inconsistentes");
        }
        return tag;
      })
    );
    return tags;
  });
}

/**
 * Obtém as tags de uma determinada alternativa
 *
 * @param {number} alternativaId Id da alternativa
 */
export async function getTagsByAlternativaId(alternativaId: number): Promise<Tag[]> {
  return await db.transaction("r", db.alternativa_tag, db.tag, async () => {
    const tagsIds = await db.alternativa_tag.where("id_alternativa").equals(alternativaId).toArray();
    const tags = await Dexie.Promise.all(
      tagsIds.map(async (tags_alt) => {
        const tag = await db.tag.get(tags_alt.id_tag);
        if (tag === undefined || tag === null) {
          throw new Error("Tag não encontrada, dados inconsistentes");
        }
        return tag;
      })
    );
    return tags;
  });
}

/**
 * Atualiza uma tag do banco de dados
 *
 * @param {number} id Id da tag a ser atualizada
 * @param {Tag} updatedTag Tag atualizada
 */
export async function updateTag(id: number, updatedTag: Tag) {
  await db.tag.update(id, updatedTag);
}

/**
 * Deleta uma tag do banco de dados
 *
 * @param {number} id Id da tag a ser deletada
 */
export async function deleteTag(id: number) {
  await db.transaction("rw", db.tag, db.caracteristica_tag, db.alternativa_tag, async () => {
    await db.tag.delete(id);
    await db.caracteristica_tag.where("id_tag").equals(id).delete();
    await db.alternativa_tag.where("id_tag").equals(id).delete();
  });
}
