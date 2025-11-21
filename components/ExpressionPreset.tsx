'use client';

import { useState } from 'react';
import { useMenuStore } from '@/store/menuStore';
import { RotateCcw } from 'lucide-react';

interface ExpressionPreset {
  id: string;
  name: string;
  replacements: { from: string; to: string }[];
}

const presets: ExpressionPreset[] = [
  {
    id: 'main-to-meat',
    name: 'メイン料理 → 肉料理',
    replacements: [
      { from: 'メイン料理', to: '肉料理' },
      { from: 'メイン', to: '肉' },
    ],
  },
  {
    id: 'meat-to-steak',
    name: '肉料理 → ステーキ',
    replacements: [
      { from: '肉料理', to: 'ステーキ' },
      { from: '肉', to: 'ステーキ' },
    ],
  },
  {
    id: 'steak-to-premium',
    name: 'ステーキ → 和牛ステーキ',
    replacements: [
      { from: 'ステーキ', to: '和牛ステーキ' },
      { from: '肉料理', to: '和牛ステーキ' },
    ],
  },
];

export default function ExpressionPreset() {
  const menuData = useMenuStore((state) => state.menuData);
  const updateMenuItemName = useMenuStore((state) => state.updateMenuItemName);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const applyPreset = (preset: ExpressionPreset) => {
    menuData.forEach((item) => {
      let newName = item.name;
      preset.replacements.forEach(({ from, to }) => {
        if (newName.includes(from)) {
          newName = newName.replace(new RegExp(from, 'g'), to);
          updateMenuItemName(item.id, newName);
        }
      });
    });
    setSelectedPreset(preset.id);
  };

  const resetNames = () => {
    // 元の名前を復元する機能（実装は簡易版）
    alert('元の名前を復元するには、メニュー収集タブから再度データを読み込んでください。');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">表現パターンのプリセット</h3>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              selectedPreset === preset.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {preset.name}
          </button>
        ))}
        <button
          onClick={resetNames}
          className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          リセット
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        選択した表現パターンを適用すると、メニュー名が一括で置換されます。
      </p>
    </div>
  );
}

