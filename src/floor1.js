var floor1_rangedB = 140; /* floor 1 fixed at -140dB to 0dB range */

function lsfit_acc(p) {
  p = p||{};
  
  // int x0;
  // int x1;

  // int xa;
  // int ya;
  // int x2a;
  // int y2a;
  // int xya;
  // int an;

  // int xb;
  // int yb;
  // int x2b;
  // int y2b;
  // int xyb;
  // int bn;

  p.x0 = 0;
  p.x1 = 0;

  p.xa = 0;
  p.ya = 0;
  p.x2a = 0;
  p.y2a = 0;
  p.xya = 0;
  p.an = 0;

  p.xb = 0;
  p.yb = 0;
  p.x2b = 0;
  p.y2b = 0;
  p.xyb = 0;
  p.bn = 0;
  
  return p;
}

/***********************************************/

function floor1_free_info(i) {
  NOT_IMPLEMENTED();
}

function floor1_free_look(i) {
  NOT_IMPLEMENTED();
}

function floor1_pack(i, opb) {
  NOT_IMPLEMENTED();
}

function floor1_unpack(vi, opb) {
  var ci=vi.codec_setup;
  var j,k,count=0,maxclass=-1,rangebits;
  var t,sortpointer;
  
  var info=vorbis_info_floor1();
  
  err_out:while(1){
    /* read partitions */
    info.partitions=oggpack_read(opb,5); /* only 0 to 31 legal */
    for(j=0;j<info.partitions;j++){
      info.partitionclass[j]=oggpack_read(opb,4); /* only 0 to 15 legal */
      if(info.partitionclass[j]<0)break err_out;
      if(maxclass<info.partitionclass[j])maxclass=info.partitionclass[j];
    }
    
    /* read partition classes */
    for(j=0;j<maxclass+1;j++){
      info.class_dim[j]=oggpack_read(opb,3)+1; /* 1 to 8 */
      info.class_subs[j]=oggpack_read(opb,2); /* 0,1,2,3 bits */
      if(info.class_subs[j]<0)
        break err_out;
      if(info.class_subs[j])info.class_book[j]=oggpack_read(opb,8);
      if(info.class_book[j]<0 || info.class_book[j]>=ci.books)
        break err_out;
      for(k=0;k<(1<<info.class_subs[j]);k++){
        info.class_subbook[j][k]=oggpack_read(opb,8)-1;
        if(info.class_subbook[j][k]<-1 || info.class_subbook[j][k]>=ci.books)
          break err_out;
      }
    }
    
    /* read the post list */
    info.mult=oggpack_read(opb,2)+1;     /* only 1,2,3,4 legal now */
    rangebits=oggpack_read(opb,4);
    if(rangebits<0)break err_out;
    
    for(j=0,k=0;j<info.partitions;j++){
      count+=info.class_dim[info.partitionclass[j]];
      if(count>VIF_POSIT) break err_out;
      for(;k<count;k++){
        t=info.postlist[k+2]=oggpack_read(opb,rangebits);
        if(t<0 || t>=(1<<rangebits))
          break err_out;
      }
    }
    info.postlist[0]=0;
    info.postlist[1]=1<<rangebits;
    
    /* don't allow repeated values in post list as they'd result in
       zero-length segments */
    {
      // int *sortpointer[VIF_POSIT+2];
      // for(j=0;j<count+2;j++)sortpointer[j]=info.postlist+j;
      // qsort(sortpointer,count+2,sizeof(*sortpointer),icomp);
      
      sortpointer=calloc(VIF_POSIT+2,[]);
      for(j=0;j<count+2;j++)sortpointer[j]=pointer(info.postlist,j);
      sortpointer=sortpointer.slice(0,count+2);
      sortpointer.sort(icomp);
      
      for(j=1;j<count+2;j++)
        if(sortpointer[j-1]===sortpointer[j])break err_out;
    }
    
    return(info);
  }
  
  // err_out:
  floor1_free_info(info);
  return(NULL);
}

function floor1_look(vd, _in) {
  
  var sortpointer=calloc(VIF_POSIT+2,[]);
  var info=_in;
  var look=vorbis_look_floor1();
  var i,j,n=0;
  var lo,hi,lx,hx,currentx,x;
  
  look.vi=info;
  look.n=info.postlist[1];
  
  /* we drop each position value in-between already decoded values,
     and use linear interpolation to predict each new value past the
     edges.  The positions are read in the order of the position
     list... we precompute the bounding positions in the lookup.  Of
     course, the neighbors can change (if a position is declined), but
     this is an initial mapping */
  
  for(i=0;i<info.partitions;i++)n+=info.class_dim[info.partitionclass[i]];
  n+=2;
  look.posts=n;
  
  /* also store a sorted position index */
  for(i=0;i<n;i++)sortpointer[i]=pointer(info.postlist,i);
  //qsort(sortpointer,n,sizeof(*sortpointer),icomp);
  sortpointer.sort(icomp);
  
  /* points from sort order back to range number */
  for(i=0;i<n;i++)look.forward_index[i]=sortpointer[i]-info.postlist;
  /* points from range order to sorted position */
  for(i=0;i<n;i++)look.reverse_index[look.forward_index[i]]=i;
  /* we actually need the post values too */
  for(i=0;i<n;i++)look.sorted_index[i]=info.postlist[look.forward_index[i]];

  /* quantize values to multiplier spec */
  switch(info.mult){
  case 1: /* 1024 . 256 */
    look.quant_q=256;
    break;
  case 2: /* 1024 . 128 */
    look.quant_q=128;
    break;
  case 3: /* 1024 . 86 */
    look.quant_q=86;
    break;
  case 4: /* 1024 . 64 */
    look.quant_q=64;
    break;
  }
  
  /* discover our neighbors for decode where we don't use fit flags
     (that would push the neighbors outward) */
  for(i=0;i<n-2;i++){
    lo=0;
    hi=1;
    lx=0;
    hx=look.n;
    currentx=info.postlist[i+2];
    for(j=0;j<i+2;j++){
      x=info.postlist[j];
      if(x>lx && x<currentx){
        lo=j;
        lx=x;
      }
      if(x<hx && x>currentx){
        hi=j;
        hx=x;
      }
    }
    look.loneighbor[i]=lo;
    look.hineighbor[i]=hi;
  }

  return(look);
}

function render_point(x0, x1, y0, y1, x) {
  NOT_IMPLEMENTED();
}

function vorbis_dBquant(x) {
  NOT_IMPLEMENTED();
}

var FLOOR1_fromdB_LOOKUP = new Float32Array([
  1.0649863e-07, 1.1341951e-07, 1.2079015e-07, 1.2863978e-07,
  1.3699951e-07, 1.4590251e-07, 1.5538408e-07, 1.6548181e-07,
  1.7623575e-07, 1.8768855e-07, 1.9988561e-07, 2.128753e-07,
  2.2670913e-07, 2.4144197e-07, 2.5713223e-07, 2.7384213e-07,
  2.9163793e-07, 3.1059021e-07, 3.3077411e-07, 3.5226968e-07,
  3.7516214e-07, 3.9954229e-07, 4.2550680e-07, 4.5315863e-07,
  4.8260743e-07, 5.1396998e-07, 5.4737065e-07, 5.8294187e-07,
  6.2082472e-07, 6.6116941e-07, 7.0413592e-07, 7.4989464e-07,
  7.9862701e-07, 8.5052630e-07, 9.0579828e-07, 9.6466216e-07,
  1.0273513e-06, 1.0941144e-06, 1.1652161e-06, 1.2409384e-06,
  1.3215816e-06, 1.4074654e-06, 1.4989305e-06, 1.5963394e-06,
  1.7000785e-06, 1.8105592e-06, 1.9282195e-06, 2.0535261e-06,
  2.1869758e-06, 2.3290978e-06, 2.4804557e-06, 2.6416497e-06,
  2.8133190e-06, 2.9961443e-06, 3.1908506e-06, 3.3982101e-06,
  3.6190449e-06, 3.8542308e-06, 4.1047004e-06, 4.3714470e-06,
  4.6555282e-06, 4.9580707e-06, 5.2802740e-06, 5.6234160e-06,
  5.9888572e-06, 6.3780469e-06, 6.7925283e-06, 7.2339451e-06,
  7.7040476e-06, 8.2047000e-06, 8.7378876e-06, 9.3057248e-06,
  9.9104632e-06, 1.0554501e-05, 1.1240392e-05, 1.1970856e-05,
  1.2748789e-05, 1.3577278e-05, 1.4459606e-05, 1.5399272e-05,
  1.6400004e-05, 1.7465768e-05, 1.8600792e-05, 1.9809576e-05,
  2.1096914e-05, 2.2467911e-05, 2.3928002e-05, 2.5482978e-05,
  2.7139006e-05, 2.8902651e-05, 3.0780908e-05, 3.2781225e-05,
  3.4911534e-05, 3.7180282e-05, 3.9596466e-05, 4.2169667e-05,
  4.4910090e-05, 4.7828601e-05, 5.0936773e-05, 5.4246931e-05,
  5.7772202e-05, 6.1526565e-05, 6.5524908e-05, 6.9783085e-05,
  7.4317983e-05, 7.9147585e-05, 8.4291040e-05, 8.9768747e-05,
  9.5602426e-05, 0.00010181521, 0.00010843174, 0.00011547824,
  0.00012298267, 0.00013097477, 0.00013948625, 0.00014855085,
  0.00015820453, 0.00016848555, 0.00017943469, 0.00019109536,
  0.00020351382, 0.00021673929, 0.00023082423, 0.00024582449,
  0.00026179955, 0.00027881276, 0.00029693158, 0.00031622787,
  0.00033677814, 0.00035866388, 0.00038197188, 0.00040679456,
  0.00043323036, 0.00046138411, 0.00049136745, 0.00052329927,
  0.00055730621, 0.00059352311, 0.00063209358, 0.00067317058,
  0.00071691700, 0.00076350630, 0.00081312324, 0.00086596457,
  0.00092223983, 0.00098217216, 0.0010459992, 0.0011139742,
  0.0011863665, 0.0012634633, 0.0013455702, 0.0014330129,
  0.0015261382, 0.0016253153, 0.0017309374, 0.0018434235,
  0.0019632195, 0.0020908006, 0.0022266726, 0.0023713743,
  0.0025254795, 0.0026895994, 0.0028643847, 0.0030505286,
  0.0032487691, 0.0034598925, 0.0036847358, 0.0039241906,
  0.0041792066, 0.0044507950, 0.0047400328, 0.0050480668,
  0.0053761186, 0.0057254891, 0.0060975636, 0.0064938176,
  0.0069158225, 0.0073652516, 0.0078438871, 0.0083536271,
  0.0088964928, 0.009474637, 0.010090352, 0.010746080,
  0.011444421, 0.012188144, 0.012980198, 0.013823725,
  0.014722068, 0.015678791, 0.016697687, 0.017782797,
  0.018938423, 0.020169149, 0.021479854, 0.022875735,
  0.024362330, 0.025945531, 0.027631618, 0.029427276,
  0.031339626, 0.033376252, 0.035545228, 0.037855157,
  0.040315199, 0.042935108, 0.045725273, 0.048696758,
  0.051861348, 0.055231591, 0.058820850, 0.062643361,
  0.066714279, 0.071049749, 0.075666962, 0.080584227,
  0.085821044, 0.091398179, 0.097337747, 0.10366330,
  0.11039993, 0.11757434, 0.12521498, 0.13335215,
  0.14201813, 0.15124727, 0.16107617, 0.17154380,
  0.18269168, 0.19456402, 0.20720788, 0.22067342,
  0.23501402, 0.25028656, 0.26655159, 0.28387361,
  0.30232132, 0.32196786, 0.34289114, 0.36517414,
  0.38890521, 0.41417847, 0.44109412, 0.46975890,
  0.50028648, 0.53279791, 0.56742212, 0.60429640,
  0.64356699, 0.68538959, 0.72993007, 0.77736504,
  0.82788260, 0.88168307, 0.9389798, 1
]);

function render_line(n, x0, x1, y0, y1, d) {
  NOT_IMPLEMENTED();
}

function render_line0(n, x0, x1, y0, y1, d) {
  NOT_IMPLEMENTED();
}

/* the floor has already been filtered to only include relevant sections */
function accumulate_fit(flr, mdct, x0, x1, a, n, info) {
  NOT_IMPLEMENTED();
}

function fit_line(a, fits, y0, y1, info) {
  NOT_IMPLEMENTED();
}

function inspect_error(x0, x1, y0, y1, mask, mdct, info) {
  NOT_IMPLEMENTED();
}

function post_Y(A, B, pos) {
  NOT_IMPLEMENTED();
}

function floor1_fit(vb, look, logmdct, logmask) {
  NOT_IMPLEMENTED();
}

function floor1_interpolate_fit(vb, look, A, B, del) {
  NOT_IMPLEMENTED();
}

function floor1_encode(opb, vb, look, post, ilogmask) {
  NOT_IMPLEMENTED();
}

function floor1_inverse1(vb, _in) {
  NOT_IMPLEMENTED();
}

function floor1_inverse2(vb, _in,memo, out) {
  NOT_IMPLEMENTED();
}

/* export hooks */
var floor1_exportbundle = vorbis_func_floor();
set_kv(floor1_exportbundle, {
    pack     : floor1_pack,
    unpack   : floor1_unpack,
    look     : floor1_look,
    free_info: floor1_free_info,
    free_look: floor1_free_look,
    inverse1 : floor1_inverse1,
    inverse2 : floor1_inverse2
});
