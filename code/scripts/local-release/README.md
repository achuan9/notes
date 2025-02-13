# 本地发布脚本

## 使用说明

1. 在项目根目录创建 `scripts` 目录
2. 将 `release.js` 文件放入 `scripts` 目录
3. 在 `package.json` 的 `scripts` 中添加 `release` 脚本

```json
{
  "scripts": {
    "release": "node scripts/release.js"
  }
}
```

## 功能说明

脚本会按以下步骤执行发布流程：

1. **工作区检查**
   - 检查是否有未提交的更改
   - 如有未提交更改，会提示用户确认是否继续

2. **分支检查与同步**
   - 检查当前是否在主分支
   - 提供切换到主分支的选项
   - 检查本地与远程代码同步状态
   - 提供同步远程代码的选项

3. **项目构建**
   - 执行配置的构建命令
   - 生成构建产物

4. **版本号更新**
   - 自动生成新版本号
   - ~~更新 package.json 中的版本信息~~

5. **打包发布**
   - 将构建产物打包成 zip 文件
   - 创建 git tag 并推送到远程

## 配置项说明

在 `buildConfig` 对象中可以配置以下选项：

```javascript
const buildConfig = {
  // 构建命令
  command: 'pnpm run build:pro',
  
  // 构建输出目录
  outputDir: 'dist',
  
  // 分支配置
  branch: {
    main: 'master',        // 主分支名称
    remote: 'origin',      // 远程仓库名称
    remoteBranch: 'origin/master'  // 完整的远程分支名
  },
  
  // 版本号生成器配置
  versionGenerators: {
    // 时间戳版本格式：YYMMDDHHSS
    timestamp: () => { ... }
    // 可以添加其他版本生成规则
  }
}
```

## 特殊参数

- `--dry`: 启用预演模式，只显示将要执行的操作，不实际执行
  ```bash
  npm run release -- --dry
  ```
