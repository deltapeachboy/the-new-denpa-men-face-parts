document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('faceCanvas');
    const ctx = canvas.getContext('2d');

    // --- パーツデータの定義 ---
    // 'images/' フォルダ以下に、対応する名前で画像ファイルを用意してください。
    // src: null の場合は「なし」として扱われ、何も描画しません。
    // name: セレクトボックスに表示される名前
    // 【重要】各パーツ画像の原点とサイズを統一し、
    //         300x300のキャンバスに描画した際に正しい位置に来るように作成してください。
    const parts = {
        body: [ // ボディパーツは以前のサンプルのままです。必要に応じて画像を用意し、パスを修正してください。
            { name: '標準体型', src: 'images/body/body_01.png' },
            { name: 'がっしり体型', src: 'images/body/body_02.png' },
        ],
        hair: [
            { name: 'なし', src: null }, // 髪なし
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
        eyes: [ // 目パーツも以前のサンプルのままです。必要に応じて画像を用意し、パスを修正してください。
            { name: 'ぱっちり目 (青)', src: 'images/eyes/eyes_normal_blue.png' },
            { name: 'ジト目 (緑)', src: 'images/eyes/eyes_jito_green.png' },
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
    // この順番でパーツが描画されます。下にあるものが手前に来ます。
    const drawOrder = ['body', 'hair', 'eyes', 'mouth', 'antenna'];

    // --- 画像プリロード関数 ---
    function preloadImages(onComplete) {
        for (const category of drawOrder) {
            if (parts[category]) {
                parts[category].forEach(part => {
                    if (part.src) { // srcがnullでない（画像がある）場合のみ
                        imagesToLoad++;
                    }
                });
            }
        }

        if (imagesToLoad === 0) {
            onComplete(); // 読み込む画像がない場合
            return;
        }

        for (const category of drawOrder) {
            if (parts[category]) {
                parts[category].forEach(part => {
                    if (part.src) {
                        const img = new Image();
                        img.src = part.src;
                        imageCache[part.src] = img;
                        img.onload = () => {
                            imagesLoaded++;
                            if (imagesLoaded === imagesToLoad) {
                                onComplete(); // 全ての画像が読み込まれたらコールバックを実行
                            }
                        };
                        img.onerror = () => {
                            console.error(`画像の読み込みに失敗しました: ${part.src}`);
                            imagesLoaded++; // エラーでもカウントは進める
                            if (imagesLoaded === imagesToLoad) {
                                onComplete();
                            }
                        };
                    }
                });
            }
        }
    }

    // --- 顔描画関数 ---
    function drawFace() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvasをクリア

        drawOrder.forEach(category => {
            const selectedPartIndex = currentSelection[category];
            if (parts[category] && parts[category][selectedPartIndex]) {
                const partData = parts[category][selectedPartIndex];
                if (partData.src && imageCache[partData.src] && imageCache[partData.src].complete) {
                    // 画像がキャッシュにあり、読み込み完了していれば描画
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
                parts[category].forEach((part, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = part.name;
                    selectElement.appendChild(option);
                });

                // 初期選択を設定 (最初のパーツを選択)
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

        // ランダムボタンのイベントリスナー
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
    initUI(); // UIのセットアップ
    preloadImages(() => { // 画像のプリロード
        console.log("全ての画像のプリロード試行完了");
        drawFace(); // プリロード後に最初の顔を描画
    });
});