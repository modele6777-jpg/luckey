#!/usr/bin/env bash
set -euo pipefail

project=${GOOGLE_CLOUD_PROJECT:-lucyuniverse-fc423}
region=${CLOUD_RUN_REGION:?Set CLOUD_RUN_REGION to the existing service region}
service=${CLOUD_RUN_SERVICE:-luckey}
account=${CLOUD_RUN_SERVICE_ACCOUNT:?Set CLOUD_RUN_SERVICE_ACCOUNT to the runtime service account email}
gemini_secret=${CLOUD_RUN_GEMINI_SECRET:?Set CLOUD_RUN_GEMINI_SECRET to the existing Secret Manager secret name}
public=${CLOUD_RUN_PUBLIC:-preserve}

if ! command -v gcloud >/dev/null 2>&1; then
  echo 'Google Cloud CLI authentication is required.' >&2
  exit 1
fi
if [[ ! "$gemini_secret" =~ ^[A-Za-z0-9_-]+$ ]]; then
  echo 'CLOUD_RUN_GEMINI_SECRET must name a Secret Manager secret in the deployment project.' >&2
  exit 1
fi

args=(run deploy "$service" --project "$project" --region "$region" --source .
  --service-account "$account" --update-env-vars NODE_ENV=production
  --update-secrets "GEMINI_API_KEY=$gemini_secret:latest" --quiet --format='value(status.url)')
case "$public" in
  preserve) ;;
  true) args+=(--allow-unauthenticated) ;;
  false) args+=(--no-allow-unauthenticated) ;;
  *) echo 'CLOUD_RUN_PUBLIC must be preserve, true or false.' >&2; exit 1 ;;
esac

cd "$(dirname -- "${BASH_SOURCE[0]}")/.."
gcloud "${args[@]}"
