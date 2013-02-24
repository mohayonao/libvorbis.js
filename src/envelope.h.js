var VE_PRE    = 16;
var VE_WIN    = 4;
var VE_POST   = 2;
var VE_AMP    = (VE_PRE+VE_POST-1);

var VE_BANDS  = 7;
var VE_NEARDC = 15;

var VE_MINSTRETCH = 2;   /* a bit less than short block */
var VE_MAXSTRETCH = 12;  /* one-third full block */

function envelope_filter_state(p) {
  p = p||{};
  
  // float ampbuf[VE_AMP];
  // int   ampptr;

  // float nearDC[VE_NEARDC];
  // float nearDC_acc;
  // float nearDC_partialacc;
  // int   nearptr;
  
  p.ampbuf = calloc(VE_AMP, float32);
  p.ampptr = 0;
  p.nearDC = calloc(VE_NEARDC, float32);
  p.nearDC_acc = 0;
  p.nearDC_partialacc = 0;
  p.nearptr = 0;
  p.__name = "envelope_filter_state";
  
  return p;
}

function envelope_band(p) {
  p = p||{};
  
  // int begin;
  // int end;
  // float *window;
  // float total;
  
  p.begin = 0;
  p.end = 0;
  p.window = null;
  p.total = 0;
  p.__name = "envelope_band";
  
  return p;
}

function envelope_lookup(p) {
  p = p||{};
  
  // int ch;
  // int winlength;
  // int searchstep;
  // float minenergy;

  // mdct_lookup  mdct;
  // float       *mdct_win;

  // envelope_band          band[VE_BANDS];
  // envelope_filter_state *filter;
  // int   stretch;

  // int                   *mark;

  // long storage;
  // long current;
  // long curmark;
  // long cursor;
  
  p.ch = 0;
  p.winlength = 0;
  p.searchstep = 0;
  p.minenergy = 0;
  p.mdct = mdct_lookup();
  p.mdct_win = null;
  p.band = calloc(VE_BANDS, envelope_band);
  p.filter = null;
  p.stretch = 0;
  p.mark = null;
  p.storage = 0;
  p.current = 0;
  p.curmark = 0;
  p.cursor = 0;
  p.__name = "envelope_lookup";
  
  return p;
}
