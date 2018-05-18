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
  output,
  name = path,
  home = ''
}) => {
  const r = (0, _path.relative)(home, output);
  const b = (0, _browserify.default)({
    entries: [path],
    cache: {},
    packageCache: {},
    plugin: [_watchify.default],
    debug: true,
    transform: [_babelify.default]
  });
  b.on('update', bundle).on('bundle', () => {
    console.log('%s bundled to %s', name, r);
  });
  bundle();

  function bundle() {
    b.bundle().on('error', ({
      message
    }) => console.log(message)).pipe((0, _fs.createWriteStream)(output));
  }
};

exports.default = _default;