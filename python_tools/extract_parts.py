import cv2
import numpy as np
import os
import json
import re

# --- 設定項目 ---
# このスクリプト (extract_parts.py) が python_tools/ にあるので、
# script.js や images/ は一つ上の階層 (../) にある
PROJECT_ROOT_FROM_SCRIPT = ".."  # このスクリプトから見たプロジェクトルートへの相対パス

INPUT_FACES_DIR = os.path.join(PROJECT_ROOT_FROM_SCRIPT, "python_tools", "input_faces")
OUTPUT_PARTS_DIR_BASE = os.path.join(PROJECT_ROOT_FROM_SCRIPT, "python_tools", "extracted_parts")
SIMULATOR_JS_FILE_PATH = os.path.join(PROJECT_ROOT_FROM_SCRIPT, "script.js")

DEFAULT_THRESHOLD = 0.10  # 抽出のデフォルト閾値 (低めに設定して調整)
THRESHOLD_OVERRIDES = {
}
SAVE_DEBUG_IMAGES = True


# --- ここまで設定項目 ---

def parse_simulator_parts_definition(js_file_path):
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
                print(f"'{os.path.basename(js_file_path)}' からパーツ定義を読み込みました。")
            except json.JSONDecodeError as e:
                print(f"エラー: '{os.path.basename(js_file_path)}' のparts定義のJSONパースに失敗: {e}")
                print("script.jsのparts定義がJSON準拠（キーと文字列はダブルクォート等）か確認してください。")
                print("パース試行文字列の一部:", parts_json_str[:500] + "...")
                return None
        else:
            print(f"エラー: '{os.path.basename(js_file_path)}' に 'const parts = {{...}};' が見つかりません。")
            return None
    except FileNotFoundError:
        print(f"エラー: シミュレーターJSファイル '{js_file_path}' が見つかりません。")
        return None
    return parts_data


def find_and_extract_part(main_img_bgr, template_rgba_path, threshold):
    if not os.path.exists(template_rgba_path):
        # print(f"  情報: テンプレート '{template_rgba_path}' が存在しません。")
        return None

    template_rgba = cv2.imread(template_rgba_path, cv2.IMREAD_UNCHANGED)
    if template_rgba is None:
        print(f"  警告: テンプレート '{template_rgba_path}' を読み込めませんでした。")
        return None
    if template_rgba.shape[2] != 4:
        # print(f"  情報: テンプレート '{template_rgba_path}' はアルファチャンネルなし。スキップ。")
        return None

    template_bgr = template_rgba[:, :, :3]
    template_alpha = template_rgba[:, :, 3]
    tmpl_h, tmpl_w = template_bgr.shape[:2]

    if tmpl_h == 0 or tmpl_w == 0: return None
    main_h, main_w = main_img_bgr.shape[:2]
    if tmpl_h > main_h or tmpl_w > main_w: return None

    res = cv2.matchTemplate(main_img_bgr, template_bgr, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)

    if max_val >= threshold:
        top_left = max_loc
        x_start_main = max(0, top_left[0])
        y_start_main = max(0, top_left[1])
        x_end_main = min(main_w, top_left[0] + tmpl_w)
        y_end_main = min(main_h, top_left[1] + tmpl_h)
        cropped_w = x_end_main - x_start_main
        cropped_h = y_end_main - y_start_main

        if cropped_w <= 0 or cropped_h <= 0: return None
        extracted_bgr = main_img_bgr[y_start_main:y_end_main, x_start_main:x_end_main]

        alpha_crop_x_start = x_start_main - top_left[0]
        alpha_crop_y_start = y_start_main - top_left[1]
        alpha_cropped = template_alpha[
                        alpha_crop_y_start: alpha_crop_y_start + cropped_h,
                        alpha_crop_x_start: alpha_crop_x_start + cropped_w
                        ]
        if extracted_bgr.shape[:2] != alpha_cropped.shape[:2]: return None

        b, g, r = cv2.split(extracted_bgr)
        extracted_bgra = cv2.merge([b, g, r, alpha_cropped])
        return extracted_bgra, top_left, tmpl_w, tmpl_h, max_val
    return None


def sanitize_filename(name):
    name = re.sub(r'[\\/*?:"<>|\'\s]', '_', name)  # 禁止文字とスペースを置換
    name = re.sub(r'__+', '_', name)  # 連続するアンダースコアを1つに
    return name


def process_single_face_image(face_image_path, simulator_parts_def, output_base_dir, project_root):
    face_fn_base = os.path.splitext(os.path.basename(face_image_path))[0]
    print(f"\n--- 顔写真 '{face_fn_base}' の処理開始 ---")
    main_img = cv2.imread(face_image_path)
    if main_img is None:
        print(f"エラー: '{face_image_path}' 読み込み失敗。")
        return

    debug_img = None
    if SAVE_DEBUG_IMAGES: debug_img = main_img.copy()
    found_any = False

    for category, items in simulator_parts_def.items():
        print(f"  カテゴリ '{category}' 検索中...")
        category_out_dir = os.path.join(output_base_dir, category)
        os.makedirs(category_out_dir, exist_ok=True)

        thresh = THRESHOLD_OVERRIDES.get(category, DEFAULT_THRESHOLD)

        for i, part_info in enumerate(items):
            template_src = part_info.get("src")
            part_name_orig = part_info.get("name", f"part_{category}_{i}")
            if not template_src: continue

            template_full_path = os.path.join(project_root, template_src)  # project_rootからの相対パス

            result = find_and_extract_part(main_img, template_full_path, thresh)
            if result:
                extracted_img, tl, tw, th, score = result
                s_part_name = sanitize_filename(part_name_orig)
                out_fn = f"{face_fn_base}_{category}_{s_part_name}.png"
                out_fpath = os.path.join(category_out_dir, out_fn)
                try:
                    cv2.imwrite(out_fpath, extracted_img)
                    print(f"    検出: '{part_name_orig}' (スコア: {score:.2f}) -> '{out_fpath}'")
                    found_any = True
                    if SAVE_DEBUG_IMAGES and debug_img is not None:
                        br = (tl[0] + tw, tl[1] + th)
                        cv2.rectangle(debug_img, tl, br, (0, 255, 0), 1)
                        cv2.putText(debug_img, f"{part_name_orig[:10]} ({score:.2f})",
                                    (tl[0], tl[1] - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 255, 0), 1)
                except Exception as e:
                    print(f"    エラー: '{out_fpath}' 保存中: {e}")

    if SAVE_DEBUG_IMAGES and found_any and debug_img is not None:
        debug_out_fpath = os.path.join(output_base_dir, f"{face_fn_base}_DEBUG.png")
        try:
            cv2.imwrite(debug_out_fpath, debug_img)
            print(f"  デバッグ画像 '{debug_out_fpath}' 保存完了。")
        except Exception as e:
            print(f"  エラー: デバッグ画像 '{debug_out_fpath}' 保存中: {e}")
    elif not found_any:
        print(f"  この顔写真から閾値を超えるパーツは見つかりませんでした。")


if __name__ == "__main__":
    print("電波人間顔パーツ抽出スクリプト開始")
    if not os.path.exists(SIMULATOR_JS_FILE_PATH):
        print(f"エラー: script.js が見つかりません: {SIMULATOR_JS_FILE_PATH}")
        exit()

    parts_def = parse_simulator_parts_definition(SIMULATOR_JS_FILE_PATH)
    if not parts_def:
        print("パーツ定義を読み込めなかったため終了します。")
        exit()

    if not os.path.isdir(INPUT_FACES_DIR):
        print(f"入力顔写真フォルダ '{INPUT_FACES_DIR}' が見つかりません。作成します。")
        os.makedirs(INPUT_FACES_DIR, exist_ok=True)

    face_files = [os.path.join(INPUT_FACES_DIR, f) for f in os.listdir(INPUT_FACES_DIR)
                  if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    if not face_files:
        print(f"'{INPUT_FACES_DIR}' に処理対象の画像がありません。終了します。")
        exit()

    os.makedirs(OUTPUT_PARTS_DIR_BASE, exist_ok=True)
    print(f"抽出パーツ保存先: '{os.path.abspath(OUTPUT_PARTS_DIR_BASE)}'")

    for face_path in face_files:
        process_single_face_image(face_path, parts_def, OUTPUT_PARTS_DIR_BASE, PROJECT_ROOT_FROM_SCRIPT)

    print("\n全処理完了。抽出パーツをシミュレーターのimagesフォルダにコピーし、script.jsを更新してください。")