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
    <div className="flex flex-col h-full bg-air-gray">
      {/* ヘッダー */}
      <header className="bg-white text-air-text border-b border-air-gray-border p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-air-blue">Recruit</h1>
        <p className="text-sm text-air-text-secondary">モバイルオーダー</p>
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
                className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative ${
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
                      className="font-bold text-sm text-air-text mb-1 line-clamp-2 min-h-[2.5rem] block"
                    />
                  ) : (
                    <h3 className="font-bold text-sm text-air-text mb-1 line-clamp-2 min-h-[2.5rem]">
                      {item.name}
                    </h3>
                  )}
                  {editable ? (
                    <EditableText
                      value={item.description || ''}
                      onChange={(value) => updateMenuItemDescription(item.id, value)}
                      className="text-xs text-air-text-secondary mb-2 line-clamp-1 block"
                      placeholder="説明を追加..."
                    />
                  ) : (
                    item.description && (
                      <p className="text-xs text-air-text-secondary mb-2 line-clamp-1">{item.description}</p>
                    )
                  )}
                  <div className="flex items-center justify-between">
                    {editable ? (
                      <EditableText
                        value={item.price}
                        onChange={(value) => updateMenuItemPrice(item.id, value)}
                        className="text-base font-bold text-air-blue"
                      />
                    ) : (
                      <span className="text-base font-bold text-air-blue">{item.price}</span>
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
                      <button className="bg-air-blue text-white p-1.5 rounded-full hover:bg-air-blue-hover">
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

