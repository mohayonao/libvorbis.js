"use strict";

var fs = require("fs");

require("./stdio.h");
/*global stdin:true,stderr:true,fread:true,fprintf:true,exit:true,pointer:true */

stdin.fp = new Uint8Array(fs.readFileSync(__dirname + "/sample01.ogg"));


// decoder_example.js //////////////////////////////////////////////////////////

/* Takes a vorbis bitstream from stdin and writes raw stereo PCM to
   stdout. Decodes simple and chained OggVorbis files from beginning
   to end. Vorbisfile.a is somewhat more complex than the code below.  */

var liboggvorbis = require("../liboggvorbis.dev.js");
var ogg    = liboggvorbis.ogg;
var vorbis = liboggvorbis.vorbis;

/* take 8k out of the data segment, not the stack */
var convbuffer=new Int16Array(4096);
var convsize=4096;

function main() {
  var oy = new ogg.SyncState();   /* sync and verify incoming physical bitstream */
  var os = new ogg.StreamState(); /* take physical pages, weld into a logical
                                     stream of packets */
  var og = new ogg.Page();        /* one Ogg bitstream page. Vorbis packets are inside */
  var op = new ogg.Packet();      /* one raw packet of data for decode */

  var vi = new vorbis.Info();     /* struct that stores all the static vorbis bitstream
                                     settings */
  var vc = new vorbis.Comment();  /* struct that stores all the bitstream user comments */
  var vd = new vorbis.DspState(); /* central working state for the packet->PCM decoder */
  var vb = new vorbis.Block();    /* local working space for packet->PCM decode */
  
  var buffer, bytes;
  var eos, i, j;
  var result,pcm,samples,clipflag,bout,mono,val,ptr;

  /********** Decode setup ************/

  oy.init(); /* Now we can read pages */

  while(1){ /* we repeat if the bitstream is chained */
    eos=0;
    
    /* grab some data at the head of the stream. We want the first page
       (which is guaranteed to be small and only contain the Vorbis
       stream initial header) We need the first page to get the stream
       serialno. */

    /* submit a 4k block to libvorbis' Ogg layer */
    buffer=oy.buffer(4096);
    bytes=fread(buffer,1,4096,stdin);
    oy.wrote(bytes);
    
    /* Get the first page. */
    if(oy.pageout(og)!==1){
      /* have we simply run out of data?  If so, we're done. */
      if(bytes<4096)break;
      
      /* error case.  Must not be Vorbis data */
      fprintf(stderr,"Input does not appear to be an Ogg bitstream.\n");
      exit(1);
    }
    
    /* Get the serial number and set up the rest of decode. */
    /* serialno first; use it to set up a logical stream */
    os.init(og.serialno());

    /* extract the initial header from the first page and verify that the
       Ogg bitstream is in fact Vorbis data */
    
    /* I handle the initial header first instead of just having the code
       read all three Vorbis headers at once because reading the initial
       header is an easy way to identify a Vorbis bitstream and it's
       useful to see that functionality seperated out. */
    
    vi.init();
    vc.init();
    if(os.pagein(og)<0){
      /* error; stream version mismatch perhaps */
      fprintf(stderr,"Error reading first page of Ogg bitstream data.\n");
      exit(1);
    }
    
    if(os.packetout(op)!==1){
      /* no page? must not be vorbis */
      fprintf(stderr,"Error reading initial header packet.\n");
      exit(1);
    }
    
    if(vi.headerin(vc,op)<0){
      /* error case; not a vorbis header */
      fprintf(stderr,"This Ogg bitstream does not contain Vorbis audio data.\n");
      exit(1);
    }

    /* At this point, we're sure we're Vorbis. We've set up the logical
       (Ogg) bitstream decoder. Get the comment and codebook headers and
       set up the Vorbis decoder */
    
    /* The next two packets in order are the comment and codebook headers.
       They're likely large and may span multiple pages. Thus we read
       and submit data until we get our two packets, watching that no
       pages are missing. If a page is missing, error out; losing a
       header page is the only place where missing data is fatal. */
    
    i=0;
    while(i<2){
      while(i<2){
        result=oy.pageout(og);
        if(result===0)break; /* Need more data */
        /* Don't complain about missing or corrupt data yet. We'll
           catch it at the packet output phase */
        if(result===1){
          os.pagein(og); /* we can ignore any errors here
                            as they'll also become apparent
                            at packetout */
          while(i<2){
            result=os.packetout(op);
            if(result===0)break;
            if(result<0){
              /* Uh oh; data at some point was corrupted or missing!
                 We can't tolerate that in a header.  Die. */
              fprintf(stderr,"Corrupt secondary header.  Exiting.\n");
              exit(1);
            }
            result=vi.headerin(vc,op);
            if(result<0){
              fprintf(stderr,"Corrupt secondary header.  Exiting.\n");
              exit(1);
            }
            i++;
          }
        }
      }
      /* no harm in not checking before adding more */
      buffer=oy.buffer(4096);
      bytes=fread(buffer,1,4096,stdin);
      if(bytes===0 && i<2){
        fprintf(stderr,"End of file before finding all Vorbis headers!\n");
        exit(1);
      }
      oy.wrote(bytes);
    }
    
    /* Throw the comments plus a few lines about the bitstream we're
       decoding */
    {
      /*jshint loopfunc:true */
      vc.user_comments.forEach(function(ptr) {
        if(ptr)fprintf(stderr,"%s\n",ptr);
      });
      /*jshint loopfunc:false */
      fprintf(stderr,"\nBitstream is %d channel, %ldHz\n",vi.channels,vi.rate);
      fprintf(stderr,"Encoded by: %s\n\n",vc.vendor);
    }

    convsize=4096/vi.channels;
    
    /* OK, got and parsed all three headers. Initialize the Vorbis
       packet->PCM decoder. */
    if(vd.init(vi)===0){ /* central decode state */
      vd.block_init(vd,vb);          /* local state for most of the decode
                                        so multiple block decodes can
                                        proceed in parallel. We could init
                                        multiple vorbis_block structures
                                        for vd here */
      
      /* The rest is just a straight decode loop until end of stream */
      while(!eos){
        while(!eos){
          result=oy.pageout(og);
          if(result===0)break; /* need more data */
          if(result<0){ /* missing or corrupt data at this page position */
            fprintf(stderr,"Corrupt or missing data in bitstream; continuing...\n");
          }else{
            os.pagein(og); /* can safely ignore errors at
                              this point */
            while(1){
              result=os.packetout(op);
              
              if(result===0)break; /* need more data */
              /*jshint noempty:false */
              if(result<0){ /* missing or corrupt data at this page position */
                /* no reason to complain; already complained above */
              }else{
                /* we have a packet.  Decode it */
                pcm=[];
                
                if(vb.synthesis(op)===0) /* test for success! */
                  vd.blockin(vb);
                /*
                  
                **pcm is a multichannel float vector.  In stereo, for
                example, pcm[0] is left, and pcm[1] is right.  samples is
                the size of each channel.  Convert the float values
                (-1.<=range<=1.) to whatever PCM format and write it out */
                
                while((samples=vd.pcmout(pcm))>0){
                  clipflag=0;
                  bout=(samples<convsize?samples:convsize);
                  
                  /* convert floats to 16 bit signed ints (host order) and
                     interleave */
                  for(i=0;i<vi.channels;i++){
                    ptr=pointer(convbuffer,i);
                    mono=pcm[i];
                    for(j=0;j<bout;j++){
                      // #if 1
                      val=Math.floor(mono[j]*32767+0.5);
                      // #else /* optional dither */
                      //   int val=mono[j]*32767.f+drand48()-0.5f;
                      // #endif
                      /* might as well guard against clipping */
                      if(val>32767){
                        val=32767;
                        clipflag=1;
                      }
                      if(val<-32768){
                        val=-32768;
                        clipflag=1;
                      }
                      // *ptr=val;
                      // ptr+=vi.channels;
                      ptr[0]=val;
                      ptr=pointer(ptr, vi.channels);
                    }
                  }
                  
                  if(clipflag)
                    fprintf(stderr,"Clipping in frame %ld\n",vd.sequence);
                  
                  
                  // fwrite(convbuffer,2*vi.channels,bout,stdout);
                  
                  vd.read(bout); /* tell libvorbis how
                                    many samples we
                                    actually consumed */
                }
              }
              /*jshint noempty:true */
            }
            if(os.eos())eos=1;
          }
        }
        if(!eos){
          buffer=oy.buffer(4096);
          bytes=fread(buffer,1,4096,stdin);
          oy.wrote(bytes);
          if(bytes===0)eos=1;
        }
      }
      
      /* ogg_page and ogg_packet structs always point to storage in
         libvorbis.  They're never freed or manipulated directly */
      
      vb.clear();
      vd.clear();
    }else{
      fprintf(stderr,"Error: Corrupt header during playback initialization.\n");
    }
    
    /* clean up this logical bitstream; before exit we see if we're
       followed by another [chained] */
    
    os.clear();
    vc.clear();
    vi.clear();  /* must be called last */
  }
  
  /* OK, clean up the framer */
  oy.clear();
  
  fprintf(stderr,"Done.\n");
  return(0);
}

main();
