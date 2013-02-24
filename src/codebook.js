/* packs the given codebook into the bitstream **************************/

function vorbis_staticbook_pack(c, opb) {
  NOT_IMPLEMENTED();
}

/* unpacks a codebook from the packet buffer into the codebook struct,
   readies the codebook auxiliary structures for decode *************/
function vorbis_staticbook_unpack(opb) {
  var i,j,unused,num,length,quantvals;
  var s=static_codebook();
  s.allocedp=1;
  
  err_out:while(1){
    /* make sure alignment is correct */
    if(oggpack_read(opb,24)!==0x564342)break err_out; // _eofout;
    
    /* first the basic parameters */
    s.dim=oggpack_read(opb,16);
    s.entries=oggpack_read(opb,24);
    if(s.entries===-1)break err_out; // _eofout;
    
    if(ilog(s.dim)+ilog(s.entries)>24)break err_out; // _eofout;
    
    /* codeword ordering.... length ordered or unordered? */
    switch(oggpack_read(opb,1)){
    case 0:
      /* allocated but unused entries? */
      unused=oggpack_read(opb,1);
      if((s.entries*(unused?1:5)+7)>>3>opb.storage-oggpack_bytes(opb))
        break err_out; // _eofout;
      /* unordered */
      s.lengthlist=calloc(s.entries,int32);
      
      /* allocated but unused entries? */
      if(unused){
        /* yes, unused entries */

        for(i=0;i<s.entries;i++){
          if(oggpack_read(opb,1)){
            num=oggpack_read(opb,5);
            if(num===-1)break err_out; // _eofout;
            s.lengthlist[i]=num+1;
          }else
            s.lengthlist[i]=0;
        }
      }else{
        /* all entries used; no tagging */
        for(i=0;i<s.entries;i++){
          num=oggpack_read(opb,5);
          if(num===-1)break err_out; // _eofout;
          s.lengthlist[i]=num+1;
        }
      }
      break;
    case 1:
      /* ordered */
      length=oggpack_read(opb,5)+1;
      if(length===0)break err_out; // _eofout;
      s.lengthlist=calloc(s.entries,int32);
      
      for(i=0;i<s.entries;){
        num=oggpack_read(opb,ilog(s.entries-i));
        if(num===-1)break err_out; // _eofout;
        if(length>32 || num>s.entries-i ||
           (num>0 && (num-1)>>(length-1)>1)){
          break err_out; // _errout;
        }
        if(length>32)break err_out; // _errout;
        for(j=0;j<num;j++,i++)
          s.lengthlist[i]=length;
        length++;
      }
      break;
    default:
      /* EOF */
      break err_out; // _eofout;
    }

    /* Do we have a mapping to unpack? */
    switch((s.maptype=oggpack_read(opb,4))){
    case 0:
      /* no mapping */
      break;
    case 1: case 2:
      /* implicitly populated value mapping */
      /* explicitly populated value mapping */

      s.q_min=oggpack_read(opb,32);
      s.q_delta=oggpack_read(opb,32);
      s.q_quant=oggpack_read(opb,4)+1;
      s.q_sequencep=oggpack_read(opb,1);
      if(s.q_sequencep===-1)break err_out; // _eofout;

      {
        quantvals=0;
        switch(s.maptype){
        case 1:
          quantvals=(s.dim===0?0:_book_maptype1_quantvals(s));
          break;
        case 2:
          quantvals=s.entries*s.dim;
          break;
        }

        /* quantized values */
        if(((quantvals*s.q_quant+7)>>3)>opb.storage-oggpack_bytes(opb))
          break err_out; // _eofout;
        s.quantlist=calloc(quantvals,int32);
        for(i=0;i<quantvals;i++)
          s.quantlist[i]=oggpack_read(opb,s.q_quant);

        if(quantvals&&s.quantlist[quantvals-1]===-1)break err_out; // _eofout;
      }
      break;
    default:
      break err_out; // _errout;
    }
    
    /* all set */
    return(s);
  }
  
  // _errout:
  // _eofout:
  vorbis_staticbook_destroy(s);
  return(NULL);
}

/* returns the number of bits ************************************************/
function vorbis_book_encode(book, a, b) {
  NOT_IMPLEMENTED();
}

function decode_packed_entry_number(book, b) {
  NOT_IMPLEMENTED();
}

/* Decode side is specced and easier, because we don't need to find
   matches using different criteria; we simply read and map.  There are
   two things we need to do 'depending':

   We may need to support interleave.  We don't really, but it's
   convenient to do it here rather than rebuild the vector later.

   Cascades may be additive or multiplicitive; this is not inherent in
   the codebook, but set in the code using the codebook.  Like
   interleaving, it's easiest to do it here.
   addmul==0 -> declarative (set the value)
   addmul==1 -> additive
   addmul==2 -> multiplicitive */

/* returns the [original, not compacted] entry number or -1 on eof *********/
function vorbis_book_decode(book, b) {
  NOT_IMPLEMENTED();
}

/* returns 0 on OK or -1 on eof *************************************/
/* decode vector / dim granularity gaurding is done in the upper layer */
function vorbis_book_decodevs_add(book, a, b, n) {
  NOT_IMPLEMENTED();
}

/* decode vector / dim granularity gaurding is done in the upper layer */
function vorbis_book_decodev_add(book, a, b, n) {
  NOT_IMPLEMENTED();
}

/* unlike the others, we guard against n not being an integer number
   of <dim> internally rather than in the upper layer (called only by
   floor0) */
function vorbis_book_decodev_set(book, a, b, n) {
  NOT_IMPLEMENTED();
}

function vorbis_book_decodevv_add(book, a, offset, ch, b, n) {
  NOT_IMPLEMENTED();
}
