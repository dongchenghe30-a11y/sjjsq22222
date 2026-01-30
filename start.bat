@echo off
REM Next.js 电耗计算器 - 快速启动脚本
REM 此脚本用于 Windows 环境，解决 PowerShell 执行策略问题

echo ==========================================
echo   电耗计算器 - Next.js 版本
echo ==========================================
echo.

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] 检查依赖...
if not exist "node_modules" (
    echo 未检测到依赖，开始安装...
    call npm install
    if errorlevel 1 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo 依赖已安装
)

echo.
echo [2/3] 启动开发服务器...
echo 服务器地址: http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev

pause
