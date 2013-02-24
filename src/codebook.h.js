/* This structure encapsulates huffman and VQ style encoding books; it
   doesn't do anything specific to either.

   valuelist/quantlist are nonNULL (and q_* significant) only if
   there's entry->value mapping to be done.

   If encode-side mapping must be done (and thus the entry needs to be
   hunted), the auxiliary encode pointer will point to a decision
   tree.  This is true of both VQ and huffman, but is mostly useful
   with VQ.

*/

function static_codebook(p) {
  p = p||{};
  
  // long   dim;            /* codebook dimensions (elements per vector) */
  // long   entries;        /* codebook entries */
  // long  *lengthlist;     /* codeword lengths in bits */

  // /* mapping ***************************************************************/
  // int    maptype;        /* 0=none
  //                           1=implicitly populated values from map column
  //                           2=listed arbitrary values */

  // /* The below does a linear, single monotonic sequence mapping. */
  // long     q_min;       /* packed 32 bit float; quant value 0 maps to minval */
  // long     q_delta;     /* packed 32 bit float; val 1 - val 0 == delta */
  // int      q_quant;     /* bits: 0 < quant <= 16 */
  // int      q_sequencep; /* bitflag */

  // long     *quantlist;  /* map == 1: (int)(entries^(1/dim)) element column map
  //                          map == 2: list of dim*entries quantized entry vals
  //                       */
  // int allocedp;

  p.dim = 0;
  p.entries = 0;
  p.lengthlist = null;
  p.maptype = 0;
  p.q_min = 0;
  p.q_delta = 0;
  p.q_quant = 0;
  p.q_sequencep = 0;
  p.quantlist = null;
  p.allocedp = 0;
  p.__name = "static_codebook";
  
  return p;
}

function codebook(p) {
  p = p||{};
  
  // long dim;           /* codebook dimensions (elements per vector) */
  // long entries;       /* codebook entries */
  // long used_entries;  /* populated codebook entries */
  // const static_codebook *c;

  // /* for encode, the below are entry-ordered, fully populated */
  // /* for decode, the below are ordered by bitreversed codeword and only
  //    used entries are populated */
  // float        *valuelist;  /* list of dim*entries actual entry values */
  // ogg_uint32_t *codelist;   /* list of bitstream codewords for each entry */

  // int          *dec_index;  /* only used if sparseness collapsed */
  // char         *dec_codelengths;
  // ogg_uint32_t *dec_firsttable;
  // int           dec_firsttablen;
  // int           dec_maxlength;

  // /* The current encoder uses only centered, integer-only lattice books. */
  // int           quantvals;
  // int           minval;
  // int           delta;
  
  p.dim = 0;
  p.entries = 0;
  p.used_entries = 0;
  p.c = null;
  p.valuelist = null;
  p.codelist = null;
  p.dec_index = null;
  p.dec_codelengths = null;
  p.dec_firsttable = null;
  p.dec_firsttablen = 0;
  p.dec_maxlength = 0;
  p.quantvals = 0;
  p.minval = 0;
  p.delta = 0;
  p.__name = "codebook";
  
  return p;
}
