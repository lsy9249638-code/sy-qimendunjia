import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "奇门时局 | 私人奇门遁甲盘",
  description: "排布、记录与发布奇门遁甲时盘",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
