'use client';

import { useState, useMemo } from 'react';
import { 
  MessageSquare, Copy, Check, User, Store, 
  Info, ChevronRight, Monitor, Smartphone
} from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';
import { MenuItem, UIPattern } from '@/types/menu';
import ScreenFlowPreview from './ScreenFlowPreview';
import PatternCategoryFocused from './patterns/PatternCategoryFocused';
import PatternPhotoFocused from './patterns/PatternPhotoFocused';
import PatternRecommendedFocused from './patterns/PatternRecommendedFocused';
import PatternGridLayout from './patterns/PatternGridLayout';
import DeviceSimulator from './DeviceSimulator';

interface TalkScenario {
  id: string;
  title: string;
  category: string;
  situation: string;
  talkTemplate: (data: MenuAnalysisData) => string;
  // 関連する画面遷移ステップ（1-5）
  relatedFlowSteps?: number[];
  // 関連するUIパターン
  relatedUIPatterns?: UIPattern[];
  // 表示タイプ: 'flow' | 'ui' | 'both'
  displayType?: 'flow' | 'ui' | 'both';
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
どれが一番お店に合っているか、一緒に見てみませんか？」`,
    relatedFlowSteps: [1, 2],
    relatedUIPatterns: ['category-focused', 'photo-focused', 'recommended-focused', 'grid-layout'],
    displayType: 'both'
  },
  {
    id: 'demo',
    title: '提案・デモ実演',
    category: '基本フロー',
    situation: '複数のUIパターンを比較し、オーナーに納得感のあるデモンストレーションを行う場面',
    talkTemplate: (data) => `「こちらが4つのUIパターンです。

【カテゴリ重視型】
カテゴリごとに整理されているので、『${data.popularCategory}が食べたい』というお客様には
すぐに目的のメニューにたどり着けます。メニュー数が多いお店に適しています。

【写真重視型】
大きな写真でメニューを魅力的に見せます。写真がきれいなお店や、
見た目で選んでもらいたいメニューがある場合に効果的です。

スクロールを動かすと、同じ位置のメニューを比較できます。
どちらがお店の雰囲気に合っていますか？」`,
    relatedFlowSteps: [2],
    relatedUIPatterns: ['category-focused', 'photo-focused'],
    displayType: 'ui'
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
    },
    relatedFlowSteps: [2, 3],
    relatedUIPatterns: ['recommended-focused'],
    displayType: 'ui'
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
    },
    relatedFlowSteps: [2, 3, 4],
    relatedUIPatterns: ['recommended-focused'],
    displayType: 'both'
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
実際に見てみましょうか？」`,
    relatedFlowSteps: [1, 2],
    relatedUIPatterns: ['category-focused'],
    displayType: 'both'
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
    },
    relatedFlowSteps: [2, 3],
    relatedUIPatterns: ['photo-focused'],
    displayType: 'both'
  }
];

// UIパターンコンポーネントのマッピング
const patternComponents = {
  'category-focused': PatternCategoryFocused,
  'photo-focused': PatternPhotoFocused,
  'recommended-focused': PatternRecommendedFocused,
  'grid-layout': PatternGridLayout,
};

const patternNames = {
  'category-focused': 'カテゴリ重視型',
  'photo-focused': '写真重視型',
  'recommended-focused': 'おすすめ重視型',
  'grid-layout': 'グリッドレイアウト',
};

export default function SalesTalkRecommendation() {
  const menuData = useMenuStore((state) => state.menuData);
  const [selectedCategory, setSelectedCategory] = useState<string>('基本フロー');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(talkScenarios[0].id);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedFlowStep, setSelectedFlowStep] = useState<number | null>(null);

  // メニューデータの分析
  const analysisData = useMemo(() => analyzeMenuData(menuData), [menuData]);

  const currentScenario = talkScenarios.find(s => s.id === selectedScenarioId) || talkScenarios[0];
  
  // カテゴリでフィルタリング
  const filteredScenarios = talkScenarios.filter(s => s.category === selectedCategory);
  
  // 表示用に、現在選択されているシナリオがフィルタリング結果に含まれていない場合、最初のものを選択
  if (!filteredScenarios.find(s => s.id === selectedScenarioId)) {
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

  // 画面遷移フローの特定ステップを表示するコンポーネント
  const renderFlowStep = (stepNumber: number) => {
    const steps = [
      { number: 1, title: 'QRコード読取', description: 'テーブルのQRコードをスキャン' },
      { number: 2, title: 'メニュー閲覧', description: 'カテゴリからメニューを探す' },
      { number: 3, title: '注文リスト追加', description: 'メニューを選んでカスタマイズ' },
      { number: 4, title: '注文送信', description: '注文内容を確認して送信' },
      { number: 5, title: 'お会計', description: '合計金額を確認' },
    ];
    const step = steps.find(s => s.number === stepNumber);
    if (!step) return null;

    return (
      <div className="bg-white rounded-lg border-2 border-[#0099E6] p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-[#0099E6] text-white rounded-full flex items-center justify-center text-sm font-bold">
            {step.number}
          </div>
          <div>
            <div className="font-bold text-[#333333]">{step.title}</div>
            <div className="text-xs text-[#666666]">{step.description}</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-[#666666] bg-[#EBF7FF] p-3 rounded">
          {step.number === 1 && 'お客様がテーブルのQRコードをスキャンすると、メニュー画面に遷移します。'}
          {step.number === 2 && 'カテゴリからメニューを探し、気になる商品をタップします。'}
          {step.number === 3 && 'メニュー詳細画面で数量やオプションを選択し、注文リストに追加します。'}
          {step.number === 4 && '注文リストを確認し、送信ボタンを押して注文を確定します。'}
          {step.number === 5 && '合計金額を確認し、会計依頼またはオンライン決済を行います。'}
        </div>
      </div>
    );
  };

  // UIパターンを表示するコンポーネント
  const renderUIPattern = (patternId: UIPattern) => {
    const PatternComponent = patternComponents[patternId];
    if (!PatternComponent) return null;

    return (
      <div className="bg-white rounded-lg border-2 border-[#0099E6] overflow-hidden">
        <div className="bg-[#0099E6] text-white px-4 py-2 text-sm font-bold">
          {patternNames[patternId]}
        </div>
        <div className="bg-gray-100 p-4">
          <DeviceSimulator device="iphone-se">
            <div className="w-full h-full overflow-y-auto" style={{ maxHeight: '500px' }}>
              <PatternComponent menuData={menuData} showHeatmap={false} editable={false} />
            </div>
          </DeviceSimulator>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#EBF7FF] min-h-screen p-4 md:p-8 font-sans text-[#333333]">
      
      {/* ヘッダーエリア */}
      <div className="max-w-[1600px] mx-auto mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0099E6] mb-2">
          場面に合わせて選べる、効果的なご案内
        </h2>
        <p className="text-[#666666]">
          お客様の状況や課題に合わせて、最適なトークスクリプトとプレビューをご活用ください。
        </p>
        {menuData.length > 0 && (
          <div className="mt-2 inline-block bg-white px-4 py-1 rounded-full text-sm text-[#0099E6] border border-[#0099E6]">
            <span className="font-bold">{analysisData.menuCount}品</span>のメニューデータを元にトークを最適化中
          </div>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* タブ切り替えエリア */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {['基本フロー', 'ケース別'].map((category) => (
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

        <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* サイドメニュー（シナリオ選択） */}
            <div className="w-full lg:w-1/3 border-r border-gray-200 bg-gray-50">
              <div className="p-4 space-y-2">
                {filteredScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedScenarioId(scenario.id);
                      setSelectedFlowStep(null);
                    }}
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
            <div className="w-full lg:w-2/3 bg-white flex flex-col">
              {/* タイトルとアクション */}
              <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF7FF] text-[#0099E6] mb-2">
                    {currentScenario.title}
                  </div>
                  <h3 className="text-lg font-bold text-[#333333] leading-snug mb-2">
                    {currentScenario.situation}
                  </h3>
                  {currentScenario.relatedFlowSteps && currentScenario.relatedFlowSteps.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-[#666666]">
                      <Smartphone className="w-4 h-4" />
                      <span>関連画面: {currentScenario.relatedFlowSteps.map(s => `ステップ${s}`).join(', ')}</span>
                    </div>
                  )}
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

              {/* 会話プレビューとプレビューエリア */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 bg-white">
                  {/* 会話プレビュー */}
                  <div className="space-y-6 mb-8">
                    {talkParagraphs.map((paragraph, index) => (
                      <div key={index} className="flex gap-4">
                        {/* アイコン */}
                        <div className="flex-shrink-0 flex flex-col items-center pt-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index % 2 === 0 ? 'bg-[#EBF7FF] text-[#0099E6]' : 'bg-gray-100 text-[#666666]'
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

                  {/* プレビューエリア */}
                  {menuData.length > 0 && currentScenario.displayType && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Monitor className="w-5 h-5 text-[#0099E6]" />
                        <h4 className="font-bold text-[#333333]">関連プレビュー</h4>
                      </div>

                      {/* 画面遷移フローの表示 */}
                      {currentScenario.displayType === 'flow' || currentScenario.displayType === 'both' ? (
                        <div className="mb-6">
                          <h5 className="text-sm font-bold text-[#333333] mb-3 flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            画面遷移フロー
                          </h5>
                          {currentScenario.relatedFlowSteps && currentScenario.relatedFlowSteps.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {currentScenario.relatedFlowSteps.map(step => (
                                <div key={step}>
                                  {renderFlowStep(step)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-[#EBF7FF] border border-gray-200 rounded-lg p-4">
                              <ScreenFlowPreview menuData={menuData} />
                            </div>
                          )}
                        </div>
                      ) : null}

                      {/* UIパターンの表示 */}
                      {currentScenario.displayType === 'ui' || currentScenario.displayType === 'both' ? (
                        <div>
                          <h5 className="text-sm font-bold text-[#333333] mb-3 flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            UIパターン比較
                          </h5>
                          {currentScenario.relatedUIPatterns && currentScenario.relatedUIPatterns.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {currentScenario.relatedUIPatterns.map(patternId => (
                                <div key={patternId}>
                                  {renderUIPattern(patternId)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-[#EBF7FF] border border-gray-200 rounded-lg p-4 text-sm text-[#666666]">
                              関連するUIパターンが設定されていません
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

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
                          <li>プレビューを見せながら説明する</li>
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-red-500 mb-1">避けるべきアクション (DON'T)</div>
                        <ul className="text-sm text-[#666666] space-y-1 list-disc ml-4">
                          <li>一方的に説明を進める</li>
                          <li>専門用語を多用する</li>
                          <li>視覚的な説明を省く</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
