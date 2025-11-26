'use client';

import { useState } from 'react';
import MenuScraper from '@/components/MenuScraper';
import ScreenFlowPreview from '@/components/ScreenFlowPreview';
import PatternComparison from '@/components/PatternComparison';
import SalesTips from '@/components/SalesTips';

export default function Home() {
  const [menuData, setMenuData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'scraper' | 'viewer' | 'comparison' | 'tips'>('scraper');

  return (
    <main className="min-h-screen bg-[#EBF7FF]">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-[#333333]">
          RING39　モバイルオーダー　プレビューツール
          </h1>
          <p className="text-sm text-[#666666] mt-1">
            UIパターンの比較ツール
          </p>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('scraper')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'scraper'
                  ? 'text-[#0099E6] border-b-2 border-[#0099E6]'
                  : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              メニュー収集
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'comparison'
                  ? 'text-[#0099E6] border-b-2 border-[#0099E6]'
                  : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              パターン比較
            </button>
            <button
              onClick={() => setViewMode('viewer')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'viewer'
                  ? 'text-[#0099E6] border-b-2 border-[#0099E6]'
                  : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              画面遷移フロー
            </button>
            <button
              onClick={() => setViewMode('tips')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'tips'
                  ? 'text-[#0099E6] border-b-2 border-[#0099E6]'
                  : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              売上アップのヒント
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'scraper' && (
          <MenuScraper 
            onDataCollected={(data) => {
              setMenuData(data);
              if (data.length > 0) {
                setViewMode('comparison');
              }
            }} 
          />
        )}
        {viewMode === 'viewer' && (
          <ScreenFlowPreview menuData={menuData} />
        )}
        {viewMode === 'comparison' && (
          <PatternComparison menuData={menuData} />
        )}
        {viewMode === 'tips' && (
          <SalesTips menuData={menuData} />
        )}
      </div>
    </main>
  );
}

