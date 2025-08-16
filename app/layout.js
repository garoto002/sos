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
                Sistema SOS
            </title>
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />
        </head>
        <SessionProvider session={session}>
        <body>
            <MainLayout>{children}</MainLayout>
        </body>
        </SessionProvider>
    </html>
  )
}