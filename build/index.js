"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.watchBundles = void 0;

var _browserify = require("./browserify");

var _watchRoutes = _interopRequireDefault(require("./watch-routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
const watchBundles = _browserify.watch;
exports.watchBundles = watchBundles;

/**
 * @type {(routesConf: RoutesConfig) => void}
 */
const watchRoutes = _watchRoutes.default;
var _default = watchRoutes;
exports.default = _default;
//# sourceMappingURL=index.js.map