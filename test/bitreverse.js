"use strict";

/*global describe:true, it:true */
var assert = require("chai").assert;

// codebook.c

function bitreverse(x) {
  x=    ((x>>>16)&0x0000ffff) | ((x<<16)&0xffff0000);
  x=    ((x>>> 8)&0x00ff00ff) | ((x<< 8)&0xff00ff00);
  x=    ((x>>> 4)&0x0f0f0f0f) | ((x<< 4)&0xf0f0f0f0);
  x=    ((x>>> 2)&0x33333333) | ((x<< 2)&0xcccccccc);
  return (((x>>> 1)&0x55555555) | ((x<< 1)&0xaaaaaaaa))>>>0;
}

function hexstr(a) {
    return "0x" + ("00000000" + a.toString(16)).substr(-8);
}

function test(src, actual) {
  it(src + " -> " + actual, function() {
    assert.equal(bitreverse(src), actual);
  });
}

describe("bitreverse", function() {
    test(0x00000000, 0x00000000);
    test(0x103785af, 0xf5a1ec08);
    test(0xf5a1ec08, 0x103785af);
    test(0x206f0b5e, 0x7ad0f604);
    test(0x7ad0f604, 0x206f0b5e);
    test(0x40de16bc, 0x3d687b02);
    test(0x3d687b02, 0x40de16bc);
    test(0x81bc2d78, 0x1eb43d81);
    test(0x1eb43d81, 0x81bc2d78);
    test(0x03785af0, 0x0f5a1ec0);
    test(0x0f5a1ec0, 0x03785af0);
    test(0x06f0b5e0, 0x07ad0f60);
    test(0x07ad0f60, 0x06f0b5e0);
    test(0x0de16bc0, 0x03d687b0);
    test(0x03d687b0, 0x0de16bc0);
    test(0x1bc2d780, 0x01eb43d8);
    test(0x01eb43d8, 0x1bc2d780);
    test(0x3785af00, 0x00f5a1ec);
    test(0x00f5a1ec, 0x3785af00);
    test(0x6f0b5e00, 0x007ad0f6);
    test(0x007ad0f6, 0x6f0b5e00);
    test(0xde16bc00, 0x003d687b);
    test(0x003d687b, 0xde16bc00);
    test(0xbc2d7800, 0x001eb43d);
    test(0x001eb43d, 0xbc2d7800);
    test(0x785af000, 0x000f5a1e);
    test(0x000f5a1e, 0x785af000);
    test(0xf0b5e000, 0x0007ad0f);
    test(0x0007ad0f, 0xf0b5e000);
    test(0xe16bc000, 0x0003d687);
    test(0x0003d687, 0xe16bc000);
    test(0xc2d78000, 0x0001eb43);
    test(0x0001eb43, 0xc2d78000);
    test(0x85af0000, 0x0000f5a1);
    test(0x0000f5a1, 0x85af0000);
    test(0x0b5e0000, 0x00007ad0);
    test(0x00007ad0, 0x0b5e0000);
    test(0x16bc0000, 0x00003d68);
    test(0x00003d68, 0x16bc0000);
    test(0x2d780000, 0x00001eb4);
    test(0x00001eb4, 0x2d780000);
    test(0x5af00000, 0x00000f5a);
    test(0x00000f5a, 0x5af00000);
    test(0xb5e00000, 0x000007ad);
    test(0x000007ad, 0xb5e00000);
    test(0x6bc00000, 0x000003d6);
    test(0x000003d6, 0x6bc00000);
    test(0xd7800000, 0x000001eb);
    test(0x000001eb, 0xd7800000);
    test(0xaf000000, 0x000000f5);
    test(0x000000f5, 0xaf000000);
    test(0x5e000000, 0x0000007a);
    test(0x0000007a, 0x5e000000);
    test(0xbc000000, 0x0000003d);
    test(0x0000003d, 0xbc000000);
    test(0x78000000, 0x0000001e);
    test(0x0000001e, 0x78000000);
    test(0xf0000000, 0x0000000f);
    test(0x0000000f, 0xf0000000);
    test(0xe0000000, 0x00000007);
    test(0x00000007, 0xe0000000);
    test(0xc0000000, 0x00000003);
    test(0x00000003, 0xc0000000);
});
