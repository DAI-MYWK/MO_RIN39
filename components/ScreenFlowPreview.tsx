'use client';

import { MenuItem } from '@/types/menu';
import { ChevronRight } from 'lucide-react';

interface ScreenFlowPreviewProps {
  menuData: MenuItem[];
}

export default function ScreenFlowPreview({ menuData }: ScreenFlowPreviewProps) {
  const steps = [
    {
      number: 1,
      title: 'QRコード読取',
      description: 'テーブルのQRコードをスキャン',
      preview: (
        <div className="relative h-full bg-white flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${i % 3 === 0 ? 'bg-white' : 'bg-gray-900'} ${i % 2 === 0 ? 'bg-white' : ''}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-[#666666] mt-2">
              ご来店ありがとうございます
            </p>
            <div className="mt-4 px-4 py-2 bg-[#0099E6] text-white rounded-full text-sm font-bold">
              📷 QRコードをスキャン
            </div>
          </div>
        </div>
      )
    },
    {
      number: 2,
      title: 'メニュー閲覧',
      description: 'カテゴリからメニューを探す',
      preview: (
        <div className="h-full bg-white overflow-hidden">
          <div className="bg-[#0099E6] text-white px-4 py-3 text-sm font-bold">
            メニュー
          </div>
          <div className="p-3 space-y-2">
            {['ドリンク', '料理', 'デザート'].map((category) => (
              <div key={category} className="bg-[#EBF7FF] rounded-lg p-2 border border-gray-200">
                <div className="text-xs font-bold text-[#333333]">{category}</div>
              </div>
            ))}
            <div className="border-t pt-2 mt-3">
              <div className="text-xs font-bold mb-2">人気メニュー</div>
              {menuData.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2 bg-gray-50 rounded p-1.5">
                  <div className="w-10 h-10 bg-[#EBF7FF] rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate text-[#333333]">{item.name}</div>
                    <div className="text-xs text-[#666666]">¥{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-50 border-t">
            <button className="w-full bg-[#0099E6] text-white py-2 rounded-full text-xs font-bold">
              注文リスト
            </button>
          </div>
        </div>
      )
    },
    {
      number: 3,
      title: '注文リスト追加',
      description: 'メニューを選んでカスタマイズ',
      preview: (
        <div className="h-full bg-white overflow-hidden">
          <div className="relative">
            <div className="w-full h-24 bg-[#EBF7FF]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg" />
            </div>
          </div>
          <div className="p-3 mt-2">
            <h3 className="text-sm font-bold mb-1 text-[#333333]">ハイボール</h3>
            <div className="text-lg font-bold text-[#0099E6] mb-2">¥600</div>
            <p className="text-xs text-[#666666] mb-3 line-clamp-2">
              キンキンに冷えたグラスで爽やかな喉越
            </p>
            <div className="bg-gray-50 rounded p-2 mb-3">
              <div className="text-xs font-medium mb-1 text-[#333333]">オプションを選択してください</div>
              <div className="space-y-1">
                <label className="flex items-center text-xs text-[#333333]">
                  <input type="checkbox" className="mr-1.5" />
                  トッピング：レモン
                  <span className="ml-auto">+¥50</span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <button className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">-</button>
              <span className="flex-1 text-center font-bold text-[#333333]">1</span>
              <button className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">+</button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t">
            <button className="w-full bg-[#0099E6] text-white py-2 rounded-full text-xs font-bold">
              注文リストに追加
            </button>
          </div>
        </div>
      )
    },
    {
      number: 4,
      title: '注文送信',
      description: '注文内容を確認して送信',
      preview: (
        <div className="h-full bg-white overflow-hidden flex flex-col">
          <div className="bg-[#0099E6] text-white px-4 py-3 text-sm font-bold flex items-center">
            <button className="mr-2">&lt;</button>
            注文リスト
          </div>
          <div className="flex-1 overflow-auto p-3">
            <div className="bg-[#EBF7FF] border border-gray-200 rounded p-2 mb-3 text-xs text-[#666666]">
              注文リストを追加してください
            </div>
            <div className="text-xs font-bold mb-2 text-[#333333]">自動追加商品</div>
            <div className="space-y-2">
              {menuData.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 pb-2 border-b">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-[#333333]">{item.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button className="w-5 h-5 bg-gray-200 rounded text-xs">-</button>
                      <span className="text-xs text-[#333333]">1</span>
                      <button className="w-5 h-5 bg-gray-200 rounded text-xs">+</button>
                    </div>
                  </div>
                  <div className="text-xs text-[#333333]">¥{item.price}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-gray-50 border-t">
            <button className="w-full bg-[#0099E6] text-white py-2 rounded-full text-xs font-bold">
              注文リストを送信
            </button>
          </div>
        </div>
      )
    },
    {
      number: 5,
      title: 'お会計',
      description: '合計金額を確認',
      preview: (
        <div className="h-full bg-white overflow-hidden flex flex-col">
          <div className="bg-[#0099E6] text-white px-4 py-3 text-sm font-bold flex items-center">
            <button className="mr-2">&lt;</button>
            お会計
          </div>
          <div className="flex-1 p-4">
            <div className="mb-4">
              <div className="text-xs text-[#666666] mb-1">お支払方法</div>
              <div className="text-sm font-bold text-[#333333]">テーブル会計</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-xs text-[#666666] mb-2">
                お支払方法をご確認し、お呼びリストに登録します。
                よろしいですか?
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-xs font-bold text-[#333333]">ご注文明細</div>
              {menuData.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-[#333333]">{item.name}</span>
                  <div>
                    <span className="text-[#666666] mr-2">1</span>
                    <span className="text-[#333333]">¥{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-[#333333]">合計金額</span>
                <span className="text-2xl font-bold text-[#333333]">¥12,800</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-white border-t">
            <button className="w-full bg-[#0099E6] text-white py-3 rounded-full text-sm font-bold">
              会計依頼
            </button>
          </div>
        </div>
      )
    }
  ];

  if (menuData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-[#666666]">メニューデータがありません。まず「メニュー収集」タブでデータを収集してください。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-[#333333] mb-2">モバイルオーダー画面遷移フロー</h2>
        <p className="text-sm text-[#666666] mb-8">
          お客様がQRコードを読み取ってから会計までの一連の流れを確認できます
        </p>

        {/* デスクトップビュー：横並び */}
        <div className="hidden lg:block overflow-x-auto pb-4">
          <div className="flex items-start gap-4 min-w-max">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  {/* ステップカード */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow w-64">
                    {/* ヘッダー */}
                    <div className="bg-[#0099E6] px-3 py-2 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-[#0099E6]">
                          {step.number}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{step.title}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* プレビュー */}
                    <div className="relative bg-gray-50" style={{ height: '400px' }}>
                      {step.preview}
                    </div>
                    
                    {/* 説明 */}
                    <div className="p-3 bg-gray-50 border-t">
                      <p className="text-xs text-[#666666]">{step.description}</p>
                    </div>
                  </div>
                </div>

                {/* 矢印 */}
                {index < steps.length - 1 && (
                  <div className="flex items-center justify-center pt-32">
                    <ChevronRight className="w-8 h-8 text-[#0099E6]" strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* モバイル/タブレットビュー：縦並び */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <div key={step.number}>
              <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* ヘッダー */}
                <div className="bg-[#0099E6] px-4 py-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-[#0099E6]">
                      {step.number}
                    </div>
                    <div>
                      <div className="text-base font-bold text-white">{step.title}</div>
                      <div className="text-xs text-white/80">{step.description}</div>
                    </div>
                  </div>
                </div>
                
                {/* プレビュー */}
                <div className="relative bg-gray-50" style={{ height: '500px' }}>
                  {step.preview}
                </div>
              </div>

              {/* 矢印（下向き） */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-3">
                  <div className="rotate-90">
                    <ChevronRight className="w-8 h-8 text-[#0099E6]" strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 追加情報 */}
      <div className="bg-[#EBF7FF] border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-bold text-[#333333] mb-2">💡 UIパターンについて</h3>
        <p className="text-sm text-[#666666]">
          この画面遷移フローは基本的な流れを示しています。
          「パターン比較」タブでは、メニュー表示画面（ステップ2）の異なるUIパターンを比較できます。
        </p>
      </div>
    </div>
  );
}

