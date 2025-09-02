"use client";

import { useState, useMemo } from "react";
import type { StudySession } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Sparkles } from "lucide-react";
import { getGuidance } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import type { TimeAllocationGuidanceOutput } from "@/ai/flows/time-allocation-guidance";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface AiAdvisorProps {
  sessions: StudySession[];
}

export function AiAdvisor({ sessions }: AiAdvisorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [guidance, setGuidance] = useState<TimeAllocationGuidanceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const studyLog = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = sessions.filter(
      (session) => new Date(session.endTime) > sevenDaysAgo
    );

    return recentSessions.reduce((acc, session) => {
      acc[session.subjectName] = (acc[session.subjectName] || 0) + session.duration; // in minutes
      return acc;
    }, {} as { [key: string]: number });
  }, [sessions]);

  const handleGetGuidance = async () => {
    setIsLoading(true);
    setError(null);
    setGuidance(null);

    const studyLogInHours = Object.entries(studyLog).reduce((acc, [key, value]) => {
      acc[key] = parseFloat((value / 60).toFixed(2));
      return acc;
    }, {} as { [key: string]: number });
    
    const result = await getGuidance({ studyLog: studyLogInHours });

    if (result.success) {
      setGuidance(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };
  
  const hasRecentData = Object.keys(studyLog).length > 0;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit /> Orientação com IA
        </CardTitle>
        <CardDescription>
          Receba sugestões para otimizar sua rotina de estudos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!guidance && !isLoading && !error && (
            <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Clique no botão para receber uma análise da sua última semana de estudos.</p>
            </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-8 w-1/3 mt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Erro na Análise</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {guidance && (
          <div className="space-y-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-base flex items-center gap-2 text-primary"><Sparkles className="w-4 h-4"/> Recomendação</h3>
              <p className="text-muted-foreground leading-relaxed">{guidance.recommendation}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-base">Justificativa</h3>
              <p className="text-muted-foreground leading-relaxed">{guidance.rationale}</p>
            </div>
          </div>
        )}
        
        <Button onClick={handleGetGuidance} disabled={isLoading || !hasRecentData} className="w-full">
          {isLoading ? "Analisando..." : "Analisar Minha Semana"}
        </Button>
        {!hasRecentData && <p className="text-xs text-center text-muted-foreground mt-2">Você precisa registrar algumas sessões de estudo primeiro.</p>}
      </CardContent>
    </Card>
  );
}
