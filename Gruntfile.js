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
        files: ["examples/*.js", "!examples/stdio.h.js"],
        tasks: ["jshint:examples"]
      },
      tests: {
        files: ["test/*.js", "!test/stdio.h.js"],
        tasks: ["jshint:tests"]
      },
      test_stdio_h: {
        files: ["test/stdio.h.js"],
        tasks: ["filesync:test"]
      },
      examples_stdio_h: {
        files: ["examples/stdio.h.js"],
        tasks: ["filesync:examples"]
      }
    },
    concat: {
      dist: {
        src: [
          "build/header.txt",
          "include/stdlib.js",
          "libogg.js/include/ogg/ogg.h.js",
          "include/vorbis/codec.h.js",
          "libogg.js/src/*.js",
          "src/*.js",
          "libogg.js/include/exports.js",
          "include/exports.js",
          "build/footer.txt"
        ],
        dest: "liboggvorbis.dev.js"
      }
    },
    jshint: {
      dest    : ["liboggvorbis.dev.js"],
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
          sourceMap: "liboggvorbis.js.map"
        },
        files: {
          "liboggvorbis.js": ["liboggvorbis.dev.js"]
        }
      }
    },
    clean: ["liboggvorbis.dev.js", "liboggvorbis.js", "liboggvorbis.js.map"]
  });
  
  grunt.registerTask("default", ["concat", "jshint:dest", "uglify"]);
  
  var safe_recursion = (function() {
    var lockfile = __dirname + "/.grunt-watch-lock";
    function lock() {
      fs.writeFileSync(lockfile, "now locking", "utf-8");
    }
    function unlock() {
      fs.unlinkSync(lockfile);
    }
    function islocked() {
      return fs.existsSync(lockfile);
    }
    return function(func, done) {
      if (!islocked()) {
        lock();
        func();
        setTimeout(function() {
          unlock();
          done();
        }, 1000);
      }
    };
  })();
  
  grunt.registerTask("filesync", function(opts) {
    var src, dst;
    
    console.log("filesync: stdio.h.js");
    
    if (opts === "test") {
      src = __dirname + "/test/stdio.h.js";
      dst = __dirname + "/examples/stdio.h.js";
    } else if (opts === "examples") {
      src = __dirname + "/examples/stdio.h.js";
      dst = __dirname + "/test/stdio.h.js";
    }
    
    safe_recursion(function() {
      fs.writeFileSync(dst, fs.readFileSync(src));
    }, this.async());
    
  });
};
