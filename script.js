document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('faceCanvas');
    const ctx = canvas.getContext('2d');

    // --- パーツデータの定義 ---
    const parts = {
        body: [ // ボディパーツは以前のサンプルのままです。必要に応じて画像を用意し、パスを修正してください。
            { name: '標準体型', src: 'images/body/body_01.png' },
            { name: 'がっしり体型', src: 'images/body/body_02.png' },
        ],
        hair: [ // 髪型パーツ (image1.png - image60.png)
            { name: 'なし', src: null },
            { name: '羊ツノ (金)', src: 'images/hair/image1.png' },
            { name: 'おさげ (金)', src: 'images/hair/image2.png' },
            { name: 'シンプル縦長 (茶)', src: 'images/hair/image3.png' },
            { name: '三つ編みおさげ (金)', src: 'images/hair/image4.png' },
            { name: '横分けショート (茶)', src: 'images/hair/image5.png' },
            { name: 'トゲトゲ縦長 (黒)', src: 'images/hair/image6.png' },
            { name: 'ボブ (金)', src: 'images/hair/image7.png' },
            { name: 'ポンポン連なり (白)', src: 'images/hair/image8.png' },
            { name: 'ストレートロング (茶)', src: 'images/hair/image9.png' },
            { name: 'モヒカン風 (金)', src: 'images/hair/image10.png' },
            { name: 'U字型 (茶)', src: 'images/hair/image11.png' },
            { name: '葉っぱ型 (金)', src: 'images/hair/image12.png' },
            { name: '巻き髪左右 (白)', src: 'images/hair/image13.png' },
            { name: '編み込みサイド (桃)', src: 'images/hair/image14.png' },
            { name: 'ウェーブボリューム (白)', src: 'images/hair/image15.png' },
            { name: 'ボブ (紫)', src: 'images/hair/image16.png' },
            { name: 'ギザギザ下向き (白)', src: 'images/hair/image17.png' },
            { name: 'ウェーブショート (茶)', src: 'images/hair/image18.png' },
            { name: 'ロールヘア横 (金)', src: 'images/hair/image19.png' },
            { name: 'モヒカン風 (白黒)', src: 'images/hair/image20.png' },
            { name: 'お椀型 (茶)', src: 'images/hair/image21.png' },
            { name: 'モヒカン風2 (茶)', src: 'images/hair/image22.png' },
            { name: 'ポンポンU字 (橙)', src: 'images/hair/image23.png' },
            { name: '前髪ぱっつん (金)', src: 'images/hair/image24.png' },
            { name: 'ショート前髪あり (茶)', src: 'images/hair/image25.png' },
            { name: '爆発ヘア (白)', src: 'images/hair/image26.png' },
            { name: 'M字バング (金)', src: 'images/hair/image27.png' },
            { name: '巻き角 (金)', src: 'images/hair/image28.png' },
            { name: '玉ねぎ型 (桃)', src: 'images/hair/image29.png' },
            { name: '三つ編みおさげ (桃)', src: 'images/hair/image30.png' },
            { name: '海藻風 (緑)', src: 'images/hair/image31.png' },
            { name: 'カールボブ (金)', src: 'images/hair/image32.png' },
            { name: '牙型 (白)', src: 'images/hair/image33.png' },
            { name: 'ストライプショート (茶)', src: 'images/hair/image34.png' },
            { name: '雲型 (白黒)', src: 'images/hair/image35.png' },
            { name: 'ボブ (橙)', src: 'images/hair/image36.png' },
            { name: '横長ショート (金)', src: 'images/hair/image37.png' },
            { name: 'G巻き髪 (白)', src: 'images/hair/image38.png' },
            { name: '富士山型 (白)', src: 'images/hair/image39.png' },
            { name: '片側はねっ毛 (茶)', src: 'images/hair/image40.png' },
            { name: '三日月左右 (金)', src: 'images/hair/image41.png' },
            { name: 'ウェーブロング (赤)', src: 'images/hair/image42.png' },
            { name: '扇型 (金)', src: 'images/hair/image43.png' },
            { name: 'ウェーブショート (黒)', src: 'images/hair/image44.png' },
            { name: '縦長リボン風 (金)', src: 'images/hair/image45.png' },
            { name: 'ギザギザ横長 (金)', src: 'images/hair/image46.png' },
            { name: '片側流し (黒)', src: 'images/hair/image47.png' },
            { name: 'ロールボブ (金)', src: 'images/hair/image48.png' },
            { name: 'ギザギザM字 (金)', src: 'images/hair/image49.png' },
            { name: 'ヒゲ (茶)', src: 'images/hair/image50.png' },
            { name: '前髪長めショート (金)', src: 'images/hair/image51.png' },
            { name: '前髪ウェーブ (桃)', src: 'images/hair/image52.png' },
            { name: '小ポンポン3つ (金)', src: 'images/hair/image53.png' },
            { name: '横ウェーブ (茶)', src: 'images/hair/image54.png' },
            { name: '横木の葉 (金)', src: 'images/hair/image55.png' },
            { name: '縦長ストレート左右 (桃)', src: 'images/hair/image56.png' },
            { name: '炎3本 (橙)', src: 'images/hair/image57.png' },
            { name: '波型 (桃)', src: 'images/hair/image58.png' },
            { name: 'ショート (緑)', src: 'images/hair/image59.png' },
            { name: 'お椀型 (青)', src: 'images/hair/image60.png' }
        ],
        eyes: [ // 目パーツ (image1.png - image67.png)
            { name: 'つり目 (黒豆風)', src: 'images/eyes/image1.png' },
            { name: '動物風の目 (大)', src: 'images/eyes/image2.png' },
            { name: 'シンプル縦長楕円', src: 'images/eyes/image3.png' },
            { name: '横長サングラス風', src: 'images/eyes/image4.png' },
            { name: 'くっきり丸目', src: 'images/eyes/image5.png' },
            { name: 'しずく型光沢目', src: 'images/eyes/image6.png' },
            { name: '大ハイライト丸目', src: 'images/eyes/image7.png' },
            { name: '盾型目', src: 'images/eyes/image8.png' },
            { name: '洋梨型目', src: 'images/eyes/image9.png' },
            { name: '黒目大ハイライト丸目', src: 'images/eyes/image10.png' },
            { name: '斜め細長棒状目', src: 'images/eyes/image11.png' },
            { name: '半月大ハイライト目', src: 'images/eyes/image12.png' },
            { name: '横一直線細目', src: 'images/eyes/image13.png' },
            { name: '下弦月ハイライト半月目', src: 'images/eyes/image14.png' },
            { name: '猫耳風丸目', src: 'images/eyes/image15.png' },
            { name: 'アーチ型太ハイライト目', src: 'images/eyes/image16.png' },
            { name: '大瞳孔まぶた目', src: 'images/eyes/image17.png' },
            { name: '鋭い切れ長目', src: 'images/eyes/image18.png' },
            { name: '白縁丸目', src: 'images/eyes/image19.png' },
            { name: 'シンプル楕円目', src: 'images/eyes/image20.png' },
            { name: '不定形生物風目', src: 'images/eyes/image21.png' },
            { name: 'T字型目', src: 'images/eyes/image22.png' },
            { name: '大ハイライト丸目2', src: 'images/eyes/image23.png' },
            { name: 'くっきり人間風目', src: 'images/eyes/image24.png' },
            { name: '三日月型目', src: 'images/eyes/image25.png' },
            { name: '半円シンプル目', src: 'images/eyes/image26.png' },
            { name: '鋭い三角目', src: 'images/eyes/image27.png' },
            { name: 'シンプル三角目', src: 'images/eyes/image28.png' },
            { name: '小四角ハイライトT字目', src: 'images/eyes/image29.png' },
            { name: '縦長0型目', src: 'images/eyes/image30.png' },
            { name: 'まつげ特徴丸目', src: 'images/eyes/image31.png' },
            { name: '大丸目 (3つ組？)', src: 'images/eyes/image32.png' },
            { name: '垂れ不定形目', src: 'images/eyes/image33.png' },
            { name: '太リング丸目', src: 'images/eyes/image34.png' },
            { name: '三本指風目', src: 'images/eyes/image35.png' },
            { name: '逆三角目', src: 'images/eyes/image36.png' },
            { name: '下弦月ハイライト丸目2', src: 'images/eyes/image37.png' },
            { name: '横大三日月ハイライト目', src: 'images/eyes/image38.png' },
            { name: 'にっこり笑顔目', src: 'images/eyes/image39.png' },
            { name: '横長楕円小ハイライト目', src: 'images/eyes/image40.png' },
            { name: '縦長猫目', src: 'images/eyes/image41.png' },
            { name: '縦長シンプル楕円目2', src: 'images/eyes/image42.png' },
            { name: '音符型目', src: 'images/eyes/image43.png' },
            { name: '横突起丸目', src: 'images/eyes/image44.png' },
            { name: 'ピクセルサングラス風', src: 'images/eyes/image45.png' },
            { name: '小下弦月ハイライト半月目', src: 'images/eyes/image46.png' },
            { name: '細長楕円目 (暗)', src: 'images/eyes/image47.png' },
            { name: '細長斜め目', src: 'images/eyes/image48.png' },
            { name: '細長三日月目', src: 'images/eyes/image49.png' },
            { name: '十字ハイライトトゲトゲ目', src: 'images/eyes/image50.png' },
            { name: '長方形二連目', src: 'images/eyes/image51.png' },
            { name: '横くるん丸目', src: 'images/eyes/image52.png' },
            { name: '横突起下弦月ハイライト丸目', src: 'images/eyes/image53.png' },
            { name: '紫瞳まつげ目', src: 'images/eyes/image54.png' },
            { name: 'ピースサイン風目', src: 'images/eyes/image55.png' },
            { name: '鋭い切れ長目2', src: 'images/eyes/image56.png' },
            { name: '青み丸目', src: 'images/eyes/image57.png' },
            { name: '半円大ハイライト目', src: 'images/eyes/image58.png' },
            { name: '鋭いジト目', src: 'images/eyes/image59.png' },
            { name: '飛び出し目玉風', src: 'images/eyes/image60.png' },
            { name: '横長シンプル楕円目2', src: 'images/eyes/image61.png' },
            { name: '縦二連ハイライト楕円目', src: 'images/eyes/image62.png' },
            { name: '三日月ハイライト丸目2', src: 'images/eyes/image63.png' },
            { name: '暗い楕円目2', src: 'images/eyes/image64.png' },
            { name: '暗い縦長楕円目2', src: 'images/eyes/image65.png' },
            { name: 'リング垂れ目', src: 'images/eyes/image66.png' },
            { name: '音符棒型目', src: 'images/eyes/image67.png' }
        ],
        mouth: [ // 口パーツも以前のサンプルのままです。必要に応じて画像を用意し、パスを修正してください。
            { name: '普通の口', src: 'images/mouth/mouth_normal.png' },
            { name: 'にっこり口', src: 'images/mouth/mouth_smile.png' },
        ],
        antenna: [ // アンテナパーツも以前のサンプルのままです。必要に応じて画像を用意し、パスを修正してください。
            { name: 'なし', src: null },
            { name: '一本アンテナ', src: 'images/antenna/antenna_single.png' },
            { name: '二股アンテナ', src: 'images/antenna/antenna_double.png' },
        ]
    };

    // 現在選択されているパーツのインデックスを保持
    const currentSelection = {};

    // 画像を事前に読み込むためのオブジェクトと状態管理
    const imageCache = {};
    let imagesToLoad = 0;
    let imagesLoaded = 0;

    // --- 描画順序 ---
    const drawOrder = ['body', 'hair', 'eyes', 'mouth', 'antenna'];

    // --- 画像プリロード関数 ---
    function preloadImages(onComplete) {
        imagesToLoad = 0; // リセット
        imagesLoaded = 0; // リセット
        for (const category of drawOrder) {
            if (parts[category]) {
                parts[category].forEach(part => {
                    if (part.src) {
                        imagesToLoad++;
                    }
                });
            }
        }

        if (imagesToLoad === 0) {
            onComplete();
            return;
        }

        for (const category of drawOrder) {
            if (parts[category]) {
                parts[category].forEach(part => {
                    if (part.src) {
                        if (!imageCache[part.src]) { // まだキャッシュされていなければ
                            const img = new Image();
                            img.src = part.src;
                            imageCache[part.src] = img; // 先にキャッシュオブジェクトに入れる
                            img.onload = () => {
                                imagesLoaded++;
                                if (imagesLoaded === imagesToLoad) {
                                    onComplete();
                                }
                            };
                            img.onerror = () => {
                                console.error(`画像の読み込みに失敗しました: ${part.src}`);
                                imagesLoaded++;
                                if (imagesLoaded === imagesToLoad) {
                                    onComplete();
                                }
                            };
                        } else if (imageCache[part.src].complete) { // すでにキャッシュ済みで読み込み完了
                            imagesLoaded++;
                             if (imagesLoaded === imagesToLoad) {
                                onComplete();
                            }
                        } else { // キャッシュオブジェクトはあるが、まだ読み込み中 (img.onloadがまだ発火してない)
                            // このケースは通常、最初のpreloadImages呼び出しで処理される
                            // もし再度preloadImagesが呼ばれた場合、onload/onerrorが処理する
                        }
                    }
                });
            }
        }
         // もしsrc:nullだけのカテゴリなど、読み込むべき画像がないのに呼ばれた場合、
         // imagesToLoadが0のままなので、即座にonCompleteが呼ばれる。
         // もし、全てのpart.srcがキャッシュ済みだった場合、imagesLoadedが即座にimagesToLoadに達する
         if (imagesLoaded === imagesToLoad && imagesToLoad > 0) { // 全てキャッシュ済みだった場合
            onComplete();
        }
    }

    // --- 顔描画関数 ---
    function drawFace() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawOrder.forEach(category => {
            const selectedPartIndex = currentSelection[category];
            if (parts[category] && parts[category][selectedPartIndex]) {
                const partData = parts[category][selectedPartIndex];
                if (partData.src && imageCache[partData.src] && imageCache[partData.src].complete) {
                    ctx.drawImage(imageCache[partData.src], 0, 0, canvas.width, canvas.height);
                }
            }
        });
    }

    // --- UI初期化関数 ---
    function initUI() {
        drawOrder.forEach(category => {
            const selectElement = document.getElementById(`${category}-select`);
            if (selectElement && parts[category]) {
                // 既存のoptionをクリア
                selectElement.innerHTML = '';
                parts[category].forEach((part, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = part.name;
                    selectElement.appendChild(option);
                });

                currentSelection[category] = 0;
                selectElement.value = 0;

                selectElement.addEventListener('change', (event) => {
                    currentSelection[category] = parseInt(event.target.value, 10);
                    drawFace();
                });
            } else if (parts[category]) {
                 currentSelection[category] = 0;
            }
        });

        const randomButton = document.getElementById('random-button');
        if (randomButton) {
            randomButton.addEventListener('click', () => {
                drawOrder.forEach(category => {
                    if (parts[category] && parts[category].length > 0) {
                        const randomIndex = Math.floor(Math.random() * parts[category].length);
                        currentSelection[category] = randomIndex;
                        const selectElement = document.getElementById(`${category}-select`);
                        if (selectElement) {
                            selectElement.value = randomIndex;
                        }
                    }
                });
                drawFace();
            });
        }
    }

    // --- 初期化処理の実行 ---
    initUI();
    preloadImages(() => {
        console.log("全ての画像のプリロード試行完了");
        drawFace();
    });
});