interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  author?: string;
}

export default function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  author = "鈴木我信",
}: ArticleJsonLdProps) {
  const baseUrl = "https://gashin.me";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Person",
      name: author,
      url: baseUrl,
    },
    publisher: {
      "@type": "Person",
      name: "鈴木我信",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image.startsWith("http") ? image : `${baseUrl}${image}`,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema),
      }}
    />
  );
}
