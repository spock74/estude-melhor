import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/components/signup-form";
import { Users, Shield } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 7L12 12L22 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-headline font-bold text-foreground">
            Estude Melhor
          </h1>
        </div>
        <p className="text-center text-muted-foreground mb-8 text-lg">
          A ferramenta completa para organizar os estudos, focar no que importa e alcançar seus objetivos.
        </p>
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Users /> Crie sua Conta de Responsável
            </CardTitle>
            <CardDescription>
              Apenas pais ou responsáveis legais podem criar uma conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-primary/50 bg-primary/5 text-primary-foreground">
              <Shield className="h-4 w-4 !text-primary" />
              <AlertTitle className="font-headline !text-primary">
                Aviso Importante aos Pais e Responsáveis
              </AlertTitle>
              <AlertDescription className="!text-primary/80">
                Ao criar esta conta, você assume a responsabilidade pelo uso do aplicativo pelo estudante. A sua supervisão é fundamental para garantir uma experiência de estudo segura, produtiva e positiva.
              </AlertDescription>
            </Alert>
            <SignUpForm />
          </CardContent>
        </Card>
        <p className="text-center text-muted-foreground mt-4">
            Já tem uma conta?{' '}
            <Link href="/" className="text-primary hover:underline">
                Entre
            </Link>
        </p>
      </div>
    </main>
  );
}