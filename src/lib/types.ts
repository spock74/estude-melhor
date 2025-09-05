export type Subject = {
  name: string;
  id: string;
};

export type Curriculum = {
  [year: string]: Subject[];
};

export type StudySession = {
  id: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  startTime: number;
  endTime: number;
  duration: number; // in minutes
};

export type SelfAssessment = {
  id: string;
  date: number;
  subjectId: string;
  subjectName: string;
  topic: string;
  concentration: number; // 1-10
  knowledgeGain: number; // 1-10
  subjectDifficulty: number; // 1-10
  topicDifficulty: number; // 1-10
  timeManagement: number; // 1-10
  notes?: string;
};

export type ParentalAssessment = {
  id: string;
  date: number;
  adherenceRating: number; // 1-5
  notes?: string;
};
