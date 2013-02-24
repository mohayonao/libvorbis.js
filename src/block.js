/* pcm accumulator examples (not exhaustive):

 <-------------- lW ---------------->
                   <--------------- W ---------------->
:            .....|.....       _______________         |
:        .'''     |     '''_---      |       |\        |
:.....'''         |_____--- '''......|       | \_______|
:.................|__________________|_______|__|______|
                  |<------ Sl ------>|      > Sr <     |endW
                  |beginSl           |endSl  |  |endSr
                  |beginW            |endlW  |beginSr


                      |< lW >|
                   <--------------- W ---------------->
                  |   |  ..  ______________            |
                  |   | '  `/        |     ---_        |
                  |___.'___/`.       |         ---_____|
                  |_______|__|_______|_________________|
                  |      >|Sl|<      |<------ Sr ----->|endW
                  |       |  |endSl  |beginSr          |endSr
                  |beginW |  |endlW
                  mult[0] |beginSl                     mult[n]

 <-------------- lW ----------------->
                          |<--W-->|
:            ..............  ___  |   |
:        .'''             |`/   \ |   |
:.....'''                 |/`....\|...|
:.........................|___|___|___|
                          |Sl |Sr |endW
                          |   |   |endSr
                          |   |beginSr
                          |   |endSl
                          |beginSl
                          |beginW
*/

/* block abstraction setup *********************************************/
var WORD_ALIGN = 8;

function vorbis_block_init(v, dv) {
  NOT_IMPLEMENTED();
}

function _vorbis_block_alloc(vb, bytes) {
  NOT_IMPLEMENTED();
}

/* reap the chain, pull the ripcord */
function _vorbis_block_ripcord(vb) {
  NOT_IMPLEMENTED();
}

function vorbis_block_clear(vb) {
  NOT_IMPLEMENTED();
}

/* Analysis side code, but directly related to blocking.  Thus it's
   here and not in analysis.c (which is for analysis transforms only).
   The init is here because some of it is shared */
function _vds_shared_init(v, vi, encp) {
  NOT_IMPLEMENTED();
}

/* arbitrary settings and spec-mandated numbers get filled in here */
function vorbis_analysis_init(v, vi) {
  NOT_IMPLEMENTED();
}

function vorbis_dsp_clear(v) {
  NOT_IMPLEMENTED();
}

function vorbis_analysis_buffer(v, vals) {
  NOT_IMPLEMENTED();
}

function _preextrapolate_helper(v) {
  NOT_IMPLEMENTED();
}

/* call with val<=0 to set eof */
function vorbis_analysis_wrote(v, vals) {
  NOT_IMPLEMENTED();
}

/* do the deltas, envelope shaping, pre-echo and determine the size of
   the next block on which to continue analysis */
function vorbis_analysis_blockout(v, vb) {
  NOT_IMPLEMENTED();
}

function vorbis_synthesis_restart(v) {
  NOT_IMPLEMENTED();
}

function vorbis_synthesis_init(v, vi) {
  if(_vds_shared_init(v,vi,0)){
    vorbis_dsp_clear(v);
    return 1;
  }
  vorbis_synthesis_restart(v);
  return 0;
}

/* Unlike in analysis, the window is only partially applied for each
   block.  The time domain envelope is not yet handled at the point of
   calling (as it relies on the previous block). */
function vorbis_synthesis_blockin(v, vb) {
  NOT_IMPLEMENTED();
}

/* pcm==NULL indicates we just want the pending samples, no more */
function vorbis_synthesis_pcmout(v, pcm){
  NOT_IMPLEMENTED();
}

function vorbis_synthesis_read(v, n) {
  NOT_IMPLEMENTED();
}

/* intended for use with a specific vorbisfile feature; we want access
   to the [usually synthetic/postextrapolated] buffer and lapping at
   the end of a decode cycle, specifically, a half-short-block worth.
   This funtion works like pcmout above, except it will also expose
   this implicit buffer data not normally decoded. */
function vorbis_synthesis_lapout(v, pcm) {
  NOT_IMPLEMENTED();
}

function vorbis_window(v, W){
  NOT_IMPLEMENTED();
}
