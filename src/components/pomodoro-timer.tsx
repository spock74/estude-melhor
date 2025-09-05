
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RefreshCw, Settings, ExternalLink } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PomodoroTimerProps {
  addSession: (session: Omit<StudySession, "id">) => void;
}

export function PomodoroTimer({ addSession }: PomodoroTimerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [workMinutes, setWorkMinutes] = useLocalStorage("pomodoroWorkMinutes", 25);
  const [breakMinutes, setBreakMinutes] = useLocalStorage("pomodoroBreakMinutes", 5);
  const [, setLastStudiedSession] = useLocalStorage("lastStudiedSession", null);

  const [mode, setMode] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [showExitMessage, setShowExitMessage] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [topic, setTopic] = useState("");

  const [tempWorkMinutes, setTempWorkMinutes] = useState(workMinutes);
  const [tempBreakMinutes, setTempBreakMinutes] = useState(breakMinutes);

  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpacePressRef = useRef<number>(0);
  const exitMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    setTimeLeft((mode === "work" ? workMinutes : breakMinutes) * 60);
  }, [workMinutes, breakMinutes, mode]);

  const switchMode = useCallback((finishedWorkSession: boolean) => {
    const newMode = mode === "work" ? "break" : "work";
    setMode(newMode);
    setTimeLeft((newMode === "work" ? workMinutes : breakMinutes) * 60);
    setIsActive(false);
    setIsFlipped(false);
    setIsFocusPaused(false);

    if (finishedWorkSession) {
      setShowAssessmentDialog(true);
    }

    toast({
      title: `Hora de ${newMode === "work" ? "focar" : "descansar"}!`,
      description: `Sua sessão de ${newMode === "work" ? "estudo" : "descanso"} começou.`,
    });
  }, [mode, toast, workMinutes, breakMinutes]);

  useEffect(() => {
    if (isActive && !isFocusPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) return prev - 1;

          let finishedWork = false;
          if (mode === "work" && selectedSubject) {
            const subject = subjects.find((s) => s.id === selectedSubject);
            addSession({
              subjectId: selectedSubject,
              subjectName: subject?.name || "Desconhecido",
              topic: topic,
              startTime: Date.now() - workMinutes * 60 * 1000,
              endTime: Date.now(),
              duration: workMinutes,
            });
            setLastStudiedSession({ subjectId: selectedSubject, topic });
            finishedWork = true;
          }
          switchMode(finishedWork);
          return 0;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isFocusPaused, mode, addSession, selectedSubject, switchMode, workMinutes, topic, setLastStudiedSession]);

  const handleSpacebarToggle = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && isActive && mode === 'work') {
      const now = Date.now();
      if (now - lastSpacePressRef.current < 500) { // Double press within 500ms
        setIsFocusPaused(prev => {
            const newPausedState = !prev;
            setIsFlipped(!newPausedState); // Flip when resuming
            return newPausedState;
        });
        setShowExitMessage(false);
        if (exitMessageTimeoutRef.current) clearTimeout(exitMessageTimeoutRef.current);
      }
      lastSpacePressRef.current = now;
    }
  }, [isActive, mode]);

  const handleUserActivity = useCallback(() => {
    if (isActive && mode === 'work' && !isFocusPaused && !showExitMessage) {
        setShowExitMessage(true);
        if (exitMessageTimeoutRef.current) clearTimeout(exitMessageTimeoutRef.current);
        exitMessageTimeoutRef.current = setTimeout(() => {
            setShowExitMessage(false);
        }, 5000);
    }
  }, [isActive, mode, isFocusPaused, showExitMessage]);
  
  useEffect(() => {
    if (isActive && mode === 'work' && !isFocusPaused) {
        window.addEventListener('keydown', handleSpacebarToggle);
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);

        return () => {
            window.removeEventListener('keydown', handleSpacebarToggle);
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
            if (exitMessageTimeoutRef.current) clearTimeout(exitMessageTimeoutRef.current);
        };
    }
  }, [isActive, mode, isFocusPaused, handleSpacebarToggle, handleUserActivity]);


  const toggleTimer = () => {
    if (isFocusPaused) {
      setIsFocusPaused(false);
      setIsFlipped(true); // Flip back to focus mode
      return;
    }
    
    if (mode === "work" && (!selectedSubject || !topic)) {
      toast({
        title: "Preencha os campos",
        description: "Você precisa escolher uma matéria e um tópico para iniciar.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isActive) {
        setIsActive(true);
        setIsFlipped(true);
    } else {
        setIsActive(false);
        setIsFlipped(false);
    }
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setIsFlipped(false);
    setIsFocusPaused(false);
    setTimeLeft((mode === "work" ? workMinutes : breakMinutes) * 60);
  };

  const handleSaveSettings = () => {
    setWorkMinutes(tempWorkMinutes > 0 ? tempWorkMinutes : 25);
    setBreakMinutes(tempBreakMinutes > 0 ? tempBreakMinutes : 5);
    if (!isActive) {
        setTimeLeft(tempWorkMinutes * 60);
    }
    toast({ title: "Configurações salvas!" });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const navigateToAssessment = () => {
    router.push("/assessment");
  };

  const isFocusModeActive = isActive && mode === 'work' && !isFocusPaused;

  return (
    <div className="relative">
      <AnimatePresence>
        {isFocusModeActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="focus-overlay"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFocusModeActive && showExitMessage && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-neutral-300 bg-black/50 p-4 rounded-md text-center max-w-sm"
            >
                <p>Recomenda-se não interrromper uma sessão de concentração, mas se for necessário basta apertar a tecla de espaço duas vezes.</p>
            </motion.div>
        )}
      </AnimatePresence>

        <motion.div
            className="relative w-full"
            animate={{ y: isFocusModeActive ? "-190px" : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
            <motion.div
                className="relative w-64 h-32 mx-auto"
                style={{ perspective: 1000 }}
                >
                <motion.div
                    className="relative w-full h-full text-center transition-transform duration-700"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Front and Back are the same but on different sides of the flip */}
                    {[0, 180].map(rotation => (
                        <div key={rotation} className={cn("absolute w-full h-full flex items-center justify-center rounded-lg", isFocusModeActive && "dark:bg-secondary bg-primary/10")} style={{ backfaceVisibility: "hidden", transform: `rotateY(${rotation}deg)` }}>
                            <span className="font-headline text-6xl font-bold tabular-nums">
                            {formatTime(timeLeft)}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
      
      <Card className={cn("lg:col-span-1 transition-all duration-300", isFocusModeActive && "bg-transparent border-transparent shadow-none")}>
        <CardHeader className={cn("transition-opacity", isFocusModeActive && "opacity-0")}>
          <div className="flex items-center justify-between">
            <CardTitle className="font-headline flex items-center gap-2">
              Foco Total
              <Badge variant={mode === "work" ? "default" : "secondary"}>
                {mode === "work" ? "Estudo" : "Descanso"}
              </Badge>
            </CardTitle>
            <Dialog onOpenChange={(open) => { if (open) { setTempWorkMinutes(workMinutes); setTempBreakMinutes(breakMinutes); }}}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Configurar Pomodoro</DialogTitle>
                  <DialogDescription>Ajuste os tempos para suas sessões de estudo e descanso.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="work-duration" className="text-right">Estudo (min)</Label>
                    <Input id="work-duration" type="number" value={tempWorkMinutes} onChange={(e) => setTempWorkMinutes(Number(e.target.value))} className="col-span-3"/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="break-duration" className="text-right">Descanso (min)</Label>
                    <Input id="break-duration" type="number" value={tempBreakMinutes} onChange={(e) => setTempBreakMinutes(Number(e.target.value))} className="col-span-3"/>
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
        <CardContent className="flex flex-col items-center gap-6 pt-6">
           <div className={cn("w-full space-y-4 transition-opacity", isFocusModeActive && "opacity-0 pointer-events-none")}>
            <div className="grid grid-cols-2 gap-4">
              <Select onValueChange={setSelectedSubject} value={selectedSubject || undefined} disabled={(isActive || isFocusPaused) && mode === "work"}>
                <SelectTrigger><SelectValue placeholder="Matéria" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Tópico estudado" value={topic} onChange={(e) => setTopic(e.target.value)} disabled={(isActive || isFocusPaused) && mode === "work"} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={toggleTimer} size="lg">
                {isFocusPaused ? <ExternalLink className="mr-2 h-4 w-4" /> : (isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />)}
                {isFocusPaused ? "Retornar" : (isActive ? "Pausar" : "Iniciar")}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Resetar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sessão de Foco Concluída!</AlertDialogTitle>
            <AlertDialogDescription>Ótimo trabalho! Que tal registrar uma autoavaliação sobre esta sessão de estudos para acompanhar seu progresso?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Agora Não</AlertDialogCancel>
            <AlertDialogAction onClick={navigateToAssessment}>Fazer Avaliação</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
