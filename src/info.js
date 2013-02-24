/* general handling of the header and the vorbis_info structure (and
   substructures) */

var GENERAL_VENDOR_STRING = "Xiph.Org libVorbis 1.3.3";
var ENCODE_VENDOR_STRING  = "Xiph.Org libVorbis I 20120203 (Omnipresent)";

function _v_writestring(o, s, bytes) {
  NOT_IMPLEMENTED();
}

function _v_readstring(o, buf, bytes) {
  buf="";
  while(bytes--){
    buf+=String.fromCharCode(oggpack_read(o,8));
  }
  return(buf);
}

function vorbis_comment_init(vc) {
  vorbis_comment(vc);
}

function vorbis_comment_add(vc, comment) {
  NOT_IMPLEMENTED();
}

function vorbis_comment_add_tag(vc, tag, contents) {
  NOT_IMPLEMENTED();
}

function vorbis_comment_query(vc, tag, count) {
  NOT_IMPLEMENTED();
}

function vorbis_comment_query_count(vc, tag) {
  NOT_IMPLEMENTED();
}

function vorbis_comment_clear(vc) {
  NOT_IMPLEMENTED();
}

/* blocksize 0 is guaranteed to be short, 1 is guaranteed to be long.
   They may be equal, but short will never ge greater than long */
function vorbis_info_blocksize(vi, zo) {
  NOT_IMPLEMENTED();
}

/* used by synthesis, which has a full, alloced vi */
function vorbis_info_init(vi) {
  vorbis_info(vi);
  vi.codec_setup=codec_setup_info();
}

function vorbis_info_clear(vi) {
  vorbis_info(vi);
}

/* Header packing/unpacking ********************************************/

function _vorbis_unpack_info(vi, opb) {
  var ci=vi.codec_setup;
  if(!ci)return(OV_EFAULT);
  
  vi.version=oggpack_read(opb,32);
  if(vi.version!==0)return(OV_EVERSION);
  
  vi.channels=oggpack_read(opb,8);
  vi.rate=oggpack_read(opb,32);
  
  vi.bitrate_upper=oggpack_read(opb,32);
  vi.bitrate_nominal=oggpack_read(opb,32);
  vi.bitrate_lower=oggpack_read(opb,32);
  
  ci.blocksizes[0]=1<<oggpack_read(opb,4);
  ci.blocksizes[1]=1<<oggpack_read(opb,4);

  err_out:while(1){
    if(vi.rate<1)break err_out;
    if(vi.channels<1)break err_out;
    if(ci.blocksizes[0]<64)break err_out;
    if(ci.blocksizes[1]<ci.blocksizes[0])break err_out;
    if(ci.blocksizes[1]>8192)break err_out;

    if(oggpack_read(opb,1)!==1)break err_out; /* EOP check */

    return(0);
  }
  
  // err_out:
  vorbis_info_clear(vi);
  return(OV_EBADHEADER);
}

function _vorbis_unpack_comment(vc, opb) {
  var i, len;
  var vendorlen=oggpack_read(opb,32);
  err_out:while(1){
    if(vendorlen<0)break err_out;
    if(vendorlen>opb.storage-8)break err_out;
    vc.vendor=_v_readstring(opb,vc.vendor,vendorlen);
    i=oggpack_read(opb,32);
    if(i<0)break err_out;
    if(i>((opb.storage-oggpack_bytes(opb))>>2))break err_out;
    vc.comments=i;
    vc.user_comments=calloc(vc.comments+1,[]);
    vc.comment_lengths=calloc(vc.comments+1, int16);
    
    for(i=0;i<vc.comments;i++){
      len=oggpack_read(opb,32);
      if(len<0)break err_out;
      if(len>opb.storage-oggpack_bytes(opb))break err_out;
      vc.comment_lengths[i]=len;
      vc.user_comments[i]=_v_readstring(opb,vc.user_comments[i],len);
    }
    if(oggpack_read(opb,1)!==1)break err_out; /* EOP check */
    
    return(0);
  }
  
  // err_out:
  vorbis_comment_clear(vc);
  return(OV_EBADHEADER);
}

/* all of the real encoding details are here.  The modes, books,
   everything */
function _vorbis_unpack_books(vi, opb) {
  var ci=vi.codec_setup;
  var i,times,test;
  if(!ci)return(OV_EFAULT);
  
  err_out:while(1){
    /* codebooks */
    ci.books=oggpack_read(opb,8)+1;
    if(ci.books<=0)break err_out;
    for(i=0;i<ci.books;i++){
      ci.book_param[i]=vorbis_staticbook_unpack(opb);
      if(!ci.book_param[i])break err_out;
    }

    /* time backend settings; hooks are unused */
    {
      times=oggpack_read(opb,6)+1;
      if(times<=0)break err_out;
      for(i=0;i<times;i++){
        test=oggpack_read(opb,16);
        if(test<0 || test>=VI_TIMEB)break err_out;
      }
    }

    /* floor backend settings */
    ci.floors=oggpack_read(opb,6)+1;
    if(ci.floors<=0)break err_out;
    for(i=0;i<ci.floors;i++){
      ci.floor_type[i]=oggpack_read(opb,16);
      if(ci.floor_type[i]<0 || ci.floor_type[i]>=VI_FLOORB)break err_out;
      ci.floor_param[i]=_floor_P[ci.floor_type[i]].unpack(vi,opb);
      if(!ci.floor_param[i])break err_out;
    }

    /* residue backend settings */
    ci.residues=oggpack_read(opb,6)+1;
    if(ci.residues<=0)break err_out;
    for(i=0;i<ci.residues;i++){
      ci.residue_type[i]=oggpack_read(opb,16);
      if(ci.residue_type[i]<0 || ci.residue_type[i]>=VI_RESB)break err_out;
      ci.residue_param[i]=_residue_P[ci.residue_type[i]].unpack(vi,opb);
      if(!ci.residue_param[i])break err_out;
    }

    /* map backend settings */
    ci.maps=oggpack_read(opb,6)+1;
    if(ci.maps<=0)break err_out;
    for(i=0;i<ci.maps;i++){
      ci.map_type[i]=oggpack_read(opb,16);
      if(ci.map_type[i]<0 || ci.map_type[i]>=VI_MAPB)break err_out;
      ci.map_param[i]=_mapping_P[ci.map_type[i]].unpack(vi,opb);
      if(!ci.map_param[i])break err_out;
    }

    /* mode settings */
    ci.modes=oggpack_read(opb,6)+1;
    if(ci.modes<=0)break err_out;
    for(i=0;i<ci.modes;i++){
      ci.mode_param[i]=vorbis_info_mode();
      ci.mode_param[i].blockflag=oggpack_read(opb,1);
      ci.mode_param[i].windowtype=oggpack_read(opb,16);
      ci.mode_param[i].transformtype=oggpack_read(opb,16);
      ci.mode_param[i].mapping=oggpack_read(opb,8);
      
      if(ci.mode_param[i].windowtype>=VI_WINDOWB)break err_out;
      if(ci.mode_param[i].transformtype>=VI_WINDOWB)break err_out;
      if(ci.mode_param[i].mapping>=ci.maps)break err_out;
      if(ci.mode_param[i].mapping<0)break err_out;
    }

    if(oggpack_read(opb,1)!==1)break err_out; /* top level EOP check */
    
    return(0);
  }
  
  // err_out:
  vorbis_info_clear(vi);
  return(OV_EBADHEADER);
}

/* Is this packet a vorbis ID header? */
function vorbis_synthesis_idheader(op) {
  NOT_IMPLEMENTED();
}

/* The Vorbis header is in three packets; the initial small packet in
   the first page that identifies basic parameters, a second packet
   with bitstream comments and a third packet that holds the
   codebook. */
function vorbis_synthesis_headerin(vi, vc, op) {
  var opb = oggpack_buffer();
  var buffer, packtype;
  
  if(op){
    oggpack_readinit(opb,op.packet,op.bytes);
    
    /* Which of the three types of header is this? */
    /* Also verify header-ness, vorbis */
    {
      packtype=oggpack_read(opb,8);
      buffer=_v_readstring(opb,buffer,6);
      if(buffer!=="vorbis"){
        /* not a vorbis header */
        return(OV_ENOTVORBIS);
      }
      switch(packtype){
      case 0x01: /* least significant *bit* is read first */
        if(!op.b_o_s){
          /* Not the initial packet */
          return(OV_EBADHEADER);
        }
        if(vi.rate!==0){
          /* previously initialized info header */
          return(OV_EBADHEADER);
        }
        
        return(_vorbis_unpack_info(vi,opb));
        
      case 0x03: /* least significant *bit* is read first */
        if(vi.rate===0){
          /* um... we didn't get the initial header */
          return(OV_EBADHEADER);
        }
        
        return(_vorbis_unpack_comment(vc,opb));
        
      case 0x05: /* least significant *bit* is read first */
        if(vi.rate===0 || vc.vendor===NULL){
          /* um... we didn;t get the initial header or comments yet */
          return(OV_EBADHEADER);
        }
        
        return(_vorbis_unpack_books(vi,opb));
        
      default:
        /* Not a valid vorbis header type */
        return(OV_EBADHEADER);
      }
    }
  }
  return(OV_EBADHEADER);
}

/* pack side **********************************************************/

function _vorbis_pack_info(opb, vi) {
  NOT_IMPLEMENTED();
}

function _vorbis_pack_comment(opb, vc) {
  NOT_IMPLEMENTED();
}

function _vorbis_pack_books(opb, vi) {
  NOT_IMPLEMENTED();
}

function vorbis_commentheader_out(vc, op) {
  NOT_IMPLEMENTED();
}

function vorbis_analysis_headerout(v, vc, op, op_comm, op_code) {
  NOT_IMPLEMENTED();
}

function vorbis_granule_time(v, granulepos) {
  NOT_IMPLEMENTED();
}

function vorbis_version_string() {
  return GENERAL_VENDOR_STRING;
}
