import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'ページの取得に失敗しました' }, { status: 400 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const menuItems: any[] = [];

    // 食べログの場合
    if (url.includes('tabelog.com')) {
      // 食べログのメニュー情報を抽出
      $('.rstdtl-menu-list-item, .menu-item, .rstdtl-menu').each((i, elem) => {
        const name = $(elem).find('.rstdtl-menu-list-item-name, .menu-name, h3').text().trim();
        const price = $(elem).find('.rstdtl-menu-list-item-price, .menu-price, .price').text().trim();
        const description = $(elem).find('.rstdtl-menu-list-item-comment, .menu-description, p').text().trim();
        const imageUrl = $(elem).find('img').attr('src') || $(elem).find('img').attr('data-src') || '';

        if (name) {
          menuItems.push({
            id: `tabelog-${i}`,
            name,
            price: price || '価格未設定',
            description,
            imageUrl,
            category: '未分類',
            source: 'tabelog',
          });
        }
      });
    }
    // ホットペッパーグルメの場合
    else if (url.includes('hotpepper.jp')) {
      let currentCategory = '未分類';
      
      // URLからカテゴリを判定
      const categoryFromUrl = url.includes('/food/') ? '料理' : url.includes('/drink/') ? 'ドリンク' : '未分類';
      
      // メニューセクションを探す（「料理」や「ドリンク」のセクション）
      const menuSection = $('section, .menu-section, [class*="menu"]').first();
      const $target = menuSection.length > 0 ? menuSection : $('body');
      
      // カテゴリセクションを検出（h4タグで◇で囲まれている、またはstrongタグ）
      $target.find('h4, strong, h3').each((i, elem) => {
        const text = $(elem).text().trim();
        
        // カテゴリの検出（◇で囲まれている）
        if (text.includes('◇')) {
          const categoryMatch = text.match(/◇([^◇]+)◇/);
          if (categoryMatch) {
            currentCategory = categoryMatch[1].trim();
          }
          return;
        }
      });
      
      // メニュー項目を探す（h4タグで####で始まるもの）
      // まず、liタグ内のh4を探す（リスト形式のメニュー）
      $target.find('li').each((i, elem) => {
        const $li = $(elem);
        const $h4 = $li.find('h4').first();
        
        if ($h4.length > 0) {
          const text = $h4.text().trim();
          
          // カテゴリセクションはスキップ
          if (text.includes('◇')) {
            return;
          }
          
          // 「おすすめ料理1、2、3」などの見出しはスキップ
          if (text.includes('おすすめ料理') || text.includes('お店') || text.includes('予約') || text.includes('料理のこだわり')) {
            return;
          }
          
          // メニュー名の検出（#### で始まる、または通常のh4）
          const name = text.replace(/^####\s*/, '').trim();
          
          if (name && name.length > 0 && name.length < 100) {
            // 価格を探す（liタグ内のテキスト全体から）
            let price = '';
            
            // liタグ内のテキスト全体を取得（HTMLタグを除いた純粋なテキスト）
            const liText = $li.text();
            
            // h4タグの後のテキストを取得（h4タグを除いた残り）
            const $h4Clone = $h4.clone();
            $h4Clone.remove();
            const textAfterH4 = $li.clone().find('h4').remove().end().text();
            
            // 価格パターンを複数試す
            const pricePatterns = [
              /(\d{1,3}(?:,\d{3})*)\s*円（税込）/g,  // 2,100円（税込）
              /(\d{1,3}(?:,\d{3})*)\s*円（税抜）/g,  // 2,100円（税抜）
              /(\d{3,})\s*円（税込）/g,              // 219円（税込）- カンマなし
              /(\d{3,})\s*円（税抜）/g,              // 219円（税抜）- カンマなし
              /(\d{1,3}(?:,\d{3})*)\s*円/g,          // 2,100円
              /(\d{3,})\s*円/g,                      // 219円 - カンマなし
            ];
            
            // まず、h4タグの後のテキストから探す
            for (const pattern of pricePatterns) {
              const matches = textAfterH4.match(pattern);
              if (matches && matches.length > 0) {
                // 最初のマッチを使用
                const match = textAfterH4.match(pattern);
                if (match && match[1]) {
                  if (pattern.source.includes('税込')) {
                    price = `${match[1]}円（税込）`;
                  } else if (pattern.source.includes('税抜')) {
                    price = `${match[1]}円（税抜）`;
                  } else {
                    price = `${match[1]}円`;
                  }
                  break;
                }
              }
            }
            
            // 見つからない場合は、liタグ全体から探す
            if (!price) {
              for (const pattern of pricePatterns) {
                const match = liText.match(pattern);
                if (match && match[1]) {
                  // メニュー名に含まれる価格は除外（例：「2,100円コース」）
                  if (!name.includes(match[1])) {
                    if (pattern.source.includes('税込')) {
                      price = `${match[1]}円（税込）`;
                    } else if (pattern.source.includes('税抜')) {
                      price = `${match[1]}円（税抜）`;
                    } else {
                      price = `${match[1]}円`;
                    }
                    break;
                  }
                }
              }
            }
            
            // デバッグ用（開発環境のみ）
            if (process.env.NODE_ENV === 'development' && !price) {
              console.log('価格が見つかりません:', {
                name,
                liText: liText.substring(0, 300),
                textAfterH4: textAfterH4.substring(0, 300),
              });
            }
            
            // 説明を探す（liタグ内のpタグ、またはh4の次の要素）
            let description = '';
            const $p = $li.find('p').first();
            if ($p.length > 0) {
              description = $p.text().trim();
            } else {
              // h4の次のテキストノードを探す
              const $next = $h4.next();
              if ($next.length > 0 && $next.is('p, div, span')) {
                description = $next.text().trim();
              }
            }
            
            // 画像を探す（liタグ内）
            let imageUrl = '';
            const $img = $li.find('img').first();
            if ($img.length > 0) {
              imageUrl = $img.attr('src') || $img.attr('data-src') || '';
              if (imageUrl && !imageUrl.startsWith('http')) {
                const urlObj = new URL(url);
                imageUrl = `${urlObj.origin}${imageUrl}`;
              }
            }
            
            // カテゴリを設定
            const category = currentCategory !== '未分類' ? currentCategory : categoryFromUrl;
            
            menuItems.push({
              id: `hotpepper-li-${menuItems.length}`,
              name,
              price: price || '価格未設定',
              description,
              imageUrl,
              category,
              source: 'hotpepper',
            });
          }
        }
      });
      
      // h4タグを直接探す（liタグがない場合、または追加のメニュー項目）
      $target.find('h4').each((i, elem) => {
        const $h4 = $(elem);
        const text = $h4.text().trim();
        
        // カテゴリセクションはスキップ
        if (text.includes('◇')) {
          return;
        }
        
        // 「おすすめ料理1、2、3」などの見出しはスキップ
        if (text.includes('おすすめ料理') || text.includes('お店') || text.includes('予約') || text.includes('料理のこだわり') || text.includes('まさや')) {
          return;
        }
        
        // メニュー名の検出（#### で始まる、または通常のh4）
        const name = text.replace(/^####\s*/, '').trim();
        
        // 既に追加済みのメニューはスキップ
        if (menuItems.some(item => item.name === name)) {
          return;
        }
        
        if (name && name.length > 0 && name.length < 100) {
          // 価格を探す（親要素内のテキスト全体から）
          let price = '';
          const $parent = $h4.parent();
          const $next = $h4.next();
          const $nextText = $h4.nextUntil('h4').first();
          
          // 親要素のテキスト全体から価格を抽出
          const parentText = $parent.text();
          const searchText = ($nextText.length > 0 ? $nextText.text() : '') || 
                            ($next.length > 0 ? $next.text() : '') || 
                            parentText;
          
          // メニュー名を除いたテキストから価格を探す
          const textWithoutName = searchText.replace(name, '').trim();
          
          // 価格パターン1: XXX円（税込）
          let priceMatch = textWithoutName.match(/(\d{1,3}(?:,\d{3})*)\s*円（税込）/);
          if (!priceMatch) {
            priceMatch = searchText.match(/(\d{1,3}(?:,\d{3})*)\s*円（税込）/);
          }
          
          if (priceMatch) {
            price = `${priceMatch[1]}円（税込）`;
          } else {
            // 価格パターン2: XXX円（税抜）
            priceMatch = textWithoutName.match(/(\d{1,3}(?:,\d{3})*)\s*円（税抜）/);
            if (!priceMatch) {
              priceMatch = searchText.match(/(\d{1,3}(?:,\d{3})*)\s*円（税抜）/);
            }
            if (priceMatch) {
              price = `${priceMatch[1]}円（税抜）`;
            } else {
              // 価格パターン3: 単純にXXX円（カンマあり）
              priceMatch = textWithoutName.match(/(\d{1,3}(?:,\d{3})*)\s*円/);
              if (!priceMatch) {
                priceMatch = searchText.match(/(\d{1,3}(?:,\d{3})*)\s*円/);
              }
              if (priceMatch) {
                price = `${priceMatch[1]}円`;
              } else {
                // 価格パターン4: カンマなしの数字
                priceMatch = textWithoutName.match(/(\d{3,})\s*円（税込）/);
                if (!priceMatch) {
                  priceMatch = searchText.match(/(\d{3,})\s*円（税込）/);
                }
                if (priceMatch) {
                  price = `${priceMatch[1]}円（税込）`;
                } else {
                  priceMatch = textWithoutName.match(/(\d{3,})\s*円/);
                  if (!priceMatch) {
                    priceMatch = searchText.match(/(\d{3,})\s*円/);
                  }
                  if (priceMatch) {
                    price = `${priceMatch[1]}円`;
                  }
                }
              }
            }
          }
          
          // 説明を探す（次のpタグ）
          let description = '';
          const $nextP = $h4.next('p');
          if ($nextP.length > 0) {
            description = $nextP.text().trim();
          }
          
          // 画像を探す（親要素内）
          let imageUrl = '';
          const $img = $parent.find('img').first();
          if ($img.length > 0) {
            imageUrl = $img.attr('src') || $img.attr('data-src') || '';
            if (imageUrl && !imageUrl.startsWith('http')) {
              const urlObj = new URL(url);
              imageUrl = `${urlObj.origin}${imageUrl}`;
            }
          }
          
          // カテゴリを設定
          const category = currentCategory !== '未分類' ? currentCategory : categoryFromUrl;
          
          menuItems.push({
            id: `hotpepper-${menuItems.length}`,
            name,
            price: price || '価格未設定',
            description,
            imageUrl,
            category,
            source: 'hotpepper',
          });
        }
      });
      
      
      // さらに別のパターン: テキストノードから直接抽出
      if (menuItems.length === 0) {
        // メニューリストのセクションを探す
        const menuText = $target.text();
        const lines = menuText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        let tempCategory = categoryFromUrl;
        lines.forEach((line, index) => {
          // カテゴリの検出
          if (line.includes('◇')) {
            const categoryMatch = line.match(/◇([^◇]+)◇/);
            if (categoryMatch) {
              tempCategory = categoryMatch[1].trim();
            }
            return;
          }
          
          // メニュー名と価格の検出
          // パターン: メニュー名の行の次に価格の行がある
          const priceMatch = line.match(/(\d{1,3}(?:,\d{3})*)\s*円（税込）/);
          if (priceMatch && index > 0) {
            const prevLine = lines[index - 1];
            if (prevLine && !prevLine.match(/\d+円/) && prevLine.length > 0 && prevLine.length < 100) {
              menuItems.push({
                id: `hotpepper-text-${menuItems.length}`,
                name: prevLine,
                price: `${priceMatch[1]}円（税込）`,
                description: '',
                imageUrl: '',
                category: tempCategory,
                source: 'hotpepper',
              });
            }
          }
        });
      }
    }
    // 旧ホットペッパーグルメ（huge.co.jp）の場合
    else if (url.includes('huge.co.jp')) {
      // ホットペッパーグルメのメニュー情報を抽出
      $('.menu-item, .menu-list-item, [class*="menu"]').each((i, elem) => {
        const name = $(elem).find('h3, h4, .menu-name, .title').text().trim();
        const price = $(elem).find('.price, .menu-price, [class*="price"]').text().trim();
        const description = $(elem).find('.description, .menu-description, p').text().trim();
        const imageUrl = $(elem).find('img').attr('src') || $(elem).find('img').attr('data-src') || '';

        if (name) {
          menuItems.push({
            id: `huge-${i}`,
            name,
            price: price || '価格未設定',
            description,
            imageUrl,
            category: '未分類',
            source: 'huge',
          });
        }
      });
    }

    // メニューが見つからない場合、一般的なパターンで再試行
    if (menuItems.length === 0) {
      $('img').each((i, elem) => {
        const $img = $(elem);
        const alt = $img.attr('alt') || '';
        const src = $img.attr('src') || $img.attr('data-src') || '';
        
        // メニューらしい画像を探す
        if (alt && (alt.includes('料理') || alt.includes('メニュー') || alt.includes('パスタ') || alt.includes('ピザ'))) {
          const parent = $img.parent();
          const name = parent.find('h3, h4, .title').text().trim() || alt;
          const price = parent.find('.price, [class*="price"]').text().trim() || '価格未設定';

          menuItems.push({
            id: `fallback-${i}`,
            name,
            price,
            description: '',
            imageUrl: src,
            category: '未分類',
            source: url.includes('tabelog.com') ? 'tabelog' : url.includes('hotpepper.jp') ? 'hotpepper' : 'huge',
          });
        }
      });
    }

    // デバッグ情報（開発時のみ）
    if (process.env.NODE_ENV === 'development') {
      if (menuItems.length === 0) {
        console.log('デバッグ: メニューが見つかりませんでした');
        console.log('URL:', url);
      } else {
        console.log(`デバッグ: ${menuItems.length}件のメニューを取得`);
        // 価格が未設定のメニューを確認
        const noPriceItems = menuItems.filter(item => !item.price || item.price === '価格未設定');
        if (noPriceItems.length > 0) {
          console.log(`デバッグ: 価格未設定のメニューが${noPriceItems.length}件あります`);
          console.log('サンプル:', noPriceItems.slice(0, 3).map(item => ({ name: item.name, price: item.price })));
        }
      }
    }

    return NextResponse.json({ menuItems });
  } catch (error: any) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'スクレイピング中にエラーが発生しました: ' + error.message },
      { status: 500 }
    );
  }
}

