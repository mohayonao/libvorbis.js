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
function rint(x) {
  return (x+0.5)|0;
}
