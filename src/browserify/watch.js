import browserify from 'browserify'
import babelify from 'babelify'
import watchify from 'watchify'
import { createWriteStream } from 'fs'
import { relative } from 'path'

export default ({
  path, output, options = {}, babelifyOptions = {},
  ignore, exclude,
}) => {
  const p = relative('', path)
  const o = relative('', output)
  const babel = babelify.configure(babelifyOptions)

  const b = browserify({
    entries: [path],
    cache: {},
    packageCache: {},
    plugin: [watchify],
    debug: true,
    transform: [babel],
    extensions: ['.jsx'],
    ...options,
  })

  b
    .on('update', bundle)
    .on('bundle', () => {
      console.log('⇢ %s bundled to %s', p, o)
    })

  if (ignore) b.ignore(ignore)
  if (exclude) b.exclude(exclude)

  bundle()

  function bundle() {
    b.bundle()
      .on('error', ({ message }) => {
        console.log('[!] %s bundle error: %s', p, message)
      })
      .pipe(createWriteStream(output))
  }
}
