import type { Minifier } from "../types.ts";

type Esbuild = any;
type EsbuildOptions = any;

/** Create a minifier based on esbuild. Pass the esbuild namespace as first
 * parameter (you'll need to `import * as esbuild from 'esbuild'` for this) and
 * optionally pass some esbuild-specific options as second parameter. For
 * example, `fromEsbuild(esbuild, {target: 'es2022'})`. */
export function fromEsbuild(
  esbuild: Esbuild,
  options: EsbuildOptions = {},
): Minifier {
  const config = { minify: true, allowOverwrite: true, ...options };
  async function fromPath(path: string): Promise<void> {
    const entryPoints = [path];
    const outfile = path;
    await esbuild.build({ ...config, entryPoints, outfile });
  }
  async function fromString(
    source: string,
    extension: string,
  ): Promise<string> {
    const loader = extension;
    const minified = await esbuild.transform(source, { ...config, loader });
    return minified.code;
  }
  const extensions = ["css", "js", "json"];
  return { extensions, fromPath, fromString };
}
