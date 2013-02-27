var BLOCKTYPE_IMPULSE    = 0;
var BLOCKTYPE_PADDING    = 1;
var BLOCKTYPE_TRANSITION = 0;
var BLOCKTYPE_LONG       = 1;

var PACKETBLOBS = 15;

function vorbis_block_internal(p) {
  p = p||{};
  
  // float  **pcmdelay;  /* this is a pointer into local storage */
  // float  ampmax;
  // int    blocktype;

  // oggpack_buffer *packetblob[PACKETBLOBS]; /* initialized, must be freed;
  //                                             blob [PACKETBLOBS/2] points to
  //                                             the oggpack_buffer in the
  //                                             main vorbis_block */
  
  p.pcmdelay = null;
  p.ampmax = 0;
  p.blocktype = 0;
  p.packetblob = calloc(PACKETBLOBS, []);
  p.__name = "vorbis_block_internal";
  
  return p;
}

/* mode ************************************************************/
function vorbis_info_mode(p) {
  p = p||{};
  
  // int blockflag;
  // int windowtype;
  // int transformtype;
  // int mapping;
  
  p.blockflag = 0;
  p.windowtype = 0;
  p.transformtype = 0;
  p.mapping = 0;
  p.__name = "vorbis_info_mode";
  
  return p;
}

function private_state(p) {
  p = p||{};
  
  // /* local lookup storage */
  // envelope_lookup        *ve; /* envelope lookup */
  // int                     window[2];
  // vorbis_look_transform **transform[2];    /* block, type */
  // drft_lookup             fft_look[2];

  // int                     modebits;
  // vorbis_look_floor     **flr;
  // vorbis_look_residue   **residue;
  // vorbis_look_psy        *psy;
  // vorbis_look_psy_global *psy_g_look;

  // /* local storage, only used on the encoding side.  This way the
  //    application does not need to worry about freeing some packets'
  //    memory and not others'; packet storage is always tracked.
  //    Cleared next call to a _dsp_ function */
  // unsigned char *header;
  // unsigned char *header1;
  // unsigned char *header2;

  // bitrate_manager_state bms;

  // ogg_int64_t sample_count;

  p.ve = null;
  p.window = calloc(2, int16);
  p.transform = calloc(2, []);
  p.fft_look = calloc(2, drft_lookup);
  p.modebits = 0;
  p.flr = null;
  p.residue = null;
  p.psy = null;
  p.psy_g_look = null;
  p.header = "";
  p.header1 = "";
  p.header2 = "";
  p.bms = bitrate_manager_state();
  p.sample_count = 0;
  p.__name = "private_state";
  
  return p;
}

/* codec_setup_info contains all the setup information specific to the
   specific compression/decompression mode in progress (eg,
   psychoacoustic settings, channel setup, options, codebook
   etc).
*********************************************************************/

function codec_setup_info(p) {
  p = p||{};
  
  // /* Vorbis supports only short and long blocks, but allows the
  //    encoder to choose the sizes */

  // long blocksizes[2];

  // /* modes are the primary means of supporting on-the-fly different
  //    blocksizes, different channel mappings (LR or M/A),
  //    different residue backends, etc.  Each mode consists of a
  //    blocksize flag and a mapping (along with the mapping setup */

  // int        modes;
  // int        maps;
  // int        floors;
  // int        residues;
  // int        books;
  // int        psys;     /* encode only */

  // vorbis_info_mode       *mode_param[64];
  // int                     map_type[64];
  // vorbis_info_mapping    *map_param[64];
  // int                     floor_type[64];
  // vorbis_info_floor      *floor_param[64];
  // int                     residue_type[64];
  // vorbis_info_residue    *residue_param[64];
  // static_codebook        *book_param[256];
  // codebook               *fullbooks;

  // vorbis_info_psy        *psy_param[4]; /* encode only */
  // vorbis_info_psy_global psy_g_param;

  // bitrate_manager_info   bi;
  // highlevel_encode_setup hi; /* used only by vorbisenc.c.  It's a
  //                               highly redundant structure, but
  //                               improves clarity of program flow. */
  // int         halfrate_flag; /* painless downsample for decode */
  
  p.blocksizes = calloc(2, int32);
  p.modes = 0;
  p.maps = 0;
  p.floors = 0;
  p.residues = 0;
  p.books = 0;
  p.psys = 0;
  p.mode_param = calloc(64, []);
  p.map_type = calloc(64, int16);
  p.map_param = calloc(64, []);
  p.floor_type = calloc(64, int16);
  p.floor_param = calloc(64, []);
  p.residue_type = calloc(64, int16);
  p.residue_param = calloc(64, []);
  p.book_param = calloc(256, []);
  p.fullbooks = null;
  p.psy_param = calloc(4, []);
  p.psy_g_param = vorbis_info_psy_global();
  p.bi = bitrate_manager_info();
  p.hi = highlevel_encode_setup();
  p.halfrate_flag = 0;
  p.__name = "codec_setup_info";
  
  return p;
}

function vorbis_look_floor1(p) {
  p = p||{};
  
  // int sorted_index[VIF_POSIT+2];
  // int forward_index[VIF_POSIT+2];
  // int reverse_index[VIF_POSIT+2];

  // int hineighbor[VIF_POSIT];
  // int loneighbor[VIF_POSIT];
  // int posts;

  // int n;
  // int quant_q;
  // vorbis_info_floor1 *vi;

  // long phrasebits;
  // long postbits;
  // long frames;
  
  p.sorted_index = calloc(VIF_POSIT+2, int16);
  p.forward_index = calloc(VIF_POSIT+2, int16);
  p.reverse_index = calloc(VIF_POSIT+2, int16);
  p.hineighbor = calloc(VIF_POSIT, int16);
  p.loneighbor = calloc(VIF_POSIT, int16);
  p.posts = 0;
  p.n = 0;
  p.quant_q = 0;
  p.vi = null;
  p.phrasebits = 0;
  p.postbits = 0;
  p.frames = 0;
  p.__name = "vorbis_look_floor1";
  
  return p;
}
