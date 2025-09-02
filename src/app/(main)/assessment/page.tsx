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
import { ClipboardCheck, Star } from "lucide-react";
import type { SelfAssessment as SelfAssessmentType } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { schoolYears, curriculum, getSubjectNameById } from "@/lib/curriculum";
import { useState, useMemo } from "react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";

const formSchema = z.object({
  schoolYear: z.string().min(1, "Selecione o ano."),
  subjectId: z.string().min(1, "Selecione a matéria."),
  rating: z.number().min(1).max(5),
  notes: z.string().optional(),
});

const ratingDescriptions = ["Muito Ruim", "Ruim", "Regular", "Bom", "Ótimo"];

export default function AssessmentPage() {
  const [assessments, setAssessments] = useLocalStorage<SelfAssessmentType[]>("selfAssessments", []);
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState(schoolYears[0]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolYear: schoolYears[0],
      subjectId: "",
      rating: 3,
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newAssessment: SelfAssessmentType = {
      id: crypto.randomUUID(),
      date: Date.now(),
      schoolYear: values.schoolYear,
      subjectName: getSubjectNameById(values.subjectId),
      ...values,
    };
    setAssessments(prev => [...(prev || []), newAssessment]);
    toast({ title: "Autoavaliação salva com sucesso!" });
    form.reset({ schoolYear: selectedYear, subjectId: "", rating: 3, notes: "" });
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
            Como você avalia seu desempenho?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="schoolYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano/Série</FormLabel>
                    <Select onValueChange={(value) => { field.onChange(value); setSelectedYear(value); }} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecione o ano" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schoolYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matéria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecione a matéria" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(curriculum[selectedYear] || []).map(subject => (
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
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avaliação: <span className="font-bold text-primary">{ratingDescriptions[field.value-1]}</span></FormLabel>
                    <FormControl>
                       <div className="flex items-center gap-2 pt-2">
                        {[1, 2, 3, 4, 5].map(value => (
                            <Star 
                                key={value} 
                                onClick={() => field.onChange(value)} 
                                className={cn("w-8 h-8 cursor-pointer transition-colors", field.value >= value ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50')}
                            />
                        ))}
                       </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Quais são suas maiores dificuldades ou conquistas?"
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
          <CardDescription>Suas últimas autoavaliações.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Matéria</TableHead>
                  <TableHead className="text-right">Nota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAssessments.length > 0 ? sortedAssessments.map(assessment => (
                  <TableRow key={assessment.id}>
                    <TableCell>{format(new Date(assessment.date), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                    <TableCell className="font-medium">{assessment.subjectName}</TableCell>
                    <TableCell className="text-right flex justify-end items-center gap-1">
                      {assessment.rating} <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">Nenhuma avaliação registrada.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
