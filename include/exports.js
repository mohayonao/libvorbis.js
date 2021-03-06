function VorbisInfo() {
  vorbis_info(this);
  
  this.init = vorbis_info_init.bind(null, this);
  this.clear = vorbis_info_clear.bind(null, this);
  this.headerin = vorbis_synthesis_headerin.bind(null, this);
}
exports.vorbis.Info = VorbisInfo;

function VorbisDspState() {
  vorbis_dsp_state(this);

  this.init = vorbis_synthesis_init.bind(null, this);
  this.block_init = vorbis_block_init.bind(null, this);
  this.blockin = vorbis_synthesis_blockin.bind(null, this);
  this.pcmout = vorbis_synthesis_pcmout.bind(null, this);
  this.read = vorbis_synthesis_read.bind(null, this);
  this.clear = vorbis_dsp_clear.bind(null, this);
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
  
  this.synthesis = vorbis_synthesis.bind(null, this);
  this.clear = vorbis_block_clear.bind(null, this);
}
exports.vorbis.Block = VorbisBlock;

function StaticCodebook(kv) {
  static_codebook(this);
  
  if (kv) {
    set_kv(this, kv);
  }
  
  this._unquantize = _book_unquantize.bind(null, this);
}
exports.vorbis._StaticCodebook = StaticCodebook;
