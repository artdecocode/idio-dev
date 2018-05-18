import { readDirStructure } from 'wrote'
import { resolve } from 'path'
import w from './watch'

/**
 * Bundle files and watch for changes.
 */
export const watch = async ({ from, to, browserify = {}, babelify = {} }) => {
  const { content } = await readDirStructure(from)
  const files = Object.keys(content)
    .filter(k => {
      const { type } = content[k]
      return type == 'File'
    })
    .filter(k => {
      return /\.js(x|on)?$/.test(k)
    })
  files.forEach((name) => {
    const path = resolve(from, name)
    const output = resolve(to, name)
    w({ path, output, options: browserify, babelifyOptions: babelify })
  })
}
