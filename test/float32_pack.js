"use strict";

/*global describe:true, it:true */
var assert = require("chai").assert;

/* 32 bit float (not IEEE; nonnormalized mantissa +
   biased exponent) : neeeeeee eeemmmmm mmmmmmmm mmmmmmmm
   Why not IEEE?  It's just not that important here. */

var VQ_FEXP = 10;
var VQ_FMAN = 21;
var VQ_FEXP_BIAS = 768; /* bias toward values smaller than 1. */

function rint(x) {
  return (x+0.5)|0;
}

function ldexp(x, exp) {
  return x*Math.pow(2,exp);
}

/* doesn't currently guard under/overflow */
function float32_pack(val){
  if(val===0)return(1610612736);
  var sign=0;
  if(val<0){
    sign=0x80000000;
    val= -val;
  }
  var exp=Math.floor(Math.log(val)*Math.LOG2E+0.001); //+epsilon
  var mant=rint(ldexp(val,(VQ_FMAN-1)-exp));
  exp=(exp+VQ_FEXP_BIAS)<<VQ_FMAN;
  return(sign|exp|mant);
}


function test(src, actual) {
  it(src + " -> " + actual, function() {
    assert.equal(float32_pack(src), actual);
  });
}

describe("float32_pack", function() {
  test(-1.200000, -535612621);
  test(-1.000000, -535822336);
  test(-0.500000, -537919488);
  test(0.000000, 1610612736);
  test(0.500000, 1609564160);
  test(1.000000, 1611661312);
  test(1.200000, 1611871027);
});
