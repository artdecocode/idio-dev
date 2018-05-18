"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watch = void 0;

var _wrote = require("wrote");

var _path = require("path");

var _watch = _interopRequireDefault(require("./watch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Bundle files and watch for changes.
 */
const watch = async ({
  from,
  to
}) => {
  const {
    content
  } = await (0, _wrote.readDirStructure)(from);
  const files = Object.keys(content).filter(k => {
    const {
      type
    } = content[k];
    return type == 'File';
  });
  files.forEach(name => {
    const path = (0, _path.resolve)(from, name);
    const output = (0, _path.resolve)(to, name);
    (0, _watch.default)({
      path,
      output,
      name
    });
  });
};

exports.watch = watch;