'use client';

import { useState } from 'react';
import { Info, ChevronRight, CheckCircle, XCircle, ArrowRight, Zap, MousePointer, LayoutTemplate } from 'lucide-react';
import { MenuItem, UIPattern } from '@/types/menu';
import DeviceSimulator from './DeviceSimulator';
import PatternCategoryFocused from './patterns/PatternCategoryFocused';
import PatternPhotoFocused from './patterns/PatternPhotoFocused';
import PatternRecommendedFocused from './patterns/PatternRecommendedFocused';
import PatternGridLayout from './patterns/PatternGridLayout';

interface SalesTipsProps {
  menuData: MenuItem[];
}

export default function SalesTips({ menuData }: SalesTipsProps) {
  // セクションの定義
  const sections = [
    {
      id: 'first-view',
      title: '1. ファーストビューで迷わせない',
      subtitle: 'お店の業態に合わせてトップ画面を最適化',
      description: 'お客様が最初に目にする画面は、注文への入り口です。メニュー数が多い居酒屋なら「カテゴリ」で探しやすく、カフェや専門店なら「写真」で魅力を伝えるのが効果的です。',
      tips: [
        { type: 'good', text: 'メニュー数が多いなら「カテゴリ一覧」をトップに' },
        { type: 'good', text: '推したい商品があるなら「おすすめ商品」を大きく表示' },
      ],
      uiComparison: {
        left: {
          title: 'メニューが多い店舗向け',
          pattern: 'category-focused' as UIPattern,
          note: '目的のメニューに最短で到達'
        },
        right: {
          title: '写真映えする店舗向け',
          pattern: 'photo-focused' as UIPattern,
          note: 'ビジュアルで食欲を刺激'
        }
      }
    },
    {
      id: 'photo-size',
      title: '2. 写真サイズで客単価をコントロール',
      subtitle: '高単価商品は写真を大きく、低単価商品はリストで効率よく',
      description: '写真の大きさは「注文のしやすさ」と「商品の魅力」のバランスです。高単価なメイン料理は大きな写真で価値を伝え、ドリンクやサイドメニューはリスト形式で一覧性を高めると、全体の注文バランスが良くなります。',
      tips: [
        { type: 'good', text: '看板メニューは画面幅いっぱいの写真でアピール' },
        { type: 'good', text: 'とりあえずの一品はリスト表示で選びやすく' },
      ],
      uiComparison: {
        left: {
          title: '一覧性重視（スピード注文）',
          pattern: 'grid-layout' as UIPattern,
          note: '多くの商品を一度に比較可能'
        },
        right: {
          title: '魅力重視（客単価UP）',
          pattern: 'recommended-focused' as UIPattern,
          note: 'シズル感のある写真で訴求'
        }
      }
    },
    {
      id: 'cross-sell',
      title: '3. 「ついで買い」を誘う動線設計',
      subtitle: '注文確定前の"もう一品"が売上を底上げ',
      description: 'お客様がメニューを選んだ瞬間は、最も購買意欲が高いタイミングです。このタイミングでトッピングやセットドリンクを提案することで、無理なく客単価をアップさせることができます。',
      tips: [
        { type: 'good', text: 'フード注文時に「ドリンクセット」を提案' },
        { type: 'good', text: '必須オプション選択の流れでトッピングも表示' },
      ],
      // ここはUIパターンの違いというよりは、特定のコンポーネントの機能差を見せたいが、
      // 既存のパターンコンポーネントを使って擬似的に表現する
      uiComparison: {
        left: {
          title: 'シンプルな注文フロー',
          pattern: 'category-focused' as UIPattern,
          note: '迷わず注文完了できるが単価は伸びにくい'
        },
        right: {
          title: '提案型の注文フロー',
          pattern: 'recommended-focused' as UIPattern,
          note: 'おすすめ商品が目に入り、追加注文を誘発'
        }
      }
    },
    {
      id: 'stress-free',
      title: '4. ストレスフリーな操作感',
      subtitle: '使いやすさがリピート率に直結する',
      description: '「ボタンが押しにくい」「どこを見ていいかわからない」というストレスは、注文離脱や店舗の印象悪化につながります。指の届きやすい位置へのボタン配置や、適度な余白が重要です。',
      tips: [
        { type: 'good', text: '重要なボタンは画面下部（親指エリア）に配置' },
        { type: 'good', text: '文字サイズと余白を十分に確保' },
      ],
      uiComparison: {
        left: {
          title: '標準的なレイアウト',
          pattern: 'grid-layout' as UIPattern,
          note: '整理されているが、ボタンが小さい場合も'
        },
        right: {
          title: '最適化されたレイアウト',
          pattern: 'photo-focused' as UIPattern,
          note: '大きなボタンと写真で操作ミスを防ぐ'
        }
      }
    }
  ];

  const renderPattern = (patternId: UIPattern) => {
    switch (patternId) {
      case 'category-focused':
        return <PatternCategoryFocused menuData={menuData} showHeatmap={false} editable={false} />;
      case 'photo-focused':
        return <PatternPhotoFocused menuData={menuData} showHeatmap={false} editable={false} />;
      case 'recommended-focused':
        return <PatternRecommendedFocused menuData={menuData} showHeatmap={false} editable={false} />;
      case 'grid-layout':
        return <PatternGridLayout menuData={menuData} showHeatmap={false} editable={false} />;
      default:
        return null;
    }
  };

  if (menuData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-[#666666]">メニューデータがありません。まず「メニュー収集」タブでデータを収集してください。</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-2xl font-bold text-[#0099E6] mb-2">売上アップのためのUIデザインのヒント</h2>
        <p className="text-[#666666]">
          お客様がストレスなく注文でき、自然と客単価が上がるUIのポイントを解説します。
          <br />
          実際の画面を見比べながら、お店に最適なデザインを検討しましょう。
        </p>
      </div>

      {sections.map((section, index) => (
        <section key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* ヘッダー部分 */}
          <div className="bg-[#EBF7FF] p-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#0099E6] text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-md">
                {index + 1}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-1">{section.title.substring(3)}</h3>
                <p className="text-[#0099E6] font-bold text-sm mb-3">{section.subtitle}</p>
                <p className="text-[#666666] text-sm leading-relaxed max-w-3xl">
                  {section.description}
                </p>
              </div>
            </div>
          </div>

          {/* ヒントとポイント */}
          <div className="p-6 bg-white border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-green-50 rounded-lg p-4 border border-green-100">
                <h4 className="text-green-800 font-bold text-sm mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> 売上アップのポイント
                </h4>
                <ul className="space-y-2">
                  {section.tips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-green-900 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-green-500 rounded-full flex-shrink-0" />
                      {tip.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <LayoutTemplate className="w-8 h-8 text-[#0099E6] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[#666666] font-bold">下記の画面を見比べてみましょう</p>
                  <ArrowRight className="w-4 h-4 text-[#666666] mx-auto mt-1 rotate-90 md:rotate-0" />
                </div>
              </div>
            </div>
          </div>

          {/* UI比較エリア */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 左側のパターン */}
              <div className="flex flex-col">
                <div className="mb-3 text-center">
                  <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-[#666666] mb-2">
                    パターンA
                  </span>
                  <h4 className="font-bold text-[#333333]">{section.uiComparison.left.title}</h4>
                  <p className="text-xs text-[#666666] mt-1">{section.uiComparison.left.note}</p>
                </div>
                <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm hover:border-[#0099E6] transition-colors flex-1">
                  <DeviceSimulator device="iphone-se" maxHeight="500px">
                    <div className="w-full h-full overflow-y-auto bg-white">
                      {renderPattern(section.uiComparison.left.pattern)}
                    </div>
                  </DeviceSimulator>
                </div>
              </div>

              {/* 右側のパターン */}
              <div className="flex flex-col">
                <div className="mb-3 text-center">
                  <span className="inline-block px-3 py-1 bg-[#0099E6] text-white rounded-full text-xs font-bold mb-2 shadow-sm">
                    パターンB (推奨)
                  </span>
                  <h4 className="font-bold text-[#0099E6]">{section.uiComparison.right.title}</h4>
                  <p className="text-xs text-[#666666] mt-1">{section.uiComparison.right.note}</p>
                </div>
                <div className="bg-white rounded-xl border-2 border-[#0099E6] overflow-hidden shadow-md flex-1 relative">
                  <div className="absolute top-0 right-0 bg-[#0099E6] text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    おすすめ
                  </div>
                  <DeviceSimulator device="iphone-se" maxHeight="500px">
                    <div className="w-full h-full overflow-y-auto bg-white">
                      {renderPattern(section.uiComparison.right.pattern)}
                    </div>
                  </DeviceSimulator>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

