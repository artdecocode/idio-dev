import { resolve, relative, sep } from 'path'
import { getName, removeExtension, importRoute } from 'idio/build/lib/routes'

let fsevents
try {
  fsevents = require('fsevents')
} catch (e) { /* ignore fsevents */ }

const log = console.log

const findChildrenInCache = (dir, file) => {
  const path = resolve(dir, file)
  const item = require.cache[path]
  if (!item) return []
  const { children } = item
  const res = children.map(({ id }) => id)
  return res
}

/**
 * Watch routes.
 */
export default (methods, dir, router, defaultImports, aliases) => {
  if (!fsevents) {
    throw new Error('fsevetns is not installed')
  }
  Object.keys(methods).forEach((m) => {
    const method = methods[m]
    const keys = Object.keys(method)
    keys.forEach(key => {
      const { path } = method[key]
      const watcher = fsevents(path)
      log('watching %s', relative('', path))

      watcher.on('modified', () => {
        log('updated %s', relative('', path))
        onChange(path, dir, router, defaultImports, aliases)
      })
      watcher.start()

      const children = findChildrenInCache('', path)
      children.filter((c) => {
        return !/node_modules/.test(c)
      }).forEach((c) => {
        const w = fsevents(c)
        log('watching dependency %s', relative('', c))
        w.on('modified', (p) => {
          log('updated dependency %s of %s', relative('', p), relative('', path))
          onChange(path, dir, router, defaultImports, aliases)
        })
        w.start()
      })
    })
  })
}

const onChange = (path, dir, router, defaultImports, aliases) => {
  const rel = relative(dir, path)
  const [method, file] = rel.split(sep)
  const route = `/${removeExtension(file)}`
  const name = getName(method, route)
  const layer = router.route(name)
  const fn = layer.stack.find(({ _route }) => _route == true)
  if (!fn) return
  const i = layer.stack.indexOf(fn)
  const children = findChildrenInCache('', path)
  children.forEach((c) => {
    delete require.cache[c]
  })
  delete require.cache[path]
  const { fn: newFn } = importRoute(dir, rel, defaultImports)
  layer.stack[i] = newFn

  const a = aliases[method][route] || []
  const reloadedAliases = a.map((alias) => {
    const aliasName = getName(method, alias)
    const l = router.route(aliasName)
    const fun = l.stack.find(({ _route }) => _route == true)
    if (!fun) return
    const j = l.stack.indexOf(fun)
    l.stack[j] = newFn
    return aliasName
  })

  console.log('> hot reloaded %s (%s)', name, reloadedAliases.join(', '))
}
