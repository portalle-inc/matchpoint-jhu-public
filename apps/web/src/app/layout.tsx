import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Box } from "@chakra-ui/react";
import { Suspense } from "react";
import { Providers } from "@/components/provider";
import { NavBar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Portalle",
    default: "Portalle",
  },
  description: "A PortalleTM project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Box minH="100vh">
            <NavBar />
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
