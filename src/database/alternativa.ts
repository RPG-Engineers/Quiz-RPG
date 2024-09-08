import { Pergunta, AlternativaWithTags, Tag, Alternativa } from "../types";
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

export async function getAlternativasWithTagsByPergunta(pergunta: Pergunta): Promise<AlternativaWithTags[]> {
  // Primeiro, buscamos todas as alternativas associadas à pergunta
  const alternativas = await db.alternativa.where("id_pergunta").equals(pergunta.id_pergunta!).toArray();

  // Agora, para cada alternativa, buscamos as tags associadas
  const alternativasWithTags: AlternativaWithTags[] = await Promise.all(
    alternativas.map(async (alternativa) => {
      const tags = await db.alternativa_tag.where("id_alternativa").equals(alternativa.id_alternativa!).toArray();

      const tagDetails: Tag[] = await Promise.all(
        tags.map(async (altTag) => {
          const tag = await db.tag.where("id_tag").equals(altTag.id_tag!).first();
          return tag!;
        })
      );

      return {
        ...alternativa,
        tags: tagDetails,
      };
    })
  );

  return alternativasWithTags;
}
/**
 * Edita uma pergunta e suas alternativas, incluindo as associações de tags
 *
 * @param {Pergunta} pergunta Pergunta a ser editada
 * @param {Alternativa[]} alternativas Lista de alternativas atualizada para a pergunta, incluindo tags
 */
export const editPerguntaEAlternativas = async (pergunta: Pergunta, alternativas: AlternativaWithTags[]) => {
  try {
    await db.transaction("rw", [db.pergunta, db.alternativa, db.alternativa_tag], async () => {
      // Atualize o texto da pergunta
      await db.pergunta.update(pergunta.id_pergunta, { pergunta: pergunta.pergunta });

      // Obtenha as alternativas existentes para a pergunta
      const existingAlternatives = await db.alternativa.where("id_pergunta").equals(pergunta.id_pergunta!).toArray();

      // Crie um Set com IDs das alternativas fornecidas para facilitar a verificação
      const providedAlternativeIds = new Set(alternativas.map((alt) => alt.id_alternativa));

      // Determine as alternativas a adicionar, remover e editar
      const alternativesToAdd = alternativas.filter((alt) => !alt.id_alternativa);
      const alternativesToRemove = existingAlternatives.filter(
        (existingAlt) => !providedAlternativeIds.has(existingAlt.id_alternativa)
      );
      const alternativesToUpdate = alternativas.filter(
        (alt) => alt.id_alternativa && providedAlternativeIds.has(alt.id_alternativa)
      );

      // Adicione novas alternativas
      if (alternativesToAdd.length > 0) {
        const addedAlternativesIds = await db.alternativa.bulkAdd(
          alternativesToAdd.map((alt) => ({
            id_pergunta: pergunta.id_pergunta!,
            alternativa: alt.alternativa,
          })),
          { allKeys: true }
        );

        // Adicionar associações de tags para as alternativas recém-criadas
        for (let i = 0; i < addedAlternativesIds.length; i++) {
          const newAltId = addedAlternativesIds[i];
          const newAltTags = alternativesToAdd[i].tags.map((tag) => tag.id_tag!);
          if (newAltTags) {
            await updateAlternativaTags(String(newAltId), newAltTags);
          }
        }
      }

      // Remova alternativas antigas e suas associações de tags
      if (alternativesToRemove.length > 0) {
        await db.alternativa.bulkDelete(alternativesToRemove.map((alt) => alt.id_alternativa));
        for (const alt of alternativesToRemove) {
          await db.alternativa_tag.where("id_alternativa").equals(alt.id_alternativa!).delete();
        }
      }

      // Atualize alternativas existentes e suas associações de tags
      for (const alt of alternativesToUpdate) {
        await db.alternativa.update(alt.id_alternativa, { alternativa: alt.alternativa });
        const updatedTags = alt.tags.map((tag) => tag.id_tag!);
        if (updatedTags) {
          await updateAlternativaTags(String(alt.id_alternativa), updatedTags);
        }
      }
    });
  } catch (error) {
    console.error("Erro ao editar pergunta e alternativas:", error);
  }
};

export const updateAlternativaTags = async (id_alternativa: string, tags: number[]) => {
  // Remove as associações de tags existentes para a alternativa
  await db.alternativa_tag.where({ id_alternativa }).delete();

  // Adiciona as novas associações de tags para a alternativa
  const alternativaTags = tags.map((id_tag) => ({
    id_alternativa: Number(id_alternativa),
    id_tag,
  }));

  await db.alternativa_tag.bulkAdd(alternativaTags);
};
