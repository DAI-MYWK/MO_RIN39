'use client';

import { useState, useMemo } from 'react';
import { 
  MessageSquare, Copy, Check, User, Store, 
  Info, ChevronRight, Star, Coffee, Utensils, ShoppingBag,
  ArrowRight, Zap, TrendingUp, LayoutGrid, Image as ImageIcon,
  Search, DollarSign, MousePointer
} from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';
import { MenuItem } from '@/types/menu';

interface TalkScenario {
  id: string;
  title: string;
  category: string;
  situation: string;
  talkTemplate: (data: MenuAnalysisData) => string;
}

// メニュー分析データの型定義
interface MenuAnalysisData {
  highPriceMenu: MenuItem | null;
  popularCategory: string;
  firstMenu: MenuItem | null;
  menuCount: number;
  photoRate: number; // 写真ありの割合 (0-1)
  
  // 診断用フラグ
  isManyItems: boolean; // 50品以上
  isFewItems: boolean; // 20品以下
  hasHighPriceItems: boolean; // 2000円以上
  isPhotoRich: boolean; // 写真あり80%以上
  isLowPrice: boolean; // 平均単価1000円以下 (簡易判定)
}

// メニューデータから分析情報を抽出するヘルパー関数
const analyzeMenuData = (menuData: MenuItem[]): MenuAnalysisData => {
  if (menuData.length === 0) {
    return {
      highPriceMenu: null,
      popularCategory: 'パスタ',
      firstMenu: null,
      menuCount: 0,
      photoRate: 0,
      isManyItems: false,
      isFewItems: true,
      hasHighPriceItems: false,
      isPhotoRich: false,
      isLowPrice: false
    };
  }

  // 価格が高い順にソートして、最も高いメニューを取得（簡易的な数値変換）
  const sortedByPrice = [...menuData].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
    const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
    return priceB - priceA;
  });

  const highPriceMenu = sortedByPrice[0] || menuData[0];
  const highPriceValue = parseInt(highPriceMenu.price.replace(/[^0-9]/g, '')) || 0;

  // 平均価格の計算
  const totalPrice = menuData.reduce((sum, item) => {
    return sum + (parseInt(item.price.replace(/[^0-9]/g, '')) || 0);
  }, 0);
  const averagePrice = totalPrice / menuData.length;

  // カテゴリの出現頻度を計算
  const categoryCounts: Record<string, number> = {};
  menuData.forEach(item => {
    if (item.category && item.category !== '未分類') {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  });
  
  // 最も多いカテゴリを取得
  let popularCategory = '料理';
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      popularCategory = cat;
    }
  });

  // 写真があるメニューの割合
  const photoCount = menuData.filter(item => item.imageUrl).length;
  const photoRate = photoCount / menuData.length;

  return {
    highPriceMenu,
    popularCategory,
    firstMenu: menuData[0],
    menuCount: menuData.length,
    photoRate,
    isManyItems: menuData.length >= 50,
    isFewItems: menuData.length <= 20,
    hasHighPriceItems: highPriceValue >= 2000,
    isPhotoRich: photoRate >= 0.8,
    isLowPrice: averagePrice <= 1000
  };
};

const talkScenarios: TalkScenario[] = [
  {
    id: 'initial-visit',
    title: '初回訪問・ヒアリング',
    category: '基本フロー',
    situation: 'メニューが多くて見せ方に悩むオーナーへ、まずは現状を可視化して課題を共有する場面',
    talkTemplate: (data) => `「実は、モバイルオーダーの導入で最も重要なのは、メニューの見せ方なんです。
お客様がスマホで見た時に、どういう順番で、どういう見た目でメニューが並ぶかで、
注文数や客単価が大きく変わります。

今日は、お店のメニューを実際に4つのパターンで表示してみて、
どれが一番お店に合っているか、一緒に見てみませんか？」`
  },
  {
    id: 'demo',
    title: '提案・デモ実演',
    category: '基本フロー',
    situation: '複数のUIパターンを比較し、オーナーに納得感のあるデモンストレーションを行う場面',
    talkTemplate: (data) => `「こちらが4つのUIパターンです。

【左：カテゴリ重視型】
カテゴリごとに整理されているので、『${data.popularCategory}が食べたい』というお客様には
すぐに目的のメニューにたどり着けます。メニュー数が多いお店に適しています。

【右：写真重視型】
大きな写真でメニューを魅力的に見せます。写真がきれいなお店や、
見た目で選んでもらいたいメニューがある場合に効果的です。

スクロールを動かすと、同じ位置のメニューを比較できます。
どちらがお店の雰囲気に合っていますか？」`
  },
  {
    id: 'customize',
    title: 'カスタマイズ・調整',
    category: '基本フロー',
    situation: '「もっとこうしたい」という要望に対し、リアルタイム編集で柔軟性を示す場面',
    talkTemplate: (data) => {
      const targetMenuName = data.highPriceMenu ? data.highPriceMenu.name : '和牛ステーキ';
      return `「例えば、こちらの『${targetMenuName}』を、もっと目立たせたい場合。

【編集モードをON】
→ メニュー名を『【期間限定】${targetMenuName}』に変更
→ 説明文に『厳選した素材を使用』を追加

すると、このように表示が変わります。お客様の目に留まりやすくなりますね。

実際のシステムでも、このように簡単に変更できます。」`;
    }
  },
  {
    id: 'closing',
    title: 'クロージング・決断',
    category: '基本フロー',
    situation: '迷うオーナーに対し、データと論理に基づいた推奨パターンを提示する場面',
    talkTemplate: (data) => {
      const targetMenuName = data.highPriceMenu ? data.highPriceMenu.name : '和牛ステーキ';
      return `「4つのパターンを見ていただきましたが、お店の特徴を考えると、
【おすすめ重視型】が最も効果的だと思います。

理由は3つあります：

1. お店の看板メニュー『${targetMenuName}』が最初に目に入る
   → お客様が迷わず注文できる

2. ヒートマップを見ると、この位置（画面の上部）が最も目立つ
   → ここにおすすめメニューを配置すると、注文率が上がる

3. 写真が大きく表示されるので、お店のこだわりが伝わる
   → 価格を高めに設定しても、納得して注文してもらえる

実際の導入後も、このようにデータを見ながら調整できます。
まずはこのパターンで始めてみませんか？」`;
    }
  },
  {
    id: 'many-menu',
    title: '多メニュー店舗への提案',
    category: 'ケース別',
    situation: '品数が多い店向けに、お客様を迷わせないUIを提案する',
    talkTemplate: (data) => `「お店のメニュー数が多いので、お客様が迷わないようにすることが重要です。

【カテゴリ重視型】だと、『${data.popularCategory}が食べたい』というお客様は
すぐに${data.popularCategory}カテゴリにたどり着けます。

一方、【写真重視型】だと、メニューが縦に長く並ぶので、
お客様がスクロールする手間が増えます。

メニュー数が多い場合は、【カテゴリ重視型】がおすすめです。
実際に見てみましょうか？」`
  },
  {
    id: 'beautiful-photo',
    title: '写真重視店舗への提案',
    category: 'ケース別',
    situation: '写真のクオリティが高い店向けに、視覚効果で攻める提案をする',
    talkTemplate: (data) => {
      const targetMenuName = data.highPriceMenu ? data.highPriceMenu.name : '和牛ステーキ';
      return `「お店の写真がとてもきれいですね。この写真の魅力を最大限に活かすなら、
【写真重視型】が効果的です。

大きな写真でメニューを見せることで、お客様の食欲を刺激し、
注文率が上がる傾向があります。

特に、こちらの『${targetMenuName}』のような高単価メニューは、
写真のインパクトが重要です。

実際に表示してみましょうか？」`;
    }
  }
];

// 診断ロジックと結果の定義
interface DiagnosisResult {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  recommendedPattern: string;
  color: string;
  bgColor: string;
}

const DIAGNOSIS_RESULTS: Record<string, DiagnosisResult> = {
  search: {
    id: 'search',
    title: '多品目・検索重視型',
    description: 'メニュー数が多いため、カテゴリ分けで目的の商品に素早くたどり着けるようにします。',
    icon: <Search className="w-8 h-8" />,
    recommendedPattern: 'カテゴリ重視型',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  brand: {
    id: 'brand',
    title: '高単価・ブランド重視型',
    description: '高単価商品と綺麗な写真があるため、ビジュアルで価値を伝え客単価アップを狙います。',
    icon: <Star className="w-8 h-8" />,
    recommendedPattern: '写真重視型',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  recommend: {
    id: 'recommend',
    title: '一点突破・看板メニュー型',
    description: '特定の看板メニューや高単価商品を強調し、主力商品の注文率を最大化します。',
    icon: <TrendingUp className="w-8 h-8" />,
    recommendedPattern: 'おすすめ重視型',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  rotation: {
    id: 'rotation',
    title: '低単価・回転重視型',
    description: '低単価で品数が多いため、一覧性を高めて注文スピードを上げ、回転率を重視します。',
    icon: <Zap className="w-8 h-8" />,
    recommendedPattern: 'グリッドレイアウト',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  visual: {
    id: 'visual',
    title: 'ビジュアル訴求型',
    description: 'ほとんどのメニューに写真があるため、カタログのようなリッチな表示で食欲を刺激します。',
    icon: <ImageIcon className="w-8 h-8" />,
    recommendedPattern: '写真重視型',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  simple: {
    id: 'simple',
    title: 'シンプル・ミニマル型',
    description: 'メニュー数が少ないため、余白を活かしたグリッド表示で洗練された印象を与えます。',
    icon: <LayoutGrid className="w-8 h-8" />,
    recommendedPattern: 'グリッドレイアウト',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
};

export default function SalesTalkRecommendation() {
  const menuData = useMenuStore((state) => state.menuData);
  const [selectedCategory, setSelectedCategory] = useState<string>('提案診断'); // デフォルトを診断タブに変更
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(talkScenarios[0].id);
  const [copied, setCopied] = useState<string | null>(null);

  // メニューデータの分析
  const analysisData = useMemo(() => analyzeMenuData(menuData), [menuData]);

  const currentScenario = talkScenarios.find(s => s.id === selectedScenarioId) || talkScenarios[0];
  
  // カテゴリでフィルタリング
  const filteredScenarios = talkScenarios.filter(s => s.category === selectedCategory);
  
  // 表示用に、現在選択されているシナリオがフィルタリング結果に含まれていない場合、最初のものを選択
  if (selectedCategory !== '提案診断' && !filteredScenarios.find(s => s.id === selectedScenarioId)) {
    if (filteredScenarios.length > 0) {
      setSelectedScenarioId(filteredScenarios[0].id);
    }
  }

  // 現在のデータに基づいてトークを生成
  const currentTalk = currentScenario.talkTemplate(analysisData);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // トークを段落で分割して、会話形式で表示
  const talkParagraphs = currentTalk.split('\n\n').filter(p => p.trim() !== '');

  // 6パターンの診断ロジック
  const getDiagnosisResult = (): DiagnosisResult => {
    // 1. 多品目・検索重視型
    if (analysisData.isManyItems) {
      return DIAGNOSIS_RESULTS.search;
    }
    // 2. 高単価・ブランド重視型
    if (analysisData.hasHighPriceItems && analysisData.isPhotoRich) {
      return DIAGNOSIS_RESULTS.brand;
    }
    // 5. ビジュアル訴求型 (写真は多いが高単価ではない)
    if (analysisData.isPhotoRich) {
      return DIAGNOSIS_RESULTS.visual;
    }
    // 6. シンプル・ミニマル型
    if (analysisData.isFewItems) {
      return DIAGNOSIS_RESULTS.simple;
    }
    // 4. 低単価・回転重視型
    if (analysisData.isLowPrice) {
      return DIAGNOSIS_RESULTS.rotation;
    }
    // 3. 一点突破・看板メニュー型 (その他デフォルト)
    return DIAGNOSIS_RESULTS.recommend;
  };

  const diagnosisResult = getDiagnosisResult();

  return (
    <div className="bg-[#EBF7FF] min-h-screen p-4 md:p-8 font-sans text-[#333333]">
      
      {/* ヘッダーエリア */}
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0099E6] mb-2">
          場面に合わせて選べる、効果的なご案内
        </h2>
        <p className="text-[#666666]">
          お客様の状況や課題に合わせて、最適なトークスクリプトをご活用ください。
        </p>
        {menuData.length > 0 && (
          <div className="mt-2 inline-block bg-white px-4 py-1 rounded-full text-sm text-[#0099E6] border border-[#0099E6]">
            <span className="font-bold">{analysisData.menuCount}品</span>のメニューデータを元にトークを最適化中
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* タブ切り替えエリア */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {['提案診断', '基本フロー', 'ケース別'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-1 py-4 text-sm md:text-base font-bold text-center transition-colors relative ${
                selectedCategory === category
                  ? 'text-[#0099E6] bg-white'
                  : 'text-[#666666] hover:text-[#333333] hover:bg-gray-100'
              }`}
            >
              {category}
              {selectedCategory === category && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#0099E6]" />
              )}
            </button>
          ))}
        </div>

        {selectedCategory === '提案診断' ? (
          <div className="p-8 bg-white">
             <div className="max-w-4xl mx-auto">
               <div className="text-center mb-10">
                 <h3 className="text-xl font-bold text-[#333333] mb-2">
                   店舗データから最適な提案シナリオを診断
                 </h3>
                 <p className="text-[#666666]">
                   収集したメニューデータを分析し、6つのパターンから最も効果的なアプローチを提示します。
                 </p>
               </div>

               {/* 診断フローチャート (CSS Grid) */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 {/* Q1 */}
                 <div className={`p-6 rounded-xl border-2 transition-all ${
                   analysisData.isManyItems ? 'border-[#0099E6] bg-blue-50 shadow-md transform scale-105' : 'border-gray-200 bg-gray-50 opacity-60'
                 }`}>
                   <div className="flex items-center gap-3 mb-3">
                     <div className="w-8 h-8 rounded-full bg-[#0099E6] text-white flex items-center justify-center font-bold">Q1</div>
                     <h4 className="font-bold text-sm">メニュー数は多い？</h4>
                   </div>
                   <p className="text-xs text-gray-600 mb-2">50品以上あるか</p>
                   <div className="font-bold text-lg text-[#0099E6]">
                     {analysisData.isManyItems ? 'YES' : 'NO'} <span className="text-sm font-normal text-gray-500">({analysisData.menuCount}品)</span>
                   </div>
                 </div>

                 {/* Q2 */}
                 <div className={`p-6 rounded-xl border-2 transition-all ${
                   !analysisData.isManyItems && (analysisData.hasHighPriceItems || analysisData.isPhotoRich) 
                     ? 'border-[#0099E6] bg-blue-50 shadow-md transform scale-105' 
                     : 'border-gray-200 bg-gray-50 opacity-60'
                 }`}>
                   <div className="flex items-center gap-3 mb-3">
                     <div className="w-8 h-8 rounded-full bg-[#0099E6] text-white flex items-center justify-center font-bold">Q2</div>
                     <h4 className="font-bold text-sm">高単価 or 写真充実？</h4>
                   </div>
                   <p className="text-xs text-gray-600 mb-2">単価2000円以上 or 写真8割以上</p>
                   <div className="font-bold text-lg text-[#0099E6]">
                     {analysisData.hasHighPriceItems || analysisData.isPhotoRich ? 'YES' : 'NO'}
                   </div>
                 </div>

                 {/* Q3 */}
                 <div className={`p-6 rounded-xl border-2 transition-all ${
                   !analysisData.isManyItems && !analysisData.hasHighPriceItems && !analysisData.isPhotoRich 
                     ? 'border-[#0099E6] bg-blue-50 shadow-md transform scale-105' 
                     : 'border-gray-200 bg-gray-50 opacity-60'
                 }`}>
                   <div className="flex items-center gap-3 mb-3">
                     <div className="w-8 h-8 rounded-full bg-[#0099E6] text-white flex items-center justify-center font-bold">Q3</div>
                     <h4 className="font-bold text-sm">品数は少ない？</h4>
                   </div>
                   <p className="text-xs text-gray-600 mb-2">20品以下か</p>
                   <div className="font-bold text-lg text-[#0099E6]">
                     {analysisData.isFewItems ? 'YES' : 'NO'}
                   </div>
                 </div>
               </div>

               {/* 診断結果カード */}
               <div className="border-t border-gray-200 pt-8">
                 <div className={`p-8 rounded-2xl border-2 shadow-sm text-center ${diagnosisResult.bgColor} border-opacity-50`}>
                    <div className={`inline-flex items-center justify-center p-4 bg-white rounded-full shadow-sm mb-4 ${diagnosisResult.color}`}>
                      {diagnosisResult.icon}
                    </div>
                    <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">DIAGNOSIS RESULT</div>
                    <h2 className={`text-2xl font-bold mb-4 ${diagnosisResult.color}`}>
                      推奨：{diagnosisResult.title}
                    </h2>
                    <p className="text-[#666666] mb-8 max-w-lg mx-auto leading-relaxed">
                      {diagnosisResult.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 font-bold text-xs uppercase">
                          <MousePointer className="w-4 h-4" /> Recommended UI
                        </div>
                        <div className={`text-lg font-bold ${diagnosisResult.color}`}>
                          {diagnosisResult.recommendedPattern}
                        </div>
                      </div>
                      
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 font-bold text-xs uppercase">
                          <MessageSquare className="w-4 h-4" /> Key Message
                        </div>
                        <div className="text-sm text-gray-700">
                          「{diagnosisResult.title.split('」')[1]}」で<br/>
                          <span className="font-bold">注文完了率の最大化</span>を狙いましょう
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200/50">
                      <h4 className="font-bold text-sm text-[#333333] mb-3">このパターンのトーク例</h4>
                      <div className="bg-white/80 p-4 rounded-lg text-sm text-[#666666] text-left leading-relaxed border border-gray-200">
                        「データ分析の結果、御社のような{analysisData.isManyItems ? 'メニュー数が多い' : '特徴的な'}店舗では、
                        <span className="font-bold text-[#333333] mx-1">{diagnosisResult.recommendedPattern}</span>
                        が最も効果的です。
                        {analysisData.highPriceMenu && `特に看板商品の『${analysisData.highPriceMenu.name}』を...`}」
                      </div>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* サイドメニュー（シナリオ選択） */}
            <div className="w-full md:w-1/3 border-r border-gray-200 bg-gray-50">
              <div className="p-4 space-y-2">
                {filteredScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenarioId(scenario.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all border ${
                      selectedScenarioId === scenario.id
                        ? 'bg-white border-[#0099E6] shadow-sm ring-1 ring-[#0099E6] ring-opacity-50'
                        : 'bg-white border-gray-200 hover:border-gray-300 text-[#666666]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${selectedScenarioId === scenario.id ? 'text-[#0099E6]' : 'text-[#333333]'}`}>
                        {scenario.title}
                      </span>
                      {selectedScenarioId === scenario.id && <ChevronRight className="w-4 h-4 text-[#0099E6]" />}
                    </div>
                    <p className="text-xs text-[#666666] line-clamp-2">
                      {scenario.situation}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* メインコンテンツエリア */}
            <div className="w-full md:w-2/3 bg-white">
              {/* タイトルとアクション */}
              <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#0099E6] mb-2">
                    {currentScenario.title}
                  </div>
                  <h3 className="text-lg font-bold text-[#333333] leading-snug">
                    {currentScenario.situation}
                  </h3>
                </div>
                <button
                  onClick={() => handleCopy(currentTalk, currentScenario.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    copied === currentScenario.id
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-[#0099E6] text-white hover:bg-[#0088cc] shadow-sm hover:shadow'
                  }`}
                >
                  {copied === currentScenario.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      コピー完了
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      トークをコピー
                    </>
                  )}
                </button>
              </div>

              {/* 会話プレビュー */}
              <div className="p-6 bg-white">
                <div className="space-y-6">
                  {talkParagraphs.map((paragraph, index) => (
                    <div key={index} className="flex gap-4">
                      {/* アイコン */}
                      <div className="flex-shrink-0 flex flex-col items-center pt-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index % 2 === 0 ? 'bg-[#EBF7FF] text-[#0099E6]' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {index % 2 === 0 ? <User className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* テキスト */}
                      <div className="flex-1">
                        <div className="text-xs font-bold text-[#999999] mb-1">
                          {index % 2 === 0 ? '営業担当' : 'オーナー様'}
                        </div>
                        <div className={`p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                          index % 2 === 0 
                            ? 'bg-[#F5FAFF] border border-[#E6F0FA] text-[#333333]' 
                            : 'bg-gray-50 border border-gray-100 text-[#333333]'
                        }`}>
                          {paragraph}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ポイントエリア */}
                <div className="mt-8 p-5 bg-[#F9FAFB] rounded-lg border border-gray-200">
                  <h4 className="flex items-center gap-2 font-bold text-[#333333] mb-3">
                    <Info className="w-5 h-5 text-[#0099E6]" />
                    この場面でのポイント
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold text-[#0099E6] mb-1">推奨アクション (DO)</div>
                      <ul className="text-sm text-[#666666] space-y-1 list-disc ml-4">
                        <li>「一緒に見てみましょう」と共感を示す</li>
                        <li>具体的な数値や効果を提示する</li>
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-red-500 mb-1">避けるべきアクション (DON'T)</div>
                      <ul className="text-sm text-[#666666] space-y-1 list-disc ml-4">
                        <li>一方的に説明を進める</li>
                        <li>専門用語を多用する</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
