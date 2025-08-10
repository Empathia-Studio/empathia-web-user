import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import ModernNavbar from "@/shared/components/navbar";
import ModernFooter from "@/shared/components/footer";
import { ThemeProvider } from "@/shared/components/theme-provider"
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { EnvIndicator } from "@/shared/components/env-indicator";
import { SpeedInsights } from "@vercel/speed-insights/next"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Empathia",
  description: "Empathia is a platform for sharing your feelings with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <ModernNavbar />
              <main className="flex-grow pt-24">{children}</main>
              <ModernFooter />
              <EnvIndicator /> 
              <SpeedInsights />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
