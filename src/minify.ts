import fs from "node:fs/promises";
import nodePath from "node:path";

import { fromDeno, verifyDenoVersion } from "./minifiers/deno.ts";
import type { EleventyMinifyOptions } from "./options.ts";

/** A generic `minify` function. It takes the same options as the Eleventy
 * plugin, except the `directory` option is required. All files within the
 * given directory are minifier using the specified options and minifiers. */
export async function minify(
  options: EleventyMinifyOptions & { directory: string },
): Promise<void> {
  if (!("directory" in options)) {
    throw Error(`The "directory" option must be specified.`);
  }
  if (options.directory.startsWith("/")) {
    throw Error(`The "directory" option must be relative to the CWD.`);
  }

  const {
    directory,
    concurrency = 6,
    ...minifiers
  } = options;

  if (verifyDenoVersion()) {
    minifiers.css ??= fromDeno();
    minifiers.js ??= fromDeno();
    minifiers.json ??= fromDeno();
  }

  const paths = await fs.readdir(directory, { recursive: true });
  const running = new Set();
  for (const path of paths) {
    const extension = path.match(/[^\\/]\.(\w+)$/)?.[1];
    if (!extension) continue;
    if (!Object.hasOwn(minifiers, extension)) continue;
    const minifier = minifiers[extension as keyof typeof minifiers];
    if (!minifier) continue;
    const fullPath = nodePath.join(directory, path);
    if (running.size == concurrency) await Promise.any([...running]);
    const promise = minifier.fromPath(fullPath, extension, minifiers);
    running.add(promise);
    promise.then(() => running.delete(promise));
  }
  await Promise.all([...running]);
}
