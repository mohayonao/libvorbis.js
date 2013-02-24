/* simplistic, wasteful way of doing this (unique lookup for each
   mode/submapping); there should be a central repository for
   identical lookups.  That will require minor work, so I'm putting it
   off as low priority.

   Why a lookup for each backend in a given mode?  Because the
   blocksize is set by the mode, and low backend lookups may require
   parameters from other areas of the mode/mapping */

function mapping0_free_info(i) {
  NOT_IMPLEMENTED();
}

function mapping0_pack(vi, vm, opb) {
  NOT_IMPLEMENTED();
}

/* also responsible for range checking */
function mapping0_unpack(vi, opb) {
  var i,b;
  var info=vorbis_info_mapping0();
  var ci=vi.codec_setup;
  var testM,testA;
  
  err_out:while(1){
    b=oggpack_read(opb,1);
    if(b<0)break err_out;
    if(b){
      info.submaps=oggpack_read(opb,4)+1;
      if(info.submaps<=0)break err_out;
    }else
      info.submaps=1;
    
    b=oggpack_read(opb,1);
    if(b<0)break err_out;
    if(b){
      info.coupling_steps=oggpack_read(opb,8)+1;
      if(info.coupling_steps<=0)break err_out;
      for(i=0;i<info.coupling_steps;i++){
        testM=info.coupling_mag[i]=oggpack_read(opb,ilog2(vi.channels));
        testA=info.coupling_ang[i]=oggpack_read(opb,ilog2(vi.channels));
        
        if(testM<0 ||
           testA<0 ||
           testM===testA ||
           testM>=vi.channels ||
           testA>=vi.channels) break err_out;
      }
    }
    
    if(oggpack_read(opb,2)!==0)break err_out; /* 2,3:reserved */
    
    if(info.submaps>1){
      for(i=0;i<vi.channels;i++){
        info.chmuxlist[i]=oggpack_read(opb,4);
        if(info.chmuxlist[i]>=info.submaps || info.chmuxlist[i]<0)break err_out;
      }
    }
    for(i=0;i<info.submaps;i++){
      oggpack_read(opb,8); /* time submap unused */
      info.floorsubmap[i]=oggpack_read(opb,8);
      if(info.floorsubmap[i]>=ci.floors || info.floorsubmap[i]<0)break err_out;
      info.residuesubmap[i]=oggpack_read(opb,8);
      if(info.residuesubmap[i]>=ci.residues || info.residuesubmap[i]<0)break err_out;
    }
    
    return info;
  }
  
  // err_out:
  mapping0_free_info(info);
  return(NULL);
}

function mapping0_forward(vb){
  NOT_IMPLEMENTED();
}

function mapping0_inverse(vb, l) {
  NOT_IMPLEMENTED();
}

/* export hooks */
var mapping0_exportbundle = vorbis_func_mapping();
set_kv(mapping0_exportbundle, {
  pack     : mapping0_pack,
  unpack   : mapping0_unpack,
  free_info: mapping0_free_info,
  forward  : mapping0_forward,
  inverse  : mapping0_inverse
});
