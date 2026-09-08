import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "BizLink AI",
  description: "Premium AI knowledge system for small business packaging decisions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full bg-[var(--bg-page)] text-[var(--text-primary)]">
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
