'use client';

import { MenuItem, UIPattern } from '@/types/menu';
import { Plus } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useMenuStore } from '@/store/menuStore';
import { calculateVisualWeight, getVisualWeightColorClass } from '@/utils/visualWeight';

interface PatternGridLayoutProps {
  menuData: MenuItem[];
  showHeatmap?: boolean;
  editable?: boolean;
}

export default function PatternGridLayout({ 
  menuData, 
  showHeatmap = false,
  editable = false 
}: PatternGridLayoutProps) {
  const updateMenuItemName = useMenuStore((state) => state.updateMenuItemName);
  const updateMenuItemPrice = useMenuStore((state) => state.updateMenuItemPrice);
  const updateMenuItemDescription = useMenuStore((state) => state.updateMenuItemDescription);
  const toggleRecommended = useMenuStore((state) => state.toggleRecommended);
  return (
    <div className="flex flex-col h-full bg-white">
      {/* ヘッダー */}
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">RIGOLETTO</h1>
        <p className="text-sm opacity-90">モバイルオーダー</p>
      </header>

      {/* グリッドレイアウト */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {menuData.map((item, index) => {
            const visualWeight = calculateVisualWeight(item, menuData, 'grid-layout', index);
            const weightColorClass = getVisualWeightColorClass(visualWeight);
            
            return (
              <div
                key={item.id}
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative ${
                  showHeatmap ? `border-2 ${weightColorClass.split(' ')[1]}` : ''
                }`}
              >
                {showHeatmap && (
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${weightColorClass.split(' ')[0]} opacity-80 z-10`} 
                       title={`視覚的重み: ${visualWeight}/100`} />
                )}
                {item.imageUrl ? (
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-28 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.classList.add('bg-gray-100');
                      }}
                    />
                    {showHeatmap && (
                      <div className={`absolute top-0 left-0 w-full h-full ${weightColorClass.split(' ')[0]} opacity-30`} />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-28 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">画像なし</span>
                  </div>
                )}
                <div className="p-3">
                  {editable ? (
                    <EditableText
                      value={item.name}
                      onChange={(value) => updateMenuItemName(item.id, value)}
                      className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] block"
                    />
                  ) : (
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
                      {item.name}
                    </h3>
                  )}
                  {editable ? (
                    <EditableText
                      value={item.description || ''}
                      onChange={(value) => updateMenuItemDescription(item.id, value)}
                      className="text-xs text-gray-500 mb-2 line-clamp-1 block"
                      placeholder="説明を追加..."
                    />
                  ) : (
                    item.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{item.description}</p>
                    )
                  )}
                  <div className="flex items-center justify-between">
                    {editable ? (
                      <EditableText
                        value={item.price}
                        onChange={(value) => updateMenuItemPrice(item.id, value)}
                        className="text-base font-bold text-gray-900"
                      />
                    ) : (
                      <span className="text-base font-bold text-gray-900">{item.price}</span>
                    )}
                    <div className="flex items-center gap-2">
                      {editable && (
                        <button
                          onClick={() => toggleRecommended(item.id)}
                          className={`px-2 py-1 text-xs rounded ${
                            item.isRecommended
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {item.isRecommended ? '★' : '☆'}
                        </button>
                      )}
                      <button className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

