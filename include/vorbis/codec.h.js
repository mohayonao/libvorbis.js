function vorbis_info(p) {
  p = p||{};
  
  // int version;
  // int channels;
  // long rate;
  
  // /* The below bitrate declarations are *hints*.
  //    Combinations of the three values carry the following implications:
  
  //    all three set to the same value:
  //      implies a fixed rate bitstream
  //    only nominal set:
  //      implies a VBR stream that averages the nominal bitrate.  No hard
  //      upper/lower limit
  //    upper and or lower set:
  //      implies a VBR bitstream that obeys the bitrate limits. nominal
  //      may also be set to give a nominal rate.
  //    none set:
  //      the coder does not care to speculate.
  // */
  
  // long bitrate_upper;
  // long bitrate_nominal;
  // long bitrate_lower;
  // long bitrate_window;
  
  // void *codec_setup;
  
  p.version = 0;
  p.channels = 0;
  p.rate = 0;
  p.bitrate_upper = 0;
  p.bitrate_nominal = 0;
  p.bitrate_lower = 0;
  p.bitrate_window = 0;
  p.codec_setup = null;
  p.__name = "vorbis_info";
  
  return p;
}


/* vorbis_dsp_state buffers the current vorbis audio
   analysis/synthesis state.  The DSP state belongs to a specific
   logical bitstream ****************************************************/
function vorbis_dsp_state(p) {
  p = p||{};
  
  // int analysisp;
  // vorbis_info *vi;
  
  // float **pcm;
  // float **pcmret;
  // int      pcm_storage;
  // int      pcm_current;
  // int      pcm_returned;
  
  // int  preextrapolate;
  // int  eofflag;
  
  // long lW;
  // long W;
  // long nW;
  // long centerW;
  
  // ogg_int64_t granulepos;
  // ogg_int64_t sequence;
  
  // ogg_int64_t glue_bits;
  // ogg_int64_t time_bits;
  // ogg_int64_t floor_bits;
  // ogg_int64_t res_bits;
  
  // void       *backend_state;
  
  p.analysisp = 0;
  p.vi = null;
  p.pcm = null;
  p.pcmret = null;
  p.pcm_storage = 0;
  p.pcm_current = 0;
  p.pcm_returned = 0;
  p.preextrapolate = 0;
  p.eofflag = 0;
  p.lW = 0;
  p.W = 0;
  p.nW = 0;
  p.centerW = 0;
  p.granulepos = 0;
  p.sequence = 0;
  p.glue_bits = 0;
  p.time_bits = 0;
  p.floor_bits = 0;
  p.res_bits = 0;
  p.backend_state = null;
  p.__name = "vorbis_dsp_state";
  
  return p;
}


function vorbis_block(p) {
  p = p||{};
  
  // /* necessary stream state for linking to the framing abstraction */
  // float  **pcm;       /* this is a pointer into local storage */
  // oggpack_buffer opb;
  
  // long  lW;
  // long  W;
  // long  nW;
  // int   pcmend;
  // int   mode;
  
  // int         eofflag;
  // ogg_int64_t granulepos;
  // ogg_int64_t sequence;
  // vorbis_dsp_state *vd; /* For read-only access of configuration */
  
  // /* local storage to avoid remallocing; it's up to the mapping to
  //    structure it */
  // void               *localstore;
  // long                localtop;
  // long                localalloc;
  // long                totaluse;
  // struct alloc_chain *reap;
  
  // /* bitmetrics for the frame */
  // long glue_bits;
  // long time_bits;
  // long floor_bits;
  // long res_bits;
  
  // void *internal;
  
  p.pcm = null;
  p.opb = oggpack_buffer();
  p.lW = 0;
  p.W = 0;
  p.nW = 0;
  p.pcmend = 0;
  p.mode = 0;
  p.eofflag = 0;
  p.granulepos = 0;
  p.sequence = 0;
  p.vd = null;
  p.localstore= null;
  p.localtop = 0;
  p.localalloc = 0;
  p.totaluse = 0;
  p.reap = null;
  p.glue_bits = 0;
  p.time_bits = 0;
  p.floor_bits = 0;
  p.res_bits = 0;
  p.internal = null;
  p.__name = "vorbis_block";
  
  return p;
}


/* vorbis_block is a single block of data to be processed as part of
   the analysis/synthesis stream; it belongs to a specific logical
   bitstream, but is independent from other vorbis_blocks belonging to
   that logical bitstream. *************************************************/

function struct_alloc_chain(p) {
  p = p||{};
  
  // void *ptr;
  // struct alloc_chain *next;

  p.ptr = null;
  p.next = null;
  p.__name = "struct_alloc_chain";
  
  return p;
}


/* vorbis_info contains all the setup information specific to the
   specific compression/decompression mode in progress (eg,
   psychoacoustic settings, channel setup, options, codebook
   etc). vorbis_info and substructures are in backends.h.
*********************************************************************/

/* the comments are not part of vorbis_info so that vorbis_info can be
   static storage */
function vorbis_comment(p) {
  p = p||{};
  
  // /* unlimited user comment fields.  libvorbis writes 'libvorbis'
  //    whatever vendor is set to in encode */
  // char **user_comments;
  // int   *comment_lengths;
  // int    comments;
  // char  *vendor;
  
  p.user_comments = null;
  p.comment_lengths = null;
  p.comments = 0;
  p.vendor = "";
  p.__name = "vorbis_comment";
  
  return p;
}


/* libvorbis encodes in two abstraction layers; first we perform DSP
   and produce a packet (see docs/analysis.txt).  The packet is then
   coded into a framed OggSquish bitstream by the second layer (see
   docs/framing.txt).  Decode is the reverse process; we sync/frame
   the bitstream and extract individual packets, then decode the
   packet back into PCM audio.

   The extra framing/packetizing is used in streaming formats, such as
   files.  Over the net (such as with UDP), the framing and
   packetization aren't necessary as they're provided by the transport
   and the streaming layer is not used */


/* Vorbis ERRORS and return codes ***********************************/

var OV_FALSE      = -1;
var OV_EOF        = -2;
var OV_HOLE       = -3;

var OV_EREAD      = -128;
var OV_EFAULT     = -129;
var OV_EIMPL      = -130;
var OV_EINVAL     = -131;
var OV_ENOTVORBIS = -132;
var OV_EBADHEADER = -133;
var OV_EVERSION   = -134;
var OV_ENOTAUDIO  = -135;
var OV_EBADPACKET = -136;
var OV_EBADLINK   = -137;
var OV_ENOSEEK    = -138;
