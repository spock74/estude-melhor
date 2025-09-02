import type { Curriculum } from "./types";

export const subjects = [
  { id: "portugues", name: "Português" },
  { id: "matematica", name: "Matemática" },
  { id: "biologia", name: "Biologia" },
  { id: "fisica", name: "Física" },
  { id: "quimica", name: "Química" },
  { id: "historia", name: "História" },
  { id: "geografia", name: "Geografia" },
  { id: "filosofia", name: "Filosofia" },
  { id: "sociologia", name: "Sociologia" },
  { id: "ingles", name: "Inglês" },
  { id: "artes", name: "Artes" },
  { id: "educacao_fisica", name: "Educação Física" },
];

export const curriculum: Curriculum = {
  "1ª Série": subjects,
  "2ª Série": subjects,
  "3ª Série": subjects,
};

export const schoolYears = Object.keys(curriculum);

export const getSubjectNameById = (id: string) => {
  return subjects.find(s => s.id === id)?.name || 'Desconhecido';
}
