export default function JsonLd() {
  const baseUrl = "https://gashin.me";

  // Person Schema - Enhanced for AIO
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "鈴木我信",
    givenName: "我信",
    familyName: "鈴木",
    alternateName: ["Gashin Suzuki", "Suzuki Gashin", "gashin_lv"],
    description:
      "慶應義塾大学 環境情報学部 1年。生まれつきの視覚障害（弱視）で、SNSでの発信やアプリ開発を通して、障害を強みに変えるために活動中。",
    url: baseUrl,
    image: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/profile/profile.png`,
      width: 500,
      height: 600,
    },
    sameAs: [
      "https://x.com/suzuki_gashin",
      "https://twitter.com/suzuki_gashin",
      "https://instagram.com/suzuki_gashin",
      "https://youtube.com/@gashin_lv",
      "https://www.tiktok.com/@gashin_lv",
    ],
    jobTitle: ["学生", "動画クリエイター", "アプリ開発者"],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "慶應義塾大学",
      alternateName: "Keio University",
      department: {
        "@type": "Organization",
        name: "環境情報学部",
      },
      url: "https://www.keio.ac.jp/",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "慶應義塾大学 環境情報学部",
    },
    knowsAbout: [
      "視覚障害",
      "弱視",
      "アクセシビリティ",
      "テクノロジー",
      "動画制作",
      "アプリ開発",
      "SNSマーケティング",
      "YouTube",
      "TikTok",
    ],
    nationality: {
      "@type": "Country",
      name: "日本",
    },
    gender: "Male",
    birthPlace: {
      "@type": "Place",
      name: "日本",
    },
  };

  // ProfilePage Schema - For AIO optimization
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${baseUrl}/#profilepage`,
    url: baseUrl,
    name: "鈴木我信｜Suzuki Gashin",
    description:
      "慶應義塾大学 環境情報学部 1年。生まれつきの視覚障害（弱視）で、SNSでの発信やアプリ開発を通して、障害を強みに変えるために活動中。",
    mainEntity: {
      "@id": `${baseUrl}/#person`,
    },
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "ja-JP",
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "鈴木我信｜Suzuki Gashin",
    alternateName: ["鈴木我信公式サイト", "Gashin Suzuki Official"],
    description:
      "慶應義塾大学 環境情報学部 1年。生まれつきの視覚障害（弱視）で、SNSでの発信やアプリ開発を通して、障害を強みに変えるために活動中。",
    publisher: {
      "@id": `${baseUrl}/#person`,
    },
    author: {
      "@id": `${baseUrl}/#person`,
    },
    inLanguage: "ja-JP",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@id": `${baseUrl}/#person`,
    },
  };

  // WebPage Schema (for homepage)
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/#webpage`,
    url: baseUrl,
    name: "鈴木我信｜Suzuki Gashin",
    description:
      "慶應義塾大学 環境情報学部 1年。生まれつきの視覚障害（弱視）で、SNSでの発信やアプリ開発を通して、障害を強みに変えるために活動中。",
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@id": `${baseUrl}/#person`,
    },
    mainEntity: {
      "@id": `${baseUrl}/#person`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/og/og-image-large.png`,
    },
    inLanguage: "ja-JP",
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
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

  // FAQ Schema - For AIO optimization
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "鈴木我信とは誰ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "鈴木我信（すずき がしん）は、慶應義塾大学 環境情報学部 1年の学生です。生まれつきの視覚障害（弱視）を持ちながら、SNSでの発信やアプリ開発を通して、障害を強みに変えるために活動しています。",
        },
      },
      {
        "@type": "Question",
        name: "鈴木我信はどのような活動をしていますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "YouTubeやTikTokでの動画制作、アプリ開発（ミテルンデス等）、SNSでの情報発信など、テクノロジーを活用した様々な活動を行っています。視覚障害者としての経験を活かし、アクセシビリティの向上にも取り組んでいます。",
        },
      },
      {
        "@type": "Question",
        name: "ミテルンデスとは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ミテルンデスは、鈴木我信が開発に携わる視覚障害者向けのアプリケーションです。視覚障害者の日常生活をサポートするためのツールとして開発されています。",
        },
      },
      {
        "@type": "Question",
        name: "鈴木我信のSNSアカウントはどこですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "YouTube: @gashin_lv、TikTok: @gashin_lv、X(Twitter): @suzuki_gashin、Instagram: @suzuki_gashin でフォローできます。",
        },
      },
    ],
  };

  // Organization Schema for Miterundesu
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Project",
    "@id": `${baseUrl}/#miterundesu`,
    name: "ミテルンデス",
    alternateName: "Miterundesu",
    description: "視覚障害者の日常生活をサポートするアプリケーション",
    url: "https://miterundesu.jp",
    founder: {
      "@id": `${baseUrl}/#person`,
    },
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
          __html: JSON.stringify(profilePageSchema),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </>
  );
}
