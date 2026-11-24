#!/usr/bin/env bash
set -euo pipefail

emulator_jar=${1:?Pass the downloaded Firestore emulator JAR}
log_file=$(mktemp)
port=8785

java -jar "$emulator_jar" --host 127.0.0.1 --port "$port" --project_id demo-luckey-portable \
  --single_project_mode true --single_project_mode_error true --rules firestore.rules >"$log_file" 2>&1 &
emulator_pid=$!
trap 'kill "$emulator_pid" 2>/dev/null || true; unlink "$log_file"' EXIT

ready=0
for ((attempt=0; attempt<35; attempt++)); do
  if grep -q 'Dev App Server is now running' "$log_file"; then ready=1; break; fi
  if ! kill -0 "$emulator_pid" 2>/dev/null; then break; fi
  sleep 1
done
if [[ "$ready" != 1 ]]; then cat "$log_file"; exit 1; fi
FIRESTORE_EMULATOR_HOST="127.0.0.1:$port" node_modules/.bin/tsx --test tests/lucy-portable-cloud.test.ts
