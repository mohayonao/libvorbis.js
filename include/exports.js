function VorbisInfo() {
  vorbis_info(this);
  
  this.init = vorbis_info_init.bind(null, this);
  this.headerin = vorbis_synthesis_headerin.bind(null, this);
}
exports.vorbis.Info = VorbisInfo;

function VorbisDspState() {
  vorbis_dsp_state(this);

  this.init = vorbis_synthesis_init.bind(null, this);
}
exports.vorbis.DspState = VorbisDspState;

function VorbisComment() {
  vorbis_comment(this);
  
  this.init = vorbis_comment_init.bind(null, this);
  this.clear = vorbis_comment_clear.bind(null, this);
}
exports.vorbis.Comment = VorbisComment;

function VorbisBlock() {
  vorbis_block(this);
}
exports.vorbis.Block = VorbisBlock;
