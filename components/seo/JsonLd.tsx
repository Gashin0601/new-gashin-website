export default function JsonLd() {
  const baseUrl = "https://gashinsuzuki.com";

  // Person Schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "鈴木我信",
    alternateName: ["Gashin Suzuki", "Suzuki Gashin", "gashin_lv"],
    description:
      "慶應義塾大学SFCの学生。視覚障害をもちながら、テクノロジーで学びと社会の垣根をゆるめる実験をしています。動画クリエイター、アプリ開発者として活動中。",
    url: baseUrl,
    image: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/profile/suzuki_gashin.jpeg`,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://x.com/suzuki_gashin",
      "https://twitter.com/suzuki_gashin",
      "https://instagram.com/suzuki_gashin",
      "https://facebook.com/suzuki.gashin",
      "https://youtube.com/@gashin_lv",
      "https://www.tiktok.com/@gashin_lv",
    ],
    jobTitle: "学生 / 動画クリエイター / アプリ開発者",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "慶應義塾大学",
      alternateName: "Keio University",
      department: "総合政策学部",
    },
    knowsAbout: [
      "視覚障害",
      "アクセシビリティ",
      "テクノロジー",
      "動画制作",
      "アプリ開発",
    ],
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "鈴木我信 | Gashin Suzuki",
    description:
      "慶應義塾大学SFCの学生・鈴木我信の公式サイト。視覚とテクノロジーで、学びと社会の垣根をゆるめる実験をしています。",
    publisher: {
      "@id": `${baseUrl}/#person`,
    },
    inLanguage: "ja-JP",
    copyrightYear: new Date().getFullYear(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // WebPage Schema (for homepage)
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/#webpage`,
    url: baseUrl,
    name: "鈴木我信 | Gashin Suzuki - 視覚とテクノロジーの実験者",
    description:
      "慶應義塾大学SFCの学生・鈴木我信の公式サイト。視覚障害をもちながら、テクノロジーで学びと社会の垣根をゆるめる実験をしています。",
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@id": `${baseUrl}/#person`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/og/og-image-large.png`,
    },
    inLanguage: "ja-JP",
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: baseUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
