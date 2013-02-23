/* Note that the lpc-lsp conversion finds the roots of polynomial with
   an iterative root polisher (CACM algorithm 283).  It *is* possible
   to confuse this algorithm into not converging; that should only
   happen with absurdly closely spaced roots (very sharp peaks in the
   LPC f response) which in turn should be impossible in our use of
   the code.  If this *does* happen anyway, it's a bug in the floor
   finder; find the cause of the confusion (probably a single bin
   spike or accidental near-float-limit resolution problems) and
   correct it. */

/* three possible LSP to f curve functions; the exact computation
   (float), a lookup based float implementation, and an integer
   implementation.  The float lookup is likely the optimal choice on
   any machine with an FPU.  The integer implementation is *not* fixed
   point (due to the need for a large dynamic range and thus a
   separately tracked exponent) and thus much more complex than the
   relatively simple float implementations. It's mostly for future
   work on a fully fixed point implementation for processors like the
   ARM family. */

/* define either of these (preferably FLOAT_LOOKUP) to have faster
   but less precise implementation. */

/* side effect: changes *lsp to cosines of lsp */
function vorbis_lsp_to_curve(curve, map, n, ln, lsp, m, amp, ampoffset) {
  NOT_IMPLEMENTED();
}
                              
function cheby(g, ord) {
  NOT_IMPLEMENTED();
}

/* Newton-Raphson-Maehly actually functioned as a decent root finder,
   but there are root sets for which it gets into limit cycles
   (exacerbated by zero suppression) and fails.  We can't afford to
   fail, even if the failure is 1 in 100,000,000, so we now use
   Laguerre and later polish with Newton-Raphson (which can then
   afford to fail) */
var EPSILON = 10e-7;

function Laguerre_With_Deflation(a, ord, r) {
  NOT_IMPLEMENTED();
}

/* for spit-and-polish only */
function Newton_Raphson(a, ord, r) {
  NOT_IMPLEMENTED();
}

/* Convert lpc coefficients to lsp coefficients */
function vorbis_lpc_to_lsp(lpc, lsp, m) {
  NOT_IMPLEMENTED();
}
