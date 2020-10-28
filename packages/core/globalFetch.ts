import { getCacheDir } from "./cache";
import { fetch } from "./fetch";

export function setupGlobalFetch(rootDirectory: string) {
  // TODO: Figure out why the types don't match here...
  // @ts-ignore
  global.fetch = fetch.defaults({
    cacheManager: getCacheDir(rootDirectory, "fetch"),
    // Don't decode responses by default. This lets people return `fetch`
    // results directly from their loaders w/out changing Content-Encoding.
    compress: false
  });
}