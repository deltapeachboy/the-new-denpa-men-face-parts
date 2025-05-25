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
        body: [
            { name: '標準体型', src: 'images/body/body_01.png' },
            { name: 'がっしり体型', src: 'images/body/body_02.png' },
            // { name: 'カスタム体型', src: 'images/body/body_custom.png' },
        ],
        hair: [
            { name: 'なし', src: null }, // 髪なし
            { name: 'ショートヘア (黒)', src: 'images/hair/hair_short_black.png' },
            { name: 'ツインテール (金)', src: 'images/hair/hair_twin_gold.png' },
            // { name: 'アフロ (茶)', src: 'images/hair/hair_afro_brown.png' },
        ],
        eyes: [
            { name: 'ぱっちり目 (青)', src: 'images/eyes/eyes_normal_blue.png' },
            { name: 'ジト目 (緑)', src: 'images/eyes/eyes_jito_green.png' },
            // { name: 'キラキラ目 (赤)', src: 'images/eyes/eyes_kirakira_red.png' },
        ],
        // 鼻パーツを追加する場合の例
        // nose: [
        //     { name: 'なし', src: null },
        //     { name: 'ちょん鼻', src: 'images/nose/nose_01.png' },
        // ],
        mouth: [
            { name: '普通の口', src: 'images/mouth/mouth_normal.png' },
            { name: 'にっこり口', src: 'images/mouth/mouth_smile.png' },
            // { name: 'びっくり口', src: 'images/mouth/mouth_surprised.png' },
        ],
        antenna: [
            { name: 'なし', src: null }, // アンテナなし
            { name: '一本アンテナ', src: 'images/antenna/antenna_single.png' },
            { name: '二股アンテナ', src: 'images/antenna/antenna_double.png' },
            // { name: 'ハートアンテナ', src: 'images/antenna/antenna_heart.png' },
        ]
        // 必要に応じてアクセサリーなどのパーツカテゴリを追加
    };

    // 現在選択されているパーツのインデックスを保持
    const currentSelection = {};

    // 画像を事前に読み込むためのオブジェクトと状態管理
    const imageCache = {};
    let imagesToLoad = 0;
    let imagesLoaded = 0;

    // --- 描画順序 ---
    // この順番でパーツが描画されます。下にあるものが手前に来ます。
    const drawOrder = ['body', 'hair', 'eyes', 'mouth', 'antenna']; // 鼻などを追加した場合はここにも追加

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
                    // 全てのパーツ画像は300x300で、正しい位置に配置されている前提
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
                // HTMLにselect要素がないがパーツ定義はある場合（例：鼻を後で追加）
                // ここでは特に何もしないが、初期選択は設定しておく
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