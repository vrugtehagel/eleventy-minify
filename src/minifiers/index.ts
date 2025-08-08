import { fromDeno } from "./deno.ts";
import { fromEsbuild } from "./esbuild.ts";
import { fromHtmlMinifier } from "./html-minifier.ts";
import { fromLightningCSS } from "./lightningcss.ts";

export const minifiers = {
  fromDeno,
  fromEsbuild,
  fromHtmlMinifier,
  fromLightningCSS,
};
