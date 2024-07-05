import { Alternativa, Caracteristica, Pergunta, Questionario, Tag } from '../types';
import { db } from './db';

// === CRUD Questionario ===

export const addQuestionario = async (questionario: Questionario) => {
  await db.questionario.add(questionario);
};

export const getQuestionarios = async (): Promise<Questionario[]> => {
  return await db.questionario.toArray();
};

export const getQuestionarioById = async (id: number): Promise<Questionario | undefined> => {
  return await db.questionario.get(id);
};

export const updateQuestionario = async (id: number, updated_questionario: Questionario) => {
  await db.questionario.update(id, updated_questionario);
};

export const deleteQuestionario = async (id: number) => {
  await db.questionario.delete(id);
};

// === CRUD Pergunta ===

export const addPergunta = async (pergunta: Pergunta) => {
  await db.pergunta.add(pergunta);
};

export const getPerguntas = async (): Promise<Pergunta[]> => {
  return await db.pergunta.toArray();
};

export const getPerguntaById = async (id: number): Promise<Pergunta | undefined> => {
  return await db.pergunta.get(id);
};

export const updatePergunta = async (id: number, updated_pergunta: Pergunta) => {
  await db.pergunta.update(id, updated_pergunta);
};

export const deletePergunta = async (id: number) => {
  await db.pergunta.delete(id);
};

// === CRUD Alternativa ===

export const addAlternativa = async (alternativa: Alternativa) => {
  await db.alternativa.add(alternativa);
};

export const getAlternativas = async (): Promise<Alternativa[]> => {
  return await db.alternativa.toArray();
};

export const getAlternativaById = async (id: number): Promise<Alternativa | undefined> => {
  return await db.alternativa.get(id);
};

export const updateAlternativa = async (id: number, updated_alternativa: Alternativa) => {
  await db.alternativa.update(id, updated_alternativa);
};

export const deleteAlternativa = async (id: number) => {
  await db.alternativa.delete(id);
};

// === CRUD Tag ===

export const addTag = async (tag: Tag) => {
  await db.tag.add(tag);
};

export const getTags = async (): Promise<Tag[]> => {
  return await db.tag.toArray();
};

export const getTagById = async (id: number): Promise<Tag | undefined> => {
  return await db.tag.get(id);
};

export const updateTag = async (id: number, updated_tag: Tag) => {
  await db.tag.update(id, updated_tag);
};

export const deleteTag = async (id: number) => {
  await db.tag.delete(id);
};

// === CRUD Caracteristica ===

export const addCaracteristica = async (caracteristica: Caracteristica) => {
  await db.caracteristica.add(caracteristica);
};

export const getCaracteristicas = async (): Promise<Caracteristica[]> => {
  return await db.caracteristica.toArray();
};

export const getCaracteristicaById = async (id: number): Promise<Caracteristica | undefined> => {
  return await db.caracteristica.get(id);
};

export const updateCaracteristica = async (id: number, updated_caracteristica: Caracteristica) => {
  await db.caracteristica.update(id, updated_caracteristica);
};

export const deleteCaracteristica = async (id: number) => {
  await db.caracteristica.delete(id);
};