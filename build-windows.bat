@echo off
REM ========================================
REM InfoGraphix AI - Tauri Windows Build Script
REM ========================================

echo.
echo ========================================
REM InfoGraphix AI Windows Build Script
echo ========================================
echo.

REM 检查 Node.js
echo [1/6] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
node --version

REM 检查 Rust
echo.
echo [2/6] Checking Rust...
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Rust not found! Please install Rust first.
    echo Download from: https://rustup.rs/
    pause
    exit /b 1
)
cargo --version
rustc --version

REM 检查 WebView2
echo.
echo [3/6] Checking WebView2...
reg query "HKLM\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" >nul 2>nul
if %errorlevel% neq 0 (
    echo WARNING: WebView2 may not be installed.
    echo Download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
    echo Press any key to continue anyway...
    pause >nul
) else (
    echo WebView2 found.
)

REM 安装 npm 依赖
echo.
echo [4/6] Installing npm dependencies...
set INSTALL_OK=0
if exist "node_modules\" (
    echo node_modules exists, checking if vite is available...
    call npx vite --version >nul 2>nul
    if errorlevel 1 (
        echo vite not found, reinstalling dependencies...
        rmdir /s /q node_modules
        call npm install --verbose
        set INSTALL_OK=%errorlevel%
    ) else (
        echo Dependencies OK, skipping npm install.
        set INSTALL_OK=0
    )
) else (
    call npm install --verbose
    set INSTALL_OK=%errorlevel%
)
if %INSTALL_OK% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

REM 构建前端
echo.
echo [5/6] Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

REM 构建 Tauri 应用
echo.
echo [6/6] Building Tauri application...
echo This may take several minutes...
call npm run tauri:build
if %errorlevel% neq 0 (
    echo ERROR: Tauri build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo BUILD SUCCESSFUL!
echo ========================================
echo.
echo Output location: src-tauri\target\release\
echo.
pause
