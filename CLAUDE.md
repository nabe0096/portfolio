# ポートフォリオサイト

## サイト情報

| 項目 | 内容 |
|---|---|
| 公開URL | https://nabe0096.github.io/portfolio/ ※nabenokitchen.comは現在レシピサイトに使用中（2026-07-31確認） |
| GitHubリポジトリ | https://github.com/nabe0096/portfolio |
| ホスティング | GitHub Pages |

---

## デプロイ方法

ファイルを編集したら、以下のコマンドを実行するだけ：

```bash
bash deploy.sh
```

これだけでGitHubに自動でアップロードされ、サイトに反映される。
反映まで1〜2分かかる場合がある。

---

## ファイル構成

| ファイル | 内容 |
|---|---|
| index.html | メインページ |
| pricing.html | 料金ページ |
| style.css | スタイル |
| script.js | JavaScript |
| cursor.css | カーソルエフェクト |
| deploy.sh | デプロイスクリプト |
| images/ | 画像フォルダ |
| links/ | **なべのリンク帳**（社長がスマホでリンクをコピーする道具・noindex・2026-10-15）。https://nabe0096.github.io/portfolio/links/ |

---

## なべのリンク帳（links/）

- **2026-10-15〜 社長がページの「編集」で追加・削除する。一覧の正本は保存先（Worker nabe-links・D1）**。`links-data` の `sections` は控え。手で直すときは `../なべのリンク帳/README.md` の手順（`sync.py pull` → 直す → `push`）で。いきなり `links-data` だけ直して公開しても、ページは保存先の一覧で上書き表示される
- ①レシピ／②SNS攻略／教材／お仕事の4区分。①②のリンクを同じ区分に混ぜない
- 計測つき（`track`）の「貼る場所」（`places`・ここが正本）の値は、受け取る側に登録済みのものだけ使う：`bot`＝なべの秘密基地の PLACES（`../なべの秘密基地/worker/src/index.mjs`）、`daidokoro`／`sns`＝Rondo の `SUBSCRIBE_SRC_JA`（`../Rondo/rondo-dist/src/worker.mjs`）。新しい値を足したら同じ作業で登録して公開する
- 登録漏れは毎朝の健康診断 `_メンテナンススクリプト/system_audit/checks/link_hub.py` が見つける（手で確かめるなら `python3 checks/link_hub.py` が `[]`）
- 新しいSNS・サイト・LPを作ったら、保存先にも足す（`sync.py pull` → `links-data` に1行 → `sync.py push` → `bash deploy.sh`）
- **教材の区分は自動（2026-10-20〜）**：正本は `発信部/有料教材/有料教材台帳.json`。`../なべのリンク帳/kyozai_sync.py` が1時間おきに全教材の販売ページ＋本編を並べ、鍵の入った端末だけに「社長用」（本編をパスワードなしで開くURL）を出す。教材のリンクを手で足さない。社長用の中身（鍵つきURL・パスワード）はページの `links-data` や公開の一覧に絶対に入れない

---

## 注意事項

- デプロイしても教科書LP（nabe0096.github.io/textbook/）には影響しない（別リポジトリのため）
- SNSフォロワー数などの数字は定期的に更新すること
