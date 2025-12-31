# ========================================
# InfoGraphix AI - GitHub Release Publisher
# ========================================

param(
    [Parameter(Mandatory=$false)]
    [string]$Version = "0.0.1"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " GitHub Release Publisher v$Version" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 gh CLI
Write-Host "[1/5] Checking GitHub CLI..." -ForegroundColor Yellow
try {
    $ghVersion = gh --version
    Write-Host "  $ghVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: GitHub CLI not found!" -ForegroundColor Red
    Write-Host "  Install from: https://cli.github.com/" -ForegroundColor White
    exit 1
}

# 检查登录状态
Write-Host ""
Write-Host "[2/5] Checking GitHub auth..." -ForegroundColor Yellow
try {
    gh auth status
    Write-Host "  Auth OK" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Not logged in to GitHub!" -ForegroundColor Red
    Write-Host "  Run: gh auth login" -ForegroundColor White
    exit 1
}

# 检查安装包是否存在
Write-Host ""
Write-Host "[3/5] Checking build artifacts..." -ForegroundColor Yellow

$msiPath = "src-tauri\target\release\bundle\msi\InfoGraphix AI_${Version}_x64_en-US.msi"
$exePath = "src-tauri\target\release\bundle\nsis\InfoGraphix AI_${Version}_x64-setup.exe"

if (!(Test-Path $msiPath)) {
    Write-Host "  ERROR: MSI not found: $msiPath" -ForegroundColor Red
    Write-Host "  Please run build first: .\build-windows.bat" -ForegroundColor White
    exit 1
}
if (!(Test-Path $exePath)) {
    Write-Host "  ERROR: EXE not found: $exePath" -ForegroundColor Red
    Write-Host "  Please run build first: .\build-windows.bat" -ForegroundColor White
    exit 1
}

Write-Host "  Found: $msiPath" -ForegroundColor Green
Write-Host "  Found: $exePath" -ForegroundColor Green

# 确认发布信息
Write-Host ""
Write-Host "[4/5] Release info:" -ForegroundColor Yellow
Write-Host "  Version: $Version" -ForegroundColor White
Write-Host "  Files:" -ForegroundColor White
Write-Host "    - $(Split-Path $msiPath -Leaf)" -ForegroundColor Gray
Write-Host "    - $(Split-Path $exePath -Leaf)" -ForegroundColor Gray

$confirm = Read-Host "  Create release? (y/n)"
if ($confirm -ne "y") {
    Write-Host "  Cancelled." -ForegroundColor Yellow
    exit 0
}

# 创建发布
Write-Host ""
Write-Host "[5/5] Creating GitHub release..." -ForegroundColor Yellow

$releaseNotes = @"
## InfoGraphix AI v$Version

### Features
- AI-powered infographic generation
- Multi-provider LLM support (Gemini, DeepSeek, OpenRouter, OpenAI)
- Real-time streaming responses
- Beautiful visual components (charts, process flows, comparisons)
- Dark mode support
- Export to PNG and PowerPoint

### Installation
- **MSI Installer**: For standard Windows installation
- **NSIS Setup**: For custom installation options

### System Requirements
- Windows 10 or later
- WebView2 Runtime (usually pre-installed)

**Built with Tauri**
"@

# 使用 gh release create
gh release create "v$Version" `
    --title "v$Version" `
    --notes "$releaseNotes" `
    $msiPath `
    $exePath

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   RELEASE CREATED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Release URL: " -ForegroundColor White -NoNewline
    $repo = gh repo view --json owner,name | ConvertFrom-Json
    Write-Host "https://github.com/$($repo.owner.login)/$($repo.name)/releases/tag/v$Version" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to create release!" -ForegroundColor Red
    exit 1
}
