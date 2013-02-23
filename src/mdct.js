/* this can also be run as an integer transform by uncommenting a
   define in mdct.h; the integerization is a first pass and although
   it's likely stable for Vorbis, the dynamic range is constrained and
   roundoff isn't done (so it's noisy).  Consider it functional, but
   only a starting point.  There's no point on a machine with an FPU */

/* build lookups for trig functions; also pre-figure scaling and
   some window function algebra. */

function mdct_init(lookup, n) {
  NOT_IMPLEMENTED();
}

/* 8 point butterfly (in place, 4 register) */
function mdct_butterfly_8(x) {
  NOT_IMPLEMENTED();
}

/* 16 point butterfly (in place, 4 register) */
function mdct_butterfly_16(x) {
  NOT_IMPLEMENTED();
}

/* 32 point butterfly (in place, 4 register) */
function mdct_butterfly_32(x) {
  NOT_IMPLEMENTED();
}

/* N point first stage butterfly (in place, 2 register) */
function mdct_butterfly_first(T, x, points) {
  NOT_IMPLEMENTED();
}

/* N/stage point generic N stage butterfly (in place, 2 register) */
function mdct_butterfly_generic(T, x, points, trigint) {
  NOT_IMPLEMENTED();
}

function mdct_butterflies(init, x, points) {
  NOT_IMPLEMENTED();
}

function mdct_clear(l) {
  NOT_IMPLEMENTED();
}

function mdct_bitreverse(init, x) {
  NOT_IMPLEMENTED();
}

function mdct_backward(init, _in, out) {
  NOT_IMPLEMENTED();
}

function mdct_forward(init, _in, out) {
  NOT_IMPLEMENTED();
}
