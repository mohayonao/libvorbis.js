module.exports = function(grunt) {
  "use strict";
  
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-clean");
  
  grunt.initConfig({
    watch: {
      scripts: {
        files: [
          "include/*.js", "include/vorbis/*.js",
          "src/*.js", "examples/*.js", "test/*.js"
        ],
        tasks: ["concat", "jshint", "uglify"],
        options: {
          interrupt: true
        }
      }
    },
    concat: {
      dist: {
        src: [
          "build/header.txt",
          "include/*.js",
          "libogg.js/include/ogg/*.js",
          "include/vorbis/*.js",
          "libogg.js/src/*.js",
          "src/*.js",
          "build/footer.txt"
        ],
        dest: "liboggvorbis.dev.js"
      }
    },
    jshint: {
      all: ["liboggvorbis.dev.js", "examples/*.js", "test/*.js"],
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
          sourceMap: "liboggvorbis.js.map"
        },
        files: {
          "liboggvorbis.js": ["liboggvorbis.dev.js"]
        }
      }
    },
    clean: ["liboggvorbis.dev.js", "liboggvorbis.js", "liboggvorbis.js.map"]
  });
  
  grunt.registerTask("default", ["concat", "jshint", "uglify"]);
};

