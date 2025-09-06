import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/components/signup-form";
import { Users, Shield } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center neural-bg p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-secondary rounded-full opacity-20 blur-xl float"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-primary rounded-full opacity-20 blur-xl float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-gradient-accent rounded-full opacity-30 blur-lg float" style={{animationDelay: '4s'}}></div>
      
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="p-4 bg-gradient-primary rounded-2xl glow shimmer">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
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
          <h1 className="text-5xl font-display font-bold gradient-text">
            Estude Melhor
          </h1>
        </div>
        <p className="text-center text-muted-foreground mb-10 text-lg font-medium">
          A ferramenta completa para organizar os estudos, focar no que importa e alcançar seus objetivos.
        </p>
        <Card className="w-full glass-card border-0 shadow-2xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-display text-2xl font-semibold flex items-center gap-3">
              <Users /> Crie sua Conta de Responsável
            </CardTitle>
            <CardDescription className="text-base">
              Apenas pais ou responsáveis legais podem criar uma conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 glass-card border-primary/30 bg-gradient-glow">
              <Shield className="h-4 w-4 !text-primary" />
              <AlertTitle className="font-display font-semibold !text-primary">
                Aviso Importante aos Pais e Responsáveis
              </AlertTitle>
              <AlertDescription className="!text-primary/90 font-medium">
                Ao criar esta conta, você assume a responsabilidade pelo uso do aplicativo pelo estudante. A sua supervisão é fundamental para garantir uma experiência de estudo segura, produtiva e positiva.
              </AlertDescription>
            </Alert>
            <SignUpForm />
          </CardContent>
        </Card>
        <p className="text-center text-muted-foreground mt-6 font-medium">
            Já tem uma conta?{' '}
            <Link href="/" className="gradient-text font-semibold hover:opacity-80 transition-opacity">
                Entre
            </Link>
        </p>
      </div>
    </main>
  );
}