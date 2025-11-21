# RecruitMO - 修正提案：最短でUIパターン比較を実現

## 目的の再確認

✅ **求められていること**:
- パターンの作成と見た目で比較できる材料を、**人間の手作業を介さずに最短で作る**
- **メニュー名の表現**（「メイン料理」vs「肉料理」）を簡単に切り替えて比較
- **おすすめメニューの強調度**を簡単に調整して比較（品切れリスクの可視化）

❌ **求められていないこと**:
- データや統計予測
- ヒューリスティックアルゴリズム
- 売上予測

---

## 🎯 実装すべき機能（優先順位順）

### 1. **プレビュー上での直接編集機能**（最重要）

#### 目的
メニュー名、価格、説明、おすすめフラグを**プレビュー上で直接編集**し、**リアルタイムで反映**させる。

#### 実装内容
- **クリックで編集**: プレビュー上のメニュー名をクリック → インライン編集
- **リアルタイム反映**: 編集した内容が**即座に全パターンに反映**
- **表現の切り替え**: 「メイン料理」→「肉料理」を**ワンクリックで切り替え**

#### ユースケース
1. プレビュー上で「メイン料理」をクリック
2. 「肉料理」に変更
3. **全パターンで即座に反映** → 見た目を比較

---

### 2. **視覚的重みのヒートマップ**（品切れリスクの可視化）

#### 目的
おすすめメニューの強調度を**視覚的に可視化**し、「アピールし過ぎて品切れするリスク」を一目で分かるようにする。

#### 実装内容
- **ヒートマップモード**: トグルでON/OFF
- **視覚的重みの計算**:
  - 画像サイズ（大きいほど重みが高い）
  - 画面上の位置（上にあるほど重みが高い）
  - おすすめフラグ（ONだと重みが高い）
  - コントラスト（目立つほど重みが高い）
- **色分け表示**: 
  - 🔴 赤（重み80-100）: 品切れリスク高
  - 🟡 黄（重み50-79）: 品切れリスク中
  - 🟢 緑（重み0-49）: 品切れリスク低

#### ユースケース
1. ヒートマップモードをON
2. おすすめメニューが**赤く表示**される
3. 「このメニューは強調し過ぎている。在庫が少ない場合は注意が必要」と判断

---

### 3. **スクロール同期によるA/B比較**

#### 目的
2つのUIパターンを**並べて比較**し、**スクロールを同期**させる。

#### 実装内容
- **サイドバイサイド表示**: 左にパターンA、右にパターンB
- **スクロール同期**: 左をスクロールすると右も自動的にスクロール
- **パターン選択**: 4つのパターンから2つを選択して比較

#### ユースケース
1. 左に「カテゴリ重視型」、右に「写真重視型」を表示
2. 左をスクロール → 右も自動的にスクロール
3. **同じ位置のメニューを比較**できる

---

### 4. **デバイスシミュレーション**

#### 目的
iPhone SE（小さい画面）とiPhone 15 Pro Max（大きい画面）で**見た目を確認**する。

#### 実装内容
- **デバイス選択**: ドロップダウンでデバイスを選択
- **フレーム表示**: 選択したデバイスのフレームで表示
- **レスポンシブ確認**: 小さい画面でもメニューが読みやすいか確認

#### ユースケース
1. iPhone SEを選択
2. メニュー名が**切れていないか**確認
3. iPhone 15 Pro Maxに切り替え
4. **大きい画面での見た目**を確認

---

### 5. **表現パターンのプリセット機能**（追加提案）

#### 目的
「メイン料理」vs「肉料理」vs「ステーキ」などの**表現パターンをプリセット**として保存し、**ワンクリックで切り替え**できる。

#### 実装内容
- **表現パターンの定義**: 
  - 「メイン料理」→「肉料理」→「ステーキ」→「和牛ステーキ」
- **一括置換**: 選択したカテゴリのメニュー名を一括で置換
- **比較**: 異なる表現パターンで**同じUIパターンを見比べる**

#### ユースケース
1. 「メイン料理」という表現でプレビュー
2. 「表現パターン」から「肉料理」を選択
3. **全メニューが「肉料理」に一括置換**
4. 見た目を比較

---

## 🚀 実装の優先順位

### Phase 1（最優先）: 最短で比較できるようにする
1. ✅ **プレビュー上での直接編集**（メニュー名、価格、説明、おすすめフラグ）
2. ✅ **視覚的重みのヒートマップ**（品切れリスクの可視化）
3. ✅ **スクロール同期**（A/B比較）

### Phase 2（次優先）: より使いやすくする
4. ✅ **デバイスシミュレーション**（iPhone SE / iPhone 15 Pro Max）
5. ✅ **表現パターンのプリセット**（「メイン料理」→「肉料理」の一括置換）

---

## 💡 実装の技術的アプローチ

### 1. プレビュー上での直接編集

```typescript
// インライン編集コンポーネント
const EditableText = ({ value, onChange, field, menuId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  return (
    <div onClick={() => setIsEditing(true)}>
      {isEditing ? (
        <input
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => {
            onChange(menuId, field, tempValue);
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onChange(menuId, field, tempValue);
              setIsEditing(false);
            }
          }}
          autoFocus
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
};
```

### 2. 視覚的重みの計算

```typescript
// 視覚的重みの計算（シンプルな実装）
function calculateVisualWeight(menuItem: MenuItem, pattern: UIPattern): number {
  let weight = 0;
  
  // 画像サイズ（0-40点）
  if (menuItem.imageUrl) {
    weight += 40; // 画像があるだけで40点
  }
  
  // 画面上の位置（0-30点）- 実際の位置はレンダリング後に計算
  // ここでは簡易的に、配列の位置で計算
  const position = menuItems.indexOf(menuItem);
  weight += (1 - position / menuItems.length) * 30;
  
  // おすすめフラグ（0-20点）
  if (menuItem.isRecommended) {
    weight += 20;
  }
  
  // コントラスト（0-10点）- 簡易的に、カテゴリで判定
  if (menuItem.category === 'メイン料理') {
    weight += 10;
  }
  
  return Math.min(100, weight);
}
```

### 3. スクロール同期

```typescript
// スクロール同期の実装
const useScrollSync = (leftRef: RefObject<HTMLDivElement>, rightRef: RefObject<HTMLDivElement>) => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const leftElement = leftRef.current;
    const rightElement = rightRef.current;

    const handleScroll = (source: 'left' | 'right') => {
      if (isScrolling) return;
      setIsScrolling(true);

      if (source === 'left' && leftElement && rightElement) {
        const scrollRatio = leftElement.scrollTop / (leftElement.scrollHeight - leftElement.clientHeight);
        rightElement.scrollTop = scrollRatio * (rightElement.scrollHeight - rightElement.clientHeight);
      } else if (source === 'right' && leftElement && rightElement) {
        const scrollRatio = rightElement.scrollTop / (rightElement.scrollHeight - rightElement.clientHeight);
        leftElement.scrollTop = scrollRatio * (leftElement.scrollHeight - leftElement.clientHeight);
      }

      setTimeout(() => setIsScrolling(false), 100);
    };

    leftElement?.addEventListener('scroll', () => handleScroll('left'));
    rightElement?.addEventListener('scroll', () => handleScroll('right'));

    return () => {
      leftElement?.removeEventListener('scroll', () => handleScroll('left'));
      rightElement?.removeEventListener('scroll', () => handleScroll('right'));
    };
  }, [leftRef, rightRef, isScrolling]);
};
```

---

## 🎯 実装後の使い方（想定）

1. **メニュー情報を収集**（既存機能）
2. **UIパターンを選択**（左に「カテゴリ重視型」、右に「写真重視型」）
3. **プレビュー上で編集**:
   - 「メイン料理」をクリック → 「肉料理」に変更
   - おすすめフラグをON/OFF
4. **ヒートマップで確認**:
   - ヒートマップモードをON
   - おすすめメニューが**赤く表示**される
   - 「このメニューは強調し過ぎている」と判断
5. **スクロール同期で比較**:
   - 左をスクロール → 右も自動的にスクロール
   - **同じ位置のメニューを比較**
6. **デバイスサイズで確認**:
   - iPhone SEに切り替え → 小さい画面での見た目を確認
   - iPhone 15 Pro Maxに切り替え → 大きい画面での見た目を確認

---

## 📝 結論

**別LLMの提案を実装し、さらに「表現パターンのプリセット機能」を追加することで、最短でUIパターン比較を実現できます。**

- ✅ **プレビュー上での直接編集**（手作業を最小化）
- ✅ **視覚的重みのヒートマップ**（品切れリスクの可視化）
- ✅ **スクロール同期**（A/B比較）
- ✅ **デバイスシミュレーション**（レスポンシブ確認）
- ✅ **表現パターンのプリセット**（「メイン料理」→「肉料理」の一括置換）

**これらの機能により、人間の手作業を介さずに、最短でUIパターン比較が可能になります。**

