/* this can also be run as an integer transform by uncommenting a
   define in mdct.h; the integerization is a first pass and although
   it's likely stable for Vorbis, the dynamic range is constrained and
   roundoff isn't done (so it's noisy).  Consider it functional, but
   only a starting point.  There's no point on a machine with an FPU */

/* build lookups for trig functions; also pre-figure scaling and
   some window function algebra. */

function mdct_init(lookup, n) {
  var bitrev=calloc((n/4),int16);
  var T=calloc((n+n/4),float32);
  
  var i,j;
  var n2=n>>1;
  var log2n=lookup.log2n=rint(Math.log(n)*Math.LOG2E);
  var mask,msb,acc;
  lookup.n=n;
  lookup.trig=T;
  lookup.bitrev=bitrev;
  
  /* trig lookups... */
  
  for(i=0;i<n/4;i++){
    T[i*2]=FLOAT_CONV(Math.cos((Math.PI/n)*(4*i)));
    T[i*2+1]=FLOAT_CONV(-Math.sin((Math.PI/n)*(4*i)));
    T[n2+i*2]=FLOAT_CONV(Math.cos((Math.PI/(2*n))*(2*i+1)));
    T[n2+i*2+1]=FLOAT_CONV(Math.sin((Math.PI/(2*n))*(2*i+1)));
  }
  for(i=0;i<n/8;i++){
    T[n+i*2]=FLOAT_CONV(Math.cos((Math.PI/n)*(4*i+2))*0.5);
    T[n+i*2+1]=FLOAT_CONV(-Math.sin((Math.PI/n)*(4*i+2))*0.5);
  }
  
  /* bitreverse lookup... */
  
  {
    mask=(1<<(log2n-1))-1;
    msb=1<<(log2n-2);
    for(i=0;i<n/8;i++){
      acc=0;
      for(j=0;msb>>j;j++)
        if((msb>>j)&i)acc|=1<<j;
      bitrev[i*2]=((~acc)&mask)-1;
      bitrev[i*2+1]=acc;

    }
  }
  lookup.scale=FLOAT_CONV(4.0/n);
}

/* 8 point butterfly (in place, 4 register) */
function mdct_butterfly_8(x) {
  NOT_IMPLEMENTED();
}

/* 16 point butterfly (in place, 4 register) */
function mdct_butterfly_16(x) {
  NOT_IMPLEMENTED();
}

/* 32 point butterfly (in place, 4 register) */
function mdct_butterfly_32(x) {
  NOT_IMPLEMENTED();
}

/* N point first stage butterfly (in place, 2 register) */
function mdct_butterfly_first(T, x, points) {
  NOT_IMPLEMENTED();
}

/* N/stage point generic N stage butterfly (in place, 2 register) */
function mdct_butterfly_generic(T, x, points, trigint) {
  NOT_IMPLEMENTED();
}

function mdct_butterflies(init, x, points) {
  NOT_IMPLEMENTED();
}

function mdct_clear(l) {
  NOT_IMPLEMENTED();
}

function mdct_bitreverse(init, x) {
  NOT_IMPLEMENTED();
}

function mdct_backward(init, _in, out) {
  NOT_IMPLEMENTED();
}

function mdct_forward(init, _in, out) {
  NOT_IMPLEMENTED();
}
