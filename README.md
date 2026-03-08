# 小贝壳 - 直接聊天笔记系统

小贝壳是一个基于Next.js的直接聊天笔记系统，它可以通过AI技术分析聊天内容并自动整理归纳为笔记。

## 功能特点

- **直接聊天**：用户可以直接与系统聊天，无需上传文件
- **笔记存储**：自动将聊天记录存储到后台
- **查询功能**：支持查询历史聊天记录和笔记
- **响应式设计**：支持移动端和桌面端

## 待实现功能

- **实时分析**：AI实时分析聊天内容并整理归纳（计划中）
- **归纳总结**：支持对聊天记录进行归纳总结（计划中）

## 技术栈

- **前端**：Next.js + React + TypeScript + Tailwind CSS
- **后端**：Next.js API Routes + Node.js + Express
- **数据库**：MongoDB（NoSQL数据库，适合存储非结构化数据）
- **AI服务**：字节跳动的豆包AI服务
- **部署**：Vercel（适合Next.js应用的部署）

## 快速开始

### 开发环境

1. 克隆仓库

   ```bash
   git clone https://github.com/yongfliu/chat-analyzer.git
   cd chat-analyzer
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 配置环境变量
   创建`.env.local`文件，添加以下内容：

   ```bash
   MONGODB_URI=your-mongodb-uri
   ```

4. 启动开发服务器

   ```bash
   npm run dev
   ```

5. 访问应用
   打开浏览器访问`http://localhost:3000`

### 生产部署

1. 配置环境变量
   在Vercel中配置以下环境变量：
   - `MONGODB_URI`：MongoDB连接字符串

2. 部署到Vercel
   使用Vercel CLI部署：
   ```bash
   vercel
   ```

## 使用方法

1. **直接聊天**：在应用中直接输入聊天内容，系统会自动分析并整理为笔记
2. **查询笔记**：在聊天记录列表中查看和查询历史笔记
3. **归纳总结**：系统会自动对聊天内容进行归纳总结

## 贡献

1. Fork仓库
2. 创建分支
3. 提交变更
4. 打开Pull Request

## 许可证

MIT License
