@echo off
REM Next.js 电耗计算器 - 构建脚本
REM 此脚本用于构建生产版本（静态导出）

echo ==========================================
echo   电耗计算器 - 构建生产版本
echo ==========================================
echo.

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo [1/2] 检查依赖...
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
echo [2/2] 构建项目...
echo 正在构建静态站点到 out 文件夹...
echo.

call npm run build

if errorlevel 1 (
    echo [错误] 构建失败
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   构建成功！
echo ==========================================
echo 输出目录: out/
echo 
echo 部署说明:
echo 1. 将 out/ 文件夹的内容上传到 Cloudflare Pages
echo 2. 或运行: npx wrangler pages deploy out
echo 3. 或预览: npm start
echo.

pause
