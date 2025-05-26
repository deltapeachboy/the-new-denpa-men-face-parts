import json
import os
import re

# --- 設定項目 ---
PROJECT_ROOT_FROM_SCRIPT = ".."  # このスクリプトから見たプロジェクトルート
SIMULATOR_JS_FILE_PATH = os.path.join(PROJECT_ROOT_FROM_SCRIPT, "script.js")
# README.md がプロジェクトルートにあると仮定し、そこからの画像パスプレフィックス
# script.js 内の src が "images/category/file.png" の場合、READMEからはそのまま使える
README_IMAGE_PATH_PREFIX = ""  # 通常は空でOK (script.jsのパスがそのまま使えるようにするため)
# もしREADMEが別の場所なら変更。例: "denpaman_simulator_project/"
OUTPUT_MARKDOWN_FILE = os.path.join(PROJECT_ROOT_FROM_SCRIPT, "README.md")  # README.mdを直接更新
IMAGE_DISPLAY_WIDTH_IN_README = 75


# --- ここまで設定項目 ---

def parse_simulator_parts_definition(js_file_path):
    # (extract_parts.py と同じ関数なので省略可、または共通モジュール化)
    parts_data = {}
    try:
        with open(js_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        match = re.search(r"const\s+parts\s*=\s*(\{[\s\S]*?\});", content, re.MULTILINE)
        if match:
            parts_json_str = match.group(1)
            parts_json_str = re.sub(r"//.*?\n", "", parts_json_str)
            parts_json_str = re.sub(r"/\*[\s\S]*?\*/", "", parts_json_str)
            try:
                parts_data = json.loads(parts_json_str)
            except json.JSONDecodeError as e:
                return None  # エラー詳細は呼び出し元で
        else:
            return None
    except FileNotFoundError:
        return None
    return parts_data


def generate_parts_markdown_section(parts_data):
    md_lines = ["\n<!-- PARTS_LIST_START -->", "## 利用可能な顔パーツ一覧\n"]

    for category, items in parts_data.items():
        if not items: continue
        md_lines.append(f"### {category.capitalize()}\n")
        md_lines.append("| 名前 | プレビュー |")
        md_lines.append("|:-----|:----------:|")  # テーブルのアラインメント指定

        for part in items:
            name = part.get("name", "N/A")
            src = part.get("src")
            preview_html = "N/A"
            if src:
                # README.md からの相対パスを構築
                # script.js の src が "images/hair/image1.png" で、README.md がプロジェクトルートにあれば、
                # このパスはそのまま使えるはず。
                img_path_for_readme = os.path.join(README_IMAGE_PATH_PREFIX, src).replace("\\", "/")
                preview_html = f'<img src="{img_path_for_readme}" width="{IMAGE_DISPLAY_WIDTH_IN_README}" alt="{name}">'
            md_lines.append(f"| {name} | {preview_html} |")
        md_lines.append("")
    md_lines.append("<!-- PARTS_LIST_END -->\n")
    return "\n".join(md_lines)


if __name__ == "__main__":
    print("README用パーツリスト生成スクリプト開始")
    if not os.path.exists(SIMULATOR_JS_FILE_PATH):
        print(f"エラー: script.js が見つかりません: {SIMULATOR_JS_FILE_PATH}")
        exit()

    parts = parse_simulator_parts_definition(SIMULATOR_JS_FILE_PATH)
    if not parts:
        print("パーツ定義を読み込めなかったため、Markdownを生成できませんでした。")
        exit()

    new_parts_section_md = generate_parts_markdown_section(parts)

    readme_content = ""
    if os.path.exists(OUTPUT_MARKDOWN_FILE):
        with open(OUTPUT_MARKDOWN_FILE, "r", encoding="utf-8") as f:
            readme_content = f.read()

    # 既存のパーツリスト部分を置換 (マーカー間)
    start_marker = "<!-- PARTS_LIST_START -->"
    end_marker = "<!-- PARTS_LIST_END -->"

    start_index = readme_content.find(start_marker)
    end_index = readme_content.find(end_marker)

    if start_index != -1 and end_index != -1:
        before_parts = readme_content[:start_index]
        after_parts = readme_content[end_index + len(end_marker):]
        final_readme_content = before_parts + new_parts_section_md + after_parts
    else:  # マーカーがない場合は、ファイルの末尾に追記
        final_readme_content = readme_content + "\n" + new_parts_section_md
        print("READMEにパーツリストのマーカーが見つからなかったので、末尾に追記します。")

    try:
        with open(OUTPUT_MARKDOWN_FILE, "w", encoding="utf-8") as f:
            f.write(final_readme_content)
        print(f"'{OUTPUT_MARKDOWN_FILE}' を更新しました。")
        print(f"画像パスがREADME.mdから見て '{README_IMAGE_PATH_PREFIX}' を基準に正しく解決されるか確認してください。")
    except Exception as e:
        print(f"エラー: '{OUTPUT_MARKDOWN_FILE}' の書き込み中にエラー: {e}")