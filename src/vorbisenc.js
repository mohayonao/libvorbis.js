/* careful with this; it's using static array sizing to make managing
   all the modes a little less annoying.  If we use a residue backend
   with > 12 partition types, or a different division of iteration,
   this needs to be updated. */
function static_bookblock(p) {
  p = p||{};
  
  // const static_codebook *books[12][4];
  
  p.books = calloc([12,4], []);
  p.__name = "static_bookblock";
  
  return p;
}

function vorbis_residue_template(p) {
  p = p||{};
  
  // int res_type;
  // int limit_type; /* 0 lowpass limited, 1 point stereo limited */
  // int grouping;
  // const vorbis_info_residue0 *res;
  // const static_codebook  *book_aux;
  // const static_codebook  *book_aux_managed;
  // const static_bookblock *books_base;
  // const static_bookblock *books_base_managed;
  
  p.res_type = 0;
  p.limit_type = 0;
  p.grouping = 0;
  p.res = null;
  p.book_aux = null;
  p.book_aux_managed = null;
  p.books_base = null;
  p.books_base_managed = null;
  p.__name = "vorbis_residue_template";
  
  return p;
}

function vorbis_mapping_template(p) {
  p = p||{};
  
  // const vorbis_info_mapping0    *map;
  // const vorbis_residue_template *res;
  
  p.map = null;
  p.res = null;
  p.__name = "vorbis_mapping_template";
  
  return p;
}

function vp_adjblock(p) {
  p = p||{};
  
  // int block[P_BANDS];
  
  p.block = calloc(P_BANDS, int16);
  p.__name = "vp_adjblock";
  
  return p;
}

function compandblock(p) {
  p = p||{};
  
  // int data[NOISE_COMPAND_LEVELS];
  
  p.data = calloc(NOISE_COMPAND_LEVELS, int16);
  p.__name = "compandblock";
  
  return p;
}

/* high level configuration information for setting things up
   step-by-step with the detailed vorbis_encode_ctl interface.
   There's a fair amount of redundancy such that interactive setup
   does not directly deal with any vorbis_info or codec_setup_info
   initialization; it's all stored (until full init) in this highlevel
   setup, then flushed out to the real codec setup structs later. */

function att3(p) {
  p = p||{};
  
  // int att[P_NOISECURVES];
  // float boost;
  // float decay;
  
  p.att = calloc(P_NOISECURVES, int16);
  p.boost = 0;
  p.decay = 0;
  p.__name = "att3";
  
  return p;
}

function adj_stereo(p) {
  p = p||{};
  
  // int   pre[PACKETBLOBS];
  // int   post[PACKETBLOBS];
  // float kHz[PACKETBLOBS];
  // float lowpasskHz[PACKETBLOBS];
  
  p.pre = calloc(PACKETBLOBS, int16);
  p.post = calloc(PACKETBLOBS, int16);
  p.kHz = calloc(PACKETBLOBS, float32);
  p.lowpasskHz = calloc(PACKETBLOBS, float32);
  p.__name = "adj_stereo";
  
  return p;
}

function noiseguard(p){
  p = p||{};
  
  // int lo;
  // int hi;
  // int fixed;
  
  p.lo = 0;
  p.hi = 0;
  p.fixed = 0;
  p.__name = "noiseguard";
  
  return p;
}

function noise3(p) {
  p = p||{};
  
  // int data[P_NOISECURVES][17];
  
  p.data = calloc([P_NOISECURVES, 17], int16);
  p.__name = "noise3";
  
  return p;
}

function ve_setup_data_template(p) {
  p = p||{};
  
  // int      mappings;
  // const double  *rate_mapping;
  // const double  *quality_mapping;
  // int      coupling_restriction;
  // long     samplerate_min_restriction;
  // long     samplerate_max_restriction;


  // const int     *blocksize_short;
  // const int     *blocksize_long;

  // const att3    *psy_tone_masteratt;
  // const int     *psy_tone_0dB;
  // const int     *psy_tone_dBsuppress;

  // const vp_adjblock *psy_tone_adj_impulse;
  // const vp_adjblock *psy_tone_adj_long;
  // const vp_adjblock *psy_tone_adj_other;

  // const noiseguard  *psy_noiseguards;
  // const noise3      *psy_noise_bias_impulse;
  // const noise3      *psy_noise_bias_padding;
  // const noise3      *psy_noise_bias_trans;
  // const noise3      *psy_noise_bias_long;
  // const int         *psy_noise_dBsuppress;

  // const compandblock  *psy_noise_compand;
  // const double        *psy_noise_compand_short_mapping;
  // const double        *psy_noise_compand_long_mapping;

  // const int      *psy_noise_normal_start[2];
  // const int      *psy_noise_normal_partition[2];
  // const double   *psy_noise_normal_thresh;

  // const int      *psy_ath_float;
  // const int      *psy_ath_abs;

  // const double   *psy_lowpass;

  // const vorbis_info_psy_global *global_params;
  // const double     *global_mapping;
  // const adj_stereo *stereo_modes;

  // const static_codebook *const *const *const floor_books;
  // const vorbis_info_floor1 *floor_params;
  // const int floor_mappings;
  // const int **floor_mapping_list;

  // const vorbis_mapping_template *maps;
  
  p.mappings = 0;
  p.rate_mapping = null;
  p.quality_mapping = null;
  p.coupling_restriction = 0;
  p.samplerate_min_restriction = 0;
  p.samplerate_max_restriction = 0;
  p.blocksize_short = null;
  p.blocksize_long = null;
  p.psy_tone_masteratt = null;
  p.psy_tone_0dB = null;
  p.psy_tone_dBsuppress = null;
  p.psy_tone_adj_impulse = null;
  p.psy_tone_adj_long = null;
  p.psy_tone_adj_other = null;
  p.psy_noiseguards = null;
  p.psy_noise_bias_impulse = null;
  p.psy_noise_bias_padding = null;
  p.psy_noise_bias_trans = null;
  p.psy_noise_bias_long = null;
  p.psy_noise_dBsuppress = null;
  p.psy_noise_compand = null;
  p.psy_noise_compand_short_mapping = null;
  p.psy_noise_compand_long_mapping = null;
  p.psy_noise_normal_start = [ null, null ];
  p.psy_noise_normal_partition = [ null, null ];
  p.psy_noise_normal_thresh = null;
  p.psy_ath_float = null;
  p.psy_ath_abs = null;
  p.psy_lowpass = null;
  p.global_params = null;
  p.global_mapping = null;
  p.stereo_modes = null;
  p.floor_books = null;
  p.floor_params = null;
  p.floor_mappings = 0;
  p.floor_mapping_list = null;
  p.maps = null;
  p.__name = "ve_setup_data_template";
  
  return p;
}

/* a few static coder conventions */
// static const vorbis_info_mode _mode_template[2]={
//   {0,0,0,0},
//   {1,0,0,1}
// };
var _mode_template = [
  vorbis_info_mode(),
  vorbis_info_mode()
];
set_kv(_mode_template[1], {
  blockflag: 1,
  mapping  : 1
});

// static const vorbis_info_mapping0 _map_nominal[2]={
//   {1, {0,0}, {0}, {0}, 1,{0},{1}},
//   {1, {0,0}, {1}, {1}, 1,{0},{1}}
// };
var _map_nominal = [
  vorbis_info_mapping0(),
  vorbis_info_mapping0()
];
set_kv(_map_nominal[0], {
  submaps: 1,
  coupling_steps: 1,
  coupling_ang: {$:[1]}
});
set_kv(_map_nominal[1], {
  submaps: 1,
  floorsubmap: {$:[1]},
  residuesubmap: {$:[1]},
  coupling_steps: 1,
  coupling_ang: {$:[1]}
});

// #include "modes/setup_44.h"
// #include "modes/setup_44u.h"
// #include "modes/setup_44p51.h"
// #include "modes/setup_32.h"
// #include "modes/setup_8.h"
// #include "modes/setup_11.h"
// #include "modes/setup_16.h"
// #include "modes/setup_22.h"
// #include "modes/setup_X.h"

// static const ve_setup_data_template *const setup_list[]={
//   &ve_setup_44_stereo,
//   &ve_setup_44_51,
//   &ve_setup_44_uncoupled,

//   &ve_setup_32_stereo,
//   &ve_setup_32_uncoupled,

//   &ve_setup_22_stereo,
//   &ve_setup_22_uncoupled,
//   &ve_setup_16_stereo,
//   &ve_setup_16_uncoupled,

//   &ve_setup_11_stereo,
//   &ve_setup_11_uncoupled,
//   &ve_setup_8_stereo,
//   &ve_setup_8_uncoupled,

//   &ve_setup_X_stereo,
//   &ve_setup_X_uncoupled,
//   &ve_setup_XX_stereo,
//   &ve_setup_XX_uncoupled,
//   0
// };

var setup_list = []; // TODO:


function vorbis_encode_floor_setup(vi, s, books, _in, x) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_global_psych_setup(vi, s, _in, x) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_global_stereo(vi, hi, p) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_psyset_setup(vi, s, nn_start, nn_partition, nn_thresh, block) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_tonemask_setup(vi, s, block, att, max, _in) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_compand_setup(vi, s, block, _in, x) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_peak_setup(vi, s, block, suppress) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_noisebias_setup(vi, s, block, suppress, _in, guard, userbias) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_ath_setup(vi, block) {
  NOT_IMPLEMENTED();
}

function book_dup_or_new(ci, book) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_blocksize_setup(vi, s,shortb, longb) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_residue_setup(vi, number, block, res) {
  NOT_IMPLEMENTED();
}

/* we assume two maps in this encoder */
function vorbis_encode_map_n_res_setup(vi, s, maps) {
  NOT_IMPLEMENTED();
}

function setting_to_approx_bitrate(vi) {
  NOT_IMPLEMENTED();
}

function get_setup_template(ch, srate, req, q_or_bitrate, base_setting) {
  NOT_IMPLEMENTED();
}

/* encoders will need to use vorbis_info_init beforehand and call
   vorbis_info clear when all done */

/* two interfaces; this, more detailed one, and later a convenience
   layer on top */

/* the final setup call */
function vorbis_encode_setup_init(vi) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_setup_setting(vi, channels, rate) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_setup_vbr(vi, channels, rate, quality) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_init_vbr(vi, channels, rate, base_quality /* 0. to 1. */) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_setup_managed(vi, channels, rate, max_bitrate, nominal_bitrate, min_bitrate) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_init(vi, channels, rate, max_bitrate, nominal_bitrate, min_bitrate) {
  NOT_IMPLEMENTED();
}

function vorbis_encode_ctl(vi, number, arg) {
  NOT_IMPLEMENTED();
}
