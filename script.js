document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('faceCanvas');
    const ctx = canvas.getContext('2d');
    const downloadButton = document.getElementById('download-button');

    // --- パーツデータの定義 (JSON準拠形式) ---
    // 各パーツの画像は `images/[カテゴリ名]/[ファイル名]` に配置されている想定
    // 画像サイズは canvas の width/height (300x300) に合わせるか、
    // drawImageで描画位置・サイズを調整する必要がある。
    // ここでは、各パーツ画像が300x300で、適切な位置に描画される前提。
    const parts = {
        "body": [
            { "name": "なし", "src": null },
            { "name": "褐色丸", "src": "images/body/image1.png" },
            // 他の輪郭 (形状、色違い) を追加
        ],
        "hair": [
            { "name": "なし", "src": null },
            // 他の髪型を追加
        ],
        "eyebrow": [
            { "name": "なし", "src": null },
            { "name": "まろ眉 - 平行", "src": "images/eyebrow/image1.png" },
            { "name": "ゲソ", "src": "images/eyebrow/image2.png" },
            // 他の眉毛を追加
        ],
        "eyes": [
            { "name": "なし", "src": null },
            { "name": "タケシ", "src": "images/eyes/image1.png" },
            { "name": "目つき", "src": "images/eyes/image2.png" },
            { "name": "青鬼", "src": "images/eyes/image3.png" },
            // 他の目を追加
        ],
        "nose": [
            { "name": "なし", "src": null },
            { "name": "c1", "src": "images/nose/image1.png" },
            { "name": "三角", "src": "images/nose/image2.png" },
            { "name": "たてばな", "src": "images/nose/image3.png" },
            // 他の鼻を追加
        ],
        "mouth": [
            { "name": "なし", "src": null },
            { "name": "ぷっくり怒", "src": "images/mouth/image1.png" },
            { "name": "唖然", "src": "images/mouth/image2.png" },
            // 他の口を追加
        ],
        "cheek": [
            { "name": "なし", "src": null },
            // 他のほっぺを追加
        ],
        "antenna": [
            { "name": "なし", "src": null },
            // 他のアンテナを追加
        ]
    };

    const currentSelection = {};
    const imageCache = {};
    let imagesToLoad = 0;
    let imagesLoaded = 0;

    // 描画順序: 下に描画されるものから順に
    const drawOrder = ["body", "eyebrow", "eyes", "mouth", "nose", "cheek", "hair"];

    function preloadImages(onComplete) {
        imagesToLoad = 0;
        imagesLoaded = 0;
        let allSrcPaths = [];

        drawOrder.forEach(category => {
            if (parts[category]) {
                parts[category].forEach(part => {
                    if (part.src && !allSrcPaths.includes(part.src)) {
                        allSrcPaths.push(part.src);
                        imagesToLoad++;
                    }
                });
            }
        });

        if (imagesToLoad === 0) {
            if (onComplete) onComplete();
            return;
        }

        allSrcPaths.forEach(srcPath => {
            if (!imageCache[srcPath]) {
                const img = new Image();
                img.src = srcPath;
                imageCache[srcPath] = img;
                img.onload = () => {
                    imagesLoaded++;
                    if (imagesLoaded === imagesToLoad) {
                        if (onComplete) onComplete();
                    }
                };
                img.onerror = () => {
                    console.error(`画像の読み込みに失敗しました: ${srcPath}`);
                    imagesLoaded++; // エラーでもカウントアップして完了処理に進む
                    if (imagesLoaded === imagesToLoad) {
                        if (onComplete) onComplete();
                    }
                };
            } else if (imageCache[srcPath].complete) {
                imagesLoaded++;
                if (imagesLoaded === imagesToLoad) {
                    if (onComplete) onComplete();
                }
            }
        });
         // 全てキャッシュ済みだった場合、または読み込む画像がなかった場合
        if (imagesLoaded === imagesToLoad) {
            if (onComplete) onComplete();
        }
    }

    function drawFace() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // console.log("Drawing face with selection:", currentSelection);

        drawOrder.forEach(category => {
            const selectedPartIndex = currentSelection[category];
            if (parts[category] && typeof selectedPartIndex !== 'undefined' && parts[category][selectedPartIndex]) {
                const partData = parts[category][selectedPartIndex];
                if (partData.src && imageCache[partData.src] && imageCache[partData.src].complete) {
                    // パーツ画像が300x300で、原点(0,0)から描画する想定
                    ctx.drawImage(imageCache[partData.src], 0, 0, canvas.width, canvas.height);
                }
            }
        });
    }

    function initUI() {
        drawOrder.forEach(category => {
            const selectElement = document.getElementById(`${category}-select`);
            if (selectElement && parts[category]) {
                selectElement.innerHTML = ''; // Clear existing options
                parts[category].forEach((part, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = part.name;
                    selectElement.appendChild(option);
                });

                currentSelection[category] = 0; // Default to the first part (e.g., "なし")
                selectElement.value = 0;

                selectElement.addEventListener('change', (event) => {
                    currentSelection[category] = parseInt(event.target.value, 10);
                    drawFace();
                });
            } else if (parts[category]) {
                // Select element not found, but data exists. Initialize selection.
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
        // Set initial selections to "なし" or the first item if "なし" isn't index 0
        // This ensures a clean slate or a default appearance on load
        drawOrder.forEach(category => {
            if (parts[category] && parts[category].length > 0) {
                const defaultIndex = parts[category].findIndex(p => p.src === null); // "なし"を探す
                currentSelection[category] = (defaultIndex !== -1) ? defaultIndex : 0;
                const selectElement = document.getElementById(`${category}-select`);
                if (selectElement) {
                    selectElement.value = currentSelection[category];
                }
            }
        });


    }

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'denpaman_face.png';
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // --- 初期化処理の実行 ---
    initUI(); // UIを先に初期化して選択肢をセット
    preloadImages(() => { // その後画像をプリロード
        console.log("全ての画像のプリロード試行完了");
        drawFace(); // プリロード後に初期描画
    });
});