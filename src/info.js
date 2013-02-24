/* general handling of the header and the vorbis_info structure (and
   substructures) */

var GENERAL_VENDOR_STRING = "Xiph.Org libVorbis 1.3.3";
var ENCODE_VENDOR_STRING  = "Xiph.Org libVorbis I 20120203 (Omnipresent)";

function _v_writestring(o, s, bytes) {
  NOT_IMPLEMENTED();
}

function _v_readstring(o, buf, bytes) {
  NOT_IMPLEMENTED();
}

function vorbis_comment_init(vc) {
  vorbis_comment(vc);
}

function vorbis_comment_add(vc, comment) {
  NOT_IMPLEMENTED();
}

function vorbis_comment_add_tag(vc, tag, contents) {
  NOT_IMPLEMENTED();
}

function vorbis_comment_query(vc, tag, count) {
  NOT_IMPLEMENTED();
}

function vorbis_comment_query_count(vc, tag) {
  NOT_IMPLEMENTED();
}

function vorbis_comment_clear(vc) {
  NOT_IMPLEMENTED();
}

/* blocksize 0 is guaranteed to be short, 1 is guaranteed to be long.
   They may be equal, but short will never ge greater than long */
function vorbis_info_blocksize(vi, zo) {
  NOT_IMPLEMENTED();
}

/* used by synthesis, which has a full, alloced vi */
function vorbis_info_init(vi) {
  vorbis_info(vi);
  vi.codec_setup=codec_setup_info();
}

function vorbis_info_clear(vi) {
  vorbis_info(vi);
}

/* Header packing/unpacking ********************************************/

function _vorbis_unpack_info(vi, opb) {
  NOT_IMPLEMENTED();
}

function _vorbis_unpack_comment(vc, opb) {
  NOT_IMPLEMENTED();
}

/* all of the real encoding details are here.  The modes, books,
   everything */
function _vorbis_unpack_books(vi, opb) {
  NOT_IMPLEMENTED();
}

/* Is this packet a vorbis ID header? */
function vorbis_synthesis_idheader(op) {
  NOT_IMPLEMENTED();
}

/* The Vorbis header is in three packets; the initial small packet in
   the first page that identifies basic parameters, a second packet
   with bitstream comments and a third packet that holds the
   codebook. */
function vorbis_synthesis_headerin(vi, vc, op) {
  NOT_IMPLEMENTED();
}

/* pack side **********************************************************/

function _vorbis_pack_info(opb, vi) {
  NOT_IMPLEMENTED();
}

function _vorbis_pack_comment(opb, vc) {
  NOT_IMPLEMENTED();
}

function _vorbis_pack_books(opb, vi) {
  NOT_IMPLEMENTED();
}

function vorbis_commentheader_out(vc, op) {
  NOT_IMPLEMENTED();
}

function vorbis_analysis_headerout(v, vc, op, op_comm, op_code) {
  NOT_IMPLEMENTED();
}

function vorbis_granule_time(v, granulepos) {
  NOT_IMPLEMENTED();
}

function vorbis_version_string() {
  return GENERAL_VENDOR_STRING;
}
