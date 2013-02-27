/* this can also be run as an integer transform by uncommenting a
   define in mdct.h; the integerization is a first pass and although
   it's likely stable for Vorbis, the dynamic range is constrained and
   roundoff isn't done (so it's noisy).  Consider it functional, but
   only a starting point.  There's no point on a machine with an FPU */

/* build lookups for trig functions; also pre-figure scaling and
   some window function algebra. */

function mdct_init(lookup, n) {
  assert.instanceOf(lookup, "mdct_lookup");
  assert.instanceOf(n, "int");
  
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
  assert.instanceOf(T, "float*");
  assert.instanceOf(x, "float*");
  assert.instanceOf(points, "int");
  
  var x1 = pointer(x, points      - 8);
  var x2 = pointer(x, (points>>1) - 8);
  var r0;
  var r1;
  
  do{

               r0      = x1[6]      -  x2[6];
               r1      = x1[7]      -  x2[7];
               x1[6]  += x2[6];
               x1[7]  += x2[7];
               x2[6]   = MULT_NORM(r1 * T[1]  +  r0 * T[0]);
               x2[7]   = MULT_NORM(r1 * T[0]  -  r0 * T[1]);

               r0      = x1[4]      -  x2[4];
               r1      = x1[5]      -  x2[5];
               x1[4]  += x2[4];
               x1[5]  += x2[5];
               x2[4]   = MULT_NORM(r1 * T[5]  +  r0 * T[4]);
               x2[5]   = MULT_NORM(r1 * T[4]  -  r0 * T[5]);

               r0      = x1[2]      -  x2[2];
               r1      = x1[3]      -  x2[3];
               x1[2]  += x2[2];
               x1[3]  += x2[3];
               x2[2]   = MULT_NORM(r1 * T[9]  +  r0 * T[8]);
               x2[3]   = MULT_NORM(r1 * T[8]  -  r0 * T[9]);

               r0      = x1[0]      -  x2[0];
               r1      = x1[1]      -  x2[1];
               x1[0]  += x2[0];
               x1[1]  += x2[1];
               x2[0]   = MULT_NORM(r1 * T[13] +  r0 * T[12]);
               x2[1]   = MULT_NORM(r1 * T[12] -  r0 * T[13]);
    
    x1=pointer(x1,-8);
    x2=pointer(x2,-8);
    T=pointer(T,16);
  }while(x2&&x2.byteOffset >= x.byteOffset);
}

/* N/stage point generic N stage butterfly (in place, 2 register) */
function mdct_butterfly_generic(T, x, points, trigint) {
  assert.instanceOf(T, "float*");
  assert.instanceOf(x, "float*");
  assert.instanceOf(points, "int");
  assert.instanceOf(trigint, "int");
  
  var x1 = pointer(x, points      - 8);
  var x2 = pointer(x, (points>>1) - 8);
  var r0;
  var r1;
  
  do{

               r0      = x1[6]      -  x2[6];
               r1      = x1[7]      -  x2[7];
               x1[6]  += x2[6];
               x1[7]  += x2[7];
               x2[6]   = MULT_NORM(r1 * T[1]  +  r0 * T[0]);
               x2[7]   = MULT_NORM(r1 * T[0]  -  r0 * T[1]);
    
               T=pointer(T,trigint);
    
               r0      = x1[4]      -  x2[4];
               r1      = x1[5]      -  x2[5];
               x1[4]  += x2[4];
               x1[5]  += x2[5];
               x2[4]   = MULT_NORM(r1 * T[1]  +  r0 * T[0]);
               x2[5]   = MULT_NORM(r1 * T[0]  -  r0 * T[1]);
    
               T=pointer(T,trigint);
    
               r0      = x1[2]      -  x2[2];
               r1      = x1[3]      -  x2[3];
               x1[2]  += x2[2];
               x1[3]  += x2[3];
               x2[2]   = MULT_NORM(r1 * T[1]  +  r0 * T[0]);
               x2[3]   = MULT_NORM(r1 * T[0]  -  r0 * T[1]);

               T=pointer(T,trigint);
    
               r0      = x1[0]      -  x2[0];
               r1      = x1[1]      -  x2[1];
               x1[0]  += x2[0];
               x1[1]  += x2[1];
               x2[0]   = MULT_NORM(r1 * T[1]  +  r0 * T[0]);
               x2[1]   = MULT_NORM(r1 * T[0]  -  r0 * T[1]);

               T=pointer(T,trigint);
    x1=pointer(x1,-8);
    x2=pointer(x2,-8);

  }while(x2&&x2.byteOffset>=x.byteOffset);
}

function mdct_butterflies(init, x, points) {
  assert.instanceOf(init, "mdct_lookup");
  assert.instanceOf(x   , "float*");
  assert.instanceOf(points, "int");
  
  var T=init.trig;
  var stages=init.log2n-5;
  var i,j;
  
  assert.instanceOf(T, "float*");
  
  if(--stages>0){
    mdct_butterfly_first(T,x,points);
  }

  for(i=1;--stages>0;i++){
    for(j=0;j<(1<<i);j++)
      mdct_butterfly_generic(T,pointer(x,(points>>i)*j),points>>i,4<<i);
  }
  
  for(j=0;j<points;j+=32)
    mdct_butterfly_32(pointer(x,j));
}

function mdct_clear(l) {
  NOT_IMPLEMENTED();
}

function mdct_bitreverse(init, x) {
  NOT_IMPLEMENTED();
}

function mdct_backward(init, _in, out) {
  assert.instanceOf(init, "mdct_lookup");
  assert.instanceOf(_in , "float*");
  assert.instanceOf(out , "float*");
  
  var n=init.n;
  var n2=n>>1;
  var n4=n>>2;
  var iX,oX,T,oX1,oX2;
  
  assert.instanceOf(n, "int");
  
  /* rotate */

  iX = pointer(_in,n2-7);
  oX = pointer(out,n2+n4);
  T  = pointer(init.trig,n4);

  assert.instanceOf(iX, "float*");
  assert.instanceOf(oX, "float*");
  assert.instanceOf(T , "float*");
  
  do{
    oX          = pointer(oX,-4);
    oX[0]       = MULT_NORM(-iX[2] * T[3] - iX[0]  * T[2]);
    oX[1]       = MULT_NORM (iX[0] * T[3] - iX[2]  * T[2]);
    oX[2]       = MULT_NORM(-iX[6] * T[1] - iX[4]  * T[0]);
    oX[3]       = MULT_NORM (iX[4] * T[1] - iX[6]  * T[0]);
    iX          = pointer(iX,-8);
    T           = pointer(T,4);
  }while(iX&&iX.byteOffset>=_in.byteOffset);
  
  iX            = pointer(_in,n2-8);
  oX            = pointer(out,n2+n4);
  T             = pointer(init.trig,n4);
  
  do{
    T           = pointer(T,-4);
    oX[0]       =  MULT_NORM (iX[4] * T[3] + iX[6] * T[2]);
    oX[1]       =  MULT_NORM (iX[4] * T[2] - iX[6] * T[3]);
    oX[2]       =  MULT_NORM (iX[0] * T[1] + iX[2] * T[0]);
    oX[3]       =  MULT_NORM (iX[0] * T[0] - iX[2] * T[1]);
    iX          = pointer(iX,-8);
    oX          = pointer(oX,4);
  }while(iX&&iX.byteOffset>=_in.byteOffset);
  
  mdct_butterflies(init,pointer(out,n2),n2);
  mdct_bitreverse(init,out);
  
  /* roatate + window */

  {
    oX1=pointer(out,n2+n4);
    oX2=pointer(out,n2+n4);
    iX =pointer(out,0);
    T  =pointer(init.trig,n2);
    
    do{
      oX1=pointer(oX1,-4);

      oX1[3]  =  MULT_NORM (iX[0] * T[1] - iX[1] * T[0]);
      oX2[0]  = -MULT_NORM (iX[0] * T[0] + iX[1] * T[1]);

      oX1[2]  =  MULT_NORM (iX[2] * T[3] - iX[3] * T[2]);
      oX2[1]  = -MULT_NORM (iX[2] * T[2] + iX[3] * T[3]);

      oX1[1]  =  MULT_NORM (iX[4] * T[5] - iX[5] * T[4]);
      oX2[2]  = -MULT_NORM (iX[4] * T[4] + iX[5] * T[5]);

      oX1[0]  =  MULT_NORM (iX[6] * T[7] - iX[7] * T[6]);
      oX2[3]  = -MULT_NORM (iX[6] * T[6] + iX[7] * T[7]);

      oX2=pointer(oX2,4);
      iX    =   pointer(iX,8);
      T     =   pointer(T,8);
    }while(iX&&oX1&&iX.byteOffset<oX1.byteOffset);
    
    iX=pointer(out,n2+n4);
    oX1=pointer(out,n4);
    oX2=oX1;
    
    do{
      oX1=pointer(oX1,-4);
      iX=pointer(iX,-4);
      
      oX2[0] = -(oX1[3] = iX[3]);
      oX2[1] = -(oX1[2] = iX[2]);
      oX2[2] = -(oX1[1] = iX[1]);
      oX2[3] = -(oX1[0] = iX[0]);
      
      oX2=pointer(oX2,4);
    }while(oX2&&iX&&oX2.byteOffset<iX.byteOffset);
    
    iX=pointer(out,n2+n4);
    oX1=pointer(out,n2+n4);
    oX2=pointer(out,n2);
    do{
      oX1=pointer(oX1,-4);
      oX1[0]= iX[3];
      oX1[1]= iX[2];
      oX1[2]= iX[1];
      oX1[3]= iX[0];
      iX=pointer(iX,4);
    }while(oX1&&oX1.byteOffset>oX2.byteOffset);
  }
}

function mdct_forward(init, _in, out) {
  NOT_IMPLEMENTED();
}
