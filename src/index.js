import { watch as w } from './browserify'

/**
 * @typedef {Object} BrowserifyConfig Import browserify types here
 *
 * @typedef {Object} BabelifyConfig Import babelify config here
 *
 * @typedef {Object} Config
 * @property {string} from
 * @property {string} to
 * @property {BrowserifyConfig} browserify
 * @property {BabelifyConfig} babelify
 *
 * @typedef {Object.<string, string[]>} AliasMap
 *
 * @typedef {Object} RoutesConfig
 * @property {string} dir Directory from which to initialise routes
 * @property {{}} methods
 * @property {Router} router `koa-router` instance
 * @property {boolean} [defaultImports] true if using ES6
 * @property {AliasMap} [aliases] a map of aliases
 */


/**
 * @type {(conf: Config) => void}
 */
const watchBundles = w

export { watchBundles }

import wr from  './watch-routes'


/**
 * @type {(routesConf: RoutesConfig) => void}
 */
const watchRoutes = wr

export default watchRoutes
