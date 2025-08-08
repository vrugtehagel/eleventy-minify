import type { EleventyMinifyOptions } from "./options.ts";
import { minify } from "./minify.ts";

/** The type for the config object is not super relevant, but at least users
 * can understand what this type represents even if TypeScript doesn't. */
type EleventyConfig = any;

/** The actual plugin itself. The actual hashing happens independently of
 * Eleventy, we just wait until Eleventy is done and then go over the output
 * directory to hash assets and add the query parameters.
 * Options are completely optional. */

/** The main plugin function. The minification process does not add any
 * template languages, but happens as a non-Eleventy-specific operation on the
 * output directory. */
export function EleventyMinify(
  config: EleventyConfig,
  options?: EleventyMinifyOptions,
): void {
  config.events.addListener("eleventy.after", async () => {
    const directory: string = config.directories.output;
    await minify({ directory, ...options });
  });
}
