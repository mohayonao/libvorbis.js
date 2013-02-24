/* psychoacoustic setup ********************************************/
// #define P_BANDS 17      /* 62Hz to 16kHz */
var P_LEVELS      = 8;   /* 30dB to 100dB */
var P_LEVEL_0     = 30;  /* 30 dB */
var P_NOISECURVES = 3;

var NOISE_COMPAND_LEVELS = 40;

function vorbis_info_psy(p) {
  p = p||{};
  
  // int   blockflag;

  // float ath_adjatt;
  // float ath_maxatt;

  // float tone_masteratt[P_NOISECURVES];
  // float tone_centerboost;
  // float tone_decay;
  // float tone_abs_limit;
  // float toneatt[P_BANDS];

  // int noisemaskp;
  // float noisemaxsupp;
  // float noisewindowlo;
  // float noisewindowhi;
  // int   noisewindowlomin;
  // int   noisewindowhimin;
  // int   noisewindowfixed;
  // float noiseoff[P_NOISECURVES][P_BANDS];
  // float noisecompand[NOISE_COMPAND_LEVELS];

  // float max_curve_dB;

  // int normal_p;
  // int normal_start;
  // int normal_partition;
  // double normal_thresh;
  
  p.blockflag = 0;
  p.ath_adjatt = 0;
  p.ath_maxatt = 0;

  p.tone_masteratt = calloc(P_NOISECURVES, float32);
  p.tone_centerboost = 0;
  p.tone_decay = 0;
  p.tone_abs_limit = 0;
  p.toneatt = calloc(P_BANDS, float32);
  p.noisemaskp = 0;
  p.noisemaxsupp = 0;
  p.noisewindowlo = 0;
  p.noisewindowhi = 0;
  p.noisewindowlomin = 0;
  p.noisewindowhimin = 0;
  p.noisewindowfixed = 0;
  p.noiseoff = calloc([P_NOISECURVES, P_BANDS], float32);
  p.noisecompand = calloc(NOISE_COMPAND_LEVELS, float32);
  p.max_curve_dB= 0;
  p.normal_p = 0;
  p.normal_start = 0;
  p.normal_partition = 0;
  p.normal_thresh = 0;
  p.__name = "vorbis_info_psy";
  
  return p;
}

function vorbis_info_psy_global(p) {
  p = p||{};
  
  // int   eighth_octave_lines;

  // /* for block long/short tuning; encode only */
  // float preecho_thresh[VE_BANDS];
  // float postecho_thresh[VE_BANDS];
  // float stretch_penalty;
  // float preecho_minenergy;

  // float ampmax_att_per_sec;

  // /* channel coupling config */
  // int   coupling_pkHz[PACKETBLOBS];
  // int   coupling_pointlimit[2][PACKETBLOBS];
  // int   coupling_prepointamp[PACKETBLOBS];
  // int   coupling_postpointamp[PACKETBLOBS];
  // int   sliding_lowpass[2][PACKETBLOBS];

  p.eighth_octave_lines = 0;
  p.preecho_thresh = calloc(VE_BANDS, float32);
  p.postecho_thresh = calloc(VE_BANDS, float32);
  p.stretch_penalty = 0;
  p.preecho_minenergy = 0;
  p.ampmax_att_per_sec = 0;
  p.coupling_pkHz = calloc(PACKETBLOBS, int16);
  p.coupling_pointlimit = calloc([2,PACKETBLOBS], int16);
  p.coupling_prepointamp = calloc(PACKETBLOBS, int16);
  p.coupling_postpointamp = calloc(PACKETBLOBS, int16);
  p.sliding_lowpass = calloc([2,PACKETBLOBS], int16);
  p.__name = "vorbis_info_psy_global";
  
  return p;
}

function vorbis_look_psy_global(p) {
  p = p||{};
  
  // float ampmax;
  // int   channels;

  // vorbis_info_psy_global *gi;
  // int   coupling_pointlimit[2][P_NOISECURVES];
  
  p.ampmax = 0;
  p.channels = 0;
  p.gi = null;
  p.coupling_pointlimit = calloc([2, P_NOISECURVES], int16);
  p.__name = "vorbis_look_psy_global";
  
  return p;
}

function vorbis_look_psy(p) {
  p = p||{};
  
  // int n;
  // struct vorbis_info_psy *vi;

  // float ***tonecurves;
  // float **noiseoffset;

  // float *ath;
  // long  *octave;             /* in n.ocshift format */
  // long  *bark;

  // long  firstoc;
  // long  shiftoc;
  // int   eighth_octave_lines; /* power of two, please */
  // int   total_octave_lines;
  // long  rate; /* cache it */

  // float m_val; /* Masking compensation value */
  
  p.n = 0;
  p.vi = null;
  p.tonecurves = null;
  p.noiseoffset= null;
  p.ath = null;
  p.octave = null;
  p.bark = null;
  p.firstoc = 0;
  p.shiftoc = 0;
  p.eighth_octave_lines = 0;
  p.total_octave_lines = 0;
  p.rate = 0;
  p.m_val = 0;
  p.__name = "vorbis_look_psy";
  
  return p;
}
