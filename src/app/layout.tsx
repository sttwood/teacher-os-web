import type { Metadata } from "next";
import "./globals.css";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { AuthBootstrap } from "@/features/auth/components/AuthBootstrap";

export const metadata: Metadata = {
  title: "Teacher OS",
  description: "Teacher OS Plan Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <AuthBootstrap>
          <AuthGuard>{children}</AuthGuard>
        </AuthBootstrap>
      </body>
    </html>
  );
}
