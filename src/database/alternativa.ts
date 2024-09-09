import { Alternativa, AlternativaTag, AlternativaWithTags } from "../types";
import { db } from "./db";
import { getTagsByAlternativaId } from "./tag";

/**
 *  Adiciona uma alternativa ao banco de dados
 *  e retorna o id da alternativa adicionada
 * @param {Alternativa} alternativa Alternativa a ser adicionada
 */

export async function addAlternativa(alternativa: Alternativa) {
  await db.alternativa.add(alternativa);
  if (alternativa.id_alternativa !== undefined) {
    return alternativa.id_alternativa;
  } else {
    throw new Error("ID da alternativa não foi definido.");
  }
}

/**
 * Associa as tags à alternativa
 *
 * @param {number} id Id da alternativa
 * @param {Set<number>} tagsIds Ids das tags a serem associadas
 */
export async function associateAlternativaToTags(id: number, tagsIds: Set<number>) {
  const tagsIdsArray = Array.from(tagsIds);
  try {
    await db.transaction("rw", db.alternativa_tag, async () => {
      const entries = tagsIdsArray.map((tagId) => ({
        id_alternativa: id,
        id_tag: tagId,
      }));
      await db.alternativa_tag.bulkAdd(entries);
    });
  } catch (error) {
    console.error("Erro ao associar alternativa com tags:", error);
    throw error;
  }
}

/**
 * Obtém todas as alternativas de uma pergunta
 * com suas tags também
 *
 * @param {number} perguntaId Id da pergunta
 */
export async function getAlternativasByPerguntaId(perguntaId: number): Promise<AlternativaWithTags[]> {
  // Buscamos todas as alternativas associadas à pergunta
  const alternativas = await db.alternativa.where("id_pergunta").equals(perguntaId).toArray();

  // Para cada alternativa obtém suas tags e associa
  return await associateTagsToAlternativas(alternativas);
}

/**
 * Atualiza uma alternativa do banco de dados
 *
 * @param {number} id Id da alternativa a ser atualizada
 * @param {Caracteristica} updatedAlternativa Alternativa atualizada
 */
export async function updateAlternativa(id: number, updatedAlternativa: Alternativa) {
  await db.alternativa.update(id, updatedAlternativa);
}

/**
 * Atualiza a associação de tags a uma alternativa
 *
 * @param {number} id Id da alternativa
 * @param {Set<number>} tagsIds Ids das tags a serem associadas
 */
export async function updateAssociationAlternativaToTags(id: number, tagsIds: Set<number>) {
  try {
    await db.transaction("rw", db.alternativa_tag, async () => {
      // Obtenha as associações existentes para a alternativa
      const existingAssociations = await db.alternativa_tag.where("id_alternativa").equals(id).toArray();

      // Determine as associações a adicionar e remover
      const currentTagIdsSet = new Set(existingAssociations.map((entry) => entry.id_tag));
      const tagsToAdd = Array.from(tagsIds).filter((tagId) => !currentTagIdsSet.has(tagId));
      const tagsToRemove = existingAssociations
        .filter((entry) => !tagsIds.has(entry.id_tag))
        .map((entry) => entry.id_tag);

      // Adicione novas associações
      const newAssociations: AlternativaTag[] = tagsToAdd.map((tagId) => ({
        id_alternativa: id,
        id_tag: tagId,
      }));
      if (newAssociations.length > 0) {
        await db.alternativa_tag.bulkAdd(newAssociations);
      }

      // Remova associações antigas
      if (tagsToRemove.length > 0) {
        await db.alternativa_tag
          .where("id_alternativa")
          .equals(id)
          .and((entry) => tagsToRemove.includes(entry.id_tag))
          .delete();
      }
    });
  } catch (error) {
    console.error("Erro ao atualizar associações de alternativas com tags:", error);
    throw error;
  }
}

/**
 * Deleta uma alternativa do banco de dados
 *
 * @param {number} id Id da alternativa a ser deletada
 */
export async function deleteAlternativa(id: number) {
  await db.transaction("rw", db.alternativa, db.alternativa_tag, async () => {
    await db.alternativa.delete(id);
    await db.alternativa_tag.where("id_alternativa").equals(id).delete();
  });
}

// === Funções Auxiliares ===

/**
 * Associa as tags respectivas de cada alternativa criando um objeto
 * AlternativaWithTags e o retorna
 *
 * @param {Alternativa[]} alternativas
 */
async function associateTagsToAlternativas(alternativas: Alternativa[]): Promise<AlternativaWithTags[]> {
  return await Promise.all(
    alternativas.map(async (alternativa) => {
      // Obtém as tags da cada alternativa
      const tagsAlternativa = await getTagsByAlternativaId(alternativa.id_alternativa!);

      // Converte os ids das tags em um Set<number>
      const tagsIdsSet: Set<number> = new Set(tagsAlternativa.map(tag => tag.id_tag!));

      // Associa as tags no objeto
      const alternativaWithTags: AlternativaWithTags = {
        ...alternativa,
        tagsIds: tagsIdsSet,
      };

      return alternativaWithTags;
    })
  );
}

