import type { Metadata } from "next";
import { Inter, Gotu } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "@/providers/context-provider";
import classNames from "classnames";
import Toaster from "@/components/UI/toasts/toaster";

const inter = Inter({ subsets: ["latin"] });
const gotu = Gotu({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F A K E",
  description: "F A K E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={classNames([inter.className])}>
        <main className="flex min-h-screen flex-col items-center justify-center gotu">
          <ContextProvider>
            {children}
            <Toaster />
          </ContextProvider>
        </main>
      </body>
    </html>
  );
}
