/* packs the given codebook into the bitstream **************************/

function vorbis_staticbook_pack(c, opb) {
  NOT_IMPLEMENTED();
}

/* unpacks a codebook from the packet buffer into the codebook struct,
   readies the codebook auxiliary structures for decode *************/
function vorbis_staticbook_unpack(opb) {
  assert.instanceOf(opb, "oggpack_buffer");
  
  var i,j,unused,num,length,quantvals;
  var s=static_codebook();
  s.allocedp=1;
  
  assert.instanceOf(s  , "static_codebook");
  
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
  assert.instanceOf(book, "codebook");
  assert.instanceOf(b   , "oggpack_buffer");
  
  var read=book.dec_maxlength;
  var lo,hi;
  var lok = oggpack_look(b,book.dec_firsttablen);
  var entry,testword,p,test;
  
  if (lok >= 0) {
    entry = book.dec_firsttable[lok];
    if(entry&0x80000000){
      lo=(entry>>>15)&0x7fff;
      hi=book.used_entries-(entry&0x7fff);
    }else{
      oggpack_adv(b, book.dec_codelengths[entry-1]);
      return(entry-1);
    }
  }else{
    lo=0;
    hi=book.used_entries;
  }
  
  lok = oggpack_look(b, read);
  
  while(lok<0 && read>1)
    lok = oggpack_look(b, --read);
  if(lok<0)return -1;
  
  /* bisect search for the codeword in the ordered list */
  {
    testword=bitreverse(lok);
    
    while(hi-lo>1){
      p=(hi-lo)>>1;
      test=book.codelist[lo+p]>testword;
      lo+=p&(test-1);
      hi-=p&(-test);
    }
    
    if(book.dec_codelengths[lo]<=read){
      oggpack_adv(b, book.dec_codelengths[lo]);
      return(lo);
    }
  }
  
  oggpack_adv(b, read);
  
  return(-1);
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
  assert.instanceOf(book, "codebook");
  assert.instanceOf(b   , "oggpack_buffer");
  
  var packed_entry;
  if(book.used_entries>0){
    packed_entry=decode_packed_entry_number(book,b);
    if(packed_entry>=0)
      return(book.dec_index[packed_entry]);
  }

  /* if there's no dec_index, the codebook unpacking isn't collapsed */
  return(-1);
}

/* returns 0 on OK or -1 on eof *************************************/
/* decode vector / dim granularity gaurding is done in the upper layer */
function vorbis_book_decodevs_add(book, a, b, n) {
  NOT_IMPLEMENTED();
}

/* decode vector / dim granularity gaurding is done in the upper layer */
function vorbis_book_decodev_add(book, a, b, n) {
  assert.instanceOf(book, "codebook");
  assert.instanceOf(a, "float*");
  assert.instanceOf(b, "oggpack_buffer");
  assert.instanceOf(n, "int");
  
  var i,j,entry,t;
  
  if(book.used_entries>0){
    if(book.dim>8){
      for(i=0;i<n;){
        entry = decode_packed_entry_number(book,b);
        if(entry===-1)return(-1);
        t     = pointer(book.valuelist,entry*book.dim);
        for (j=0;j<book.dim;)
          a[i++]+=t[j++];
      }
    }else{
      for(i=0;i<n;){
        entry = decode_packed_entry_number(book,b);
        if(entry===-1)return(-1);
        t     = pointer(book.valuelist,entry*book.dim);
        j=0;
        
        switch(book.dim){
        case 8:
          a[i++]+=t[j++];
          /* falls through */
        case 7:
          a[i++]+=t[j++];
          /* falls through */
        case 6:
          a[i++]+=t[j++];
          /* falls through */
        case 5:
          a[i++]+=t[j++];
          /* falls through */
        case 4:
          a[i++]+=t[j++];
          /* falls through */
        case 3:
          a[i++]+=t[j++];
          /* falls through */
        case 2:
          a[i++]+=t[j++];
          /* falls through */
        case 1:
          a[i++]+=t[j++];
          /* falls through */
        case 0:
          break;
        }
      }
    }
  }
  return(0);
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
