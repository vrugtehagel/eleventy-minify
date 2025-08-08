import type { Minifier } from "./types.ts";

/** Optionally, options to pass to the plugin (or directly to the `minify`
 * function). */
export type EleventyMinifyOptions = {
  /** The directory to process; as an Eleventy plugin, this defaults to the
   * output directory. Files are minified in-place. */
  directory?: string;

  /** The number of files to process in parallel; defaults to 6. */
  concurrency?: number;
} & Minifiers;

/** Custom minifiers. These are generally produced by one of the exported
 * `from*` helpers (e.g. `fromEsbuild`). No minifiers are included by default,
 * to avoid downloading dependencies you might not want. If you are using Deno,
 * however, the built-in bundler will be used to minify CSS, JS and JSON.
 * Note that, while only four extensions are defined here, you may define
 * additional extensions as long as they do not conflict with the base options.
 * That is, you mustn't define a `directory` or `concurrency` extension. */
export type Minifiers = Partial<
  Record<"html" | "css" | "js" | "json", Minifier>
>;
