import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eerste Hulp bij Onbegrepen Gedrag",
  description: "Praktisch handelingsperspectief voor zorgmedewerkers bij onbegrepen gedrag bij dementie.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
