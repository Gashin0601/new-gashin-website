import { Metadata } from "next";

export const metadata: Metadata = {
  title: "メディア掲載・ニュース",
  description:
    "鈴木我信（Gashin Suzuki）のメディア掲載情報とニュース一覧。日刊SPA!、J-CASTニュースなどのメディア掲載記事や、ミテルンデスなどのプロジェクト情報。",
  openGraph: {
    title: "メディア掲載・ニュース | 鈴木我信",
    description:
      "鈴木我信のメディア掲載情報とニュース一覧。各メディアでの取材記事やプロジェクト情報。",
    url: "https://gashinsuzuki.com/news",
    type: "website",
  },
  twitter: {
    title: "メディア掲載・ニュース | 鈴木我信",
    description:
      "鈴木我信のメディア掲載情報とニュース一覧。各メディアでの取材記事やプロジェクト情報。",
  },
  alternates: {
    canonical: "https://gashinsuzuki.com/news",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
