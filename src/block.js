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
  var i;
  var ci=vi.codec_setup;
  var b=NULL;
  var hs;
  
  if(ci===NULL) return 1;
  hs=ci.halfrate_flag;
  
  vorbis_dsp_state(v);
  b=v.backend_state=private_state();
  
  v.vi=vi;
  b.modebits=ilog2(ci.modes);
  
  b.transform[0]=calloc(VI_TRANSFORMB,[]);
  b.transform[1]=calloc(VI_TRANSFORMB,[]);
  
  /* MDCT is tranform 0 */
  
  b.transform[0][0]=mdct_lookup();
  b.transform[1][0]=mdct_lookup();
  mdct_init(b.transform[0][0],ci.blocksizes[0]>>hs);
  mdct_init(b.transform[1][0],ci.blocksizes[1]>>hs);
  
  /* Vorbis I uses only window type 0 */
  b.window[0]=ilog2(ci.blocksizes[0])-6;
  b.window[1]=ilog2(ci.blocksizes[1])-6;
  
  abort_books:while(1){
    if(encp){ /* encode/decode differ here */
      
      /* analysis always needs an fft */
      drft_init(b.fft_look[0],ci.blocksizes[0]);
      drft_init(b.fft_look[1],ci.blocksizes[1]);
      
      /* finish the codebooks */
      if(!ci.fullbooks){
        ci.fullbooks=calloc(ci.books,codebook);
        for(i=0;i<ci.books;i++)
          vorbis_book_init_encode(ci.fullbooks[i],ci.book_param[i]);
      }
      
      b.psy=calloc(ci.psys,vorbis_look_psy);
      for(i=0;i<ci.psys;i++){
        _vp_psy_init(b.psy[i],
                     ci.psy_param[i],
                     ci.psy_g_param,
                     ci.blocksizes[ci.psy_param[i].blockflag]/2,
                     vi.rate);
      }
      
      v.analysisp=1;
    }else{
      /* finish the codebooks */
      if(!ci.fullbooks){
        ci.fullbooks=calloc(ci.books,codebook);
        for(i=0;i<ci.books;i++){
          if(ci.book_param[i]===NULL)
            break abort_books;
          if(vorbis_book_init_decode(ci.fullbooks[i],ci.book_param[i]))
            break abort_books;
          /* decode codebooks are now standalone after init */
          vorbis_staticbook_destroy(ci.book_param[i]);
          ci.book_param[i]=NULL;
        }
      }
    }
    
    /* initialize the storage vectors. blocksize[1] is small for encode,
       but the correct size for decode */
    v.pcm_storage=ci.blocksizes[1];
    v.pcm=calloc(vi.channels,[]);
    v.pcmret=calloc(vi.channels,[]);
    {
      for(i=0;i<vi.channels;i++)
        v.pcm[i]=calloc(v.pcm_storage,float32);
    }
    
    /* all 1 (large block) or 0 (small block) */
    /* explicitly set for the sake of clarity */
    v.lW=0; /* previous window size */
    v.W=0;  /* current window size */
    
    /* all vector indexes */
    v.centerW=_int(ci.blocksizes[1]/2);
    
    v.pcm_current=v.centerW;
    
    /* initialize all the backend lookups */
    b.flr=calloc(ci.floors,[]);
    b.residue=calloc(ci.residues,[]);
    
    for(i=0;i<ci.floors;i++)
      b.flr[i]=_floor_P[ci.floor_type[i]].look(v,ci.floor_param[i]);
    
    for(i=0;i<ci.residues;i++)
      b.residue[i]=_residue_P[ci.residue_type[i]].look(v,ci.residue_param[i]);
    
    return 0;
  }
  
  // abort_books:
  for(i=0;i<ci.books;i++){
    if(ci.book_param[i]!==NULL){
      vorbis_staticbook_destroy(ci.book_param[i]);
      ci.book_param[i]=NULL;
    }
  }
  vorbis_dsp_clear(v);
  return -1;
}

/* arbitrary settings and spec-mandated numbers get filled in here */
function vorbis_analysis_init(v, vi) {
  NOT_IMPLEMENTED();
}

function vorbis_dsp_clear(v) {
  if(v){
    vorbis_dsp_state(v);
  }
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
