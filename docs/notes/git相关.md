## git 的常用命令

```shell
git init                    // 新建 git 代码库
git add                     // 添加指定文件到暂存区
git rm                      // 删除工作区文件，并且将这次删除放入暂存区
git commit -m [message]     // 提交暂存区到仓库区
git branch                  // 列出所有分支
git checkout -b [branch]    // 新建一个分支，并切换到该分支
git status                  // 显示有变更文件的状态
```

## git pull 和 git fetch 的区别

* git pull 会将远程仓库的分化下载下来，并和当前分支合并。
* git fetch 只是将远程仓库的变化下载下来，并没有和本地分支合并。

## git merge 和 git rebase 的区别

git merge 和 git rebase 都是用于分支合并，关键在 commit 记录的处理上不同：
* git merge 会新建一个新的 commit 对象，然后两个分支以前的 commit 记录都指向这个新 commit 记录。这种方法会保留之前每个分支的 commit 历史。
* git rebase 会先找到两个分支的第一个共同的 commit 祖先记录，然后将提取当前分支这之后的所有 commit 记录，然后将这个 commit 记录添加到目标分支的最新提交后面。经过这个合并后，两个分支合并后的 commit 记录就变为了线性的记录。
