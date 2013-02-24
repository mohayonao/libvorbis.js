function VorbisInfo() {
  vorbis_info(this);
  
  this.init = vorbis_info_init.bind(null, this);
}
exports.vorbis.Info = VorbisInfo;

function VorbisDspState() {
  vorbis_dsp_state(this);
}
exports.vorbis.DspState = VorbisDspState;

function VorbisComment() {
  vorbis_comment(this);
}
exports.vorbis.Comment = VorbisComment;

function VorbisBlock() {
  vorbis_block(this);
}
exports.vorbis.Block = VorbisBlock;
