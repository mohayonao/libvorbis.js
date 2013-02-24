#include <stdio.h>
#include <math.h>

/* 32 bit float (not IEEE; nonnormalized mantissa +
   biased exponent) : neeeeeee eeemmmmm mmmmmmmm mmmmmmmm
   Why not IEEE?  It's just not that important here. */

#define VQ_FEXP 10
#define VQ_FMAN 21
#define VQ_FEXP_BIAS 768 /* bias toward values smaller than 1. */

/* doesn't currently guard under/overflow */
long _float32_pack(float val){
  int sign=0;
  long exp;
  long mant;
  if(val<0){
    sign=0x80000000;
    val= -val;
  }
  exp= floor(log(val)/log(2.f)+.001); //+epsilon
  mant=rint(ldexp(val,(VQ_FMAN-1)-exp));
  exp=(exp+VQ_FEXP_BIAS)<<VQ_FMAN;

  return(sign|exp|mant);
}


int main(void) {
  float src[] = {
    -1.2f,
    -1.0f,
    -0.5f,
    +0.0f,
    +0.5f,
    +1.0f,
    +1.2f,
  };
  int size = sizeof(src) / sizeof(*src);
  for (int i = 0; i < size; i++) {
    printf("test(%f, %ld);\n", src[i], _float32_pack(src[i]));
  }
  return 0;
}
