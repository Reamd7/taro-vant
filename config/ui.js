const child_process = require("child_process");
const path = require('path');
const cwd = process.cwd().replace(/\\/g, "/");
const util = require("util")
const VantTaroRoot = path.resolve(cwd, "./src/components/taro-vant").replace(/\\/g, "/");
const VantTaroDist = path.resolve(cwd, "./ui").replace(/\\/g, "/");
const fs = require('fs');
const copyFile = function (_src, _dst, path) {
  let readable = fs.createReadStream(_src + '/' + path);//创建读取流
  let writable = fs.createWriteStream(_dst + '/' + path);//创建写入流
  readable.pipe(writable);
  console.log("复制完成" + _src + '/' + path, _dst + '/' + path)
}
const copy = function (src, dst) {
  let paths = fs.readdirSync(src); //同步读取当前目录
  paths.forEach(function (path) {
    var _src = src + '/' + path;
    var _dst = dst + '/' + path;
    fs.stat(_src, function (err, stats) {  //stats  该对象 包含文件属性
      if (err) throw err;
      if (stats.isFile()) { //如果是个文件则拷贝
        copyFile(src, dst, path)
      } else if (stats.isDirectory()) { //是目录则 递归
        checkDirectory(_src, _dst, copy);
      }
    });
  });
}
const checkDirectory = function (src, dst, callback) {
  fs.access(dst, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdirSync(dst);
      callback(src, dst);
    } else {
      callback(src, dst);
    }
  });
};
function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

delDir(VantTaroDist);

fs.mkdirSync(VantTaroDist);
copyFile(cwd, VantTaroDist, "readme.md");
copyFile(cwd, VantTaroDist, "package.json");
copyFile(cwd, VantTaroDist, "LICENSE");
copyFile(cwd, VantTaroDist, "CHANGELOG.md");
checkDirectory(VantTaroRoot, VantTaroDist, copy);
