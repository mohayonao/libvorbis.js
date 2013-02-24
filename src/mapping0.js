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
  var vd=vb.vd;
  var vi=vd.vi;
  var ci=vi.codec_setup;
  var b=vd.backend_state;
  var info=l;
  
  var i,j;
  var n=vb.pcmend=ci.blocksizes[vb.W];
  
  var pcmbundle=calloc(vi.channels,[]);
  var zerobundle=calloc(vi.channels,int16);
  
  var nonzero=calloc(vi.channels,int16);
  var floormemo=calloc(vi.channels,[]);
  var submap,ch_in_bundle,pcmM,pcmA,mag,ang,pcm;
  
  /* recover the spectral envelope; store it in the PCM vector for now */
  for(i=0;i<vi.channels;i++){
    submap=info.chmuxlist[i];
    floormemo[i]=_floor_P[ci.floor_type[info.floorsubmap[submap]]]
      .inverse1(vb,b.flr[info.floorsubmap[submap]]);
    if(floormemo[i])
      nonzero[i]=1;
    else
      nonzero[i]=0;
    valset(vb.pcm[i],0,n/2);
  }
  
  /* channel coupling can 'dirty' the nonzero listing */
  for(i=0;i<info.coupling_steps;i++){
    if(nonzero[info.coupling_mag[i]] ||
       nonzero[info.coupling_ang[i]]){
      nonzero[info.coupling_mag[i]]=1;
      nonzero[info.coupling_ang[i]]=1;
    }
  }
  
  /* recover the residue into our working vectors */
  for(i=0;i<info.submaps;i++){
    ch_in_bundle=0;
    for(j=0;j<vi.channels;j++){
      if(info.chmuxlist[j]===i){
        if(nonzero[j])
          zerobundle[ch_in_bundle]=1;
        else
          zerobundle[ch_in_bundle]=0;
        pcmbundle[ch_in_bundle++]=vb.pcm[j];
      }
    }

    _residue_P[ci.residue_type[info.residuesubmap[i]]].
      inverse(vb,b.residue[info.residuesubmap[i]],
              pcmbundle,zerobundle,ch_in_bundle);
  }
  
  /* channel coupling */
  for(i=info.coupling_steps-1;i>=0;i--){
    pcmM=vb.pcm[info.coupling_mag[i]];
    pcmA=vb.pcm[info.coupling_ang[i]];
    
    for(j=0;j<n/2;j++){
      mag=pcmM[j];
      ang=pcmA[j];
      
      if(mag>0)
        if(ang>0){
          pcmM[j]=mag;
          pcmA[j]=mag-ang;
        }else{
          pcmA[j]=mag;
          pcmM[j]=mag+ang;
        }
      else
        if(ang>0){
          pcmM[j]=mag;
          pcmA[j]=mag+ang;
        }else{
          pcmA[j]=mag;
          pcmM[j]=mag-ang;
        }
    }
  }
  
  /* compute and apply spectral envelope */
  for(i=0;i<vi.channels;i++){
    pcm=vb.pcm[i];
    submap=info.chmuxlist[i];
    _floor_P[ci.floor_type[info.floorsubmap[submap]]]
      .inverse2(vb,b.flr[info.floorsubmap[submap]],floormemo[i],pcm);
  }
  
  /* transform the PCM data; takes PCM vector, vb; modifies PCM vector */
  /* only MDCT right now.... */
  for(i=0;i<vi.channels;i++){
    pcm=vb.pcm[i];
    mdct_backward(b.transform[vb.W][0],pcm,pcm);
  }
  
  /* all done! */
  return(0);
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
