// sharedbook.c (_ilog)
function ilog(v){
  var ret=0;
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
