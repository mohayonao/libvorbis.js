var NEGINF = -9999;

var stereo_threshholds = new Float32Array([
  0.0, 0.5, 1.0, 1.5, 2.5, 4.5, 8.5, 16.5, 9e10
]);
var stereo_threshholds_limited = new Float32Array([
  0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 4.5, 8.5, 9e10
]);

function _vp_global_look(vi) {
  NOT_IMPLEMENTED();
}

function _vp_global_free(look) {
  NOT_IMPLEMENTED();
}

function _vi_gpsy_free(i) {
  NOT_IMPLEMENTED();
}

function _vi_psy_free(i) {
  NOT_IMPLEMENTED();
}

function min_curve(c, c2) {
  NOT_IMPLEMENTED();
}
                      
function max_curve(c, c2) {
  NOT_IMPLEMENTED();
}

function attenuate_curve(c, att) {
  NOT_IMPLEMENTED();
}

function setup_tone_curves(curveatt_dB, binHz, n, center_boost, center_decay_rate) {
  NOT_IMPLEMENTED();
}

function _vp_psy_init(p, vi, gi, n, rate) {
  NOT_IMPLEMENTED();
}

function _vp_psy_clear(p) {
  NOT_IMPLEMENTED();
}

/* octave/(8*eighth_octave_lines) x scale and dB y scale */
function seed_curve(seed, curves, amp, oc, n, linesper, dBoffset) {
  NOT_IMPLEMENTED();
}

function seed_loop(p, curves, f, flr, seed, specmax) {
  NOT_IMPLEMENTED();
}

function seed_chase(seeds, linesper, n) {
  NOT_IMPLEMENTED();
}

/* bleaugh, this is more complicated than it needs to be */
function max_seeds(p, seed, flr) {
  NOT_IMPLEMENTED();
}

function bark_noise_hybridmp(n, b, f, noise, offset, fixed) {
  NOT_IMPLEMENTED();
}

function _vp_noisemask(p, logmdct, logmask) {
  NOT_IMPLEMENTED();
}

function _vp_tonemask(p, logfft, logmask, global_specmax, local_specmax) {
  NOT_IMPLEMENTED();
}

function _vp_offset_and_mix(p, noise, tone, offset_select, logmask, mdct, logmdct) {
  NOT_IMPLEMENTED();
}

function _vp_ampmax_decay(amp, vd) {
  NOT_IMPLEMENTED();
}

function flag_lossless(limit, prepoint, postpoint, mdct, floor, flag, i, jn) {
  NOT_IMPLEMENTED();
}

/* Overload/Side effect: On input, the *q vector holds either the
   quantized energy (for elements with the flag set) or the absolute
   values of the *r vector (for elements with flag unset).  On output,
   *q holds the quantized energy for all elements */
function noise_normalize(p, limit, r,  q, f, flags, acc, i, n, out) {
  NOT_IMPLEMENTED();
}

/* Noise normalization, quantization and coupling are not wholly
   seperable processes in depth>1 coupling. */
function _vp_couple_quantize_normalize(blobno, g, p, vi, mdct, iwork, nonzero, sliding_lowpass, ch) {
  NOT_IMPLEMENTED();
}
