import fs from "node:fs/promises";
import type { Minifier } from "../types.ts";

type LightningCSS = any;
type LightningCSSOptions = any;

/** Create a minifier for Lightning CSS. */
export function fromLightningCSS(
  lightningcss: LightningCSS,
  options: LightningCSSOptions = {},
): Minifier {
  const config = { minify: true, ...options };
  const encoder = new TextEncoder();
  async function fromPath(path: string): Promise<void> {
    const code = await fs.readFile(path);
    const minified = lightningcss.transform({ code, ...config });
    await fs.writeFile(path, minified.code);
  }
  // deno-lint-ignore require-await
  async function fromString(source: string): Promise<string> {
    const code = encoder.encode(source);
    const minified = lightningcss.transform({ code, ...config });
    return minified.code.toString();
  }
  const extensions = ["css"];
  return { extensions, fromPath, fromString };
}
