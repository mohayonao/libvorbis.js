/* packs the given codebook into the bitstream **************************/

function vorbis_staticbook_pack(c, opb) {
  NOT_IMPLEMENTED();
}

/* unpacks a codebook from the packet buffer into the codebook struct,
   readies the codebook auxiliary structures for decode *************/
function vorbis_staticbook_unpack(opb) {
  NOT_IMPLEMENTED();
}

/* returns the number of bits ************************************************/
function vorbis_book_encode(book, a, b) {
  NOT_IMPLEMENTED();
}

function decode_packed_entry_number(book, b) {
  NOT_IMPLEMENTED();
}

/* Decode side is specced and easier, because we don't need to find
   matches using different criteria; we simply read and map.  There are
   two things we need to do 'depending':

   We may need to support interleave.  We don't really, but it's
   convenient to do it here rather than rebuild the vector later.

   Cascades may be additive or multiplicitive; this is not inherent in
   the codebook, but set in the code using the codebook.  Like
   interleaving, it's easiest to do it here.
   addmul==0 -> declarative (set the value)
   addmul==1 -> additive
   addmul==2 -> multiplicitive */

/* returns the [original, not compacted] entry number or -1 on eof *********/
function vorbis_book_decode(book, b) {
  NOT_IMPLEMENTED();
}

/* returns 0 on OK or -1 on eof *************************************/
/* decode vector / dim granularity gaurding is done in the upper layer */
function vorbis_book_decodevs_add(book, a, b, n) {
  NOT_IMPLEMENTED();
}

/* decode vector / dim granularity gaurding is done in the upper layer */
function vorbis_book_decodev_add(book, a, b, n) {
  NOT_IMPLEMENTED();
}

/* unlike the others, we guard against n not being an integer number
   of <dim> internally rather than in the upper layer (called only by
   floor0) */
function vorbis_book_decodev_set(book, a, b, n) {
  NOT_IMPLEMENTED();
}

function vorbis_book_decodevv_add(book, a, offset, ch, b, n) {
  NOT_IMPLEMENTED();
}
