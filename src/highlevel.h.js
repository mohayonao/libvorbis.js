function highlevel_byblocktype(p) {
  p = p||{};
  
  // double tone_mask_setting;
  // double tone_peaklimit_setting;
  // double noise_bias_setting;
  // double noise_compand_setting;
  
  p.tone_mask_setting = 0;
  p.tone_peaklimit_setting = 0;
  p.noise_bias_setting = 0;
  p.noise_compand_setting = 0;
  
  return p;
}

function highlevel_encode_setup(p) {
  p = p||{};
  
  // int   set_in_stone;
  // const void *setup;
  // double base_setting;

  // double impulse_noisetune;

  // /* bitrate management below all settable */
  // float  req;
  // int    managed;
  // long   bitrate_min;
  // long   bitrate_av;
  // double bitrate_av_damp;
  // long   bitrate_max;
  // long   bitrate_reservoir;
  // double bitrate_reservoir_bias;

  // int impulse_block_p;
  // int noise_normalize_p;
  // int coupling_p;

  // double stereo_point_setting;
  // double lowpass_kHz;
  // int    lowpass_altered;

  // double ath_floating_dB;
  // double ath_absolute_dB;

  // double amplitude_track_dBpersec;
  // double trigger_setting;

  // highlevel_byblocktype block[4]; /* padding, impulse, transition, long */
  
  p.set_in_stone = 0;
  p.setup = null;
  p.base_setting = 0;
  p.impulse_noisetune = 0;
  p.req = 0;
  p.managed = 0;
  p.bitrate_min = 0;
  p.bitrate_av = 0;
  p.bitrate_av_damp = 0;
  p.bitrate_max = 0;
  p.bitrate_reservoir = 0;
  p.bitrate_reservoir_bias = 0;
  p.impulse_block_p = 0;
  p.noise_normalize_p = 0;
  p.coupling_p = 0;
  p.stereo_point_setting = 0;
  p.lowpass_kHz = 0;
  p.lowpass_altered = 0;
  p.ath_floating_dB = 0;
  p.ath_absolute_dB = 0;
  p.amplitude_track_dBpersec = 0;
  p.trigger_setting = 0;
  p.block = calloc(4, highlevel_byblocktype);
  
  return p;
}
