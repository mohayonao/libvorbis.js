function vorbis_look_residue0(p) {
  p = p||{};
  
  //   vorbis_info_residue0 *info;

  //   int         parts;
  //   int         stages;
  //   codebook   *fullbooks;
  //   codebook   *phrasebook;
  //   codebook ***partbooks;

  //   int         partvals;
  //   int       **decodemap;

  //   long      postbits;
  //   long      phrasebits;
  //   long      frames;

  // #if defined(TRAIN_RES) || defined(TRAIN_RESAUX)
  //   int        train_seq;
  //   long      *training_data[8][64];
  //   float      training_max[8][64];
  //   float      training_min[8][64];
  //   float     tmin;
  //   float     tmax;
  //   int       submap;
  // #endif
  
  p.info = null;
  p.parts = 0;
  p.stages = 0;
  p.fullbooks = null;
  p.phrasebook = null;
  p.partbooks = null;
  p.partvals = 0;
  p.decodemap = null;
  p.postbits = 0;
  p.phrasebits = 0;
  p.frames = 0;
  p.__name = "vorbis_look_residue0";
  
  return p;
}

function res0_free_info(i) {
  NOT_IMPLEMENTED();
}

function res0_free_look(i) {
  NOT_IMPLEMENTED();
}

function res0_pack(vr, opb){
  NOT_IMPLEMENTED();
}

/* vorbis_info is for range checking */
function res0_unpack(vi, opb) {
  var j,acc=0;
  var info=vorbis_info_residue0();
  var ci=vi.codec_setup;
  var cascade,cflag,c,book,entries,dim,partvals;
  
  info.begin=oggpack_read(opb,24);
  info.end=oggpack_read(opb,24);
  info.grouping=oggpack_read(opb,24)+1;
  info.partitions=oggpack_read(opb,6)+1;
  info.groupbook=oggpack_read(opb,8);
  
  err_out:while(1){
    /* check for premature EOP */
    if(info.groupbook<0)break err_out;
    
    for(j=0;j<info.partitions;j++){
      cascade=oggpack_read(opb,3);
      cflag=oggpack_read(opb,1);
      if(cflag<0) break err_out;
      if(cflag){
        c=oggpack_read(opb,5);
        if(c<0) break err_out;
        cascade|=(c<<3);
      }
      info.secondstages[j]=cascade;
      
      acc+=icount(cascade);
    }
    for(j=0;j<acc;j++){
      book=oggpack_read(opb,8);
      if(book<0) break err_out;
      info.booklist[j]=book;
    }
    
    if(info.groupbook>=ci.books)break err_out;
    for(j=0;j<acc;j++){
      if(info.booklist[j]>=ci.books)break err_out;
      if(ci.book_param[info.booklist[j]].maptype===0)break err_out;
    }
    
    /* verify the phrasebook is not specifying an impossible or
       inconsistent partitioning scheme. */
    /* modify the phrasebook ranging check from r16327; an early beta
       encoder had a bug where it used an oversized phrasebook by
       accident.  These files should continue to be playable, but don't
       allow an exploit */
    {
      entries = ci.book_param[info.groupbook].entries;
      dim = ci.book_param[info.groupbook].dim;
      partvals = 1;
      if (dim<1) break err_out;
      while(dim>0){
        partvals *= info.partitions;
        if(partvals > entries) break err_out;
        dim--;
      }
      info.partvals = partvals;
    }

    return(info);
  }
  
  // errout:
  res0_free_info(info);
  return(NULL);
}

function res0_look(vd, vr) {
  var info=vr;
  var look=vorbis_look_residue0();
  var ci=vd.vi.codec_setup;

  var j,k,acc=0;
  var dim;
  var maxstage=0;
  var stages,val,mult,deco;
  
  look.info=info;
  
  look.parts=info.partitions;
  look.fullbooks=ci.fullbooks;
  look.phrasebook=ci.fullbooks[info.groupbook];
  dim=look.phrasebook.dim;
  
  look.partbooks=calloc(look.parts,[]);
  
  for(j=0;j<look.parts;j++){
    stages=ilog(info.secondstages[j]);
    if(stages){
      if(stages>maxstage)maxstage=stages;
      look.partbooks[j]=calloc(stages,codebook);
      for(k=0;k<stages;k++)
        if(info.secondstages[j]&(1<<k)){
          look.partbooks[j][k]=ci.fullbooks[info.booklist[acc++]];
        }
    }
  }
  
  look.partvals=1;
  for(j=0;j<dim;j++)
    look.partvals*=look.parts;
  
  look.stages=maxstage;
  look.decodemap=calloc(look.partvals,[]);
  for(j=0;j<look.partvals;j++){
    val=j;
    mult=_int(look.partvals/look.parts);
    look.decodemap[j]=calloc(dim,int16);
    for(k=0;k<dim;k++){
      deco=_int(val/mult);
      val-=deco*mult;
      mult=_int(mult/look.parts);
      look.decodemap[j][k]=deco;
    }
  }
  return(look);
}

/* break an abstraction and copy some code for performance purposes */
function local_book_besterror(book, a) {
  NOT_IMPLEMENTED();
}

function _encodepart(opb, vec, n, book, acc) {
  NOT_IMPLEMENTED();
}

function _01class(vb, vl, _in, ch) {
  NOT_IMPLEMENTED();
}

/* designed for stereo or other modes where the partition size is an
   integer multiple of the number of channels encoded in the current
   submap */
function _2class(vb, vl, _in, ch) {
  NOT_IMPLEMENTED();
}

function _01forward(opb, vb, vl, _in, ch, partword, encode, submap) {
  NOT_IMPLEMENTED();
}

/* a truncated packet here just means 'stop working'; it's not an error */
function _01inverse(vb, vl, _in, ch, decodepart) {
  NOT_IMPLEMENTED();
}

function res0_inverse(vb, vl, _in, nonzero, ch) {
  NOT_IMPLEMENTED();
}

function res1_forward(opb, vb, vl, _in, nonzero, ch, partword, submap) {
  NOT_IMPLEMENTED();
}

function res1_class(vb, vl, _in, nonzero, ch) {
  NOT_IMPLEMENTED();
}

function res1_inverse(vb, vl, _in, nonzero, ch) {
  NOT_IMPLEMENTED();
}

function res2_class(vb, vl, _in, nonzero, ch) {
  NOT_IMPLEMENTED();
}

/* res2 is slightly more different; all the channels are interleaved
   into a single vector and encoded. */
function res2_forward(opb, vb, vl, _in, nonzero, ch, partword, submap) {
  NOT_IMPLEMENTED();
}

/* duplicate code here as speed is somewhat more important */
function res2_inverse(vb, vl, _in, nonzero, ch) {
  NOT_IMPLEMENTED();
}

var residue0_exportbundle = vorbis_func_residue();
set_kv(residue0_exportbundle, {
  pack     : null,
  unpack   : res0_unpack,
  look     : res0_look,
  free_info: res0_free_info,
  free_look: res0_free_look,
  klass    : null,
  forward  : null,
  inverse  : res0_inverse
});

var residue1_exportbundle = vorbis_func_residue();
set_kv(residue1_exportbundle, {
  pack: res0_pack,
  unpack: res0_unpack,
  look: res0_look,
  free_info: res0_free_info,
  free_look: res0_free_look,
  klass: res1_class,
  forward: res1_forward,
  inverse: res1_inverse
});

var residue2_exportbundle = vorbis_func_residue();
set_kv(residue2_exportbundle, {
  pack     : res0_pack,
  unpack   : res0_unpack,
  look     : res0_look,
  free_info: res0_free_info,
  free_look: res0_free_look,
  klass    : res2_class,
  forward  : res2_forward,
  inverse  : res2_inverse
});

/* moved from:registry.js (latedef) */
var _residue_P = [
  residue0_exportbundle,
  residue1_exportbundle,
  residue2_exportbundle
];
