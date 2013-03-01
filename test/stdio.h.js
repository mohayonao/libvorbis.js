"use strict";

var sys = require("sys");

var stdin  = global.stdin  = {fp:null};
var stdout = global.stdout = {fp:null};
var stderr = global.stderr = {fp:null};

global.NULL = null;

function exit(id) {
  process.exit(id);
}
global.exit = exit;

function fprintf(stream, format) {
  var argv = Array.prototype.slice.call(arguments, 2);
  var str = format.replace(/%([.\d+])?([ldxcsf]+)/g, function(m, num, chr) {
    var val = argv.shift();
    switch (chr) {
    case "c":
      val = String.fromCharCode(val);
      break;
    case "x":
      val = "0x" + val.toString(16);
      break;
    }
    return val;
  });
  if (stream === stdout) {
    if (!stdout.fp) {
      sys.print(str);
    }
  } else {
    if (!stderr.fp) {
      sys.print(str);
    }
  }
}
global.fprintf = fprintf;

function printf() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(stdout);
  fprintf.apply(null, args);
}
global.printf = printf;

function fread(buf, size, n, fp) {
  if (fp.fp) {
    n = Math.min(n, fp.fp.length);
    buf.set(fp.fp.subarray(0, n));
    fp.fp = new Uint8Array(fp.fp.buffer, fp.fp.byteOffset + n);
    return n;
  }
  throw new Error("cannot fread.");
}
global.fread = fread;

function pointer(src, offset, length) {
  offset = (src.byteOffset + offset * src.BYTES_PER_ELEMENT);
  if (typeof length === "number") {
    return new src.constructor(src.buffer, offset, length);
  } else {
    return new src.constructor(src.buffer, offset);
  }
}
global.pointer = pointer;

function int(x) {
  return x|0;
}

var assert = {};
assert.isNotNaN = function(num) {
  if (isNaN(num)) {
    throw new Error("NaN!?");
  }
  return 0;
};
assert.instanceOf = (function() {
  function str(object) {
    if (object.__name){
      return object.__name;
    }
    var objtype = Array.isArray(object) ? "array" : typeof(object);
    if (hasNaN.flag) {
      object += " contains NaN";
    }
    return objtype + "(" + object.toString() + ")";
  }
  
  function hasNaN(object) {
    for (var i = object.length; i--; ) {
      if (isNaN(object[i])) {
        return (hasNaN.flag = true);
      }
    }
    return false;
  }
  
  return function(object, typename) {
    switch (typename) {
    case "int":
    case "long":
      if (typeof object === "number" && int(object) === object) {
        return 0;
      }
      break;
    case "float":
      if (typeof object === "number" && !isNaN(object)) {
        return 0;
      }
      break;
    case "char*":
      if (object === null || object instanceof Uint8Array && !hasNaN(object)) {
        return 0;
      }
      break;
    case "int*":
      if (object === null || object instanceof Int16Array && !hasNaN(object)) {
          return 0;
      }
      break;
    case "long*":
      if (object === null || object instanceof Int32Array && !hasNaN(object)) {
          return 0;
      }
      break;
    case "float*":
      if (object === null || object instanceof Float32Array && !hasNaN(object)) {
          return 0;
      }
      break;
    case "float***":
      if (object === null || Array.isArray(object)) {
        return 0;
      }
      break;
    case "void":
      if (object === null || typeof object === "object") {
        return 0;
      }
      break;
    default:
      if (object.__name === typename) {
        return 0;
      }
    }
    throw new TypeError("require:"+typename+", but:"+str(object));
  };
})();
global.assert = assert;
