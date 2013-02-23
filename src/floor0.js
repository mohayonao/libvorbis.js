function vorbis_look_floor0(p) {
  p = p||{};
  
  // int ln;
  // int  m;
  // int **linearmap;
  // int  n[2];

  // vorbis_info_floor0 *vi;

  // long bits;
  // long frames;
  
  p.ln = 0;
  p.m = 0;
  p.linearmap= null;
  p.n = calloc(2, int16);
  p.vi = null;
  p. bits = 0;
  p.frames = 0;
  
  return p;
}

/***********************************************/

function floor0_free_info(i) {
  NOT_IMPLEMENTED();
}

function floor0_free_look(i) {
  NOT_IMPLEMENTED();
}

function floor0_unpack (vi, opb) {
  NOT_IMPLEMENTED();
}

/* initialize Bark scale and normalization lookups.  We could do this
   with static tables, but Vorbis allows a number of possible
   combinations, so it's best to do it computationally.

   The below is authoritative in terms of defining scale mapping.
   Note that the scale depends on the sampling rate as well as the
   linear block and mapping sizes */
function floor0_map_lazy_init(vb, infoX, look) {
  NOT_IMPLEMENTED();
}

function floor0_look(vd, i) {
  NOT_IMPLEMENTED();
}

function floor0_inverse1(vb, i) {
  NOT_IMPLEMENTED();
}

function floor0_inverse2(vb, i, memo, out) {
  NOT_IMPLEMENTED();
}

/* export hooks */
var floor0_exportbundle = vorbis_func_floor();
set_kv(floor0_exportbundle, {
  pack     : null,
  unpack   : floor0_unpack,
  look     : floor0_look,
  free_info: floor0_free_info,
  free_look: floor0_free_look,
  inverse1 : floor0_inverse1,
  inverse2 : floor0_inverse2
});
