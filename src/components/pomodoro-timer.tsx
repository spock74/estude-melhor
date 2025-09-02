"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { subjects } from "@/lib/curriculum";
import type { StudySession } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PomodoroTimerProps {
  addSession: (session: Omit<StudySession, "id">) => void;
}

export function PomodoroTimer({ addSession }: PomodoroTimerProps) {
  const { toast } = useToast();
  const [workMinutes, setWorkMinutes] = useLocalStorage("pomodoroWorkMinutes", 25);
  const [breakMinutes, setBreakMinutes] = useLocalStorage("pomodoroBreakMinutes", 5);

  const [mode, setMode] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const [tempWorkMinutes, setTempWorkMinutes] = useState(workMinutes);
  const [tempBreakMinutes, setTempBreakMinutes] = useState(breakMinutes);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const totalDuration = (mode === "work" ? workMinutes : breakMinutes) * 60;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        audioRef.current = new Audio('/alert.mp3');
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft((mode === "work" ? workMinutes : breakMinutes) * 60);
    }
  }, [workMinutes, breakMinutes, mode, isActive]);

  const switchMode = useCallback(() => {
    if (audioRef.current) {
        audioRef.current.play();
    }
    const newMode = mode === "work" ? "break" : "work";
    const newTime = (newMode === "work" ? workMinutes : breakMinutes) * 60;
    setMode(newMode);
    setTimeLeft(newTime);
    setIsActive(false);

    toast({
      title: `Hora de ${newMode === "work" ? "focar" : "descansar"}!`,
      description: `Sua sessão de ${newMode === "work" ? "estudo" : "descanso"} começou.`,
    });
  }, [mode, toast, workMinutes, breakMinutes]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) return prev - 1;
          
          if (mode === "work" && selectedSubject) {
            const subject = subjects.find(s => s.id === selectedSubject);
            addSession({
              subjectId: selectedSubject,
              subjectName: subject?.name || "Desconhecido",
              startTime: Date.now() - workMinutes * 60 * 1000,
              endTime: Date.now(),
              duration: workMinutes,
            });
          }
          switchMode();
          return 0;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, mode, addSession, selectedSubject, switchMode, workMinutes]);

  const toggleTimer = () => {
    if (mode === "work" && !selectedSubject) {
      toast({
        title: "Selecione uma matéria",
        description: "Você precisa escolher uma matéria para iniciar uma sessão de estudo.",
        variant: "destructive",
      });
      return;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setTimeLeft((mode === "work" ? workMinutes : breakMinutes) * 60);
  };

  const handleSaveSettings = () => {
    setWorkMinutes(tempWorkMinutes > 0 ? tempWorkMinutes : 25);
    setBreakMinutes(tempBreakMinutes > 0 ? tempBreakMinutes : 5);
    toast({ title: "Configurações salvas!" });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="font-headline flex items-center gap-2">
            Foco Total
            <Badge variant={mode === 'work' ? 'default' : 'secondary'}>
                {mode === 'work' ? 'Estudo' : 'Descanso'}
            </Badge>
            </CardTitle>
            <Dialog onOpenChange={(open) => { if (open) { setTempWorkMinutes(workMinutes); setTempBreakMinutes(breakMinutes); } }}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Settings className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Configurar Pomodoro</DialogTitle>
                    <DialogDescription>
                        Ajuste os tempos para suas sessões de estudo e descanso.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="work-duration" className="text-right">
                        Estudo (min)
                        </Label>
                        <Input
                        id="work-duration"
                        type="number"
                        value={tempWorkMinutes}
                        onChange={(e) => setTempWorkMinutes(Number(e.target.value))}
                        className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="break-duration" className="text-right">
                        Descanso (min)
                        </Label>
                        <Input
                        id="break-duration"
                        type="number"
                        value={tempBreakMinutes}
                        onChange={(e) => setTempBreakMinutes(Number(e.target.value))}
                        className="col-span-3"
                        />
                    </div>
                    </div>
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={handleSaveSettings}>Salvar</Button>
                    </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
            <span className="font-headline text-6xl font-bold tabular-nums">
                {formatTime(timeLeft)}
            </span>
        </div>
        <Progress value={((totalDuration - timeLeft) / totalDuration) * 100} className="w-full h-2" />
        <div className="w-full space-y-4">
          <Select onValueChange={setSelectedSubject} value={selectedSubject || undefined} disabled={isActive && mode ==='work'}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma matéria para estudar" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={toggleTimer} size="lg">
              {isActive ? <Pause className="mr-2 h-4 w-4"/> : <Play className="mr-2 h-4 w-4" />}
              {isActive ? "Pausar" : "Iniciar"}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Resetar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
