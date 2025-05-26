# 電波人間 顔シミュレーター

これは、電波人間の顔パーツを組み合わせてオリジナルの顔を作成できるウェブアプリケーションです。

## 使い方

1.  `index.html` をブラウザで開きます。
2.  左側のコントロールパネルから各パーツを選択します。
3.  プレビューエリアに選択したパーツがリアルタイムで表示されます。
4.  「ランダム生成！」ボタンでランダムな組み合わせを試せます。
5.  「画像をダウンロード」ボタンで作成した顔をPNG画像として保存できます。

## プロジェクト構造

-   `index.html`: メインのHTMLファイル
-   `style.css`: スタイルシート
-   `script.js`: アプリケーションのロジックとパーツデータ
-   `images/`: 各顔パーツの画像ファイルがカテゴリ別に格納されています。
    -   `body/`
    -   `hair/`
    -   `eyebrow/`
    -   `eyes/`
    -   `nose/`
    -   `mouth/`
    -   `cheek/`
    -   `antenna/`
-   `python_tools/`: パーツ抽出やREADME生成用のPythonスクリプト群
    -   `extract_parts.py`: 新しい顔写真からパーツを抽出します。
    -   `generate_readme_parts.py`: このパーツリストを自動生成します。
    -   `input_faces/`: `extract_parts.py` で使用する顔写真を入れてください。
    -   `extracted_parts/`: `extract_parts.py` によって抽出されたパーツが保存されます。

## 開発者向け

### 新しいパーツの追加

1.  新しいパーツ画像（背景透過PNG、300x300px推奨）を `images/[該当カテゴリ名]/` フォルダに配置します。
2.  `script.js` ファイル内の `const parts = { ... };` オブジェクトを編集し、対応するカテゴリに新しいパーツの情報をJSON形式で追加します。
    ```javascript
    // 例: 髪型に追加
    "hair" [
        // ...既存の髪パーツ...
        { "name": "新しい髪型 - 色", "src": "images/hair/new_hair_color.png" }
    ]
    ```
3.  必要であれば、`python_tools/generate_readme_parts.py` を実行してこのREADMEのパーツリストを更新します。

### 新しい顔写真からのパーツ自動抽出

1.  抽出したい新しい電波人間の顔写真を `python_tools/input_faces/` フォルダに入れます。
2.  ターミナルで `python_tools` ディレクトリに移動し、`python extract_parts.py` を実行します。
3.  抽出されたパーツが `python_tools/extracted_parts/[カテゴリ名]/` に保存されます。
4.  これらのパーツを `images/[カテゴリ名]/` に手動でコピーし、上記の「新しいパーツの追加」の手順に従って `script.js` を更新します。

<!-- PARTS_LIST_START -->
## 利用可能な顔パーツ一覧
<!-- このセクションは generate_readme_parts.py によって自動更新されます -->
<!-- PARTS_LIST_END -->

## ライセンス

このプロジェクトは [あなたのライセンス] の下で公開されています。 (例: MIT License)