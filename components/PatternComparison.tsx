'use client';

import { useState, useRef, useEffect } from 'react';
import { MenuItem, UIPattern } from '@/types/menu';
import PatternCategoryFocused from './patterns/PatternCategoryFocused';
import PatternPhotoFocused from './patterns/PatternPhotoFocused';
import PatternRecommendedFocused from './patterns/PatternRecommendedFocused';
import PatternGridLayout from './patterns/PatternGridLayout';
import { Maximize2, Minimize2, Edit3, Eye, EyeOff } from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';
import DeviceSimulator from './DeviceSimulator';
import ExpressionPreset from './ExpressionPreset';

interface PatternComparisonProps {
  menuData: MenuItem[];
}

// スクロール同期フック
function useScrollSync(leftRef: React.RefObject<HTMLDivElement>, rightRef: React.RefObject<HTMLDivElement>, enabled: boolean) {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const leftElement = leftRef.current;
    const rightElement = rightRef.current;

    if (!leftElement || !rightElement) return;

    const handleScroll = (source: 'left' | 'right') => {
      if (isScrolling) return;
      setIsScrolling(true);

      if (source === 'left' && leftElement && rightElement) {
        const scrollRatio = leftElement.scrollTop / Math.max(leftElement.scrollHeight - leftElement.clientHeight, 1);
        rightElement.scrollTop = scrollRatio * Math.max(rightElement.scrollHeight - rightElement.clientHeight, 1);
      } else if (source === 'right' && leftElement && rightElement) {
        const scrollRatio = rightElement.scrollTop / Math.max(rightElement.scrollHeight - rightElement.clientHeight, 1);
        leftElement.scrollTop = scrollRatio * Math.max(leftElement.scrollHeight - leftElement.clientHeight, 1);
      }

      setTimeout(() => setIsScrolling(false), 100);
    };

    leftElement.addEventListener('scroll', () => handleScroll('left'));
    rightElement.addEventListener('scroll', () => handleScroll('right'));

    return () => {
      leftElement.removeEventListener('scroll', () => handleScroll('left'));
      rightElement.removeEventListener('scroll', () => handleScroll('right'));
    };
  }, [leftRef, rightRef, enabled, isScrolling]);
}

export default function PatternComparison({ menuData: initialMenuData }: PatternComparisonProps) {
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'single'>('side-by-side');
  const [selectedPatterns, setSelectedPatterns] = useState<[UIPattern, UIPattern]>(['category-focused', 'photo-focused']);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [editable, setEditable] = useState(false);
  const [scrollSyncEnabled, setScrollSyncEnabled] = useState(true);
  const [device, setDevice] = useState<'iphone-se' | 'iphone-15-pro-max'>('iphone-se');
  
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const menuData = useMenuStore((state) => state.menuData.length > 0 ? state.menuData : initialMenuData);
  const setMenuData = useMenuStore((state) => state.setMenuData);

  useEffect(() => {
    if (initialMenuData.length > 0) {
      setMenuData(initialMenuData);
    }
  }, [initialMenuData, setMenuData]);

  useScrollSync(leftRef, rightRef, scrollSyncEnabled && viewMode === 'side-by-side');

  const patterns = [
    { id: 'category-focused' as UIPattern, name: 'カテゴリ重視型', component: PatternCategoryFocused },
    { id: 'photo-focused' as UIPattern, name: '写真重視型', component: PatternPhotoFocused },
    { id: 'recommended-focused' as UIPattern, name: 'おすすめ重視型', component: PatternRecommendedFocused },
    { id: 'grid-layout' as UIPattern, name: 'グリッドレイアウト', component: PatternGridLayout },
  ];

  if (menuData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">メニューデータがありません。まず「メニュー収集」タブでデータを収集してください。</p>
      </div>
    );
  }

  if (viewMode === 'single' && expandedPattern) {
    const pattern = patterns.find(p => p.id === expandedPattern);
    const Component = pattern?.component || PatternCategoryFocused;
    
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{pattern?.name}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditable(!editable)}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 ${
                  editable
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {editable ? '編集モード' : '編集'}
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 ${
                  showHeatmap
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showHeatmap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                ヒートマップ
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <Minimize2 className="w-4 h-4" />
                比較モードに戻る
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-100 p-8 flex justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '700px' }}>
              <Component menuData={menuData} showHeatmap={showHeatmap} editable={editable} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const LeftComponent = patterns.find(p => p.id === selectedPatterns[0])?.component || PatternCategoryFocused;
  const RightComponent = patterns.find(p => p.id === selectedPatterns[1])?.component || PatternPhotoFocused;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">UIパターン比較</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewMode === 'side-by-side'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              サイドバイサイド
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewMode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              単一表示
            </button>
          </div>
        </div>

        {viewMode === 'side-by-side' && (
          <div className="space-y-4">
            <ExpressionPreset />
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">左のパターン</label>
                <select
                  value={selectedPatterns[0]}
                  onChange={(e) => setSelectedPatterns([e.target.value as UIPattern, selectedPatterns[1]])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {patterns.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">右のパターン</label>
                <select
                  value={selectedPatterns[1]}
                  onChange={(e) => setSelectedPatterns([selectedPatterns[0], e.target.value as UIPattern])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {patterns.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => setEditable(!editable)}
                className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${
                  editable
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {editable ? '編集モードON' : '編集モードOFF'}
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${
                  showHeatmap
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showHeatmap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                ヒートマップ
              </button>
              <button
                onClick={() => setScrollSyncEnabled(!scrollSyncEnabled)}
                className={`px-4 py-2 text-sm rounded-lg ${
                  scrollSyncEnabled
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                スクロール同期: {scrollSyncEnabled ? 'ON' : 'OFF'}
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">デバイス</label>
                <select
                  value={device}
                  onChange={(e) => setDevice(e.target.value as 'iphone-se' | 'iphone-15-pro-max')}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="iphone-se">iPhone SE</option>
                  <option value="iphone-15-pro-max">iPhone 15 Pro Max</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 mt-4">
          {viewMode === 'side-by-side' 
            ? '2つのUIパターンを並べて比較できます。スクロール同期により、同じ位置のメニューを比較可能です。'
            : '各UIパターンを個別に確認できます。パターンをクリックして拡大表示も可能です。'
          }
        </p>
      </div>

      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                {patterns.find(p => p.id === selectedPatterns[0])?.name}
              </h3>
            </div>
            <div className="bg-gray-100 p-4">
              <DeviceSimulator device={device}>
                <div 
                  ref={leftRef}
                  className="w-full h-full overflow-y-auto" 
                  style={{ minHeight: device === 'iphone-se' ? '667px' : '932px' }}
                >
                  <LeftComponent menuData={menuData} showHeatmap={showHeatmap} editable={editable} />
                </div>
              </DeviceSimulator>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                {patterns.find(p => p.id === selectedPatterns[1])?.name}
              </h3>
            </div>
            <div className="bg-gray-100 p-4">
              <DeviceSimulator device={device}>
                <div 
                  ref={rightRef}
                  className="w-full h-full overflow-y-auto" 
                  style={{ minHeight: device === 'iphone-se' ? '667px' : '932px' }}
                >
                  <RightComponent menuData={menuData} showHeatmap={showHeatmap} editable={editable} />
                </div>
              </DeviceSimulator>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'single' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {patterns.map((pattern) => {
            const Component = pattern.component;
            
            return (
              <div key={pattern.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{pattern.name}</h3>
                  <button
                    onClick={() => {
                      setExpandedPattern(pattern.id);
                      setViewMode('single');
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-gray-100 p-4">
                  <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '400px' }}>
                    <Component menuData={menuData} showHeatmap={showHeatmap} editable={editable} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
