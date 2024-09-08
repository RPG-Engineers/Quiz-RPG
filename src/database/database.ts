import Dexie from "dexie";
import {
  Alternativa,
  AlternativaWithTags,
  Caracteristica,
  Pergunta,
  Questionario,
  QuestionarioPergunta,
  QuestionarioWithPerguntas,
  Tag,
  TipoCaracteristica,
} from "../types";
import { db } from "./db";

// === CRUD Questionario ===

/**
 * Adiciona um questionário ao banco de dados
 *
 * @param {QuestionarioWithPerguntas} questionarioWithPerguntas Questionário a ser adicionado
 */
export const addQuestionario = async (questionarioWithPerguntas: QuestionarioWithPerguntas) => {
  const questionario: Questionario = {
    nome: questionarioWithPerguntas.nome,
    default: questionarioWithPerguntas.default,
  };
  const perguntas: Pergunta[] = questionarioWithPerguntas.perguntas;

  try {
    // Adiciona o questionário e obtém o ID gerado
    const questionario_id = await db.questionario.add(questionario);

    // Obtém os IDs das perguntas
    const perguntas_ids = perguntas.map((pergunta) => pergunta.id_pergunta!);

    // Associa as perguntas ao questionário
    await associateQuestionarioToPerguntas(questionario_id, perguntas_ids);

    console.log("Questionário e associações adicionados com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar questionário e associações:", error);
  }
};

/**
 * Associa as perguntas ao questionário
 *
 * @param {number} questionario_id Id do questionário
 * @param {number[]} perguntas_ids Ids das perguntas a serem associadas
 */
const associateQuestionarioToPerguntas = async (questionario_id: number, perguntas_ids: number[]) => {
  try {
    await db.transaction("rw", db.questionario_pergunta, async () => {
      const entries: QuestionarioPergunta[] = perguntas_ids.map((perguntas_id) => ({
        id_questionario: questionario_id,
        id_pergunta: perguntas_id,
      }));
      await db.questionario_pergunta.bulkAdd(entries);
    });

    console.log("Associações adicionadas com sucesso!");
  } catch (error) {
    console.error("Erro ao associar perguntas ao questionário:", error);
  }
};

/**
 * Obtém todos os questionários do banco de dados
 *
 */
export const getQuestionarios = async (): Promise<Questionario[]> => {
  return await db.questionario.toArray();
};

/**
 * Obtém um questionário do banco de dados
 *
 * @param {number} id Id do questionário a ser obtido
 */
export const getQuestionarioById = async (id: number): Promise<Questionario> => {
  const questionario = await db.questionario.get(id);
  if (typeof questionario === "undefined") {
    throw new Error("Questionário não encontrado");
  }
  return questionario;
};

/**
 * Atualiza um questionário do banco de dados
 *
 * @param {number} id Id do questionário a ser atualizado
 * @param {Questionario} updated_questionario Questionário atualizado
 */
export const updateQuestionario = async (id: number, updated_questionario: Questionario) => {
  await db.questionario.update(id, updated_questionario);
};

/**
 * Deleta um questionário específico no banco de dados
 *
 * @param {number} id Id do questionário a ser deletado
 */
export const deleteQuestionario = async (id: number) => {
  await db.transaction("rw", db.questionario, db.questionario_pergunta, async () => {
    await db.questionario.delete(id);
    await db.questionario_pergunta.where("id_questionario").equals(id).delete();
  });
};

// === CRUD Pergunta ===

/**
 * Adiciona uma pergunta ao banco de dados
 *
 * @param {Pergunta} pergunta Pergunta a ser adicionada
 */
export const addPergunta = async (pergunta: Pergunta) => {
  await db.pergunta.add(pergunta);
  return pergunta.id_pergunta ?? -1;
};

/**
 * Obtém todas as perguntas do banco de dados
 *
 */
export const getPerguntas = async (): Promise<Pergunta[]> => {
  return await db.pergunta.toArray();
};

/**
 * Obtém uma pergunta do banco de dados
 *
 * @param {number} id Id da pergunta a ser obtida
 */
export const getPerguntaById = async (id: number): Promise<Pergunta> => {
  const pergunta = await db.pergunta.get(id);
  if (typeof pergunta === "undefined") {
    throw new Error("Pergunta não encontrada");
  }
  return pergunta;
};

/**
 * Obtém as perguntas de um determinado questionário
 *
 * @param {number} id_questionario Id do questionário
 */
export const getPerguntasByQuestionarioId = async (id_questionario: number): Promise<Pergunta[]> => {
  return await db.transaction("r", db.questionario_pergunta, db.pergunta, async () => {
    const perguntas_ids = await db.questionario_pergunta.where("id_questionario").equals(id_questionario).toArray();
    const perguntas = await Dexie.Promise.all(
      perguntas_ids.map(async (pergunta_quest) => {
        const pergunta = await db.pergunta.get(pergunta_quest.id_pergunta);
        if (typeof pergunta === "undefined") {
          throw new Error("Pergunta não encontrada");
        }
        return pergunta;
      })
    );
    return perguntas;
  });
};

/**
 * Atualiza uma pergunta do banco de dados
 *
 * @param {number} id Id da pergunta a ser atualizada
 * @param {Pergunta} updated_pergunta Pergunta atualizada
 */
export const updatePergunta = async (id: number, updated_pergunta: Pergunta) => {
  await db.pergunta.update(id, updated_pergunta);
};

/**
 * Deleta uma pergunta do banco de dados
 *
 * @param {number} id Id da pergunta a ser deletada
 */
export const deletePergunta = async (id: number) => {
  await db.transaction("rw", db.questionario_pergunta, db.pergunta, db.alternativa, db.alternativa_tag, async () => {
    await db.pergunta.delete(id);
    await db.questionario_pergunta.where("id_pergunta").equals(id).delete();
    const alternativas_associadas = await db.alternativa.where("id_pergunta").equals(id).toArray();
    for (const alternativa of alternativas_associadas) {
      const alternativa_id = alternativa.id_alternativa;
      if (typeof alternativa_id === "undefined") {
        throw new Error("Alternativa não encontrada durante a deleção");
      }
      await db.alternativa_tag.where("id_alternativa").equals(alternativa_id).delete();
      await db.alternativa.delete(alternativa_id);
    }
  });
};

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

    return resultado;
  } catch (error) {
    console.error("Erro ao filtrar características:", error);
    throw error;
  }
};
