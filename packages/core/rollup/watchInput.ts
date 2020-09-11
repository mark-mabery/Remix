import { promises as fsp } from "fs";
import type { InputOptions, InputOption, Plugin } from "rollup";
import chokidar from "chokidar";
import tmp from "tmp";

/**
 * Enables setting the compiler's input dynamically via a hook function.
 */
export default function watchInput({
  watchFile,
  getInput
}: {
  watchFile: string;
  getInput: (options: InputOptions) => Promise<InputOption>;
}): Plugin {
  let tmpfile = tmp.fileSync();
  let startedWatcher = false;

  return {
    name: "watch-input",
    // @ts-ignore
    async options(options: InputOptions) {
      let input = await getInput(options);
      return { ...options, input };
    },
    buildStart() {
      // This is a workaround for a bug in Rollup where this.addWatchFile does
      // not correctly listen for files that are added to a directory.
      // See https://github.com/rollup/rollup/issues/3704
      if (!startedWatcher) {
        chokidar.watch(watchFile).on("add", async () => {
          let now = new Date();
          await fsp.utimes(tmpfile.name, now, now);
        });

        startedWatcher = true;
      }

      this.addWatchFile(tmpfile.name);
    }
  };
}
