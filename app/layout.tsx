import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "鈴木我信 | Gashin Suzuki",
  description: "慶應SFCの学生。視覚とテクノロジーで、学びと社会の垣根をゆるめる実験をしています。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
