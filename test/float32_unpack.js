"use strict";

/*global describe:true, it:true */
var assert = require("chai").assert;

/* 32 bit float (not IEEE; nonnormalized mantissa +
   biased exponent) : neeeeeee eeemmmmm mmmmmmmm mmmmmmmm
   Why not IEEE?  It's just not that important here. */

var VQ_FEXP = 10;
var VQ_FMAN = 21;
var VQ_FEXP_BIAS = 768; /* bias toward values smaller than 1. */

function ldexp(x, exp) {
  return x*Math.pow(2,exp);
}

function float32_unpack(val) {
  if(val===2147483647)return(Infinity);
  var mant=val&0x1fffff;
  var sign=val&0x80000000;
  var exp =(val&0x7fe00000)>>>VQ_FMAN;
  if(sign)mant= -mant;
  return(ldexp(mant,exp-(VQ_FMAN-1)-VQ_FEXP_BIAS));
}


function test(src, actual) {
  it(src + " -> " + actual, function() {
    if (actual === Infinity) {
      assert.equal(float32_unpack(src), actual);
    } else {
      assert.closeTo(float32_unpack(src), actual, 1e-6);
    }
  });
}

describe("float32_pack", function() {
  test(-535612621, -1.200000);
  test(-535822336, -1.000000);
  test(-537919488, -0.500000);
  test(1610612736, 0.000000);
  test(1609564160, 0.500000);
  test(1611661312, 1.000000);
  test(1611871027, 1.200000);
  test(2147483647, Infinity);
  test(-2147483648, -0.000000);
});
