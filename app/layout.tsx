import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { cookies } from "next/headers";
import ThemeChooser, { Theme } from "@/components/ThemeChooser/ThemeChooser";
import  "@/styles/themes.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nitbit",
  description: "nitbit",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = (await cookies()).get("theme")?.value as Theme || 'default';

  return (
    <html lang="en">
      <body className={`${inter.className} ${theme}`}>
        <ThemeProvider initialTheme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}