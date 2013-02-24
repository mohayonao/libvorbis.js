var NULL = null;

function NOP() {}
function NOT_IMPLEMENTED() { throw new Error("not implemented."); }

function _int(x) {
  return x|0;
}

function pointer(src, offset, length) {
  offset = (src.byteOffset + offset) * src.constructor.BYTES_PER_ELEMENT;
  if (length) {
    return new src.constructor(src.buffer, offset, length);
  } else {
    return new src.constructor(src.buffer, offset);
  }
}

function set_kv(dst, src) {
  var val;
  for (var k in src) {
    if (dst.hasOwnProperty(k)) {
      if (src[k] && src[k].$) {
        for (var i = 0; i < src[k].$.length; i++) {
          dst[k][i] = src[k].$[i];
        }
      } else {
        dst[k] = src[k];
      }
    } else {
      throw new Error("Object [" + dst.constructor.name + "] has no property '" + k + "'");
    }
  }
}

var uint8   = 0;
var int16   = 1;
var int32   = 2;
var uint32  = 3;
var float32 = 4;

function calloc(n, size) {
  var a, i, m;
  if (Array.isArray(n)) {
    if (n.length === 2) {
      a = new Array(n[0]);
      for (i = 0; i < n[0]; i++) {
        a[i] = calloc(n[1], size);
      }
      return a;
    }
  } else {
    if (typeof size === "number") {
      switch (size) {
      case uint8  : return new Uint8Array(n);
      case int16  : return new Int16Array(n);
      case int32  : return new Int32Array(n);
      case uint32 : return new Uint32Array(n);
      case float32: return new Float32Array(n);
      }
    } else if (typeof size === "function") {
      a = new Array(n); for (i = 0; i < n; i++) { a[i] = size(); } return a;
    } else {
      a = new Array(n); for (i = 0; i < n; i++) { a[i] = null  ; } return a;
    }
  }
  throw new Error("calloc failed.");
}

function realloc(src, newSize) {
  var ret = new src.constructor(newSize);
  ret.set(src);
  return ret;
}

function copy(dst, src, offset) {
  dst.set(src, offset||0);
}

function valset(dst, val, size) {
  for(var i=0;i<size;i++)dst[i]=val;
}
