import type { StudySession, SelfAssessment, ParentalAssessment } from "./types";
import { subjects } from "./curriculum";

const now = new Date();
const getRandomSubject = () => subjects[Math.floor(Math.random() * subjects.length)];
const getRandomRating = (max = 5) => Math.floor(Math.random() * max) + 1;
const getRandomFloatRating = (max = 10) => parseFloat((Math.random() * (max - 1) + 1).toFixed(1));

export const mockStudySessions: StudySession[] = Array.from({ length: 50 }).map((_, i) => {
    const subject = getRandomSubject();
    const duration = Math.floor(Math.random() * (90 - 25 + 1)) + 25; // 25 to 90 mins
    const endTime = new Date(now.getTime() - i * 4 * 60 * 60 * 1000); // every 4 hours
    const startTime = new Date(endTime.getTime() - duration * 60 * 1000);

    return {
        id: `session-${i}`,
        subjectId: subject.id,
        subjectName: subject.name,
        topic: `Tópico de ${subject.name} #${i+1}`,
        startTime: startTime.getTime(),
        endTime: endTime.getTime(),
        duration: duration,
    };
});


export const mockSelfAssessments: SelfAssessment[] = Array.from({ length: 15 }).map((_, i) => {
    const subject = getRandomSubject();
    const date = new Date(now.getTime() - i * 2 * 24 * 60 * 60 * 1000); // every 2 days
    return {
        id: `self-${i}`,
        date: date.getTime(),
        subjectId: subject.id,
        subjectName: subject.name,
        topic: `Tópico de ${subject.name} #${i+1}`,
        concentration: getRandomFloatRating(),
        knowledgeGain: getRandomFloatRating(),
        subjectDifficulty: getRandomFloatRating(),
        topicDifficulty: getRandomFloatRating(),
        timeManagement: getRandomFloatRating(),
        notes: `Nota sobre ${subject.name}.`,
    };
});


export const mockParentalAssessments: ParentalAssessment[] = Array.from({ length: 5 }).map((_, i) => {
    const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000); // every week
    return {
        id: `parental-${i}`,
        date: date.getTime(),
        adherenceRating: getRandomRating(),
        notes: "Observação do responsável sobre o desempenho geral.",
    };
});
