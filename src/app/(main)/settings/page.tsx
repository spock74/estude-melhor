
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { mockStudySessions, mockSelfAssessments, mockParentalAssessments } from "@/lib/mock-data";
import { TestTube2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  const { toast } = useToast();
  const [, setStudySessions] = useLocalStorage("studySessions", []);
  const [, setSelfAssessments] = useLocalStorage("selfAssessments", []);
  const [, setParentalAssessments] = useLocalStorage("parentalAssessments", []);
  const [, setWorkMinutes] = useLocalStorage("pomodoroWorkMinutes", 25);
  const [, setBreakMinutes] = useLocalStorage("pomodoroBreakMinutes", 5);
  const [, setLastStudiedSession] = useLocalStorage("lastStudiedSession", null);

  const loadMockData = () => {
    setStudySessions(mockStudySessions);
    setSelfAssessments(mockSelfAssessments);
    setParentalAssessments(mockParentalAssessments);
    toast({
      title: "Dados de teste carregados!",
      description: "Navegue pelo app para ver os relatórios populados.",
    });
  };
  
  const clearAllData = () => {
    setStudySessions([]);
    setSelfAssessments([]);
    setParentalAssessments([]);
    setWorkMinutes(25);
    setBreakMinutes(5);
    setLastStudiedSession(null);
    // You could also clear localStorage directly, but this is safer with the hook
    // window.localStorage.clear();
    // window.dispatchEvent(new Event('local-storage'));
    toast({
      title: "Dados limpos!",
      description: "Todos os dados de sessões e avaliações foram removidos.",
      variant: "destructive"
    });
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>
            Gerencie suas preferências e dados do aplicativo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           {/* Future settings can go here */}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <TestTube2 /> Opções de Desenvolvimento
          </CardTitle>
          <CardDescription>
            Estas ações são para fins de teste e irão alterar seus dados salvos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
              <AlertTitle>Carregar Dados de Exemplo</AlertTitle>
              <AlertDescription>
                Popule o aplicativo com dados de sessões e avaliações de exemplo para testar as funcionalidades de relatórios.
              </AlertDescription>
              <Button onClick={loadMockData} className="mt-4">Carregar Dados</Button>
          </Alert>
          <Alert variant="destructive">
              <AlertTitle>Limpar Todos os Dados</AlertTitle>
              <AlertDescription>
                Esta ação removerá permanentemente todos os seus dados de estudo, avaliações e configurações do Pomodoro.
              </AlertDescription>
              <Button onClick={clearAllData} variant="destructive" className="mt-4">Limpar Dados Agora</Button>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
