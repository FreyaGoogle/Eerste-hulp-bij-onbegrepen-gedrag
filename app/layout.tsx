import type { Metadata } from "next";
import { Lora, DM_Sans } from "next/font/google";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Eerste Hulp bij Onbegrepen Gedrag",
  description: "Praktisch handelingsperspectief voor zorgmedewerkers bij onbegrepen gedrag bij dementie.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={`${lora.variable} ${dmSans.variable} bg-dv-cream text-gray-900 dark:bg-gray-950 dark:text-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
