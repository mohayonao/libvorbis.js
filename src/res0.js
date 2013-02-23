function vorbis_look_residue0(p) {
  p = p||{};
  
  //   vorbis_info_residue0 *info;

  //   int         parts;
  //   int         stages;
  //   codebook   *fullbooks;
  //   codebook   *phrasebook;
  //   codebook ***partbooks;

  //   int         partvals;
  //   int       **decodemap;

  //   long      postbits;
  //   long      phrasebits;
  //   long      frames;

  // #if defined(TRAIN_RES) || defined(TRAIN_RESAUX)
  //   int        train_seq;
  //   long      *training_data[8][64];
  //   float      training_max[8][64];
  //   float      training_min[8][64];
  //   float     tmin;
  //   float     tmax;
  //   int       submap;
  // #endif
  
  p.info = null;
  p.parts = 0;
  p.stages = 0;
  p.fullbooks = null;
  p.phrasebook = null;
  p.partbooks = null;
  p.partvals = 0;
  p.decodemap = null;
  p.postbits = 0;
  p.phrasebits = 0;
  p.frames = 0;
  
  return p;
}

function res0_free_info(i) {
  NOT_IMPLEMENTED();
}

function res0_free_look(i) {
  NOT_IMPLEMENTED();
}

function res0_pack(vr, opb){
  NOT_IMPLEMENTED();
}

/* vorbis_info is for range checking */
function res0_unpack(vi, opb) {
  NOT_IMPLEMENTED();
}

function res0_look(vd, vr) {
  NOT_IMPLEMENTED();
}

/* break an abstraction and copy some code for performance purposes */
function local_book_besterror(book, a) {
  NOT_IMPLEMENTED();
}

function _encodepart(opb, vec, n, book, acc) {
  NOT_IMPLEMENTED();
}

function _01class(vb, vl, _in, ch) {
  NOT_IMPLEMENTED();
}

/* designed for stereo or other modes where the partition size is an
   integer multiple of the number of channels encoded in the current
   submap */
function _2class(vb, vl, _in, ch) {
  NOT_IMPLEMENTED();
}

function _01forward(opb, vb, vl, _in, ch, partword, encode, submap) {
  NOT_IMPLEMENTED();
}

/* a truncated packet here just means 'stop working'; it's not an error */
function _01inverse(vb, vl, _in, ch, decodepart) {
  NOT_IMPLEMENTED();
}

function res0_inverse(vb, vl, _in, nonzero, ch) {
  NOT_IMPLEMENTED();
}

function res1_forward(opb, vb, vl, _in, nonzero, ch, partword, submap) {
  NOT_IMPLEMENTED();
}

function res1_class(vb, vl, _in, nonzero, ch) {
  NOT_IMPLEMENTED();
}

function res1_inverse(vb, vl, _in, nonzero, ch) {
  NOT_IMPLEMENTED();
}

function res2_class(vb, vl, _in, nonzero, ch) {
  NOT_IMPLEMENTED();
}

/* res2 is slightly more different; all the channels are interleaved
   into a single vector and encoded. */
function res2_forward(opb, vb, vl, _in, nonzero, ch, partword, submap) {
  NOT_IMPLEMENTED();
}

/* duplicate code here as speed is somewhat more important */
function res2_inverse(vb, vl, _in, nonzero, ch) {
  NOT_IMPLEMENTED();
}

var residue0_exportbundle = vorbis_func_residue();
set_kv(residue0_exportbundle, {
  pack     : null,
  unpack   : res0_unpack,
  look     : res0_look,
  free_info: res0_free_info,
  free_look: res0_free_look,
  klass    : null,
  forward  : null,
  inverse  : res0_inverse
});

var residue1_exportbundle = vorbis_func_residue();
set_kv(residue1_exportbundle, {
  pack: res0_pack,
  unpack: res0_unpack,
  look: res0_look,
  free_info: res0_free_info,
  free_look: res0_free_look,
  klass: res1_class,
  forward: res1_forward,
  inverse: res1_inverse
});

var residue2_exportbundle = vorbis_func_residue();
set_kv(residue2_exportbundle, {
  pack     : res0_pack,
  unpack   : res0_unpack,
  look     : res0_look,
  free_info: res0_free_info,
  free_look: res0_free_look,
  klass    : res2_class,
  forward  : res2_forward,
  inverse  : res2_inverse
});

/* moved from:registry.js (latedef) */
var _residue_P = [
  residue0_exportbundle,
  residue1_exportbundle,
  residue2_exportbundle
];
