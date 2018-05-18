import browserify from 'browserify'
import babelify from 'babelify'
import watchify from 'watchify'
import { createWriteStream } from 'fs'
import { relative } from 'path'

export default ({
  path, output,
}) => {
  const b = browserify({
    entries: [path],
    cache: {},
    packageCache: {},
    plugin: [watchify],
    debug: true,
    transform: [babelify],
    extensions: ['.jsx'],
  })

  b
    .on('update', bundle)
    .on('bundle', () => {
      console.log('⇢ %s bundled to %s', relative('', path), relative('', output))
    })

  bundle()

  function bundle() {
    b.bundle()
      .on('error', ({ message }) => {
        console.log('[!] Bundle error: %s', message)
      })
      .pipe(createWriteStream(output))
  }
}
