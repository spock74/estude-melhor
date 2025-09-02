"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardCheck,
  BrainCircuit,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assessment", label: "Autoavaliação", icon: ClipboardCheck },
  { href: "/guidance", label: "Orientação IA", icon: BrainCircuit },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function SidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const navLinkClasses = (href: string) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
      pathname === href && "bg-accent text-primary",
      isMobile && "text-lg"
    );

  return (
    <nav className={`grid items-start px-2 text-sm font-medium ${isMobile ? 'gap-4 mt-8' : 'gap-1 lg:px-4'}`}>
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={navLinkClasses(href)}>
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
