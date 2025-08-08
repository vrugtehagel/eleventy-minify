import type { Minifier } from "../types.ts";

/** Creates a minifier based on Deno's built-in `deno bundle` command. This
 * uses esbuild under the hood. Can minify CSS, JS and JSON. */
export function fromDeno(options: {
  format?: "esm" | "iife" | "cjs";
  inlineImports?: boolean;
} = {}): Minifier {
  const canUseDenoBundle = verifyDenoVersion();
  if (!canUseDenoBundle) throw Error("Deno minifying needs Deno 2.4 or higher");
  const { format, inlineImports } = options;
  const validFormat = !format || ["esm", "iife", "cjs"].includes(format);
  if (!validFormat) throw Error('Invalid value for "format" option');
  const config = ["bundle", "--minify", "--platform=browser"];
  if (format) config.push("--format=" + format);
  if (inlineImports) config.push("--inline-imports");
  const execPath = Deno.execPath();
  async function fromPath(path: string): Promise<void> {
    const args = [...config, path, "--output", path];
    const command = new Deno.Command(execPath, { args });
    await command.output();
  }
  async function fromString(
    source: string,
    extension: string,
  ): Promise<string> {
    const suffix = "." + extension;
    const path = await Deno.makeTempFile({ suffix });
    await Deno.writeTextFile(path, source);
    await fromPath(path);
    const result = await Deno.readTextFile(path);
    await Deno.remove(path);
    return result;
  }
  const extensions = ["css", "js", "json"];
  return { extensions, fromPath, fromString };
}

export function verifyDenoVersion() {
  if (typeof Deno == "undefined") return false;
  const version = Deno.version?.deno;
  if (typeof version != "string") return false;
  const [major, minor] = version.split(".").map((part) => Number(part));
  return major >= 2 && minor >= 4;
}
