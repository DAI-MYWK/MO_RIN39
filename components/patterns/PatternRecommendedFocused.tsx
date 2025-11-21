'use client';

import { MenuItem, UIPattern } from '@/types/menu';
import { Star, ChevronRight } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useMenuStore } from '@/store/menuStore';
import { calculateVisualWeight, getVisualWeightColorClass } from '@/utils/visualWeight';

interface PatternRecommendedFocusedProps {
  menuData: MenuItem[];
  showHeatmap?: boolean;
  editable?: boolean;
}

export default function PatternRecommendedFocused({ 
  menuData, 
  showHeatmap = false,
  editable = false 
}: PatternRecommendedFocusedProps) {
  const updateMenuItemName = useMenuStore((state) => state.updateMenuItemName);
  const updateMenuItemPrice = useMenuStore((state) => state.updateMenuItemPrice);
  const updateMenuItemDescription = useMenuStore((state) => state.updateMenuItemDescription);
  const toggleRecommended = useMenuStore((state) => state.toggleRecommended);
  
  // おすすめメニューを先頭に（実際にはisRecommendedフラグで判定）
  const recommendedItems = menuData.filter(item => item.isRecommended || item.name.includes('アマトリッチャーナ') || item.name.includes('パスタ'));
  const otherItems = menuData.filter(item => !recommendedItems.includes(item));

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
        <h1 className="text-xl font-bold">RIGOLETTO</h1>
        <p className="text-sm opacity-90">モバイルオーダー</p>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* おすすめセクション */}
        {recommendedItems.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border-b-4 border-yellow-400">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">おすすめメニュー</h2>
            </div>
            <div className="space-y-4">
              {recommendedItems.map((item, index) => {
                const visualWeight = calculateVisualWeight(item, menuData, 'recommended-focused', menuData.indexOf(item));
                const weightColorClass = getVisualWeightColorClass(visualWeight);
                
                return (
                  <div 
                    key={item.id} 
                    className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative ${
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
                            className="w-24 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          {showHeatmap && (
                            <div className={`absolute top-0 left-0 w-full h-full rounded-lg ${weightColorClass.split(' ')[0]} opacity-20`} />
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          {editable ? (
                            <EditableText
                              value={item.name}
                              onChange={(value) => updateMenuItemName(item.id, value)}
                              className="font-bold text-lg text-gray-900 block"
                            />
                          ) : (
                            <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                          )}
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            おすすめ
                          </span>
                        </div>
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
                              className="text-xl font-bold text-gray-900"
                            />
                          ) : (
                            <span className="text-xl font-bold text-gray-900">{item.price}</span>
                          )}
                          <div className="flex items-center gap-2">
                            {editable && (
                              <button
                                onClick={() => toggleRecommended(item.id)}
                                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                              >
                                おすすめ解除
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
          </div>
        )}

        {/* その他のメニュー */}
        {otherItems.length > 0 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">その他のメニュー</h2>
            <div className="space-y-3">
              {otherItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <span className="text-lg font-bold text-gray-900">{item.price}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

