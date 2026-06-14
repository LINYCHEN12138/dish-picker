# 今天吃什么 / meal-planner-app

Next.js 16 + TypeScript + Supabase 的移动端点菜应用。Supabase 未配置或网络失败时，会自动使用 `src/data/dishes.ts` 和 localStorage。

## 本地运行

```bash
npm install
npm run dev
```

复制 `.env.example` 为 `.env.local`，配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

不要在前端或 GitHub 中保存 service_role key、数据库密码和真实 DeepSeek Key。

## Supabase 初始化

在 Supabase SQL Editor 中依次运行：

1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. `supabase/rls_policies.sql`

需要重新从本地菜品生成 seed 时运行：

```bash
npm run supabase:seed
```

在 Supabase Authentication 设置中启用 Anonymous Sign-ins。菜谱表通过 RLS 公开只读，历史、收藏和购物清单只允许当前 `auth.uid()` 访问。

## GitHub 与 Vercel

```bash
git init
git branch -M main
git add .
git commit -m "feat: add Supabase persistence"
git remote add origin https://github.com/<username>/meal-planner-app.git
git push -u origin main
```

`.env.local` 已由 `.gitignore` 忽略。推送前确认暂存区没有真实密钥。

在 Vercel 导入 GitHub 仓库，框架使用自动识别的 Next.js，Build Command 使用 `npm run build`，Output Directory 保持默认。在 Vercel 配置与本地相同的 Supabase 和 DeepSeek 环境变量；修改变量后需要 Redeploy。

部署完成后，用手机打开 Vercel 生产地址，验证菜品读取、随机点菜、收藏、菜单历史和购物清单勾选状态。

## 验证

```bash
npm run lint
npm run build
```
