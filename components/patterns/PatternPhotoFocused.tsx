'use client';

import { useState } from 'react';
import { MenuItem, UIPattern } from '@/types/menu';
import { Plus } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useMenuStore } from '@/store/menuStore';
import { calculateVisualWeight, getVisualWeightColorClass } from '@/utils/visualWeight';

interface PatternPhotoFocusedProps {
  menuData: MenuItem[];
  showHeatmap?: boolean;
  editable?: boolean;
}

export default function PatternPhotoFocused({ 
  menuData, 
  showHeatmap = false,
  editable = false 
}: PatternPhotoFocusedProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const updateMenuItemName = useMenuStore((state) => state.updateMenuItemName);
  const updateMenuItemPrice = useMenuStore((state) => state.updateMenuItemPrice);
  const updateMenuItemDescription = useMenuStore((state) => state.updateMenuItemDescription);
  const toggleRecommended = useMenuStore((state) => state.toggleRecommended);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <h1 className="text-xl font-bold">RIGOLETTO</h1>
        <p className="text-sm opacity-90">モバイルオーダー</p>
      </header>

      {/* メニューグリッド（写真重視） */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {menuData.map((item, index) => {
            const visualWeight = calculateVisualWeight(item, menuData, 'photo-focused', index);
            const weightColorClass = getVisualWeightColorClass(visualWeight);
            
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${
                  showHeatmap ? `border-2 ${weightColorClass.split(' ')[1]}` : ''
                }`}
              >
                {showHeatmap && (
                  <div className={`absolute top-2 left-2 w-3 h-3 rounded-full ${weightColorClass.split(' ')[0]} opacity-80 z-10`} 
                       title={`視覚的重み: ${visualWeight}/100`} />
                )}
                {item.imageUrl ? (
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.classList.add('bg-gray-200');
                      }}
                    />
                    {showHeatmap && (
                      <div className={`absolute top-0 left-0 w-full h-full ${weightColorClass.split(' ')[0]} opacity-30`} />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">画像なし</span>
                  </div>
                )}
                <div className="p-3 bg-white">
                  {editable ? (
                    <EditableText
                      value={item.name}
                      onChange={(value) => updateMenuItemName(item.id, value)}
                      className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1 block"
                    />
                  ) : (
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                  )}
                  {editable ? (
                    <EditableText
                      value={item.price}
                      onChange={(value) => updateMenuItemPrice(item.id, value)}
                      className="text-lg font-bold text-gray-900 block"
                    />
                  ) : (
                    <p className="text-lg font-bold text-gray-900">{item.price}</p>
                  )}
                </div>
                {item.isRecommended && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    おすすめ
                  </div>
                )}
                {editable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRecommended(item.id);
                    }}
                    className={`absolute bottom-2 right-2 px-2 py-1 text-xs rounded ${
                        item.isRecommended
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    {item.isRecommended ? 'おすすめ' : '通常'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* モーダル（選択時） */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            {selectedItem.imageUrl && (
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.name}</h2>
              {selectedItem.description && (
                <p className="text-gray-600 mb-4">{selectedItem.description}</p>
              )}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">{selectedItem.price}</span>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  カートに追加
                </button>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

