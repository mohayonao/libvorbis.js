module.exports = function(grunt) {
  "use strict";
  
  var fs = require("fs");
  
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-clean");
  
  grunt.initConfig({
    watch: {
      scripts: {
        files: [
          "include/*.js", "include/vorbis/*.js", "src/*.js"
        ],
        tasks: ["concat", "jshint:dest", "uglify"]
      },
      examples: {
        files: ["examples/*.js"],
        tasks: ["jshint:examples"]
      },
      tests: {
        files: ["test/*.js"],
        tasks: ["jshint:tests"]
      }
    },
    concat: {
      dist: {
        src: [
          "build/header.txt",
          "include/stdlib.js",
          "include/utils.js",
          "libogg.js/include/ogg/ogg.h.js",
          "include/vorbis/codec.h.js",
          "libogg.js/src/*.js",
          "src/*.js",
          "libogg.js/include/exports.js",
          "include/exports.js",
          "build/footer.txt"
        ],
        dest: "libvorbis.dev.js"
      }
    },
    jshint: {
      dest    : ["libvorbis.dev.js"],
      examples: ["examples/*.js"],
      tests   : ["test/*.js"],
      options: {
        curly   : false,
        eqeqeq  : true,
        latedef : true,
        noarg   : true,
        noempty : true,
        quotmark: "double",
        undef   : true,
        strict  : true,
        trailing: true,
        newcap  : true,
        browser : true,
        node    : true
      }
    },
    uglify: {
      all: {
        options: {
          sourceMap: "libvorbis.js.map"
        },
        files: {
          "libvorbis.js": ["libvorbis.dev.js"]
        }
      }
    },
    clean: ["libvorbis.dev.js", "libvorbis.js", "libvorbis.js.map"]
  });
  
  grunt.registerTask("default", ["concat", "jshint:dest", "uglify"]);
};
