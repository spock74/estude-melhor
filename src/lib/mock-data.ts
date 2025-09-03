
import type { StudySession, SelfAssessment, ParentalAssessment } from "./types";
import { subjects } from "./curriculum";

const now = new Date();
const getRandomSubject = () => subjects[Math.floor(Math.random() * subjects.length)];
const getRandomRating = () => Math.floor(Math.random() * 5) + 1; // 1 to 5

export const mockStudySessions: StudySession[] = Array.from({ length: 50 }).map((_, i) => {
    const subject = getRandomSubject();
    const duration = Math.floor(Math.random() * (90 - 25 + 1)) + 25; // 25 to 90 mins
    const endTime = new Date(now.getTime() - i * 4 * 60 * 60 * 1000); // every 4 hours
    const startTime = new Date(endTime.getTime() - duration * 60 * 1000);

    return {
        id: `session-${i}`,
        subjectId: subject.id,
        subjectName: subject.name,
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
        schoolYear: "1ª Série",
        subjectId: subject.id,
        subjectName: subject.name,
        rating: getRandomRating(),
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
