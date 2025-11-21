import { MenuItem } from '@/types/menu';
import { UIPattern } from '@/types/menu';

export function calculateVisualWeight(
  menuItem: MenuItem,
  menuItems: MenuItem[],
  pattern: UIPattern,
  index: number
): number {
  let weight = 0;

  // 画像サイズ（0-40点）
  if (menuItem.imageUrl) {
    weight += 40; // 画像があるだけで40点
  }

  // 画面上の位置（0-30点）
  // 配列の位置で計算（実際のレンダリング位置は別途計算可能）
  const positionRatio = 1 - index / Math.max(menuItems.length, 1);
  weight += positionRatio * 30;

  // おすすめフラグ（0-20点）
  if (menuItem.isRecommended) {
    weight += 20;
  }

  // コントラスト（0-10点）- カテゴリで判定
  if (menuItem.category === 'メイン料理' || menuItem.category === '肉料理') {
    weight += 10;
  }

  // パターンによる調整
  switch (pattern) {
    case 'photo-focused':
      // 写真重視型は画像の重みが高い
      if (menuItem.imageUrl) {
        weight += 10;
      }
      break;
    case 'recommended-focused':
      // おすすめ重視型はおすすめフラグの重みが高い
      if (menuItem.isRecommended) {
        weight += 10;
      }
      break;
  }

  return Math.min(100, Math.max(0, weight));
}

export function getVisualWeightColor(weight: number): 'red' | 'yellow' | 'green' {
  if (weight >= 80) {
    return 'red'; // 品切れリスク高
  } else if (weight >= 50) {
    return 'yellow'; // 品切れリスク中
  } else {
    return 'green'; // 品切れリスク低
  }
}

export function getVisualWeightColorClass(weight: number): string {
  const color = getVisualWeightColor(weight);
  if (color === 'red') {
    return 'bg-red-500 border-red-500';
  } else if (color === 'yellow') {
    return 'bg-yellow-500 border-yellow-500';
  } else {
    return 'bg-green-500 border-green-500';
  }
}

export function getVisualWeightLabel(weight: number): string {
  if (weight >= 80) {
    return '高リスク';
  } else if (weight >= 50) {
    return '中リスク';
  } else {
    return '低リスク';
  }
}

