'use client';

import { useState } from 'react';
import { MenuItem, UIPattern } from '@/types/menu';
import PatternCategoryFocused from './patterns/PatternCategoryFocused';
import PatternPhotoFocused from './patterns/PatternPhotoFocused';
import PatternRecommendedFocused from './patterns/PatternRecommendedFocused';
import PatternGridLayout from './patterns/PatternGridLayout';
import FlowVisualization from './FlowVisualization';

interface UIPatternViewerProps {
  menuData: MenuItem[];
}

export default function UIPatternViewer({ menuData }: UIPatternViewerProps) {
  const [selectedPattern, setSelectedPattern] = useState<UIPattern>('category-focused');

  const patterns = [
    { id: 'category-focused' as UIPattern, name: 'パターン1: カテゴリ重視型', description: 'カテゴリごとに整理されたメニュー表示' },
    { id: 'photo-focused' as UIPattern, name: 'パターン2: 写真重視型', description: '大きな写真でメニューを魅力的に表示' },
    { id: 'recommended-focused' as UIPattern, name: 'パターン3: おすすめ重視型', description: 'おすすめメニューを前面に表示' },
    { id: 'grid-layout' as UIPattern, name: 'パターン4: グリッドレイアウト', description: '均等なグリッドで整理された表示' },
  ];

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [editable, setEditable] = useState(false);

  const renderPattern = () => {
    switch (selectedPattern) {
      case 'category-focused':
        return <PatternCategoryFocused menuData={menuData} showHeatmap={showHeatmap} editable={editable} />;
      case 'photo-focused':
        return <PatternPhotoFocused menuData={menuData} showHeatmap={showHeatmap} editable={editable} />;
      case 'recommended-focused':
        return <PatternRecommendedFocused menuData={menuData} showHeatmap={showHeatmap} editable={editable} />;
      case 'grid-layout':
        return <PatternGridLayout menuData={menuData} showHeatmap={showHeatmap} editable={editable} />;
      default:
        return <PatternCategoryFocused menuData={menuData} showHeatmap={showHeatmap} editable={editable} />;
    }
  };

  if (menuData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">メニューデータがありません。まず「メニュー収集」タブでデータを収集してください。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">UIパターン選択</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {patterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => setSelectedPattern(pattern.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedPattern === pattern.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900 mb-1">{pattern.name}</div>
              <div className="text-sm text-gray-600">{pattern.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {patterns.find(p => p.id === selectedPattern)?.name}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setEditable(!editable)}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                editable
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {editable ? '編集ON' : '編集OFF'}
            </button>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                showHeatmap
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showHeatmap ? 'ヒートマップON' : 'ヒートマップOFF'}
            </button>
          </div>
        </div>
        <div className="bg-gray-100 p-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '600px' }}>
            {renderPattern()}
          </div>
        </div>
      </div>

      <FlowVisualization patternName={patterns.find(p => p.id === selectedPattern)?.name || ''} />
    </div>
  );
}

