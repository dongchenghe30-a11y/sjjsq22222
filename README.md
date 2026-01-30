# 电耗计算器 (Power Consumption Calculator) - Next.js 版本

一个免费的在线工具，帮助用户估算家电（尤其是手机）从开始使用到现在累计耗电量、电费和碳排放。

## 功能特性

- ⚡ **即时耗电计算**：快速查询家电即时耗电量
- 📱 **手机累计计算**：基于电池容量和充电习惯估算手机累计耗电
- 🏠 **家电累计计算**：计算电视、冰箱、空调等家电累计耗电
- 📊 **批量汇总**：查看所有家电的总耗电量统计和图表
- 💾 **本地存储**：所有数据保存在浏览器 localStorage
- 📱 **响应式设计**：完美适配移动端和桌面端

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **UI**: React 18
- **样式**: Tailwind CSS
- **图表**: Chart.js + react-chartjs-2
- **日期处理**: dayjs
- **图标**: Lucide React

## 构建命令

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本（静态导出）
npm run build

# 4. 预览生产版本
npm start
```

## 部署到 Cloudflare Pages

### 方法一：直接上传

1. 运行 `npm run build` 构建项目
2. 将 `out` 文件夹的内容上传到 Cloudflare Pages
3. 确保构建输出目录配置为 `out`

### 方法二：通过 Git 自动部署

1. 将代码推送到 GitHub
2. 在 Cloudflare Pages 中连接 GitHub 仓库
3. 配置构建设置：
   - **构建命令**: `npm run build`
   - **构建输出目录**: `out`
   - **Node.js 版本**: 18.x 或更高

### 方法三：使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages deploy out
```

## 错误排查

### 1. PowerShell 执行策略错误

**错误信息**:
```
npm : 无法加载文件 xxx\npm.ps1，因为在此系统上禁止运行脚本
```

**解决方案**:
```powershell
# 临时解决（当前会话）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# 或使用 CMD 代替 PowerShell
```

### 2. 依赖安装失败

**错误信息**:
```
npm ERR! code ENOENT
```

**解决方案**:
```bash
# 清除缓存后重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 3. 构建失败

**错误信息**:
```
Module not found: Can't resolve 'xxx'
```

**解决方案**:
```bash
# 确保所有依赖已安装
npm install

# 检查 TypeScript 配置
npm run type-check
```

### 4. 静态导出路径问题

**错误信息**:
```
Error: Image optimization with 'output: export' is not supported
```

**解决方案**: 已在 `next.config.js` 中配置 `images: { unoptimized: true }`

### 5. localStorage 在某些环境中不可用

**解决方案**: 该项目已使用 `'use client'` 标记所有使用 localStorage 的组件，确保在浏览器端运行

## 计算逻辑

### 即时计算
```
kWh = (功率W / 1000) × 使用小时数
电费 = kWh × 电价
CO₂ = kWh × 0.6 kg/kWh
```

### 手机累计计算
```
单次Wh = 电池容量(mAh) × 3.85V / 1000
单次kWh = 单次Wh / 1000
实际单次kWh = 单次kWh × (1 + 损失率)
日均kWh = 实际单次kWh × 日均充电次数 + 0.003 kWh
累计kWh = 日均kWh × 使用天数
```

### 家电累计计算
```
日均kWh = (功率W / 1000) × 日均使用小时 + 待机kWh
累计kWh = 日均kWh × 使用天数
```

## 数据来源

- 平均电压：3.85V（锂电池标准）
- 充电损失：20%（充电器效率+电池老化）
- CO₂系数：0.6 kg/kWh（全球平均）
- 默认电价：1.5 USD/kWh（香港/美国平均）

## 隐私声明

- 所有数据保存在浏览器本地（localStorage）
- 不收集任何个人数据
- 不使用后端服务器
- 不依赖第三方API

## 免责声明

所有计算结果均为估算值，仅供参考。实际耗电量可能因使用习惯、环境温度、设备老化等因素而有所不同。

## 项目结构

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 根布局
│   │   ├── page.tsx      # 首页
│   │   ├── globals.css   # 全局样式
│   │   ├── instant/      # 即时计算页
│   │   ├── phone/        # 手机计算页
│   │   ├── cumulative/   # 家电计算页
│   │   ├── results/      # 批量汇总页
│   │   └── about/        # 关于页
│   ├── lib/              # 工具函数
│   │   ├── calculations.ts  # 计算逻辑
│   │   └── storage.ts       # localStorage 管理
│   └── types/            # TypeScript 类型定义
├── public/               # 静态资源
├── next.config.js        # Next.js 配置
├── tailwind.config.ts    # Tailwind CSS 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 依赖配置
```

## 许可证

MIT License
