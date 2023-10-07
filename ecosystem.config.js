module.exports = {
  apps : [{
    script: "./node-serve.ts", // 项目的启动文件
    name: "server", // 启动项目的别名
    // ignore_watch: ['node_modules'], // 忽略监听的目录
    interpreter: "./node_modules/.bin/ts-node",
    exec_mode: "cluster"
  }]
}
