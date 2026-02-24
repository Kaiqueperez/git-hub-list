import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Git hub list",
  description: "Listagem de repositórios GitHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
