#!/usr/bin/env bash
# 手动执行这个脚本部署到 github pages
# 打包，进入打包后的文件夹 dist，创建 .nojekyll 文件，初始化 git 仓库，添加所有文件，提交，强制推送到 gh-pages 分支

# `.nojekyll` 是 GitHub Pages 中的一个特殊文件。它用于告诉 GitHub Pages 不要使用 Jekyll 构建页面。
# Jekyll 是一个用于构建静态网站的工具，但在某些情况下，如果你的项目中包含一些命名格式为 `_config.yml`
# 和 `_posts` 的文件夹或文件，那么这些文件可能会被错误地当作 Jekyll 的文件处理，导致构建失败。通过将
# `.nojekyll` 文件添加到仓库根目录中，可以防止这种情况的发生，确保 GitHub Pages 以纯静态 HTML 页面的形式呈现你的网站。
set -e
npm run build
cd dist
touch .nojekyll
git init
git add -A
git commit -m 'deploy'
# 强制推送到 gh-pages 分支，使用了 HTTP 访问令牌作为身份验证来访问名为 demo-threejs 的 Github 仓库
# git push -f "https://${access_token}@github.com/1103409364/demo-threejs" master:gh-pages
# 将本地分支 master 的代码强制推送到名为 gh-pages 的远程分支上，并覆盖远程分支上的所有代码。
git push -f "git@github.com:1103409364/demo-threejs" master:gh-pages
cd -
exec /bin/bash
