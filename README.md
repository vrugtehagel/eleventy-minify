# eleventy-minify

Minify files in the Eleventy output directory (or any directory).

This plugin is designed to only ship "glue code"; it doesn't come with minifiers
built-in to avoid users downloading dependencies that they don't need. You'll
need to import a supported minifier manually (for example,
`import * as esbuild from 'esbuild'`) and manually pass it to the plugin using
the exported glue code (e.g. `js: minifiers.fromEsbuild(esbuild)`). See the
configuration options below for the supported minifiers. A special case is added
for Deno users; since Deno has esbuild built-in from version 2.4 and up, this is
used as the default minifier for CSS, JS and JSON to provide dependency-free
minification.

> [!CAUTION]
> The plugin minifies files in-place; if you misconfigure the processed
> directory, it can irreversibly overwrite files. It is strongly recommended to
> use version control software like Git to avoid scenarios where files are
> unintentionally overwritten without a way back.

The plugin runs entirely independently from Eleventy within the `eleventy.after`
hook, meaning no template formats or transforms are added. Likely, if you are
using other post-processing plugins, you'll want to run the `eleventy.after`
hooks sequentially to avoid race conditions; to do so, use the following in your
Eleventy config:

```js
export default function (eleventyConfig) {
  // …
  eleventyConfig.setEventEmitterMode("sequential");
}
```

## Installation

To install, run any of the following commands:

```bash
# For npm:
npx jsr add @vrugtehagel/eleventy-minify
# For yarn:
yarn dlx jsr add @vrugtehagel/eleventy-minify
# For pnpm:
pnpm dlx jsr add @vrugtehagel/eleventy-minify
# For deno:
deno add @vrugtehagel/eleventy-minify
```

## Config

In your Eleventy configuration file (usually `.eleventy.js`), import or require
the module and add the plugin using `.addPlugin()`:

```js
import EleventyMinify, { minifiers } from "@vrugtehagel/eleventy-minify";
import * as htmlMinifier from "html-minifier";
import * as lightningcss from "lightningcss";
import * as esbuild from "esbuild";

export default function (eleventyConfig) {
  // …
  config.addPlugin(EleventyMinify, {
    concurrency: 6,
    html: minifiers.fromHtmlMinfier(htmlMinifier, {
      removeEmptyAttributes: true,
    }),
    css: minifiers.fromLightningCSS(lightningcss),
    js: minifiers.fromEsbuild(esbuild, {
      mangleProps: /^__/,
    }),
    json: minifiers.fromDeno(),
  });
}
```

There are a few base options available:

- `directory`: The directory to minify files in. The entire directory is
  recursively scanned and files with extensions that match provided minifiers
  are minified. This defaults to the Eleventy output directory.
- `concurrency`: The amount of files to process simultaneously. Defaults to 6.

The remaining options are key-value pairs representing an extension matched to a
normalized minifier. The latter are provided by the exported `minifiers` object.
Each minifier takes the namespaced module as first argument (`fromDeno()` is an
exception here), and options as second, as demonstrated in the snippet above.
Most of these set some sensible default options, like `minify: true`, to reduce
the need for manual configuration. The provided minifiers are found under the
exported `minifiers` object by the following names:

- `fromDeno(options)`: this is a special case. Deno has esbuild built-in, so if
  you are using Deno (version 2.4 or higher) you don't need any extra
  dependencies to minify CSS, JS and JSON. If the detected environment is Deno
  2.4 or higher, this is used as the default minifier for CSS, JS and JSON. If
  you are using Deno, but you'd like to avoid minifying a specific type
  altogether, set said type to `false`; for example, `css: false`.
- `fromEsbuild(esbuild, options)`: minify CSS, JS or JSON using
  [esbuild](https://www.npmjs.com/package/esbuild).
- `fromHtmlMinifer(htmlMinifier, options)`: minify HTML using
  [html-minifier](https://www.npmjs.com/package/html-minifier),
  [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser) or
  [html-minifier-next](https://www.npmjs.com/package/html-minifier-next). By
  default, comments are removed, entities decoded and whitespace collapsed
  conservatively. Additionally, the provided CSS and JS minifiers (if any) are
  used to minify inline styles and scripts. To use the default ones instead, set
  `minifyCSS: true` and/or `minifyJS: true`.
- `fromLightningCSS(lightningcss, options)`: minify CSS using
  [lightningcss](https://www.npmjs.com/package/lightningcss).

Are you missing your favorite minifier here?
[Open an issue](https://github.com/vrugtehagel/eleventy-minify/issues/new)!

The plugin also exports a `minify` function, which takes the same options as the
`EleventyMinify` plugin, but with a required `directory` option. This function
does the same thing as the plugin (minify files within a directory) but is
independent from Eleventy.
