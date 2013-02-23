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

function realloc(src, newSize) {
  var ret = new src.constructor(newSize);
  ret.set(src);
  return ret;
}

function copy(dst, src, offset) {
  dst.set(src, offset||0);
}

function zeroclear(buf) {
  buf.constructor.zeroclear(buf);
}

function ilog(v) {
  var ret=0;
  while(v){
    ret++;
    v>>=1;
  }
  return(ret);
}

function ilog2(v) {
  var ret=0;
  if(v){--v;}
  while(v){
    ret++;
    v>>=1;
  }
  return(ret);
}

function icount(v) {
  var ret=0;
  while(v){
    ret+=v&1;
    v>>=1;
  }
  return(ret);
}
