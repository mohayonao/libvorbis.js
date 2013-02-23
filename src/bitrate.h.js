/* encode side bitrate tracking */
function bitrate_manager_state(p) {
  p = p||{};
  
  // int            managed;
  
  // long           avg_reservoir;
  // long           minmax_reservoir;
  // long           avg_bitsper;
  // long           min_bitsper;
  // long           max_bitsper;
  
  // long           short_per_long;
  // double         avgfloat;
  
  // vorbis_block  *vb;
  // int            choice;
  
  p.managed = 0;
  p.avg_reservoir = 0;
  p.minmax_reservoir = 0;
  p.avg_bitsper = 0;
  p.min_bitsper = 0;
  p.max_bitsper = 0;
  p.short_per_long = 0;
  p.avgfloat = 0;
  p.vb = null;
  p.choice = 0;
  
  return p;
}

function bitrate_manager_info(p) {
  p = p||{};
  
  // long           avg_rate;
  // long           min_rate;
  // long           max_rate;
  // long           reservoir_bits;
  // double         reservoir_bias;
  
  // double         slew_damp;
  
  p.avg_rate = 0;
  p.min_rate = 0;
  p.max_rate = 0;
  p.reservoir_bits = 0;
  p.reservoir_bias = 0;
  p.slew_damp = 0;
  
  return p;
}
