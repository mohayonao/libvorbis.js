"use strict";

var sys = require("sys");

var stdin  = global.stdin  = {fp:null};
var stdout = global.stdout = {fp:null};
var stderr = global.stderr = {fp:null};

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
      str = str.replace(/\n$/g, "");
      sys.error(str);
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
  offset = (src.byteOffset + offset) * src.constructor.BYTES_PER_ELEMENT;
  if (length) {
    return new src.constructor(src.buffer, offset, length);
  } else {
    return new src.constructor(src.buffer, offset);
  }
}
global.pointer = pointer;
