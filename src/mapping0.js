/* simplistic, wasteful way of doing this (unique lookup for each
   mode/submapping); there should be a central repository for
   identical lookups.  That will require minor work, so I'm putting it
   off as low priority.

   Why a lookup for each backend in a given mode?  Because the
   blocksize is set by the mode, and low backend lookups may require
   parameters from other areas of the mode/mapping */

function mapping0_free_info(i) {
  NOT_IMPLEMENTED();
}

function mapping0_pack(vi, vm, opb) {
  NOT_IMPLEMENTED();
}

/* also responsible for range checking */
function mapping0_unpack(vi, opb) {
  NOT_IMPLEMENTED();
}

function mapping0_forward(vb){
  NOT_IMPLEMENTED();
}

function mapping0_inverse(vb, l) {
  NOT_IMPLEMENTED();
}

/* export hooks */
var mapping0_exportbundle = vorbis_func_mapping();
set_kv(mapping0_exportbundle, {
  pack     : mapping0_pack,
  unpack   : mapping0_unpack,
  free_info: mapping0_free_info,
  forward  : mapping0_forward,
  inverse  : mapping0_inverse
});
