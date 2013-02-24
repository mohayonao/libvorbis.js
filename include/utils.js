// math.h
function ldexp(x, exp) {
  return x*Math.pow(2,exp);
}

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

// sharedbook.c

/* 32 bit float (not IEEE; nonnormalized mantissa +
   biased exponent) : neeeeeee eeemmmmm mmmmmmmm mmmmmmmm
   Why not IEEE?  It's just not that important here. */

var VQ_FEXP = 10;
var VQ_FMAN = 21;
var VQ_FEXP_BIAS = 768; /* bias toward values smaller than 1. */

/* doesn't currently guard under/overflow */
function float32_pack(val){
  if(val===0)return(1610612736);
  var sign=0;
  if(val<0){
    sign=0x80000000;
    val= -val;
  }
  var exp=Math.floor(Math.log(val)*Math.LOG2E+0.001); //+epsilon
  var mant=rint(ldexp(val,(VQ_FMAN-1)-exp));
  exp=(exp+VQ_FEXP_BIAS)<<VQ_FMAN;
  return(sign|exp|mant);
}

function float32_unpack(val) {
  if(val===2147483647)return(Infinity);
  var mant=val&0x1fffff;
  var sign=val&0x80000000;
  var exp =(val&0x7fe00000)>>>VQ_FMAN;
  if(sign)mant= -mant;
  return(ldexp(mant,exp-(VQ_FMAN-1)-VQ_FEXP_BIAS));
}
