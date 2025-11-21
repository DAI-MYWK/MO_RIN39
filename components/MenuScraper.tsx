'use client';

import { useState } from 'react';
import { Loader2, Download, Check } from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  category: string;
  source: string;
}

interface MenuScraperProps {
  onDataCollected: (data: MenuItem[]) => void;
}

export default function MenuScraper({ onDataCollected }: MenuScraperProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState('');
  const setMenuData = useMenuStore((state) => state.setMenuData);

  const handleScrape = async () => {
    if (!url) {
      setError('URLを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setMenuItems([]);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'スクレイピングに失敗しました');
      }

      const items = data.menuItems || [];
      setMenuItems(items);
      setMenuData(items);
      onDataCollected(items);
      
      if (items.length === 0) {
        setError('メニュー情報が見つかりませんでした。手動で追加することもできます。');
      }
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleAddManual = () => {
    const newItem: MenuItem = {
      id: `manual-${Date.now()}`,
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      category: '未分類',
      source: 'manual',
    };
    setMenuItems([...menuItems, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof MenuItem, value: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    setMenuData(menuItems);
    onDataCollected(menuItems);
    alert('メニューデータを保存しました！');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">メニュー情報の収集</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL（食べログまたはホットペッパーグルメ）
            </label>
            <p className="text-xs text-gray-500 mb-2">
              ホットペッパーグルメの例: https://www.hotpepper.jp/strJ001221223/food/ （料理）または /drink/ （ドリンク）
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://tabelog.com/..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleScrape}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    収集中...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    収集
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              {error}
            </div>
          )}

          {menuItems.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  収集したメニュー ({menuItems.length}件)
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddManual}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    + 手動追加
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    保存
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {menuItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                          placeholder="メニュー名"
                          className="w-full px-3 py-2 border border-gray-300 rounded mb-2 font-medium"
                        />
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                          placeholder="価格"
                          className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                        />
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="説明"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={item.imageUrl}
                          onChange={(e) => handleUpdateItem(item.id, 'imageUrl', e.target.value)}
                          placeholder="画像URL"
                          className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                        />
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded mt-2 text-sm"
                        >
                          <option>未分類</option>
                          <option>メイン料理</option>
                          <option>パスタ</option>
                          <option>ピザ</option>
                          <option>サラダ</option>
                          <option>ドリンク</option>
                          <option>デザート</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

