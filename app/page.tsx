'use client';

import { useState } from 'react';
import MenuScraper from '@/components/MenuScraper';
import UIPatternViewer from '@/components/UIPatternViewer';
import PatternComparison from '@/components/PatternComparison';

export default function Home() {
  const [menuData, setMenuData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'scraper' | 'viewer' | 'comparison'>('scraper');

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            RecruitMO UI プロトタイプ
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            モバイルオーダーシステムのUIパターン比較ツール
          </p>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('scraper')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'scraper'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              メニュー収集
            </button>
            <button
              onClick={() => setViewMode('viewer')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'viewer'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              UIパターン表示
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'comparison'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              パターン比較
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'scraper' && (
          <MenuScraper onDataCollected={setMenuData} />
        )}
        {viewMode === 'viewer' && (
          <UIPatternViewer menuData={menuData} />
        )}
        {viewMode === 'comparison' && (
          <PatternComparison menuData={menuData} />
        )}
      </div>
    </main>
  );
}

