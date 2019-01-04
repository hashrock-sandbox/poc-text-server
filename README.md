# 何

- anydown のテキスト同期用サーバの PoC 実装

# 機能

- URL 自動発行
- TBD: ポーリング同期の conflict 被害を少なくするための 3-way merge
- TBD: 任意のホストからのテキスト保存・ロード（共有用途）

# お遊び

- 依存の最小化
- fetch / async, await を使ってクライアントを薄くする
- express を使わず connect のみで実装してみる
