/* given a list of word lengths, generate a list of codewords.  Works
   for length ordered or unordered, always assigns the lowest valued
   codewords first.  Extended to handle unused entries (length 0) */
function _make_words(l, n, sparsecount) {
  NOT_IMPLEMENTED();
}

/* there might be a straightforward one-line way to do the below
   that's portable and totally safe against roundoff, but I haven't
   thought of it.  Therefore, we opt on the side of caution */
function _book_maptype1_quantvals(b) {
  var vals=Math.floor(Math.pow(b.entries,1/b.dim));
  var acc,acc1,i;
  
  /* the above *should* be reliable, but we'll not assume that FP is
     ever reliable when bitstream sync is at stake; verify via integer
     means that vals really is the greatest value of dim for which
     vals^b.bim <= b.entries */
  /* treat the above as an initial guess */
  while(1){
    acc=1;
    acc1=1;
    for(i=0;i<b.dim;i++){
      acc*=vals;
      acc1*=vals+1;
    }
    if(acc<=b.entries && acc1>b.entries){
      return(vals);
    }else{
      if(acc>b.entries){
        vals--;
      }else{
        vals++;
      }
    }
  }
}

/* unpack the quantized list of values for encode/decode ***********/
/* we need to deal with two map types: in map type 1, the values are
   generated algorithmically (each column of the vector counts through
   the values in the quant vector). in map type 2, all the values came
   in in an explicit list.  Both value lists must be unpacked */
function _book_unquantize(b, n, sparsemap) {
  NOT_IMPLEMENTED();
}

function vorbis_staticbook_destroy(b) {
  NOT_IMPLEMENTED();
}

function vorbis_book_clear(b){
  NOT_IMPLEMENTED();
}

function vorbis_book_init_encode(c, s) {
  NOT_IMPLEMENTED();
}

/* decode codebook arrangement is more heavily optimized than encode */
function vorbis_book_init_decode(c, s) {
  NOT_IMPLEMENTED();
}

function vorbis_book_codeword(book, entry) {
  NOT_IMPLEMENTED();
}

function vorbis_book_codelen(book, entry) {
  NOT_IMPLEMENTED();
}
