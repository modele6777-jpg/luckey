$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host 'PRISM Firestore rules deploy' -ForegroundColor Cyan
Write-Host 'Project: lucyuniverse-fc423'
Write-Host 'Database: ai-studio-cbbdcebe-d278-41b2-9826-3d7e58a0eb1a'
Write-Host ''

$login = npx firebase login:list 2>&1 | Out-String
if ($login -match 'No authorized accounts') {
  Write-Host 'Firebase 로그인이 필요합니다. 브라우저 창이 열리면 Google 계정으로 승인해 주세요.' -ForegroundColor Yellow
  npx firebase login
}

npx firebase deploy --only firestore:rules
Write-Host ''
Write-Host '배포 완료. Firebase 콘솔 > Firestore > Rules 에서 반영 여부를 확인하세요.' -ForegroundColor Green
Read-Host 'Enter 키를 누르면 종료합니다'