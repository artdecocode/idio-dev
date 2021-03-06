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

const getDisplayPath = (url, route) => {
  return `${url}${route}`
}

const pad = (key, maxLength) => {
  const length = maxLength - key.length
  const a = Array.from({ length }).map(a => ' ').join('')
  return `${key}${a}`
}

const grey = (t) => {
  return `\x1b[90m${t}\x1b[0m`
}

/**
 * Watch routes.
 */
export default ({ dir, methods, router, defaultImports = true, aliases = {}, url = '' }) => {
  if (!fsevents) {
    throw new Error('fsevetns is not installed')
  }
  Object.keys(methods).forEach((m) => {
    const method = methods[m]
    const keys = Object.keys(method)
    const { length: longestKey } = keys.reduce((acc, k) => {
      if (k.length > acc.length)
        return k
      return acc
    }, '')
    keys.forEach(key => {
      const d = getDisplayPath(url, key)

      const { path } = method[key]
      const watcher = fsevents(path)
      log('%s', pad(d, longestKey + url.length))
      log('  %s', relative('', path))
      watcher.on('modified', () => {
        log('⌁ %s', relative('', path))
        onChange(path, dir, router, defaultImports, aliases)
      })
      watcher.start()

      const children = findChildrenInCache('', path)
      children.filter((c) => {
        return !/node_modules/.test(c)
      }).forEach((c) => {
        const w = fsevents(c)
        log('  %s', grey(relative('', c)))
        w.on('modified', (p) => {
          log('⌁ %s', grey(relative('', p)))
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

  console.log('> hot reloaded %s %s', name, reloadedAliases.length ? `${reloadedAliases.join(', ')}` : '')
}
