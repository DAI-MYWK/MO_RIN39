'use client';

import { useState } from 'react';
import { MenuItem, UIPattern } from '@/types/menu';
import { ChevronRight } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useMenuStore } from '@/store/menuStore';
import { calculateVisualWeight, getVisualWeightColorClass } from '@/utils/visualWeight';

interface PatternCategoryFocusedProps {
  menuData: MenuItem[];
  showHeatmap?: boolean;
  editable?: boolean;
}

export default function PatternCategoryFocused({ 
  menuData, 
  showHeatmap = false,
  editable = false 
}: PatternCategoryFocusedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const updateMenuItemName = useMenuStore((state) => state.updateMenuItemName);
  const updateMenuItemPrice = useMenuStore((state) => state.updateMenuItemPrice);
  const updateMenuItemDescription = useMenuStore((state) => state.updateMenuItemDescription);
  const toggleRecommended = useMenuStore((state) => state.toggleRecommended);

  const categories = ['all', ...Array.from(new Set(menuData.map(item => item.category)))];
  const filteredMenu = selectedCategory === 'all' 
    ? menuData 
    : menuData.filter(item => item.category === selectedCategory);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">RIGOLETTO</h1>
        <p className="text-sm opacity-90">モバイルオーダー</p>
      </header>

      {/* カテゴリタブ */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              selectedCategory === category
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {category === 'all' ? 'すべて' : category}
          </button>
        ))}
      </div>

      {/* メニューリスト */}
      <div className="flex-1 overflow-y-auto">
        {filteredMenu.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            メニューがありません
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMenu.map((item, index) => {
              const visualWeight = calculateVisualWeight(item, menuData, 'category-focused', menuData.indexOf(item));
              const weightColorClass = getVisualWeightColorClass(visualWeight);
              
              return (
                <div 
                  key={item.id} 
                  className={`p-4 hover:bg-gray-50 cursor-pointer relative ${
                    showHeatmap ? `border-l-4 ${weightColorClass.split(' ')[1]}` : ''
                  }`}
                >
                  {showHeatmap && (
                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${weightColorClass.split(' ')[0]} opacity-60`} 
                         title={`視覚的重み: ${visualWeight}/100`} />
                  )}
                  <div className="flex items-start gap-4">
                    {item.imageUrl && (
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {showHeatmap && (
                          <div className={`absolute top-0 left-0 w-full h-full rounded ${weightColorClass.split(' ')[0]} opacity-20`} />
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {editable ? (
                        <EditableText
                          value={item.name}
                          onChange={(value) => updateMenuItemName(item.id, value)}
                          className="font-semibold text-gray-900 mb-1 block"
                        />
                      ) : (
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      )}
                      {editable ? (
                        <EditableText
                          value={item.description || ''}
                          onChange={(value) => updateMenuItemDescription(item.id, value)}
                          className="text-sm text-gray-600 mb-2 line-clamp-2 block"
                          placeholder="説明を追加..."
                          multiline
                        />
                      ) : (
                        item.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        )
                      )}
                      <div className="flex items-center justify-between">
                        {editable ? (
                          <EditableText
                            value={item.price}
                            onChange={(value) => updateMenuItemPrice(item.id, value)}
                            className="text-lg font-bold text-gray-900"
                            placeholder="価格"
                          />
                        ) : (
                          <span className="text-lg font-bold text-gray-900">{item.price}</span>
                        )}
                        <div className="flex items-center gap-2">
                          {editable && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRecommended(item.id);
                              }}
                              className={`px-2 py-1 text-xs rounded ${
                                item.isRecommended
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {item.isRecommended ? 'おすすめ' : '通常'}
                            </button>
                          )}
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

