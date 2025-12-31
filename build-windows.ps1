# ========================================
# InfoGraphix AI - Tauri Windows Build Script (PowerShell)
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " InfoGraphix AI Windows Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 错误处理
$ErrorActionPreference = "Stop"

# 检查 Node.js
Write-Host "[1/6] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor White
    exit 1
}

# 检查 Rust
Write-Host ""
Write-Host "[2/6] Checking Rust..." -ForegroundColor Yellow
try {
    $rustVersion = rustc --version
    $cargoVersion = cargo --version
    Write-Host "  $rustVersion" -ForegroundColor Green
    Write-Host "  $cargoVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Rust not found!" -ForegroundColor Red
    Write-Host "  Download from: https://rustup.rs/" -ForegroundColor White
    exit 1
}

# 检查 WebView2
Write-Host ""
Write-Host "[3/6] Checking WebView2..." -ForegroundColor Yellow
$webviewPath = "HKLM:\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
if (Test-Path $webviewPath) {
    Write-Host "  WebView2 found." -ForegroundColor Green
} else {
    Write-Host "  WARNING: WebView2 may not be installed." -ForegroundColor Red
    Write-Host "  Download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/" -ForegroundColor White
    $continue = Read-Host "  Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# 安装 npm 依赖
Write-Host ""
Write-Host "[4/6] Installing npm dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERROR: npm install failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "  Dependencies installed." -ForegroundColor Green
} else {
    Write-Host "  node_modules already exists, skipping npm install." -ForegroundColor Gray
}

# 构建前端
Write-Host ""
Write-Host "[5/6] Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Frontend built successfully." -ForegroundColor Green

# 构建 Tauri 应用
Write-Host ""
Write-Host "[6/6] Building Tauri application..." -ForegroundColor Yellow
Write-Host "  This may take several minutes..." -ForegroundColor Gray
npm run tauri:build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Tauri build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "       BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Output location: src-tauri\target\release\" -ForegroundColor White
Write-Host ""

# 查找生成的安装包
$bundleDir = "src-tauri\target\release\bundle"
if (Test-Path $bundleDir) {
    Write-Host "Generated files:" -ForegroundColor Cyan
    Get-ChildItem -Path $bundleDir -Recurse -File | ForEach-Object {
        Write-Host "  - $($_.FullName)" -ForegroundColor White
    }
}

Write-Host ""
