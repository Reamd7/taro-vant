const path = require('path');
const cwd = process.cwd()
console.log(cwd)
const VantTaroRoot = path.resolve(cwd, "./src/components/taro-vant")
const VantTaroDist = path.resolve(cwd, "./ui")
const fs = require('fs-extra');

function copy(root, dist, file) {
  fs.copySync(
    path.resolve(root, file),
    path.resolve(dist, file)
  )
}
fs.removeSync(VantTaroDist);
fs.mkdirSync(VantTaroDist);

copy(cwd, VantTaroDist, "./readme.md");
copy(cwd, VantTaroDist, "./package.json");
copy(cwd, VantTaroDist, "./LICENSE");
copy(cwd, VantTaroDist, "./CHANGELOG.md");
fs.copySync(
  VantTaroRoot, VantTaroDist
)
