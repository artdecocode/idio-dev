"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _browserify = _interopRequireDefault(require("browserify"));

var _babelify = _interopRequireDefault(require("babelify"));

var _watchify = _interopRequireDefault(require("watchify"));

var _fs = require("fs");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = ({
  path,
  output
}) => {
  const b = (0, _browserify.default)({
    entries: [path],
    cache: {},
    packageCache: {},
    plugin: [_watchify.default],
    debug: true,
    transform: [_babelify.default],
    extensions: ['.jsx']
  });
  b.on('update', bundle).on('bundle', () => {
    console.log('⇢ %s bundled to %s', (0, _path.relative)('', path), (0, _path.relative)('', output));
  });
  bundle();

  function bundle() {
    b.bundle().on('error', ({
      message
    }) => {
      console.log('[!] Bundle error: %s', message);
    }).pipe((0, _fs.createWriteStream)(output));
  }
};

exports.default = _default;