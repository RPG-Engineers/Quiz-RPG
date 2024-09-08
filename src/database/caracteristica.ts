import { Caracteristica, TipoCaracteristica, Pergunta, AlternativaWithTags, Tag } from "../types";
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
