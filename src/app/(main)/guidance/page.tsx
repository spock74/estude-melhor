"use client";

import { AiAdvisor } from "@/components/ai-advisor";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { StudySession } from "@/lib/types";

export default function GuidancePage() {
  const [sessions] = useLocalStorage<StudySession[]>("studySessions", []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AiAdvisor sessions={sessions || []} />
    </div>
  );
}
