#include <stdio.h>

/* the 'eliminate the decode tree' optimization actually requires the
   codewords to be MSb first, not LSb.  This is an annoying inelegancy
   (and one of the first places where carefully thought out design
   turned out to be wrong; Vorbis II and future Ogg codecs should go
   to an MSb bitpacker), but not actually the huge hit it appears to
   be.  The first-stage decode table catches most words so that
   bitreverse is not in the main execution path. */

static unsigned int bitreverse(unsigned int x) {
  x=    ((x>>16)&0x0000ffff) | ((x<<16)&0xffff0000);
  x=    ((x>> 8)&0x00ff00ff) | ((x<< 8)&0xff00ff00);
  x=    ((x>> 4)&0x0f0f0f0f) | ((x<< 4)&0xf0f0f0f0);
  x=    ((x>> 2)&0x33333333) | ((x<< 2)&0xcccccccc);
  return((x>> 1)&0x55555555) | ((x<< 1)&0xaaaaaaaa);
}

int main(void) {
  printf("test(0x%08x, 0x%08x);\n", 0, bitreverse(0));
  for (int i = 0; i < 31; i++) {
    unsigned int x = 0x103785af << i;
    unsigned int y = bitreverse(x);
    printf("test(0x%08x, 0x%08x);\n", x, y);
    printf("test(0x%08x, 0x%08x);\n", y, bitreverse(y));
  }
  
  return 0;
}
