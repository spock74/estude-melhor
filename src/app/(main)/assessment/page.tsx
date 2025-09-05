
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardCheck, TrendingUp } from "lucide-react";
import type { SelfAssessment as SelfAssessmentType } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { subjects, getSubjectNameById } from "@/lib/curriculum";
import { useState, useMemo } from "react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const assessmentLabels = {
  concentration: "Capacidade de Concentração",
  knowledgeGain: "Ganho de Conhecimento",
  subjectDifficulty: "Dificuldade com a Matéria",
  topicDifficulty: "Dificuldade com o Tópico",
  timeManagement: "Cumprimento dos Tempos"
};

const formSchema = z.object({
  subjectId: z.string().min(1, "Selecione a matéria."),
  topic: z.string().min(1, "Digite o tópico estudado."),
  concentration: z.number().min(1).max(10),
  knowledgeGain: z.number().min(1).max(10),
  subjectDifficulty: z.number().min(1).max(10),
  topicDifficulty: z.number().min(1).max(10),
  timeManagement: z.number().min(1).max(10),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AssessmentPage() {
  const [assessments, setAssessments] = useLocalStorage<SelfAssessmentType[]>("selfAssessments", []);
  const [sessionInfo] = useLocalStorage<any>("lastStudiedSession", null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: sessionInfo?.subjectId || "",
      topic: sessionInfo?.topic || "",
      concentration: 1,
      knowledgeGain: 1,
      subjectDifficulty: 1,
      topicDifficulty: 1,
      timeManagement: 1,
      notes: "",
    },
  });

  function onSubmit(values: FormData) {
    const newAssessment: SelfAssessmentType = {
      id: crypto.randomUUID(),
      date: Date.now(),
      subjectName: getSubjectNameById(values.subjectId),
      ...values,
    };
    setAssessments(prev => [...(prev || []), newAssessment]);
    toast({ title: "Autoavaliação salva com sucesso!" });
    form.reset({
        subjectId: "",
        topic: "",
        concentration: 1,
        knowledgeGain: 1,
        subjectDifficulty: 1,
        timeManagement: 1,
        notes: "",
    });
  }
  
  const sortedAssessments = useMemo(() => {
    return [...(assessments || [])].sort((a, b) => b.date - a.date);
  }, [assessments]);

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <ClipboardCheck /> Nova Autoavaliação
          </CardTitle>
          <CardDescription>
            Avalie sua última sessão de estudos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matéria</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tópico</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Análise Sintática" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
              </div>

              <Accordion type="multiple" className="w-full" defaultValue={['item-0', 'item-1', 'item-2', 'item-3', 'item-4']}>
                {Object.entries(assessmentLabels).map(([key, label], index) => (
                   <FormField
                    key={key}
                    control={form.control}
                    name={key as keyof FormData}
                    render={({ field }) => (
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>{label}</AccordionTrigger>
                            <AccordionContent>
                                <FormItem>
                                    <FormControl>
                                        <Slider
                                            min={1}
                                            max={10}
                                            step={0.1}
                                            value={[field.value as number]}
                                            onValueChange={(value) => field.onChange(value[0])}
                                            />
                                    </FormControl>
                                    <FormDescription className="text-center text-muted-foreground/80 pt-2">
                                        Arraste para avaliar de "Baixo" a "Alto"
                                    </FormDescription>
                                </FormItem>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                  />
                ))}
              </Accordion>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Gerais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Quais foram suas maiores dificuldades ou conquistas nesta sessão?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Salvar Autoavaliação</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="font-headline">Histórico de Avaliações</CardTitle>
          <CardDescription>Suas últimas autoavaliações detalhadas.</CardDescription>
        </CardHeader>
        <CardContent>
            {sortedAssessments.length > 0 ? (
                 <Accordion type="multiple" className="w-full">
                    {sortedAssessments.map((assessment) => (
                        <AccordionItem key={assessment.id} value={assessment.id}>
                            <AccordionTrigger>
                                <div className="flex justify-between w-full pr-4 text-sm">
                                    <span>{assessment.subjectName}: <span className="font-normal text-muted-foreground">{assessment.topic}</span></span>
                                    <span className="font-normal text-muted-foreground">{format(new Date(assessment.date), 'dd/MM/yy', { locale: ptBR })}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-2 text-sm pl-2">
                                    {Object.entries(assessmentLabels).map(([key, label]) => (
                                        <li key={key} className="flex justify-between items-center">
                                            <span className="text-muted-foreground">{label}:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-primary">{assessment[key as keyof SelfAssessmentType]}</span>
                                                <Progress value={(assessment[key as keyof SelfAssessmentType] as number) * 10} className="w-24 h-1.5" />
                                            </div>
                                        </li>
                                    ))}
                                    {assessment.notes && (
                                        <li className="pt-2 text-muted-foreground border-t mt-3">
                                            <p><span className="font-semibold text-card-foreground">Obs:</span> {assessment.notes}</p>
                                        </li>
                                    )}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>
            ) : (
                <div className="text-center h-24 flex items-center justify-center bg-muted/50 rounded-md">
                    <p className="text-muted-foreground">Nenhuma avaliação registrada.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
