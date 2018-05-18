# idio-dev

[![npm version](https://badge.fury.io/js/idio-dev.svg)](https://badge.fury.io/js/idio-dev)

```sh
yarn add -E -D idio-dev
```

`idio-dev` is a new Node.js npm package.

Development tools for idio.

## `watchBundles`

Make and watch `browserify` bundles. This produces source maps and does not minify output, so that it's useful in development. To build production bundles, use `buildBundles`.

```js
import { watchBundles } from 'idio-dev'

await watchBundles({
  from, to,
  babelify: {
    babelrc: false,
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
      '@babel/plugin-proposal-object-rest-spread',
    ],
    presets: [
      '@babel/preset-react',
    ],
  },
})
```

- _from_: where to look for JS files which need to be compiled
- _to_: where to put compiled bundles
- _browserify_: any additional options to pass to `browserify`
- _babelify_: a configuration for `babelify`
- _ignore_: `browserify`'s ignore
- _exclude_: `browserify`'s exclude

```fs
⇢ src/scripts/tamara-de-lempicka.js bundled to src/static/scripts/tamara-de-lempicka.js
```

---

(c) [artdecocode][1] 2018

[1]: https://artdeco.bz
