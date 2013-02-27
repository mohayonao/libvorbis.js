function vorbis_synthesis(vb, op) {
  assert.instanceOf(vb, "vorbis_block");
  assert.instanceOf(op, "ogg_packet");
  
  var vd= vb ? vb.vd : 0;
  var b= vd ? vd.backend_state : 0;
  var vi= vd ? vd.vi : 0;
  var ci= vi ? vi.codec_setup : 0;
  var opb=vb ? vb.opb : 0;
  var type,mode,i;

  if (!vd || !b || !vi || !ci || !opb) {
    return OV_EBADPACKET;
  }

  assert.instanceOf(vd , "vorbis_dsp_state");
  assert.instanceOf(b  , "private_state");
  assert.instanceOf(vi , "vorbis_info");
  assert.instanceOf(ci , "codec_setup_info");
  assert.instanceOf(opb, "oggpack_buffer");
  
  /* first things first.  Make sure decode is ready */
  _vorbis_block_ripcord(vb);
  oggpack_readinit(opb,op.packet,op.bytes);
  
  /* Check the packet type */
  if(oggpack_read(opb,1)!==0){
    /* Oops.  This is not an audio data packet */
    return(OV_ENOTAUDIO);
  }
  
  /* read our mode and pre/post windowsize */
  mode=oggpack_read(opb,b.modebits);
  if(mode===-1){
    return(OV_EBADPACKET);
  }
  
  vb.mode=mode;
  if(!ci.mode_param[mode]){
    return(OV_EBADPACKET);
  }
  
  vb.W=ci.mode_param[mode].blockflag;
  if(vb.W){
    /* this doesn;t get mapped through mode selection as it's used
       only for window selection */
    vb.lW=oggpack_read(opb,1);
    vb.nW=oggpack_read(opb,1);
    if(vb.nW===-1){
      return(OV_EBADPACKET);
    }
  }else{
    vb.lW=0;
    vb.nW=0;
  }
  
  /* more setup */
  vb.granulepos=op.granulepos;
  vb.sequence=op.packetno;
  vb.eofflag=op.e_o_s;
  
  /* alloc pcm passback storage */
  vb.pcmend=ci.blocksizes[vb.W];
  // vb.pcm=_vorbis_block_alloc(vb,sizeof(*vb.pcm)*vi.channels);
  // for(i=0;i<vi.channels;i++)
  //   vb.pcm[i]=_vorbis_block_alloc(vb,vb.pcmend*sizeof(*vb.pcm[i]));
  vb.pcm=calloc(vi.channels,[]);
  for(i=0;i<vi.channels;i++)
    vb.pcm[i]=_vorbis_block_alloc(vb,vb.pcmend,float32);
  
  /* unpack_header enforces range checking */
  type=ci.map_type[ci.mode_param[mode].mapping];
  
  return(_mapping_P[type].inverse(vb,ci.map_param[ci.mode_param[mode].mapping]));
}

/* used to track pcm position without actually performing decode.
   Useful for sequential 'fast forward' */
function vorbis_synthesis_trackonly(vb, op) {
  NOT_IMPLEMENTED();
}

function vorbis_packet_blocksize(vi, op) {
  NOT_IMPLEMENTED();
}

function vorbis_synthesis_halfrate(vi, flag) {
  NOT_IMPLEMENTED();
}

function vorbis_synthesis_halfrate_p(vi) {
  NOT_IMPLEMENTED();
}
