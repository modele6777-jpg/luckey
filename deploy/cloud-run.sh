#!/usr/bin/env bash
set -euo pipefail

project=${GOOGLE_CLOUD_PROJECT:-lucyuniverse-fc423}
region=${CLOUD_RUN_REGION:?Set CLOUD_RUN_REGION to the existing service region}
service=${CLOUD_RUN_SERVICE:-luckey}
account=${CLOUD_RUN_SERVICE_ACCOUNT:?Set CLOUD_RUN_SERVICE_ACCOUNT to the runtime service account email}
gemini_secret=${CLOUD_RUN_GEMINI_SECRET:-}
public=${CLOUD_RUN_PUBLIC:-preserve}

if ! command -v gcloud >/dev/null 2>&1; then
  echo 'Google Cloud CLI authentication is required.' >&2
  exit 1
fi
if [[ -n "$gemini_secret" && ! "$gemini_secret" =~ ^[A-Za-z0-9_-]+$ ]]; then
  echo 'CLOUD_RUN_GEMINI_SECRET must name a Secret Manager secret in the deployment project.' >&2
  exit 1
fi

cd "$(dirname -- "${BASH_SOURCE[0]}")/.."
source_dir=$(mktemp -d)
trap 'rm -r -- "$source_dir"' EXIT
git archive HEAD | tar -xf - -C "$source_dir"

args=(run deploy "$service" --project "$project" --region "$region" --source "$source_dir"
  --service-account "$account" --update-env-vars NODE_ENV=production --quiet --format='value(status.url)')
if [[ -n "$gemini_secret" ]]; then
  args+=(--update-secrets "GEMINI_API_KEY=$gemini_secret:latest")
else
  # Existing service credentials stay in place. Look at the variable names only.
  names=$(gcloud run services describe "$service" --project "$project" --region "$region"     --format='flattened(spec.template.spec.containers[].env[].name)')
  if ! grep -Eq ':[[:space:]]*(GEMINI_API_KEY|GOOGLE_GENAI_API_KEY|gemini)$' <<< "$names"; then
    echo 'No existing Gemini configuration found. Set CLOUD_RUN_GEMINI_SECRET to a Secret Manager secret name.' >&2
    exit 1
  fi
fi
case "$public" in
  preserve) ;;
  true) args+=(--allow-unauthenticated) ;;
  false) args+=(--no-allow-unauthenticated) ;;
  *) echo 'CLOUD_RUN_PUBLIC must be preserve, true or false.' >&2; exit 1 ;;
esac

gcloud "${args[@]}"
