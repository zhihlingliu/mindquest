import type { Metadata } from "next";
import { Press_Start_2P, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700"],
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MindQuest｜管理者的試煉",
  description: "Where Theory Becomes Mastery — 在每一個決策裡，成為真正的管理者",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${pressStart2P.variable} ${notoSansTC.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
