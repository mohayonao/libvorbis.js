/* this would all be simpler/shorter with templates, but.... */
/* Floor backend generic *****************************************/
function vorbis_func_floor(p) {
  p = p||{};
  
  // void                   (*pack)  (vorbis_info_floor *,oggpack_buffer *);
  // vorbis_info_floor     *(*unpack)(vorbis_info *,oggpack_buffer *);
  // vorbis_look_floor     *(*look)  (vorbis_dsp_state *,vorbis_info_floor *);
  // void (*free_info) (vorbis_info_floor *);
  // void (*free_look) (vorbis_look_floor *);
  // void *(*inverse1)  (struct vorbis_block *,vorbis_look_floor *);
  // int   (*inverse2)  (struct vorbis_block *,vorbis_look_floor *,
  //                    void *buffer,float *);
  
  p.pack      = NOP;
  p.unpack    = NOP;
  p.look      = NOP;
  p.free_info = NOP;
  p.free_look = NOP;
  p.inverse1  = NOP;
  p.inverse2  = NOP;
  p.__name = "vorbis_func_floor";
  
  return p;
}

function vorbis_info_floor0(p) {
  p = p||{};
  
  // int   order;
  // long  rate;
  // long  barkmap;
  // int   ampbits;
  // int   ampdB;
  // int   numbooks; /* <= 16 */
  // int   books[16];
  // float lessthan;     /* encode-only config setting hacks for libvorbis */
  // float greaterthan;  /* encode-only config setting hacks for libvorbis */

  p.order = 0;
  p.rate = 0;
  p.barkmap = 0;
  p.ampbits = 0;
  p.ampdB = 0;
  p.numbooks = 0;
  p.books = calloc(16, int16);
  p.lessthan = 0;
  p.greaterthan = 0;
  p.__name = "vorbis_info_floor0";
  
  return p;
}

var VIF_POSIT = 63;
var VIF_CLASS = 16;
var VIF_PARTS = 31;

function vorbis_info_floor1(p) {
  p = p||{};
  
  // int   partitions;                /* 0 to 31 */
  // int   partitionclass[VIF_PARTS]; /* 0 to 15 */

  // int   class_dim[VIF_CLASS];        /* 1 to 8 */
  // int   class_subs[VIF_CLASS];       /* 0,1,2,3 (bits: 1<<n poss) */
  // int   class_book[VIF_CLASS];       /* subs ^ dim entries */
  // int   class_subbook[VIF_CLASS][8]; /* [VIF_CLASS][subs] */
  
  // int   mult;                      /* 1 2 3 or 4 */
  // int   postlist[VIF_POSIT+2];    /* first two implicit */
  
  // /* encode side analysis parameters */
  // float maxover;
  // float maxunder;
  // float maxerr;

  // float twofitweight;
  // float twofitatten;

  // int   n;
  
  p.partitions = 0;
  p.partitionclass = calloc(VIF_PARTS, int16);
  p.class_dim = calloc(VIF_CLASS, int16);
  p.class_subs = calloc(VIF_CLASS, int16);
  p.class_book = calloc(VIF_CLASS, int16);
  p.class_subbook = calloc([VIF_CLASS,8], int16);
  
  p.mult = 0;
  p.postlist = calloc(VIF_POSIT+2, int16);
  p.maxover = 0;
  p.maxunder = 0;
  p.maxerr = 0;
  p.twofitweight = 0;
  p.twofitatten = 0;
  p.n = 0;
  p.__name = "vorbis_info_floor1";
  
  return p;
}

/* Residue backend generic *****************************************/
function vorbis_func_residue(p) {
  p = p||{};
  
  // void                 (*pack)  (vorbis_info_residue *,oggpack_buffer *);
  // vorbis_info_residue *(*unpack)(vorbis_info *,oggpack_buffer *);
  // vorbis_look_residue *(*look)  (vorbis_dsp_state *,
  //                                vorbis_info_residue *);
  // void (*free_info)    (vorbis_info_residue *);
  // void (*free_look)    (vorbis_look_residue *);
  // long **(*class)      (struct vorbis_block *,vorbis_look_residue *,
  //                       int **,int *,int);
  // int  (*forward)      (oggpack_buffer *,struct vorbis_block *,
  //                       vorbis_look_residue *,
  //                       int **,int *,int,long **,int);
  // int  (*inverse)      (struct vorbis_block *,vorbis_look_residue *,
  //                       float **,int *,int);
  
  p.pack = NOP;
  p.unpack = NOP;
  p.look = NOP;
  p.free_info = NOP;
  p.free_look = NOP;
  p.klass = NOP;
  p.forward = NOP;
  p.inverse = NOP;
  p.__name = "vorbis_func_residue";
  
  return p;
}

function vorbis_info_residue0(p) {
  p = p||{};
  
  // /* block-partitioned VQ coded straight residue */
  // long  begin;
  // long  end;

  // /* first stage (lossless partitioning) */
  // int    grouping;         /* group n vectors per partition */
  // int    partitions;       /* possible codebooks for a partition */
  // int    partvals;         /* partitions ^ groupbook dim */
  // int    groupbook;        /* huffbook for partitioning */
  // int    secondstages[64]; /* expanded out to pointers in lookup */
  // int    booklist[512];    /* list of second stage books */

  // const int classmetric1[64];
  // const int classmetric2[64];

  p.begin = 0;
  p.end = 0;
  p.grouping = 0;
  p.partitions = 0;
  p.partvals = 0;
  p.groupbook = 0;
  p.secondstages = calloc(64, int16);
  p.booklist = calloc(512, int16);
  p.classmetric1 = calloc(64, int16);
  p.classmetric2 = calloc(64, int16);
  p.__name = "vorbis_info_residue0";
  
  return p;
}

/* Mapping backend generic *****************************************/
function vorbis_func_mapping(p) {
  p = p||{};
  
  // void                 (*pack)  (vorbis_info *,vorbis_info_mapping *,
  //                                oggpack_buffer *);
  // vorbis_info_mapping *(*unpack)(vorbis_info *,oggpack_buffer *);
  // void (*free_info)    (vorbis_info_mapping *);
  // int  (*forward)      (struct vorbis_block *vb);
  // int  (*inverse)      (struct vorbis_block *vb,vorbis_info_mapping *);
  
  p.pack = NOP;
  p.unpack = NOP;
  p.free_info = NOP;
  p.forward = NOP;
  p.inverse = NOP;
  p.__name = "vorbis_func_mapping";
  
  return p;
}

function vorbis_info_mapping0(p) {
  p = p||{};
  
  // int   submaps;  /* <= 16 */
  // int   chmuxlist[256];   /* up to 256 channels in a Vorbis stream */

  // int   floorsubmap[16];   /* [mux] submap to floors */
  // int   residuesubmap[16]; /* [mux] submap to residue */

  // int   coupling_steps;
  // int   coupling_mag[256];
  // int   coupling_ang[256];
  
  p.submaps = 0;
  p.chmuxlist = calloc(256, int16);
  p.floorsubmap = calloc(16, int16);
  p.residuesubmap = calloc(16, int16);
  p.coupling_steps = 0;
  p.coupling_mag = calloc(256, int16);
  p.coupling_ang = calloc(256, int16);
  p.__name = "vorbis_info_mapping0";
  
  return p;
}
