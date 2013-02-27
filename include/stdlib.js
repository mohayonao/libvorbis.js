var NULL = null;

function NOP() {}
function NOT_IMPLEMENTED() { throw new Error("not implemented."); }

var assert = {};
assert.isNotNaN = function(num) {
  if (isNaN(num)) {
    throw new Error("NaN!?");
  }
  return 0;
};
assert.instanceOf = function(object, typename) {
  switch (typename) {
  case "int":
  case "long":
    if (typeof object !== "number") {
      throw new TypeError("require:"+typename+", but:"+object);
    }
    if (int(object) !== object) {
      throw new TypeError("require:int, but:float, " + object);
    }
    break;
  case "int*":
    if (!(typeof object === "object" && object instanceof Int16Array)) {
      throw new TypeError("require:int*, but:" + object);
    }
    break;
  case "long*":
    if (!(typeof object === "object" && object instanceof Int32Array)) {
      throw new TypeError("require:int*, but:" + object);
    }
    break;
  case "float":
    if (typeof object !== "number") {
      throw new TypeError("require:"+typename+", but:"+object);
    }
    break;
  case "float*":
    if (!(typeof object === "object" && object instanceof Float32Array)) {
      throw new TypeError("require:int*, but:" + object);
    }
    break;
  case "float***":
    if (!Array.isArray(object)) {
      throw new TypeError("require:float***, but:" + object);
    }
    break;
  case "void":
    if (typeof object !== "object") {
      throw new TypeError("require:object, but:"+object);
    }
    break;
  default:
    if (object.__name !== typename) {
      throw new TypeError("require:"+typename+", but:"+object.__name);
    }
  }
  return 0;
};

function int(x) {
  return x|0;
}

var OUT_OF_RANGE_STATE = 0;

function pointer(src, offset, length) {
  if (Array.isArray(src)) {
    if (offset >= 0) {
      return src.slice(offset, offset+length);
    }
    throw new Error("Ops.. Array["+offset+"]..");
  } else {
    offset = (src.byteOffset + offset * src.BYTES_PER_ELEMENT);
    assert.isNotNaN(offset);
    
    if (offset < 0) {
      OUT_OF_RANGE_STATE = 1;
      return null;
    } else if (offset >= src.buffer.byteLength) {
      OUT_OF_RANGE_STATE = 1;
      return null;
    }
    
    if (typeof length === "number") {
      return new src.constructor(src.buffer, offset, length);
    }
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
