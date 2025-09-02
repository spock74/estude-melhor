"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMemo } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ShieldCheck, Star } from "lucide-react";
import type { ParentalAssessment as ParentalAssessmentType } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formSchema = z.object({
  adherenceRating: z.number().min(1).max(5),
  notes: z.string().optional(),
});

export function ParentalAssessment() {
  const [assessments, setAssessments] = useLocalStorage<ParentalAssessmentType[]>("parentalAssessments", []);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adherenceRating: 3,
      notes: "",
    },
  });
  
  const adherenceLabels = ["Muito Baixa", "Baixa", "Média", "Alta", "Muito Alta"];

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newAssessment: ParentalAssessmentType = {
      id: crypto.randomUUID(),
      date: Date.now(),
      ...values,
    };
    setAssessments(prev => [...(prev || []), newAssessment]);
    toast({ title: "Avaliação salva com sucesso!" });
    form.reset({ adherenceRating: 3, notes: "" });
  }

  const sortedAssessments = useMemo(() => {
    return [...(assessments || [])].sort((a, b) => b.date - a.date);
  }, [assessments]);

  const chartData = useMemo(() => {
    return [...(assessments || [])]
      .sort((a, b) => a.date - b.date)
      .map(a => ({
        date: format(new Date(a.date), 'dd/MM'),
        Nota: a.adherenceRating,
        notes: a.notes,
      }));
  }, [assessments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ShieldCheck /> Avaliação do Responsável
        </CardTitle>
        <CardDescription>
          Acompanhe e avalie a dedicação do estudante.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Registrar Avaliação</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="register" className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="adherenceRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adesão ao plano de estudos: <span className="font-bold text-primary">{adherenceLabels[field.value-1]}</span></FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
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
                          placeholder="Adicione observações sobre o progresso ou comportamento do estudante..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Salvar Avaliação</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="history" className="pt-6">
            <div className="space-y-8">
              {sortedAssessments.length > 0 ? (
                <>
                  <div>
                    <h3 className="text-lg font-headline mb-4">Evolução da Adesão</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={[1, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                          }}
                        />
                        <Line type="monotone" dataKey="Nota" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-lg font-headline mb-4">Avaliações Recentes</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Nota de Adesão</TableHead>
                            <TableHead>Observações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedAssessments.slice(0, 5).map(assessment => (
                            <TableRow key={assessment.id}>
                              <TableCell>{format(new Date(assessment.date), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {assessment.adherenceRating} <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                </div>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">{assessment.notes || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-md">
                  <p className="text-muted-foreground">Nenhuma avaliação de responsável registrada.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
