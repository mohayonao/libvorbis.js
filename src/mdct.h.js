
// #define DATA_TYPE float
// #define REG_TYPE  float
var cPI3_8 = 0.38268343236508977175;
var cPI2_8 = 0.70710678118654752441;
var cPI1_8 = 0.92387953251128675613;

var FLOAT_CONV = function(x) { return x; };
var MULT_NORM  = function(x) { return x; };
var HALVE      = function(x) { return x*0.5; };

function mdct_lookup(p) {
  p = p||{};
  
  // int n;
  // int log2n;

  // DATA_TYPE *trig;
  // int       *bitrev;

  // DATA_TYPE scale;
  
  p.n = 0;
  p.log2n = 0;
  p.trig = null;
  p.bitrev = null;
  p.scale = 0;
  
  return p;
}
