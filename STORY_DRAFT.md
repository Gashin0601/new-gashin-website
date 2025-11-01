# ストーリー構成案

> **関連ドキュメント**: [`CONCEPT.md`](./CONCEPT.md) - プロジェクト全体のコンセプト、技術スタック、デザイン方針を参照

このドキュメントは、`/story` ページの詳細な演出内容とコンテンツ構成を定義します。

## 技術実装の参照

以下の技術仕様は [`CONCEPT.md`](./CONCEPT.md) で定義されています：
- 動画同期システム（Web API、requestAnimationFrame）
- 音声ナレーションシステム（Web Audio API、再生制御）
- CSS Variables テーマシステム
- アクセシビリティ要件（`prefers-reduced-motion`、スクリーンリーダー対応）
- データスキーマ（`story.json` 形式）

---

## オープニング映像（/story ページ開始時）

**映像**: 慶應SFCキャンパスを歩く鮮やかな映像
- 0-5秒：カラフルなキャンパス
- 5秒：徐々にグレースケールに
- 5.5秒：目が閉じる演出
- 6秒：真っ暗な画面へ

---

## 第1章：横浜で生まれる（2006年）

### 映像演出
1. **真っ暗な画面**
   - テキスト表示：「2006年 - 横浜で生まれる」
   - 音声：鈴木我信本人による読み上げ「2006年6月1日、横浜で生まれた」

2. **母親の視点**
   - 真っ暗から徐々に明るく（まぶたが開く演出）
   - フォーカスが合うと、生まれたばかりの赤ちゃんが見える
   - スクリーンリーダー使用時：副音声「母親の視点。目の前に生まれたばかりの我信がいます」

3. **医師の告知**
   - 映像：医師が母親に何かを告げるシーン（ボケ効果）
   - テキスト表示：「生まれてすぐ、医師から『彼は全く見えていません』と告げられた」
   - 音声ナレーション：本人の読み上げ

4. **積み木のシーン**
   - 映像：母親の手が積み木を動かす（POV視点）
   - 赤ちゃんの顔が積み木を追うように動く
   - 笑顔
   - テキスト表示：「しかし両親は『本当に見えていないのだろうか』と漠然とした違和感があったそうだ」

5. **希望の光**
   - 映像：病院の窓から光が差し込む
   - テキスト表示：「右目にわずかながら視力があると診断され、失明を免れた」
   - 音声ナレーション：「今こうして見えているのは、あのとき信じてくれた両親のおかげである」

---

## 第2章：工作と探究心、そして見え方

### 映像演出
1. **工作のシーン**
   - 映像：色紙やダンボールで何かを作る小さな手
   - 完成した作品（ロボット、建物など）
   - 目を近づけて細部を見る姿

2. **賞状のシーン**
   - 映像：研究発表の様子
   - 習字を書く手元（墨と筆）
   - 賞状を受け取る笑顔

3. **星空を見上げる**
   - 映像：夜、空を見上げる少年
   - POV視点：ぼやけた星空（フォーカスが合わない演出）
   - 本人の表情：どうすればいいんだろう…
   - テキスト表示：「見たい。もっとはっきりと」

4. **白杖での通学**
   - 映像：学校へ白杖を持って通う姿
   - 朝の通学路（周りには他の学生たち）
   - 白杖で地面を確認しながら歩く

5. **車に轢かれそうになる**
   - 映像：道路を渡ろうとするシーン
   - 急ブレーキの音
   - ぼやけた視界の演出（視野が狭く、左側が見えない）
   - テキスト表示：「左目が見えなくて、視野が狭くぼやけて見える」

6. **インタラクティブ体験への誘導**
   - テキスト表示：「私の見え方を、実際に体験してみてください」
   - 画面中央に体験ボタン表示

### 🎮 インタラクティブ体験機能（重要）

**コンセプト**: ユーザーが実際に視覚障害者の見え方を体験できるパノラマビューワー

**機能仕様**:
1. **パノラマ撮影**
   - デバイスのカメラでその場のパノラマ写真を撮影
   - または、サンプルパノラマ画像を使用（撮影できない場合）

2. **ビューワーモード**
   - VR/ストリートビューのような360度横スクロール
   - ジャイロスコープ対応（デバイスの傾きで視点移動）
   - マウス/タッチドラッグで視点移動

3. **見え方切り替えボタン**
   - **通常モード**: クリアな視界
   - **視覚障害モード**:
     - 左側が完全に暗い（左目が見えない）
     - 右側も中心のみフォーカス、周辺はぼやけ（視野狭窄）
     - フィルター：`blur(5px)` + 視野マスク
   - ボタン一つで即座に切り替え可能

4. **UI要素**
   - 画面下部：切り替えボタン「通常の見え方 ⇄ 私の見え方」
   - 音声ガイド：「これが私の日常の見え方です」
   - 閉じるボタン：体験終了

### テキスト・ナレーション
「小さい頃、すごく工作が好きな子供だった。手を動かして何かを作ることが楽しくて、夢中になって作品を作り続けた。研究や習字でも賞を取ったりした。

ある日、星空を見ようとした。でも、肉眼ではぼやけて見えない。どうすればいいんだろう――そんな疑問が、いつも心にあった。

学校へは白杖を持って通うようになった。でも私は左目が見えなくて、視野が狭くぼやけて見える。だから、車に轢かれそうになる――そんなこともある。

私の見え方を、実際に体験してみてください。」

---

## 第3章：国立盲学校（2018-2024年）

### 映像演出
1. **新しい環境**
   - 寮の風景
   - 全盲の友人たちとの日常
   - 白杖を使って歩く友人たち

2. **献立の問い**
   - 友人の声：「今日の給食は何？」
   - 毎朝繰り返される同じシーン（タイムラプス風）
   - 本人の顔にフォーカス「プログラミングで解決できるのでは？」

3. **コーディングシーン**
   - 夜、画面の光だけが顔を照らす
   - コードを書く手元（タイピング音）
   - LINEに通知が届く画面

4. **喜びの声**
   - 友人の笑顔
   - テキスト表示：「今まで自分で知ることができなかった情報を、一人で知れるようになった」
   - 本人の実感：「障害があっても自分にできることがあると強く実感した」

---

## 第4章：高校の活動（2021-2024年）

### 映像演出
- モンタージュ形式で活動を次々と表示
  1. iPadセミナーの様子
  2. アプリ開発中の画面
  3. エストニアの風景
  4. 慶應SFCの校舎を見上げる姿

### テキスト・ナレーション
「視覚障害のある子どもたちを対象にiPad活用セミナーを開催したり、視覚障害をシミュレートできるアプリを開発したり、さらにはメディアを立ち上げて、エストニアを訪れたこともある。こうした活動を続けてきたこともあり、AO入試で念願の慶應義塾大学に入学することができた。」

---

## 第5章：慶應SFC入学（2023年）

### 映像演出
1. **期待と現実**
   - SFCの鮮やかなキャンパス風景（カラフル）
   - テキスト表示：「留学生も多く、私のように障害のある学生もいる――そんなインクルーシブな環境だと思っていた」

2. **授業のシーン**
   - 映像：教室（徐々にグレースケールに）
   - テキスト表示：「出生前診断で障害があると分かったら産むか否か」
   - 学生たちの声（エコー、重なり合う）：
     - 「障害があると幸せになれない」
     - 「周囲から反対されそう」
     - 「障害があると分かっていて産むなんて正気じゃない」

3. **心の闇**
   - 映像：画面が暗くなる
   - 本人の顔（影が強い）
   - テキスト表示：「私は生きていてはいけないのだろうか。今までの活動は無駄だったのだろうか」

---

## 第6章：ローソンでの出来事（2024年）

### 映像演出
1. **日常のシーン**
   - ローソン店内
   - スマホをおにぎりに近づける
   - 拡大された画面（具材が見える）

2. **アナウンス**
   - 音声：「店内での写真・動画の撮影はご遠慮ください」
   - 映像：手が止まる
   - 本人の不安な表情

3. **投稿と反響**
   - スマホでXに投稿する手元
   - 通知が次々と増える（数字のカウントアップ）
   - Yahoo!ニュースの画面

4. **希望の光**
   - 映像：徐々に明るくなる
   - テキスト表示：「今まで理解されにくかった障害を知ってもらえたことが、本当に嬉しかった」
   - 音声ナレーション：「障害は誰かに否定されるものではない、自分は自信を持って生きていこう、そう思えた」

---

## 第7章：YouTube開始（2024年〜）

### 映像演出
1. **決意**
   - 映像：カメラに向かって話す準備をする姿
   - テキスト表示：「『障害があっても人生を楽しんでるぜ！』ということを伝えるために、YouTubeを始めた」

2. **現在へ**
   - 映像：YouTubeの動画撮影風景（カラフル、明るい）
   - 笑顔で話す本人
   - カメラが引いていき、SFCキャンパスの俯瞰へ

3. **エンディング**
   - 映像：空を見上げる本人（逆光）
   - テキスト表示：「これからも、自分らしく」
   - フェードアウト

---

## story.json 形式案

```json
{
  "opening": {
    "videoSrc": "/videos/story-opening-sfc.mp4",
    "duration": 6,
    "effects": [
      { "time": 0, "filter": "grayscale(0%)", "description": "鮮やかなSFCキャンパス" },
      { "time": 5, "filter": "grayscale(100%)", "description": "徐々にグレースケール化" },
      { "time": 5.5, "overlay": "eye-closing", "description": "目が閉じる演出" },
      { "time": 6, "fadeOut": true, "description": "真っ暗な画面へ" }
    ]
  },
  "timeline": [
    {
      "chapter": 1,
      "year": 2006,
      "date": "2006年6月1日",
      "title": "横浜で生まれる",
      "layout": "full",
      "videoSrc": "/videos/story/chapter-01-birth.mp4",
      "videoDuration": 30,
      "videoEffects": [
        { "time": 0, "effect": "black-screen", "text": "2006年 - 横浜で生まれる" },
        { "time": 3, "effect": "eyes-opening", "description": "母親の視点、まぶたが開く" },
        { "time": 8, "effect": "doctor-scene", "blur": true },
        { "time": 15, "effect": "toy-blocks", "description": "積み木を追う視線" },
        { "time": 25, "effect": "light-from-window", "description": "希望の光" }
      ],
      "body": "2006年6月1日、横浜で生まれた。生まれてすぐ、医師から「彼は全く見えていません」と告げられ、角膜の手術の話が進んでいた。しかし両親は「本当に見えていないのだろうか」と漠然とした違和感があったそうだ。ある日、積み木を動かしたときに、私がそれを目で追いながら笑っている姿を見て確信したという。すぐに東京・世田谷の生育医療センターでセカンドオピニオンを受けた結果、右目にわずかながら視力があると診断され、失明を免れた。今こうして見えているのは、あのとき信じてくれた両親のおかげである。",
      "audioNarration": "/audio/narration/chapter-01-birth.mp3",
      "audioDescriptionForScreenReader": "/audio/narration/chapter-01-birth-sr.mp3",
      "media": [
        {
          "type": "video",
          "src": "/videos/story/chapter-01-birth.mp4",
          "poster": "/images/story/2006-baby.jpg",
          "alt": "生まれたばかりの我信",
          "audioDescription": "/audio/images/chapter-01-baby.mp3"
        }
      ],
      "accent": "#222284"
    },
    {
      "chapter": 2,
      "title": "工作と探究心、そして見え方",
      "layout": "left",
      "body": "小さい頃、すごく工作が好きな子供だった。手を動かして何かを作ることが楽しくて、夢中になって作品を作り続けた。研究や習字でも賞を取ったりした。ある日、星空を見ようとした。でも、肉眼ではぼやけて見えない。どうすればいいんだろう――そんな疑問が、いつも心にあった。学校へは白杖を持って通うようになった。でも私は左目が見えなくて、視野が狭くぼやけて見える。だから、車に轢かれそうになる――そんなこともある。私の見え方を、実際に体験してみてください。",
      "audioNarration": "/audio/narration/chapter-02-crafts.mp3",
      "videoSrc": "/videos/story/chapter-02-crafts.mp4",
      "videoEffects": [
        { "time": 0, "description": "工作のシーン" },
        { "time": 10, "description": "賞状を受け取る" },
        { "time": 20, "filter": "blur(3px)", "description": "ぼやけた星空（POV）" },
        { "time": 30, "description": "白杖で通学" },
        { "time": 40, "description": "車に轢かれそうになる、ぼやけた視界" }
      ],
      "interactiveExperience": {
        "type": "vision-simulator",
        "ctaText": "私の見え方を体験する",
        "ctaAudio": "/audio/buttons/vision-experience-cta.mp3",
        "features": {
          "panorama": {
            "enabled": true,
            "cameraCapture": true,
            "sampleImage": "/images/story/sample-panorama.jpg"
          },
          "viewer": {
            "mode": "360-panorama",
            "gyroscope": true,
            "dragControl": true
          },
          "visionModes": [
            {
              "id": "normal",
              "label": "通常の見え方",
              "filters": []
            },
            {
              "id": "impaired",
              "label": "私の見え方",
              "filters": [
                { "type": "left-blind", "description": "左目が見えない" },
                { "type": "tunnel-vision", "blur": "5px", "vignette": "0.4", "description": "視野狭窄" }
              ],
              "audioGuide": "/audio/experience/vision-guide.mp3"
            }
          ],
          "toggleButton": {
            "label": "通常の見え方 ⇄ 私の見え方",
            "position": "bottom-center"
          },
          "closeButton": {
            "label": "体験を終了",
            "position": "top-right"
          }
        }
      },
      "media": [
        {
          "type": "video",
          "src": "/videos/story/chapter-02-crafts.mp4",
          "poster": "/images/story/crafts.jpg",
          "alt": "工作と星空、白杖での通学",
          "audioDescription": "/audio/images/chapter-02-crafts.mp3"
        }
      ]
    },
    {
      "chapter": 3,
      "year": 2018,
      "yearRange": "2018-2024",
      "title": "国立盲学校",
      "layout": "full",
      "videoSrc": "/videos/story/chapter-04-blind-school.mp4",
      "body": "そのかいあって、日本で唯一の国立盲学校へ進学できた。そこではほとんどの生徒が寮生活を送っていた。これまで「見えない側」として頼るばかりだった自分が、逆に全盲の友人たちに囲まれ、時には頼りにされるという新しい体験をした。特に記憶に残っているのは、友人が毎朝「今日の給食は何？」と尋ねてきたことだ。最初は声に出して献立を読んでいたが、繰り返すうちに「プログラミングで解決できるのではないか」と考えるようになった。パソコンすら持っていない中で、寝る間も惜しんで独学で学び、ついに毎朝7時に学年のLINEへ献立を自動通知するシステムを作り上げた。そして、そのシステムを使った全盲の友人たちから「今まで自分で知ることができなかった情報を、一人で知れるようになった」と喜びの声をもらえた。その瞬間、障害があっても自分にできることがあると強く実感した。",
      "audioNarration": "/audio/narration/chapter-04-blind-school.mp3",
      "media": [
        {
          "type": "video",
          "src": "/videos/story/chapter-04-blind-school.mp4",
          "poster": "/images/story/blind-school.jpg",
          "alt": "国立盲学校での日々",
          "audioDescription": "/audio/images/chapter-04-blind-school.mp3"
        }
      ]
    },
    {
      "chapter": 4,
      "year": 2021,
      "yearRange": "2021-2024",
      "title": "高校の活動",
      "layout": "right",
      "body": "視覚障害のある子どもたちを対象にiPad活用セミナーを開催したり、視覚障害をシミュレートできるアプリを開発したり、さらにはメディアを立ち上げて、マイナンバーカードのモデルになったとも言われるIT先進国エストニアを訪れ、現地の電子政府の専門家に話を聞いたこともある。こうした活動を続けてきたこともあり、AO入試で念願の慶應義塾大学に入学することができた。",
      "audioNarration": "/audio/narration/chapter-04-activities.mp3",
      "media": [
        {
          "type": "image",
          "src": "/images/story/activities-montage.jpg",
          "alt": "高校での様々な活動",
          "audioDescription": "/audio/images/chapter-04-activities.mp3"
        }
      ]
    },
    {
      "chapter": 5,
      "year": 2023,
      "title": "慶應SFC入学",
      "layout": "left",
      "videoSrc": "/videos/story/chapter-05-sfc.mp4",
      "videoEffects": [
        { "time": 0, "filter": "grayscale(0%)", "description": "カラフルなキャンパス" },
        { "time": 10, "filter": "grayscale(50%)", "description": "授業シーン" },
        { "time": 20, "filter": "grayscale(100%)", "brightness": "0.3", "description": "心の闇" }
      ],
      "body": "留学生も多く、私のように障害のある学生もいる――そんなインクルーシブで障害への理解がある環境だと思っていた。しかし、現実はそれほど甘くなかった。ある授業で「出生前診断で障害があると分かったら産むか否か」というテーマで議論する機会があった。すると、「障害があると幸せになれない」「周囲から反対されそう」「障害があると分かっていて産むなんて正気じゃない」といった言葉が飛び交った。私は生きていてはいけないのだろうか。今までの活動は無駄だったのだろうか。そう思い悩む日々が、やってきた。",
      "audioNarration": "/audio/narration/chapter-05-sfc.mp3",
      "media": [
        {
          "type": "video",
          "src": "/videos/story/chapter-05-sfc.mp4",
          "poster": "/images/story/sfc-campus.jpg",
          "alt": "SFCキャンパス",
          "audioDescription": "/audio/images/chapter-05-sfc.mp3"
        }
      ]
    },
    {
      "chapter": 6,
      "year": 2024,
      "title": "ローソンでの出来事",
      "layout": "right",
      "videoSrc": "/videos/story/chapter-06-lawson.mp4",
      "videoEffects": [
        { "time": 0, "brightness": "0.5", "description": "暗いトーン" },
        { "time": 20, "brightness": "1.0", "description": "徐々に明るく" }
      ],
      "body": "そんなある日、大学内のローソンで昼ご飯を買おうとしたとき、「店内での写真・動画の撮影はご遠慮ください」というアナウンスが流れた。私ははいつもスマホのカメラでおにぎりの具や値段を拡大して確認しているため、その言葉を聞いた瞬間、とても不安な気持ちになった。――ああ、私は一人で昼食を買うことすらできないのだろうか。そんな思いに駆られ、Xに投稿したところ、瞬く間に拡散され、Yahoo!ニュースにも取り上げられた。今まで理解されにくかった障害を知ってもらえたことが、本当に嬉しかった。障害は誰かに否定されるものではない、自分は自信を持って生きていこう、そう思えた。",
      "audioNarration": "/audio/narration/chapter-06-lawson.mp3",
      "media": [
        {
          "type": "video",
          "src": "/videos/story/chapter-06-lawson.mp4",
          "poster": "/images/story/lawson.jpg",
          "alt": "ローソンでの出来事",
          "audioDescription": "/audio/images/chapter-06-lawson.mp3"
        }
      ]
    },
    {
      "chapter": 7,
      "year": 2024,
      "title": "YouTube開始",
      "layout": "full",
      "videoSrc": "/videos/story/chapter-07-youtube.mp4",
      "videoEffects": [
        { "time": 0, "filter": "grayscale(0%)", "brightness": "1.2", "description": "明るく鮮やか" }
      ],
      "body": "そして、「障害があっても人生を楽しんでるぜ！」ということを伝えるために、YouTubeを始めた。",
      "audioNarration": "/audio/narration/chapter-07-youtube.mp3",
      "ctaButton": {
        "label": "YouTubeチャンネルを見る",
        "href": "https://youtube.com/@gashin",
        "audioLabel": "/audio/buttons/youtube-cta.mp3"
      },
      "media": [
        {
          "type": "video",
          "src": "/videos/story/chapter-07-youtube.mp4",
          "poster": "/images/story/youtube.jpg",
          "alt": "YouTube撮影風景",
          "audioDescription": "/audio/images/chapter-07-youtube.mp3"
        }
      ]
    }
  ]
}
```

---

## 音声ファイル録音リスト

### ナレーション（全7章）
- [ ] `/audio/narration/chapter-01-birth.mp3` - 第1章：横浜で生まれる
- [ ] `/audio/narration/chapter-01-birth-sr.mp3` - 第1章：スクリーンリーダー用副音声
- [ ] `/audio/narration/chapter-02-crafts.mp3` - 第2章：工作と探究心
- [ ] `/audio/narration/chapter-03-blind-school.mp3` - 第3章：国立盲学校
- [ ] `/audio/narration/chapter-04-activities.mp3` - 第4章：高校の活動
- [ ] `/audio/narration/chapter-05-sfc.mp3` - 第5章：慶應SFC入学
- [ ] `/audio/narration/chapter-06-lawson.mp3` - 第6章：ローソンでの出来事
- [ ] `/audio/narration/chapter-07-youtube.mp3` - 第7章：YouTube開始

### 画像・動画説明
- [ ] `/audio/images/chapter-01-baby.mp3` - 生まれたばかりの写真の説明
- [ ] `/audio/images/chapter-02-crafts.mp3` - 工作と星空の動画の説明
- [ ] `/audio/images/chapter-03-blind-school.mp3` - 盲学校の動画の説明
- [ ] `/audio/images/chapter-04-activities.mp3` - 活動の写真の説明
- [ ] `/audio/images/chapter-05-sfc.mp3` - SFCの動画の説明
- [ ] `/audio/images/chapter-06-lawson.mp3` - ローソンの動画の説明
- [ ] `/audio/images/chapter-07-youtube.mp3` - YouTube撮影の動画の説明

### ボタン
- [ ] `/audio/buttons/youtube-cta.mp3` - 「YouTubeチャンネルを見る」
- [ ] `/audio/buttons/vision-experience-cta.mp3` - 「私の見え方を体験する」

### 体験機能用音声
- [ ] `/audio/experience/vision-guide.mp3` - 視覚体験の音声ガイド「これが私の日常の見え方です」

---

## 動画撮影リスト

### オープニング
- [ ] `/videos/story-opening-sfc.mp4` - SFCキャンパス歩行（5秒、カラー→グレー→暗転）

### 各章（全7章）
- [ ] `/videos/story/chapter-01-birth.mp4` - 母親視点、積み木のシーン
- [ ] `/videos/story/chapter-02-crafts.mp4` - 工作シーン、賞状、ぼやけた星空、白杖での通学、車に轢かれそうになる
- [ ] `/videos/story/chapter-03-blind-school.mp4` - 盲学校、コーディングシーン
- [ ] `/videos/story/chapter-05-sfc.mp4` - SFCキャンパス、授業シーン（カラー→グレー）
- [ ] `/videos/story/chapter-06-lawson.mp4` - ローソン、スマホで撮影するシーン
- [ ] `/videos/story/chapter-07-youtube.mp4` - YouTube撮影風景

## パノラマ画像・素材リスト

### 視覚体験シミュレーター用
- [ ] `/images/story/sample-panorama.jpg` - サンプルパノラマ画像（360度、カメラ撮影できない場合の代替）
  - 推奨：横断歩道や街中のシーン
  - サイズ：4096x2048px以上
  - 形式：Equirectangular（正距円筒図法）

---

## 技術的な実装ポイント

### 動画同期システム
```typescript
interface VideoEffect {
  time: number;
  filter?: string;
  brightness?: string;
  overlay?: string;
  effect?: string;
  fadeOut?: boolean;
  text?: string;
  description: string;
}

// 動画再生時にエフェクトを同期
videoElement.ontimeupdate = () => {
  const currentTime = videoElement.currentTime;
  const effect = effects.find(e => Math.abs(e.time - currentTime) < 0.1);

  if (effect) {
    applyEffect(videoElement, effect);
  }
};
```

### 音声ナレーション制御
```typescript
interface AudioNarration {
  src: string;
  trigger: 'auto' | 'manual' | 'scroll';
  delay?: number;
}

// スクリーンリーダー検出時に自動再生
if (isScreenReaderUser || userPreference === 'audio-on') {
  playNarration(chapter.audioNarration);
}
```

### 視覚体験シミュレーター（第2章）

**技術スタック**:
- Three.js または Photo Sphere Viewer（360度パノラマ表示）
- Web API: Device Orientation API（ジャイロスコープ）
- Canvas API（視覚フィルター適用）
- getUserMedia API（カメラアクセス）

**実装例**:
```typescript
interface VisionSimulator {
  panorama: {
    source: 'camera' | 'sample';
    imageUrl?: string;
  };
  visionMode: 'normal' | 'impaired';
  filters: VisionFilter[];
}

interface VisionFilter {
  type: 'left-blind' | 'tunnel-vision' | 'blur';
  params: {
    blur?: string;
    vignette?: number;
    maskPosition?: 'left' | 'right';
  };
}

// Canvas での視覚フィルター適用
const applyVisionFilter = (canvas: HTMLCanvasElement, mode: VisionMode) => {
  const ctx = canvas.getContext('2d');

  if (mode === 'impaired') {
    // 左側を暗くする（左目が見えない）
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

    // 右側に視野狭窄効果（中心のみクリア、周辺ぼやけ）
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.75, canvas.height / 2, 100,
      canvas.width * 0.75, canvas.height / 2, canvas.width * 0.4
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
  }
};

// パノラマビューワーの初期化
const initPanoramaViewer = async () => {
  const viewer = new PhotoSphereViewer.Viewer({
    container: 'panorama-container',
    panorama: panoramaImageUrl,
    defaultYaw: 0,
    defaultPitch: 0,
    navbar: false,
    touchmoveTwoFingers: false,
    gyroscope: true, // ジャイロスコープ有効化
  });

  // 視覚フィルターをオーバーレイとして適用
  const canvas = document.createElement('canvas');
  applyVisionFilter(canvas, currentVisionMode);
  viewer.renderer.domElement.appendChild(canvas);
};
```

**パノラマ撮影の実装**:
```typescript
const capturePanorama = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });

  // ユーザーに360度撮影を案内
  // 複数枚の写真を撮影してステッチング（簡易版はスライドパノラマ）

  // または、既存のサンプル画像を使用
  return samplePanoramaUrl;
};
```

**アクセシビリティ**:
- スクリーンリーダーユーザーには音声ガイド再生
- キーボード操作：矢印キーで視点移動、Enterでモード切替、Escで終了
- `prefers-reduced-motion`では自動回転を無効化

---

## 関連ドキュメント参照

### CONCEPT.mdで定義されている技術仕様

以下の詳細は [`CONCEPT.md`](./CONCEPT.md) を参照してください：

- **[アクセシビリティ要件](./CONCEPT.md#♿️-アクセシビリティ要件)**
  - 音声ナレーションシステムの全体設計
  - スクリーンリーダー対応
  - `prefers-reduced-motion`の実装

- **[パフォーマンス目標](./CONCEPT.md#🎯-パフォーマンス目標)**
  - 動画ファイルサイズ（< 1MB）
  - 音声ファイルサイズ（< 100KB）
  - LCP、CLS、INPの目標値

- **[技術スタック](./CONCEPT.md#🛠-技術スタック案)**
  - Next.js設定
  - 動画同期システム
  - Web Audio API実装

- **[データスキーマ](./CONCEPT.md#📁-データスキーマ案)**
  - `story.json` の完全なスキーマ定義
  - TypeScript型定義

- **[デプロイ・運用](./CONCEPT.md#🚀-デプロイ運用)**
  - Vercel設定
  - 更新フロー（動画・音声の追加手順）

---

## プロジェクト構造

```
new-gashin-website/
├── README.md              # プロジェクト概要
├── CONCEPT.md             # 全体コンセプト・技術仕様
├── STORY_DRAFT.md         # このファイル（ストーリー詳細）
├── /public/
│   ├── /videos/
│   │   ├── story-opening-sfc.mp4
│   │   └── /story/
│   │       ├── chapter-01-birth.mp4
│   │       ├── chapter-03-elementary.mp4
│   │       └── ...
│   ├── /audio/
│   │   ├── /narration/
│   │   ├── /buttons/
│   │   └── /images/
│   └── /images/
└── /app/
    ├── (data)/
    │   └── story.json     # このドキュメントに基づくデータ
    └── story/
        └── page.tsx       # ストーリーページ実装
```
