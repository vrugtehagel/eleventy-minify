import fs from "node:fs/promises";
import type { Minifier } from "../types.ts";

type HTMLMinifier = any;
type HTMLMinifierOptions = any;

/** Create a minifier for html-minifier, or its cousins html-minifier-terser
 * and html-minifier-next. A few options are set by default; comments are
 * removed, entities decoded and whitespace collapsed conservatively. Also, the
 * provided CSS and JS minifiers are used instead of the default provided by
 * html-minifier; this can be undone by setting the `minifyCSS` or `minifyJS`
 * option to `true`. */
export function fromHtmlMinifier(
  htmlMinifier: HTMLMinifier,
  options: HTMLMinifierOptions,
): Minifier {
  const config = {
    removeComments: true,
    decodeEntities: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    ...options,
  };
  async function fromString(
    source: string,
    _extension: string,
    minifiers: Record<string, Minifier>,
  ): Promise<string> {
    if (minifiers.css) config.minifyCSS ??= minifiers.css;
    if (minifiers.js) config.minifyJS ??= minifiers.js;
    return await htmlMinifier.minify(source, config);
  }
  async function fromPath(
    path: string,
    extension: string,
    minifiers: Record<string, Minifier>,
  ): Promise<void> {
    const source = await fs.readFile(path, "utf8");
    const minified = await fromString(source, extension, minifiers);
    await fs.writeFile(path, minified);
  }
  const extensions = ["html"];
  return { extensions, fromPath, fromString };
}
