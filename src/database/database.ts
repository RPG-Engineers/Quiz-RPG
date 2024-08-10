import Dexie from "dexie";
import { Alternativa, Caracteristica, Pergunta, Questionario, Tag } from "../types";
import { db } from "./db";

// === CRUD Questionario ===

export const addQuestionario = async (questionario: Questionario) => {
  await db.questionario.add(questionario);
};

export const getQuestionarios = async (): Promise<Questionario[]> => {
  return await db.questionario.toArray();
};

export const getQuestionarioById = async (id: number): Promise<Questionario> => {
  const questionario = await db.questionario.get(id);
  if (typeof questionario === "undefined") {
    throw new Error("Questionário não encontrado");
  }
  return questionario;
};

export const updateQuestionario = async (id: number, updated_questionario: Questionario) => {
  await db.questionario.update(id, updated_questionario);
};

export const deleteQuestionario = async (id: number) => {
  await db.transaction("rw", db.questionario, db.questionario_pergunta, async () => {
    await db.questionario.delete(id);
    await db.questionario_pergunta.where("id_questionario").equals(id).delete();
  });
};

// === CRUD Pergunta ===

export const addPergunta = async (pergunta: Pergunta) => {
  await db.pergunta.add(pergunta);
};

export const getPerguntas = async (): Promise<Pergunta[]> => {
  return await db.pergunta.toArray();
};

export const getPerguntaById = async (id: number): Promise<Pergunta> => {
  const pergunta = await db.pergunta.get(id);
  if (typeof pergunta === "undefined") {
    throw new Error("Pergunta não encontrada");
  }
  return pergunta;
};

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

export const updatePergunta = async (id: number, updated_pergunta: Pergunta) => {
  await db.pergunta.update(id, updated_pergunta);
};

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

export const addAlternativa = async (alternativa: Alternativa) => {
  await db.alternativa.add(alternativa);
};

export const getAlternativas = async (): Promise<Alternativa[]> => {
  return await db.alternativa.toArray();
};

export const getAlternativaById = async (id: number): Promise<Alternativa> => {
  const alternativa = await db.alternativa.get(id);
  if (typeof alternativa === "undefined") {
    throw new Error("Alternativa não encontrada");
  }
  return alternativa;
};

export const getAlternativasByPerguntaId = async (id_pergunta: number): Promise<Alternativa[]> => {
  return await db.alternativa.where("id_pergunta").equals(id_pergunta).toArray();
};

export const updateAlternativa = async (id: number, updated_alternativa: Alternativa) => {
  await db.alternativa.update(id, updated_alternativa);
};

export const deleteAlternativa = async (id: number) => {
  await db.transaction("rw", db.alternativa, db.alternativa_tag, async () => {
    await db.alternativa.delete(id);
    await db.alternativa_tag.where("id_alternativa").equals(id).delete();
  });
};

// === CRUD Tag ===

export const addTag = async (tag: Tag) => {
  await db.tag.add(tag);
};

export const getTags = async (): Promise<Tag[]> => {
  return await db.tag.toArray();
};

export const getTagById = async (id: number): Promise<Tag> => {
  const tag = await db.tag.get(id);
  if (typeof tag === "undefined") {
    throw new Error("Tag não encontrada");
  }
  return tag;
};

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

export const updateTag = async (id: number, updated_tag: Tag) => {
  await db.tag.update(id, updated_tag);
};

export const deleteTag = async (id: number) => {
  await db.transaction("rw", db.tag, db.caracteristica_tag, db.alternativa_tag, async () => {
    await db.tag.delete(id);
    await db.caracteristica_tag.where("id_tag").equals(id).delete();
    await db.alternativa_tag.where("id_tag").equals(id).delete();
  });
};

// === CRUD Caracteristica ===

export const addCaracteristica = async (caracteristica: Caracteristica) => {
  await db.caracteristica.add(caracteristica);
  return caracteristica.id_caracteristica ?? -1;
};

export const getCaracteristicas = async (): Promise<Caracteristica[]> => {
  return await db.caracteristica.toArray();
};

export const getCaracteristicaById = async (id: number): Promise<Caracteristica> => {
  const caracteristica = await db.caracteristica.get(id);
  if (typeof caracteristica === "undefined") {
    throw new Error("Caracteristica não encontrada");
  }
  return caracteristica;
};

export const updateCaracteristica = async (id: number, updated_caracteristica: Caracteristica) => {
  await db.caracteristica.update(id, updated_caracteristica);
};

export const associateCaracteristicaToTags = async (id: number, tag_ids: number[]) => {
  try {
    await db.transaction('rw', db.caracteristica_tag, async () => {
      const entries = tag_ids.map(tag_id => ({
        id_caracteristica: id,
        id_tag: tag_id
      }));
      await db.caracteristica_tag.bulkAdd(entries);
    });
  } catch (error) {
    console.error('Erro ao associar características com tags:', error);
  }
}

export const updateAssociationCaracteristicaToTags = async (id: number, tag_ids: number[]) => {
  try {
    await db.transaction('rw', db.caracteristica_tag, async () => {
      // Obtenha as associações existentes para a característica
      const existingAssociations = await db.caracteristica_tag
        .where('id_caracteristica')
        .equals(id)
        .toArray();

      // Crie um Set com IDs fornecidos para facilitar a verificação
      const tagIdsSet = new Set(tag_ids);

      // Determine as associações a adicionar e remover
      const currentTagIdsSet = new Set(existingAssociations.map(entry => entry.id_tag));
      const tagsToAdd = tag_ids.filter(tag_id => !currentTagIdsSet.has(tag_id));
      const tagsToRemove = existingAssociations
        .filter(entry => !tagIdsSet.has(entry.id_tag))
        .map(entry => entry.id_tag);

      // Adicione novas associações
      const newAssociations = tagsToAdd.map(tag_id => ({
        id_caracteristica: id,
        id_tag: tag_id
      }));
      if (newAssociations.length > 0) {
        await db.caracteristica_tag.bulkAdd(newAssociations);
      }

      // Remova associações antigas
      if (tagsToRemove.length > 0) {
        await db.caracteristica_tag
          .where('id_caracteristica')
          .equals(id)
          .and(entry => tagsToRemove.includes(entry.id_tag))
          .delete();
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar associações de características com tags:', error);
  }
};

export const deleteCaracteristica = async (id: number) => {
  await db.transaction("rw", db.caracteristica, db.caracteristica_tag, async () => {
    await db.caracteristica.delete(id);
    await db.caracteristica_tag.where("id_caracteristica").equals(id).delete();
  });
};

export const filtrarCaracteristicas = async (termo: string): Promise<Caracteristica[]> => {
  try {
    // Buscar IDs das tags que correspondem ao termo
    const tagIds = await db.tag
      .where("nome")
      .startsWithIgnoreCase(termo)
      .primaryKeys();

    // Buscar IDs das características associadas às tags encontradas
    const caracteristicasPorTagsIds = tagIds.length > 0
      ? await db.caracteristica_tag
          .where("id_tag")
          .anyOf(tagIds)
          .toArray()
      : [];

    const idsPorTags = caracteristicasPorTagsIds.map(item => item.id_caracteristica);

    // Buscar características pelo nome das características ou pelo nome das tags
    const caracteristicasPorNome = await db.caracteristica
      .where("nome")
      .startsWithIgnoreCase(termo)
      .toArray();

    const caracteristicasPorTags = idsPorTags.length > 0
      ? await db.caracteristica.where("id_caracteristica").anyOf(idsPorTags).toArray()
      : [];

    // Combina e remove os duplicados
    const todasCaracteristicas = [...caracteristicasPorNome, ...caracteristicasPorTags];
    const resultado = Array.from(new Set(todasCaracteristicas.map(c => c.id_caracteristica)))
      .map(id => todasCaracteristicas.find(c => c.id_caracteristica === id) as Caracteristica);

    return resultado;
  } catch (error) {
    console.error("Erro ao filtrar características:", error);
    throw error;
  }
};

