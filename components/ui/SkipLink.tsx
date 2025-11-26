"use client";

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export default function SkipLink({
  href = "#main-content",
  children = "メインコンテンツへスキップ",
}: SkipLinkProps) {
  return (
    <a href={href} className="skip-link">
      {children}
    </a>
  );
}
