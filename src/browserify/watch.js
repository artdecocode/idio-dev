import browserify from 'browserify'
import babelify from 'babelify'
import watchify from 'watchify'
import { createWriteStream } from 'fs'
import { relative } from 'path'

export default ({
  path, output, name = path, home = '',
}) => {
  const r = relative(home, output)
  const b = browserify({
    entries: [path],
    cache: {},
    packageCache: {},
    plugin: [watchify],
    debug: true,
    transform: [babelify],
  })

  b
    .on('update', bundle)
    .on('bundle', () => {
      console.log('%s bundled to %s', name, r)
    })

  bundle()

  function bundle() {
    b.bundle()
      .on('error', ({ message }) => console.log(message))
      .pipe(createWriteStream(output))
  }
}
