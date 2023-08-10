import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import AppLayout from "@/components/layout/AppLayout";
import StyledComponentsRegistry from "@/libs/registry";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "숫자야구 게임",
  description: "숫자야구 게임",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={roboto.className}>
        <StyledComponentsRegistry>
          <AppLayout>{children}</AppLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
