#include <stdio.h>
#include <math.h>

/* 32 bit float (not IEEE; nonnormalized mantissa +
   biased exponent) : neeeeeee eeemmmmm mmmmmmmm mmmmmmmm
   Why not IEEE?  It's just not that important here. */

#define VQ_FEXP 10
#define VQ_FMAN 21
#define VQ_FEXP_BIAS 768 /* bias toward values smaller than 1. */

float _float32_unpack(long val){
  double mant=val&0x1fffff;
  int    sign=val&0x80000000;
  long   exp =(val&0x7fe00000L)>>VQ_FMAN;
  if(sign)mant= -mant;
  return(ldexp(mant,exp-(VQ_FMAN-1)-VQ_FEXP_BIAS));
}


int main(void) {
  long src[] = {
    -535612621,
    -535822336,
    -537919488,
    1610612736,
    1609564160,
    1611661312,
    1611871027,
    +2147483647,
    -2147483648,
  };
  int size = sizeof(src) / sizeof(*src);
  for (int i = 0; i < size; i++) {
    printf("testpack(%ld, %f);\n", src[i], _float32_unpack(src[i]));
  }
  return 0;
}
