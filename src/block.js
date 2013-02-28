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

function vorbis_block_init(v, vb) {
  assert.instanceOf(v , "vorbis_dsp_state");
  assert.instanceOf(vb, "vorbis_block");
  
  var i,vbi;
  vorbis_block(vb);
  vb.vd=v;
  vb.localalloc=0;
  vb.localstore=NULL;
  if(v.analysisp){
    vbi=vb.internal=vorbis_block_internal();
    vbi.ampmax=-9999;
    
    for(i=0;i<PACKETBLOBS;i++){
      if(i===PACKETBLOBS>>1){
        vbi.packetblob[i]=vb.opb;
      }else{
        vbi.packetblob[i]=oggpack_buffer();
      }
      oggpack_writeinit(vbi.packetblob[i]);
    }
  }
  return(0);
}

function _vorbis_block_alloc(vb, size, type) {
  assert.instanceOf(vb, "vorbis_block");
  
  return calloc(size, type);

  // var ret,link;
  // if(size+vb.localtop>vb.localalloc){
  //   /* can't just _ogg_realloc... there are outstanding pointers */
  //   if(vb.localstore){
  //     link=struct_alloc_chain();
  //     vb.totaluse+=vb.localtop;
  //     link.next=vb.reap;
  //     link.ptr=vb.localstore;
  //     vb.reap=link;
  //   }
  //   /* highly conservative */
  //   vb.localalloc=size;
  //   vb.localstore=calloc(vb.localalloc,type);
  //   vb.localtop=0;
  // }
  // {
  //   ret=pointer(vb.localstore,vb.localtop);
  //   vb.localtop+=size;
  //   return ret;
  // }
}

/* reap the chain, pull the ripcord */
function _vorbis_block_ripcord(vb) {
  assert.instanceOf(vb, "vorbis_block");
  
  /* reap the chain */
  var reap=vb.reap;
  var next;
  while(reap){
    next=reap.next;
    struct_alloc_chain(reap);
    reap=next;
  }
  /* consolidate storage */
  if(vb.totaluse){
    vb.localstore=realloc(vb.localstore,vb.totaluse+vb.localalloc);
    vb.localalloc+=vb.totaluse;
    vb.totaluse=0;
  }
  
  /* pull the ripcord */
  vb.localtop=0;
  vb.reap=NULL;
}

function vorbis_block_clear(vb) {
  NOT_IMPLEMENTED();
}

/* Analysis side code, but directly related to blocking.  Thus it's
   here and not in analysis.c (which is for analysis transforms only).
   The init is here because some of it is shared */
function _vds_shared_init(v, vi, encp) {
  assert.instanceOf(v   , "vorbis_dsp_state");
  assert.instanceOf(vi  , "vorbis_info");
  assert.instanceOf(encp, "int");
  
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
                     ci.blocksizes[ci.psy_param[i].blockflag]>>1,
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
    v.centerW=ci.blocksizes[1]>>1;
    
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
  assert.instanceOf(v, "vorbis_dsp_state");
  
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
  assert.instanceOf(v, "vorbis_dsp_state");
  
  var vi=v.vi;
  var ci;
  var hs;
  
  if(!v.backend_state)return -1;
  if(!vi)return -1;
  ci=vi.codec_setup;
  if(!ci)return -1;
  hs=ci.halfrate_flag;
  
  assert.instanceOf(vi, "vorbis_info");
  assert.instanceOf(ci, "codec_setup_info");
  
  v.centerW=ci.blocksizes[1]>>(hs+1);
  v.pcm_current=v.centerW>>hs;
  
  v.pcm_returned=-1;
  v.granulepos=-1;
  v.sequence=-1;
  v.eofflag=0;
  v.backend_state.sample_count=-1;
  
  return(0);
}

function vorbis_synthesis_init(v, vi) {
  assert.instanceOf(v, "vorbis_dsp_state");
  assert.instanceOf(vi, "vorbis_info");
  
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
  assert.instanceOf(v, "vorbis_dsp_state");
  assert.instanceOf(vb, "vorbis_block");
  
  var vi=v.vi;
  var ci=vi.codec_setup;
  var b=v.backend_state;
  var hs=ci.halfrate_flag;
  var i,j,n,n0,n1,thisCenter,prevCenter,w,pcm,p,extra;
  
  if(!vb)return(OV_EINVAL);
  if(v.pcm_current>v.pcm_returned  && v.pcm_returned!==-1)return(OV_EINVAL);

  assert.instanceOf(vi, "vorbis_info");
  assert.instanceOf(ci, "codec_setup_info");
  assert.instanceOf(b, "private_state");
  assert.instanceOf(hs, "int");

  v.lW=v.W;
  v.W=vb.W;
  v.nW=-1;

  if((v.sequence===-1)||
     (v.sequence+1 !== vb.sequence)){
    v.granulepos=-1; /* out of sequence; lose count */
    b.sample_count=-1;
  }

  v.sequence=vb.sequence;

  if(vb.pcm){  /* no pcm to process if vorbis_synthesis_trackonly
                   was called on block */
    n=ci.blocksizes[v.W]>>(hs+1);
    n0=ci.blocksizes[0]>>(hs+1);
    n1=ci.blocksizes[1]>>(hs+1);
    
    v.glue_bits+=vb.glue_bits;
    v.time_bits+=vb.time_bits;
    v.floor_bits+=vb.floor_bits;
    v.res_bits+=vb.res_bits;
    
    if(v.centerW){
      thisCenter=n1;
      prevCenter=0;
    }else{
      thisCenter=0;
      prevCenter=n1;
    }
    
    /* v.pcm is now used like a two-stage double buffer.  We don't want
       to have to constantly shift *or* adjust memory usage.  Don't
       accept a new block until the old is shifted out */

    for(j=0;j<vi.channels;j++){
      /* the overlap/add section */
      if(v.lW){
        if(v.W){
          /* large/large */
          w=_vorbis_window_get(b.window[1]-hs);
          pcm=pointer(v.pcm[j],prevCenter);
          p=vb.pcm[j];
          for(i=0;i<n1;i++)
            pcm[i]=pcm[i]*w[n1-i-1] + p[i]*w[i];
        }else{
          /* large/small */
          w=_vorbis_window_get(b.window[0]-hs);
          pcm=pointer(v.pcm[j],prevCenter+(n1>>1)-(n0>>1));
          p=vb.pcm[j];
          for(i=0;i<n0;i++)
            pcm[i]=pcm[i]*w[n0-i-1] +p[i]*w[i];
        }
      }else{
        if(v.W){
          /* small/large */
          w=_vorbis_window_get(b.window[0]-hs);
          pcm=pointer(v.pcm[j],prevCenter);
          p=pointer(vb.pcm[j],(n1>>1)-(n0>>1));
          for(i=0;i<n0;i++)
            pcm[i]=pcm[i]*w[n0-i-1] +p[i]*w[i];
          for(;i<(n1+n0)>>1;i++)
            pcm[i]=p[i];
        }else{
          /* small/small */
          w=_vorbis_window_get(b.window[0]-hs);
          pcm=pointer(v.pcm[j],prevCenter);
          p=vb.pcm[j];
          for(i=0;i<n0;i++)
            pcm[i]=pcm[i]*w[n0-i-1] +p[i]*w[i];
        }
      }

      /* the copy section */
      {
        pcm=pointer(v.pcm[j],thisCenter);
        p=pointer(vb.pcm[j],n);
        for(i=0;i<n;i++)
          pcm[i]=p[i];
      }
    }
    
    if(v.centerW)
      v.centerW=0;
    else
      v.centerW=n1;
    
    /* deal with initial packet state; we do this using the explicit
       pcm_returned==-1 flag otherwise we're sensitive to first block
       being short or long */
    
    if(v.pcm_returned===-1){
      v.pcm_returned=thisCenter;
      v.pcm_current=thisCenter;
    }else{
      v.pcm_returned=prevCenter;
      v.pcm_current=prevCenter+
        (((ci.blocksizes[v.lW]>>2)+
          (ci.blocksizes[v.W]>>2))>>hs);
    }
  }
  
  /* track the frame number... This is for convenience, but also
     making sure our last packet doesn't end with added padding.  If
     the last packet is partial, the number of samples we'll have to
     return will be past the vb.granulepos.

     This is not foolproof!  It will be confused if we begin
     decoding at the last page after a seek or hole.  In that case,
     we don't have a starting point to judge where the last frame
     is.  For this reason, vorbisfile will always try to make sure
     it reads the last two marked pages in proper sequence */
  
  if(b.sample_count===-1){
    b.sample_count=0;
  }else{
    b.sample_count+=(ci.blocksizes[v.lW]>>2)+(ci.blocksizes[v.W]>>2);
  }

  if(v.granulepos===-1){
    if(vb.granulepos!==-1){ /* only set if we have a position to set to */

      v.granulepos=vb.granulepos;

      /* is this a short page? */
      if(b.sample_count>v.granulepos){
        /* corner case; if this is both the first and last audio page,
           then spec says the end is cut, not beginning */
        extra=b.sample_count-vb.granulepos;

        /* we use ogg_int64_t for granule positions because a
           uint64 isn't universally available.  Unfortunately,
           that means granposes can be 'negative' and result in
           extra being negative */
        if(extra<0)
          extra=0;

        if(vb.eofflag){
          /* trim the end */
          /* no preceding granulepos; assume we started at zero (we'd
             have to in a short single-page stream) */
          /* granulepos could be -1 due to a seek, but that would result
             in a long count, not short count */

          /* Guard against corrupt/malicious frames that set EOP and
             a backdated granpos; don't rewind more samples than we
             actually have */
          if(extra > (v.pcm_current - v.pcm_returned)<<hs)
            extra = (v.pcm_current - v.pcm_returned)<<hs;

          v.pcm_current-=extra>>hs;
        }else{
          /* trim the beginning */
          v.pcm_returned+=extra>>hs;
          if(v.pcm_returned>v.pcm_current)
            v.pcm_returned=v.pcm_current;
        }
      }
    }
  }else{
    v.granulepos+=ci.blocksizes[v.lW]/4+ci.blocksizes[v.W]>>2;
    if(vb.granulepos!==-1 && v.granulepos!==vb.granulepos){

      if(v.granulepos>vb.granulepos){
        extra=v.granulepos-vb.granulepos;

        if(extra)
          if(vb.eofflag){
            /* partial last frame.  Strip the extra samples off */

            /* Guard against corrupt/malicious frames that set EOP and
               a backdated granpos; don't rewind more samples than we
               actually have */
            if(extra > (v.pcm_current - v.pcm_returned)<<hs)
              extra = (v.pcm_current - v.pcm_returned)<<hs;

            /* we use ogg_int64_t for granule positions because a
               uint64 isn't universally available.  Unfortunately,
               that means granposes can be 'negative' and result in
               extra being negative */
            if(extra<0)
              extra=0;

            v.pcm_current-=extra>>hs;
          } /* else {Shouldn't happen *unless* the bitstream is out of
               spec.  Either way, believe the bitstream } */
      } /* else {Shouldn't happen *unless* the bitstream is out of
           spec.  Either way, believe the bitstream } */
      v.granulepos=vb.granulepos;
    }
  }

  /* Update, cleanup */

  if(vb.eofflag)v.eofflag=1;
  return(0);
}

/* pcm==NULL indicates we just want the pending samples, no more */
function vorbis_synthesis_pcmout(v, pcm){
  assert.instanceOf(v, "vorbis_dsp_state");
  assert.instanceOf(pcm, "float***");
  
  var vi=v.vi;
  var i;
  
  assert.instanceOf(vi, "vorbis_info");

  if(v.pcm_returned>-1 && v.pcm_returned<v.pcm_current){
    if(pcm){
      for(i=0;i<vi.channels;i++)
        v.pcmret[i]=pointer(v.pcm[i],v.pcm_returned);
      pcm[0]=v.pcmret;
    }
    return(v.pcm_current-v.pcm_returned);
  }
  return(0);
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
