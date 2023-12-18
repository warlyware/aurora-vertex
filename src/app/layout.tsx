import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "@/providers/context-provider";
import classNames from "classnames";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AURORA VERTEX",
  description: "AURORA VERTEX",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={classNames([inter.className, "bg-blue-700"])}>
        <main className="flex min-h-screen flex-col items-center justify-between">
          <ContextProvider>{children}</ContextProvider>
        </main>
      </body>
    </html>
  );
}
