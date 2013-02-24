/* given a list of word lengths, generate a list of codewords.  Works
   for length ordered or unordered, always assigns the lowest valued
   codewords first.  Extended to handle unused entries (length 0) */
function _make_words(l, n, sparsecount) {
  var i,j,count=0;
  var marker = calloc(33,uint32);
  var r=calloc((sparsecount?sparsecount:n),uint32);
  var length,entry,temp;
  
  for(i=0;i<n;i++){
    length=l[i];
    if(length>0){
      entry=marker[length];
      
      /* when we claim a node for an entry, we also claim the nodes
         below it (pruning off the imagined tree that may have dangled
         from it) as well as blocking the use of any nodes directly
         above for leaves */
      
      /* update ourself */
      if(length<32 && (entry>>>length)){
        /* error condition; the lengths must specify an overpopulated tree */
        return(NULL);
      }
      r[count++]=entry;
      
      /* Look to see if the next shorter marker points to the node
         above. if so, update it and repeat.  */
      {
        for(j=length;j>0;j--){
          
          if(marker[j]&1){
            /* have to jump branches */
            if(j===1)
              marker[1]++;
            else
              marker[j]=marker[j-1]<<1;
            break; /* invariant says next upper marker would already
                      have been moved if it was on the same path */
          }
          marker[j]++;
        }
      }
      
      /* prune the tree; the implicit invariant says all the longer
         markers were dangling from our just-taken node.  Dangle them
         from our *new* node. */
      for(j=length+1;j<33;j++)
        if((marker[j]>>1) === entry){
          entry=marker[j];
          marker[j]=marker[j-1]<<1;
        }else
          break;
    }else
      if(sparsecount===0)count++;
  }
  
  /* sanity check the huffman tree; an underpopulated tree must be
     rejected. The only exception is the one-node pseudo-nil tree,
     which appears to be underpopulated because the tree doesn't
     really exist; there's only one possible 'codeword' or zero bits,
     but the above tree-gen code doesn't mark that. */
  if(sparsecount !== 1){
    for(i=1;i<33;i++)
      if(marker[i] & (0xffffffff>>>(32-i))){
        return(NULL);
      }
  }
  
  /* bitreverse the words because our bitwise packer/unpacker is LSb
     endian */
  for(i=0,count=0;i<n;i++){
    temp=0;
    for(j=0;j<l[i];j++){
      temp<<=1;
      temp|=(r[count]>>j)&1;
    }
    
    if(sparsecount){
      if(l[i])
        r[count++]=temp;
    }else
      r[count++]=temp;
  }
  
  return(r);
}

/* there might be a straightforward one-line way to do the below
   that's portable and totally safe against roundoff, but I haven't
   thought of it.  Therefore, we opt on the side of caution */
function _book_maptype1_quantvals(b) {
  var vals=Math.floor(Math.pow(b.entries,1/b.dim));
  var acc,acc1,i;
  
  /* the above *should* be reliable, but we'll not assume that FP is
     ever reliable when bitstream sync is at stake; verify via integer
     means that vals really is the greatest value of dim for which
     vals^b.bim <= b.entries */
  /* treat the above as an initial guess */
  while(1){
    acc=1;
    acc1=1;
    for(i=0;i<b.dim;i++){
      acc*=vals;
      acc1*=vals+1;
    }
    if(acc<=b.entries && acc1>b.entries){
      return(vals);
    }else{
      if(acc>b.entries){
        vals--;
      }else{
        vals++;
      }
    }
  }
}

/* unpack the quantized list of values for encode/decode ***********/
/* we need to deal with two map types: in map type 1, the values are
   generated algorithmically (each column of the vector counts through
   the values in the quant vector). in map type 2, all the values came
   in in an explicit list.  Both value lists must be unpacked */
function _book_unquantize(b, n, sparsemap) {
  NOT_IMPLEMENTED();
}

function vorbis_staticbook_destroy(b) {
  if(b.allocedp){
    static_codebook(b);
  } /* otherwise, it is in static memory */
}

function vorbis_book_clear(b){
  /* static book is not cleared; we're likely called on the lookup and
     the static codebook belongs to the info struct */
  codebook(b);
}

function vorbis_book_init_encode(c, s) {
  NOT_IMPLEMENTED();
}

/* decode codebook arrangement is more heavily optimized than encode */
function vorbis_book_init_decode(c, s) {
  var i,j,n=0,tabn;
  var sortindex,codes,codep,position,orig,mask,hi,lo,word,loval,hival;
  codebook(c);
  
  /* count actually used entries */
  for(i=0;i<s.entries;i++)
    if(s.lengthlist[i]>0)
      n++;
  
  c.entries=s.entries;
  c.used_entries=n;
  c.dim=s.dim;
  
  err_out:while(1){
    if(n>0){
      
      /* two different remappings go on here.
         
         First, we collapse the likely sparse codebook down only to
         actually represented values/words.  This collapsing needs to be
         indexed as map-valueless books are used to encode original entry
         positions as integers.
         
         Second, we reorder all vectors, including the entry index above,
         by sorted bitreversed codeword to allow treeless decode. */
      
      /* perform sort */
      codes=_make_words(s.lengthlist,s.entries,c.used_entries);
      codep=calloc(n,[]);
      
      if(codes===NULL)break err_out;
      
      for(i=0;i<n;i++){
        codes[i]=bitreverse(codes[i]);
        codep[i]=pointer(codes,i);
      }
      // qsort(codep,n,sizeof(*codep),sort32a);
      codep.sort(sort32a);
      
      sortindex=calloc(n,int16);
      c.codelist=calloc(n,uint32);
      /* the index is a reverse index */
      for(i=0;i<n;i++){
        position=codep[i]-codes;
        sortindex[position]=i;
      }
      
      for(i=0;i<n;i++)
        c.codelist[sortindex[i]]=codes[i];
      codes=null;
      
      c.valuelist=_book_unquantize(s,n,sortindex);
      c.dec_index=calloc(n,int16);
      
      for(n=0,i=0;i<s.entries;i++)
        if(s.lengthlist[i]>0)
          c.dec_index[sortindex[n++]]=i;
      
      c.dec_codelengths=calloc(n,int16);
      for(n=0,i=0;i<s.entries;i++)
        if(s.lengthlist[i]>0)
          c.dec_codelengths[sortindex[n++]]=s.lengthlist[i];
      
      c.dec_firsttablen=ilog(c.used_entries)-4; /* this is magic */
      if(c.dec_firsttablen<5)c.dec_firsttablen=5;
      if(c.dec_firsttablen>8)c.dec_firsttablen=8;
      
      tabn=1<<c.dec_firsttablen;
      c.dec_firsttable=calloc(tabn,uint32);
      c.dec_maxlength=0;
      
      for(i=0;i<n;i++){
        if(c.dec_maxlength<c.dec_codelengths[i])
          c.dec_maxlength=c.dec_codelengths[i];
        if(c.dec_codelengths[i]<=c.dec_firsttablen){
          orig=bitreverse(c.codelist[i]);
          for(j=0;j<(1<<(c.dec_firsttablen-c.dec_codelengths[i]));j++)
            c.dec_firsttable[orig|(j<<c.dec_codelengths[i])]=i+1;
        }
      }
      
      /* now fill in 'unused' entries in the firsttable with hi/lo search
         hints for the non-direct-hits */
      {
        mask=0xfffffffe<<(31-c.dec_firsttablen);
        lo=0;hi=0;
        
        for(i=0;i<tabn;i++){
          word=i<<(32-c.dec_firsttablen);
          if(c.dec_firsttable[bitreverse(word)]===0){
            while((lo+1)<n && c.codelist[lo+1]<=word)lo++;
            while(    hi<n && word>=(c.codelist[hi]&mask))hi++;
            
            /* we only actually have 15 bits per hint to play with here.
               In order to overflow gracefully (nothing breaks, efficiency
               just drops), encode as the difference from the extremes. */
            {
              loval=lo;
              hival=n-hi;
              
              if(loval>0x7fff)loval=0x7fff;
              if(hival>0x7fff)hival=0x7fff;
              c.dec_firsttable[bitreverse(word)]=
                0x80000000 | (loval<<15) | hival;
            }
          }
        }
      }
    }
    
    return(0);
  }
  
  // err_out:
  vorbis_book_clear(c);
  return(-1);
}

function vorbis_book_codeword(book, entry) {
  NOT_IMPLEMENTED();
}

function vorbis_book_codelen(book, entry) {
  NOT_IMPLEMENTED();
}
