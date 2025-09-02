"use client";

import { useMemo } from "react";
import type { StudySession } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "./ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";

interface StudyMetricsProps {
  sessions: StudySession[];
  className?: string;
}

export function StudyMetrics({ sessions, className }: StudyMetricsProps) {
  const chartData = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = sessions.filter(
      (session) => new Date(session.endTime) > sevenDaysAgo
    );

    const dataBySubject = recentSessions.reduce((acc, session) => {
      acc[session.subjectName] = (acc[session.subjectName] || 0) + session.duration / 60; // convert to hours
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(dataBySubject)
      .map(([name, hours]) => ({ name, hours: parseFloat(hours.toFixed(2)) }))
      .sort((a,b) => b.hours - a.hours);

  }, [sessions]);
  
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => b.endTime - a.endTime);
  }, [sessions]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="font-headline">Métricas de Estudo</CardTitle>
        <CardDescription>Seu progresso nos últimos 7 dias.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Horas por Matéria</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} interval={0} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="h" />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }}
                  contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Sem dados de estudo para exibir.</p>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Sessões Recentes</h3>
          <ScrollArea className="h-[200px] w-full pr-4">
             <div className="space-y-4">
              {sortedSessions.length > 0 ? sortedSessions.map(session => (
                <div key={session.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold">{session.subjectName}</p>
                    <p className="text-muted-foreground">{formatDistanceToNow(new Date(session.endTime), { addSuffix: true, locale: ptBR })}</p>
                  </div>
                  <Badge variant="outline">{session.duration} min</Badge>
                </div>
              )) : (
                 <div className="flex items-center justify-center h-[150px]">
                    <p className="text-muted-foreground">Nenhuma sessão registrada.</p>
                 </div>
              )}
             </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
