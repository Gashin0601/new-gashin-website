import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ニュース",
  description:
    "鈴木我信（Gashin Suzuki）のニュース一覧。日刊SPA!、J-CASTニュースなどのメディア掲載記事や、ミテルンデスなどのプロジェクト情報。",
  openGraph: {
    title: "ニュース | 鈴木我信",
    description:
      "鈴木我信のニュース一覧。各メディアでの取材記事やプロジェクト情報。",
    url: "https://gashin.me/news",
    type: "website",
  },
  twitter: {
    title: "ニュース | 鈴木我信",
    description:
      "鈴木我信のニュース一覧。各メディアでの取材記事やプロジェクト情報。",
  },
  alternates: {
    canonical: "https://gashin.me/news",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
