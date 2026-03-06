#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_CONFIG="$ROOT_DIR/../backend/data/studio-config.json"
SITE_CONFIG="$ROOT_DIR/studio-config.json"
OUTPUT_ZIP="$ROOT_DIR/../../frezo-site-upload.zip"

if [[ ! -f "$BACKEND_CONFIG" ]]; then
  echo "Missing backend config: $BACKEND_CONFIG"
  exit 1
fi

cp "$BACKEND_CONFIG" "$SITE_CONFIG"

cd "$ROOT_DIR"
rm -f "$OUTPUT_ZIP"
zip -r "$OUTPUT_ZIP" index.html main.js styles.css runtime-config.json studio-config.json assets -x '**/.DS_Store' >/tmp/frezo-publish.log

echo "Publish package ready:"
echo "$OUTPUT_ZIP"
