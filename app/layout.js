"use client";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

function MainLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  if (status === "loading") return null;
  if (session?.user?.role === "superadmin" && !pathname.startsWith("/superadmin")) {
    router.replace("/superadmin/dashboard");
    return null;
  }
  if (session?.user?.role !== "superadmin" && pathname.startsWith("/superadmin")) {
    router.replace("/auth/login");
    return null;
  }
  return children;
}

export default function RoutLayout({children, session}) {
  return (
    <html>
        <head>
            <title>
                Sistema Gestao Empresarial
            </title>
        </head>
        <SessionProvider session={session}>
        <body>
            <MainLayout>{children}</MainLayout>
        </body>
        </SessionProvider>
    </html>
  )
}