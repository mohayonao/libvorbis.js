// sharedbook.c (_ilog)
function ilog(v){
  var ret=0;
  while(v){
    ret++;
    v>>=1;
  }
  return(ret);
}

// mapping0.c
function ilog2(v){
  var ret=0;
  if(v)--v;
  while(v){
    ret++;
    v>>=1;
  }
  return(ret);
}

// res0.c
function icount(v){
  var ret=0;
  while(v){
    ret+=v&1;
    v>>=1;
  }
  return(ret);
}

// os.h
function rint(x){
  return (x+0.5)|0;
}

// sharedbook.c
function sort32a(a,b){
  return a[0]-b[0];
}

// sharedbook.c
function bitreverse(x){
  x=    ((x>>>16)&0x0000ffff) | ((x<<16)&0xffff0000);
  x=    ((x>>> 8)&0x00ff00ff) | ((x<< 8)&0xff00ff00);
  x=    ((x>>> 4)&0x0f0f0f0f) | ((x<< 4)&0xf0f0f0f0);
  x=    ((x>>> 2)&0x33333333) | ((x<< 2)&0xcccccccc);
  return((x>>> 1)&0x55555555) | ((x<< 1)&0xaaaaaaaa);
}
