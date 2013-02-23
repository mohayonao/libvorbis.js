/* FFT implementation from OggSquish, minus cosine transforms,
 * minus all but radix 2/4 case.  In Vorbis we only need this
 * cut-down version.
 *
 * To do more than just power-of-two sized vectors, see the full
 * version I wrote for NetLib.
 *
 * Note that the packing is a little strange; rather than the FFT r/i
 * packing following R_0, I_n, R_1, I_1, R_2, I_2 ... R_n-1, I_n-1,
 * it follows R_0, R_1, I_1, R_2, I_2 ... R_n-1, I_n-1, I_n like the
 * FORTRAN version
 */

function drfti1(n, wa, ifac) {
  NOT_IMPLEMENTED();
}

function fdrffti(n, wsave, ifac) {
  NOT_IMPLEMENTED();
}

function dradf2(ido, l1, cc, ch, wa1) {
  NOT_IMPLEMENTED();
}

function dradf4(ido, l1, cc, ch, wa1, wa2, wa3) {
  NOT_IMPLEMENTED();
}

function dradfg(ido, ip, l1, idl1, cc, c1, c2, ch, ch2, wa) {
  NOT_IMPLEMENTED();
}

function drftf1(n, c, ch, wa, ifac) {
  NOT_IMPLEMENTED();
}

function dradb2(ido, l1, cc, ch, wa1) {
  NOT_IMPLEMENTED();
}

function dradb3(ido, l1, cc, ch, wa1, wa2) {
  NOT_IMPLEMENTED();
}

function dradb4(ido, l1, cc, ch, wa1, wa2, wa3) {
  NOT_IMPLEMENTED();
}

function dradbg(ido, ip, l1, idl1, cc, c1, c2, ch, ch2, wa) {
  NOT_IMPLEMENTED();
}

function drftb1(n, c, ch, wa, ifac){
  NOT_IMPLEMENTED();
}

function drft_forward(l, data) {
  NOT_IMPLEMENTED();
}

function drft_backward(l, data) {
  NOT_IMPLEMENTED();
}

function drft_init(l, n) {
  NOT_IMPLEMENTED();
}

function drft_clear(l) {
  NOT_IMPLEMENTED();
}
