"use client";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { StudyMetrics } from "@/components/study-metrics";
import { ParentalAssessment } from "@/components/parental-assessment";
import type { StudySession } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function DashboardPage() {
  const [sessions, setSessions] = useLocalStorage<StudySession[]>("studySessions", []);
  
  const addSession = (session: Omit<StudySession, 'id'>) => {
    const newSession = { ...session, id: crypto.randomUUID() };
    setSessions(prevSessions => [...(prevSessions || []), newSession]);
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <PomodoroTimer addSession={addSession} />
        <StudyMetrics sessions={sessions || []} className="lg:col-span-2" />
      </div>
      <div className="grid gap-6">
         <ParentalAssessment />
      </div>
    </div>
  );
}
