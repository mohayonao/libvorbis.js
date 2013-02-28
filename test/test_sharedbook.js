"use strict";

/*global NULL:true,assert:true,fprintf:true,stderr:true,exit:true */
require("./stdio.h");

// SELFTEST ////////////////////////////////////////////////////////////////////
var liboggvorbis = require("../liboggvorbis.dev.js");
var vorbis = liboggvorbis.vorbis;

function static_codebook() {
  var list = arguments;
  return new vorbis._StaticCodebook({
    dim        : list[0],
    entries    : list[1],
    lengthlist : list[2],
    maptype    : list[3],
    q_min      : list[4],
    q_delta    : list[5],
    q_quant    : list[6],
    q_sequencep: list[7],
    quantlist  : list[8],
    allocedp   : list[9]
  });
}

var full_quantlist1=new Int32Array([0,1,2,3,    4,5,6,7, 8,3,6,1]);
var partial_quantlist1=new Int32Array([0,7,2]);

/* no mapping */
var test1=static_codebook(
  4,16,
  NULL,
  0,
  0,0,0,0,
  NULL,
  0
);
var test1_result=null;

/* linear, full mapping, nonsequential */
var test2=static_codebook(
  4,3,
  NULL,
  2,
  -533200896,1611661312,4,0,
  full_quantlist1,
  0
);
var test2_result=new Float32Array([-3,-2,-1,0, 1,2,3,4, 5,0,3,-2]);

/* linear, full mapping, sequential */
var test3=static_codebook(
  4,3,
  NULL,
  2,
  -533200896,1611661312,4,1,
  full_quantlist1,
  0
);
var test3_result=new Float32Array([-3,-5,-6,-6, 1,3,6,10, 5,5,8,6]);

/* linear, algorithmic mapping, nonsequential */
var test4=static_codebook(
  3,27,
  NULL,
  1,
  -533200896,1611661312,4,0,
  partial_quantlist1,
  0
);
var test4_result=new Float32Array([-3,-3,-3, 4,-3,-3, -1,-3,-3,
                                   -3, 4,-3, 4, 4,-3, -1, 4,-3,
                                   -3,-1,-3, 4,-1,-3, -1,-1,-3,
                                   -3,-3, 4, 4,-3, 4, -1,-3, 4,
                                   -3, 4, 4, 4, 4, 4, -1, 4, 4,
                                   -3,-1, 4, 4,-1, 4, -1,-1, 4,
                                   -3,-3,-1, 4,-3,-1, -1,-3,-1,
                                   -3, 4,-1, 4, 4,-1, -1, 4,-1,
                                   -3,-1,-1, 4,-1,-1, -1,-1,-1]);

/* linear, algorithmic mapping, sequential */
var test5=static_codebook(
  3,27,
  NULL,
  1,
  -533200896,1611661312,4,1,
  partial_quantlist1,
  0
);
var test5_result=new Float32Array([-3,-6,-9, 4, 1,-2, -1,-4,-7,
                                   -3, 1,-2, 4, 8, 5, -1, 3, 0,
                                   -3,-4,-7, 4, 3, 0, -1,-2,-5,
                                   -3,-6,-2, 4, 1, 5, -1,-4, 0,
                                   -3, 1, 5, 4, 8,12, -1, 3, 7,
                                   -3,-4, 0, 4, 3, 7, -1,-2, 2,
                                   -3,-6,-7, 4, 1, 0, -1,-4,-5,
                                   -3, 1, 0, 4, 8, 7, -1, 3, 2,
                                   -3,-4,-5, 4, 3, 2, -1,-2,-3]);


function run_test(b, comp) {
  assert.instanceOf(b, "static_codebook");
  assert.instanceOf(comp, "float*");
    
  var out=b._unquantize(b.entries,null);
  var i;

  if(comp){
    if(!out){
      fprintf(stderr,"_book_unquantize incorrectly returned NULL\n");
      exit(1);
    }
    
    for(i=0;i<b.entries*b.dim;i++)
      if(Math.abs(out[i]-comp[i])>0.0001){
        fprintf(stderr,"disagreement in unquantized and reference data:\n position %d, %g != %g\n",i,out[i],comp[i]);
        exit(1);
      }

  }else{
    if(out){
      fprintf(stderr,"_book_unquantize returned a value array: \n correct result should have been NULL\n");
      exit(1);
    }
  }
}

function main() {
  /* run the nine dequant tests, and compare to the hand-rolled results */
  fprintf(stderr,"Dequant test 1... ");
  run_test(test1,test1_result);
  fprintf(stderr,"OK\nDequant test 2... ");
  run_test(test2,test2_result);
  fprintf(stderr,"OK\nDequant test 3... ");
  run_test(test3,test3_result);
  fprintf(stderr,"OK\nDequant test 4... ");
  run_test(test4,test4_result);
  fprintf(stderr,"OK\nDequant test 5... ");
  run_test(test5,test5_result);
  fprintf(stderr,"OK\n\n");

  return(0);
}

main();
