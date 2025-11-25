import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import LoadingScreen from "@/components/ui/LoadingScreen";

export const metadata: Metadata = {
  title: "鈴木我信 | Gashin Suzuki",
  description: "慶應SFCの学生。視覚とテクノロジーで、学びと社会の垣根をゆるめる実験をしています。",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="bg-noise" />
        <LoadingScreen />
        <Header />
        {children}
      </body>
    </html>
  );
}
