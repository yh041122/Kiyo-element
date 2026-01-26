import { each, isFunction } from "lodash-es";
import shell from "shelljs";

export default function hookPlugin({
  rmFiles = [],
  beforeBuild,
  afterBuild,
}: {
  rmFiles?: string[];
  beforeBuild?: () => void;
  afterBuild?: () => void;
}) {
  return {
    name: "hooksPlugin",
    buildStart() {
      each(rmFiles, (fName) => shell.rm("-rf", fName)); //传进来文件名 然后each删除
      isFunction(beforeBuild) && beforeBuild();
    },
    buildEnd(err?: Error) {
      !err && isFunction(afterBuild) && afterBuild();
    },
  };
}
