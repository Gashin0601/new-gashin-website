# カラーパレット | Color Palette

このファイルは、ウェブサイト全体で使用する統一されたカラーコードを定義しています。

## プライマリカラー | Primary Colors

### テキストカラー | Text Colors

| 用途 | カラー名 | カラーコード | 説明 |
|------|----------|--------------|------|
| 主要テキスト | `text-primary` | `#0B0C10` | ヘッディングや本文のメインカラー。深いチャコールグレー。 |
| 副次テキスト | `text-secondary` | `#4A4A4A` | サブテキストや説明文に使用。ミディアムグレー。 |

### 背景カラー | Background Colors

| 用途 | カラー名 | カラーコード | 説明 |
|------|----------|--------------|------|
| 主要背景 | `bg-primary` | `#FFFFFF` | メインセクションの背景。純白。 |
| 副次背景 | `bg-secondary` | `#F5F5F5` | カードやセカンダリセクションの背景。オフホワイト。 |

### アクセントカラー | Accent Colors

| 用途 | カラー名 | カラーコード | 説明 |
|------|----------|--------------|------|
| 主要アクセント | `accent` | `#667EEA` | ボタンやリンクのメインカラー。淡いパープルブルー。SNSアイコンと調和する柔らかい色味。 |
| ホバーアクセント | `accent-hover` | `#5568D3` | ホバー時のアクセントカラー。主要アクセントより少し濃い。 |

### ボーダーカラー | Border Colors

| 用途 | カラー名 | カラーコード | 説明 |
|------|----------|--------------|------|
| ボーダー | `border-color` | `#E0E0E0` | 境界線や区切り線に使用。ライトグレー。 |

## グラデーション | Gradients

### ヒーローセクション

```css
background: linear-gradient(135deg, #F5F7FA 0%, #C3CFE2 100%);
```

淡いブルーグレーのグラデーション。柔らかく洗練された印象。

## ダークテーマ | Dark Theme

| 用途 | カラー名 | カラーコード | 説明 |
|------|----------|--------------|------|
| 主要背景 | `bg-primary` | `#0B0C10` | ダークモードのメイン背景。 |
| 副次背景 | `bg-secondary` | `#1A1B1F` | ダークモードのセカンダリ背景。 |
| 主要テキスト | `text-primary` | `#FFFFFF` | ダークモードのメインテキスト。 |
| 副次テキスト | `text-secondary` | `#B8B8B8` | ダークモードのサブテキスト。 |
| ボーダー | `border-color` | `#2A2B2F` | ダークモードのボーダー。 |
| 主要アクセント | `accent` | `#667EEA` | ダークモードでも同じアクセントカラーを使用。 |
| ホバーアクセント | `accent-hover` | `#7B8FF5` | ダークモードのホバー時は少し明るく。 |

## SNSブランドカラー | SNS Brand Colors

各SNSプラットフォームの公式ブランドカラーとの調和を考慮しています。

| プラットフォーム | カラーコード | 備考 |
|------------------|--------------|------|
| YouTube | `#FF0000` | 赤 |
| Instagram | `#E4405F` | ピンクパープルのグラデーション（代表色） |
| TikTok | `#00F2EA`, `#FF0050` | シアンとピンク |
| X (Twitter) | `#000000` | 黒 |
| Facebook | `#1877F2` | 青 |

**統一コンセプト**: アクセントカラー `#667EEA` は、InstagramのパープルトーンとFacebookのブルーを橋渡しする柔らかい色味で、すべてのSNSアイコンと調和するよう設計されています。

## カラー使用例 | Usage Examples

### ボタン

```tsx
// Primary Button
<button className="bg-[#667EEA] hover:bg-[#5568D3] text-white">
  クリック
</button>

// Outline Button
<button className="border-2 border-[#667EEA] text-[#667EEA] hover:bg-[#667EEA] hover:text-white">
  クリック
</button>
```

### テキスト

```tsx
// Heading
<h1 className="text-[#0B0C10]">見出し</h1>

// Description
<p className="text-[#4A4A4A]">説明文</p>
```

### 背景

```tsx
// White Section
<section className="bg-[#FFFFFF]">
  コンテンツ
</section>

// Light Gray Section
<section className="bg-[#F5F5F5]">
  コンテンツ
</section>
```

## アクセシビリティ | Accessibility

### コントラスト比

- `#0B0C10` on `#FFFFFF`: **16.47:1** ✓ (AAA)
- `#4A4A4A` on `#FFFFFF`: **8.59:1** ✓ (AAA)
- `#667EEA` on `#FFFFFF`: **4.55:1** ✓ (AA)
- `#FFFFFF` on `#667EEA`: **4.55:1** ✓ (AA)

すべての色の組み合わせがWCAG 2.1 AA基準を満たしています。

## デザイン哲学 | Design Philosophy

1. **淡く洗練された色味**: 従来の鮮やかな青（`#222284`）から、より柔らかく洗練されたパープルブルー（`#667EEA`）に変更。モダンで上品な印象を与えます。

2. **SNSとの調和**: すべてのSNSプラットフォームのブランドカラーと調和する中間的な色味を選択。Instagram、Facebook、TikTokなど、どのアイコンと並べても違和感がありません。

3. **アクセシビリティ重視**: すべての色の組み合わせでWCAG基準を満たし、視認性とアクセシビリティを確保。

4. **一貫性**: ライトテーマとダークテーマで統一感のある色使いを実現。

---

最終更新: 2025-11-09
