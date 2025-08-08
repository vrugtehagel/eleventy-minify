import { fromDeno } from "./deno.ts";
import { fromEsbuild } from "./esbuild.ts";
import { fromHtmlMinifier } from "./html-minifier.ts";
import { fromLightningCSS } from "./lightningcss.ts";

/** A collection of "wrappers" around popular minifiers. To use one, pass the
 * namespaced package in question as first argument (i.e. import a package
 * using `import * as … from '…'`) and optionally an options object as second
 * parameter. `fromDeno()` is a special case that only takes an options
 * parameter. For more information and examples, see the README. */
export const minifiers = {
  fromDeno,
  fromEsbuild,
  fromHtmlMinifier,
  fromLightningCSS,
};
