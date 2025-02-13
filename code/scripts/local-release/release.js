const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const readline = require('readline');

// 解析命令行参数
const isDryRun = process.argv.includes('--dry');

/**
 * 构建配置
 * 可以根据不同项目配置不同的构建命令和输出目录
 */
const buildConfig = {
  command: 'pnpm run build:pro',
  outputDir: 'dist',
  // 分支配置
  branch: {
    main: 'master', // 主分支名称
    remote: 'origin', // 远程仓库名称
    remoteBranch: 'origin/master' // 完整的远程分支名
  },
  // 版本号生成器配置
  versionGenerators: {
    // 时间戳版本 (YYMMDDHHSS)
    timestamp: () => {
      const now = new Date();
      return (
        now.getFullYear().toString().slice(-2) +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0')
      );
    }
    // 可以添加其他版本生成规则
    // semver: () => { ... },
    // custom: () => { ... },
  }
};

// 控制台样式
const styles = {
  info: '\x1b[36m%s\x1b[0m', // 青色
  success: '\x1b[32m%s\x1b[0m', // 绿色
  warning: '\x1b[33m%s\x1b[0m', // 黄色
  error: '\x1b[31m%s\x1b[0m', // 红色
  bold: '\x1b[1m%s\x1b[0m', // 加粗
  divider: '━'.repeat(60) // 分隔线
};

const emoji = {
  rocket: '🚀',
  warning: '⚠️ ',
  check: '✅',
  error: '❌',
  build: '🔨',
  sync: '🔄',
  zip: '📦',
  tag: '🏷️ ',
  time: '⏰',
  info: '💡' // 修改为灯泡 emoji
};

// 打印带样式的消息
function log(style, message, withEmoji = '') {
  const emojiPrefix = withEmoji ? `${emoji[withEmoji]} ` : '';
  const fullMessage = `${emojiPrefix}${message}`.trimStart();
  console.log(styles[style], fullMessage);
}

// 检查工作区状态
async function checkWorkingDirectory() {
  try {
    // 检查是否有未提交的更改
    const status = execSync('git status --porcelain').toString();
    if (status) {
      log('warning', '工作区存在未提交的更改：', 'warning');
      log('warning', status);

      const answer = await askQuestion('是否继续？这些更改将被包含在构建中 (y/N) ');
      if (answer !== 'y') {
        log('info', '已取消构建流程。');
        process.exit(0);
      }
      log('warning', '继续构建（包含未提交更改）...', 'warning');
    }
    return true;
  } catch (error) {
    log('error', '检查工作区状态失败：', 'error');
    console.error(error);
    process.exit(1);
  }
}

// 用户确认函数
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.toLowerCase());
    })
  );
}

// 检查是否需要显示建议
async function checkNeedSuggestions() {
  try {
    if (isDryRun) {
      log('info', '[DRY] 检查工作区、分支和远程同步状态...', 'sync');
      return { needSuggest: true, suggestions: ['[DRY] 建议检查'] };
    }

    const suggestions = [];

    // 检查当前分支
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    if (currentBranch !== buildConfig.branch.main) {
      suggestions.push(`建议您使用 ${buildConfig.branch.main} 分支进行构建`);
    }

    // 检查工作区状态
    const status = execSync('git status --porcelain').toString();
    if (status) {
      suggestions.push('建议您提交本地更改并同步到远程后，再进行构建');
    }

    // 检查远程同步状态
    execSync(`git fetch ${buildConfig.branch.remote} ${buildConfig.branch.main}`, {
      stdio: 'inherit'
    });
    const localHash = execSync('git rev-parse HEAD').toString().trim();
    const remoteHash = execSync(`git rev-parse ${buildConfig.branch.remoteBranch}`)
      .toString()
      .trim();
    if (localHash !== remoteHash) {
      suggestions.push('建议您同步远程代码后，再进行构建');
    }

    return {
      needSuggest: suggestions.length > 0,
      suggestions
    };
  } catch (error) {
    return { needSuggest: false, suggestions: [] };
  }
}

// 检查并同步目标分支
async function checkoutBranch() {
  if (isDryRun) {
    log('info', '开始检查分支...', 'sync');
    // 获取当前分支名
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

    if (currentBranch !== buildConfig.branch.main) {
      log('warning', `[DRY] 当前在 ${currentBranch} 分支`, 'warning');
      const switchAnswer = await askQuestion(
        `[DRY] 是否切换到${buildConfig.branch.main}分支？(y/N) `
      );

      if (switchAnswer === 'y') {
        log('info', `[DRY] 将切换到${buildConfig.branch.main}分支`, 'sync');
        log('info', '[DRY] 将检查工作区状态', 'sync');
        log('info', `[DRY] 将检查与远程${buildConfig.branch.main}的同步状态`, 'sync');
      } else {
        log('warning', `[DRY] 将继续在 ${currentBranch} 分支进行构建`, 'warning');
        return;
      }
    }

    // 模拟远程同步检查
    log('warning', '[DRY] 本地分支与远程master不一致', 'warning');
    const syncAnswer = await askQuestion('[DRY] 是否同步远程代码？(y/N) ');

    if (syncAnswer === 'y') {
      log('info', '[DRY] 将同步远程代码', 'sync');
      log('info', '[DRY] 将检查同步结果', 'sync');
    } else {
      log('warning', '[DRY] 您选择继续使用本地代码构建', 'warning');
      const confirmBuild = await askQuestion('[DRY] 确定要继续吗？(y/N) ');
      if (confirmBuild !== 'y') {
        log('info', '[DRY] 已取消发布流程', 'info');
        process.exit(0);
      }
      log('warning', '[DRY] 将继续使用本地代码构建', 'warning');
    }
    return;
  }

  log('info', '开始检查分支...', 'sync');

  // 先检查工作区状态
  await checkWorkingDirectory();

  // 获取当前分支名
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

  if (currentBranch !== buildConfig.branch.main) {
    log('warning', `当前在 ${currentBranch} 分支`, 'warning');
    const switchAnswer = await askQuestion(`是否切换到${buildConfig.branch.main}分支？(y/N) `);

    if (switchAnswer === 'y') {
      log('info', `切换到${buildConfig.branch.main}分支...`, 'sync');
      execSync(`git checkout ${buildConfig.branch.main}`, { stdio: 'inherit' });
      await checkWorkingDirectory();
    } else {
      log('warning', `继续在 ${currentBranch} 分支进行构建...`, 'warning');
      return;
    }
  }

  // 获取当前commit hash
  const localHash = execSync('git rev-parse HEAD').toString().trim();

  // 获取远程最新commit hash
  execSync(`git fetch ${buildConfig.branch.remote} ${buildConfig.branch.main}`, {
    stdio: 'inherit'
  });
  const remoteHash = execSync(`git rev-parse ${buildConfig.branch.remoteBranch}`).toString().trim();

  // 检查本地与远程是否一致
  if (localHash !== remoteHash) {
    log('warning', `本地分支与远程${buildConfig.branch.main}不一致！`, 'warning');
    log('info', '当前情况：');
    log('info', `本地版本：${localHash.slice(0, 7)}`);
    log('info', `远程版本：${remoteHash.slice(0, 7)}`);

    const syncAnswer = await askQuestion('是否同步远程代码？(y/N) ');

    if (syncAnswer === 'y') {
      log('info', '开始同步远程代码...', 'sync');
      try {
        execSync('git pull origin master', { stdio: 'inherit' });

        // 再次检查是否一致
        const newLocalHash = execSync('git rev-parse HEAD').toString().trim();
        const newRemoteHash = execSync('git rev-parse origin/master').toString().trim();

        if (newLocalHash !== newRemoteHash) {
          log('error', '错误：同步后本地分支仍与远程不一致！', 'error');
          log('error', '可能存在未处理的冲突或未提交的更改。');
          log('error', '请手动解决冲突后重试。');
          process.exit(1);
        }

        await checkWorkingDirectory();
        log('success', '分支同步完成', 'check');
      } catch (error) {
        log('error', '错误：同步分支失败！', 'error');
        log('error', '请手动解决问题后重试。');
        process.exit(1);
      }
    } else {
      log('warning', '您选择继续使用本地代码构建。', 'warning');
      const confirmBuild = await askQuestion('确定要继续吗？(y/N) ');
      if (confirmBuild !== 'y') {
        log('info', '已取消构建流程。');
        process.exit(0);
      }
      log('warning', '继续使用本地代码构建...', 'warning');
    }
  } else {
    log('success', '分支检查通过', 'check');
  }
}

// 生成版本号
function generateVersion(type = 'timestamp') {
  const generator = buildConfig.versionGenerators[type];
  if (!generator) {
    throw new Error(`未知的版本号生成类型: ${type}`);
  }
  return generator();
}

// 更新版本号
function updateVersion() {
  const packagePath = path.resolve(__dirname, '../package.json');
  const packageJson = require(packagePath);
  const version = generateVersion();

  if (isDryRun) {
    log('info', `[DRY] 将读取 package.json：${packagePath}`, 'time');
    log('info', `[DRY] 将生成新版本号：${version}`, 'time');
    log('info', '[DRY] 将更新 package.json 中的 version 字段', 'time');
  } else {
    packageJson.version = version;
    // fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    log('success', `版本号已更新为: ${version}`, 'time');
  }

  return { version, name: packageJson.name };
}

// 构建项目
function buildProject() {
  if (isDryRun) {
    log('info', `[DRY] 将执行构建命令：${buildConfig.command}`, 'build');
    log('info', `[DRY] 构建输出目录：${buildConfig.outputDir}`, 'build');
    return;
  }

  log('info', '开始构建项目...', 'build');
  execSync(buildConfig.command, { stdio: 'inherit' });
  log('success', '项目构建完成\n', 'check');
}

// 创建zip文件
function createZip(name, version) {
  const fileName = `${name}-v${version}.zip`;

  if (isDryRun) {
    log('info', `[DRY] 将创建压缩文件：${fileName}`, 'zip');
    log('info', `[DRY] 将压缩 ${buildConfig.outputDir} 目录的内容`, 'zip');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    log('info', '开始压缩文件...', 'zip');
    const output = fs.createWriteStream(path.resolve(__dirname, `../${fileName}`));
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      log('success', `压缩完成: ${fileName}`, 'check');
      resolve();
    });

    archive.on('error', (err) => {
      log('error', '错误：压缩文件失败！', 'error');
      console.error(err);
      reject(err);
    });

    archive.pipe(output);
    archive.directory(path.resolve(__dirname, `../${buildConfig.outputDir}`), false);
    archive.finalize();
  });
}

// 创建并推送tag
function createAndPushTag(version) {
  const tagName = `v${version}`;
  if (isDryRun) {
    log('info', `[DRY] 将创建 git tag：${tagName}`, 'tag');
    log('info', '[DRY] 将推送 tag 到远程仓库', 'tag');
  } else {
    log('info', `创建tag: ${tagName}`, 'tag');
    execSync(`git tag ${tagName}`, { stdio: 'inherit' });
    execSync('git push origin --tags', { stdio: 'inherit' });
    log('success', '完成Tag创建并推送到远程\n', 'check');
  }
}

async function main() {
  try {
    if (isDryRun) {
      log('warning', styles.divider);
      log('warning', 'DRY RUN 模式 - 仅预览将要执行的操作', 'warning');
      log('warning', styles.divider);
      log('info', '本次运行将模拟完整的构建流程，不会实际执行任何操作\n', 'info');
    }

    // 检查是否需要显示建议
    const { needSuggest, suggestions } = await checkNeedSuggestions();
    if (!isDryRun && needSuggest) {
      log('info', styles.divider);
      suggestions.forEach((suggestion) => {
        log('info', suggestion, 'info');
      });
      log('info', styles.divider);

      // 让用户确认是否继续
      const proceed = await askQuestion('忽略建议，继续构建流程？(Y/n) ');
      if (proceed === 'n') {
        log('info', '已取消构建流程。');
        process.exit(0);
      }
    } else {
      // 检查并同步目标分支
      await checkoutBranch();
    }

    // 构建项目
    buildProject();

    // 更新版本号
    const { version, name } = updateVersion();

    // 创建zip文件
    await createZip(name, version);

    // 创建并推送tag
    createAndPushTag(version);

    // 添加换行，分隔压缩完成和发布完成的提示
    log('info', '');

    if (isDryRun) {
      log('warning', styles.divider);
      log('warning', 'DRY RUN 完成 - 以上操作并未实际执行', 'warning');
      log('warning', styles.divider + '\n');
    } else {
      log('success', styles.divider);
      log('success', '构建流程完成！', 'rocket');
      log('success', styles.divider + '\n');
    }
  } catch (error) {
    log('error', '构建失败:', 'error');
    console.error(error);
    process.exit(1);
  }
}

main();
