module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      target: {
        files: {
          'dist/<%= pkg.name %>.showcase.min.css': ['src/<%= pkg.name %>.showcase.css']
        }
      }
    },
    // svgstore is a grunt task to build a single library file form a folder of svg files
    svgstore: {
      default: {
        files: {
          'dist/libraries/sample.svg': ['libraries/sample/*.svg']
        }
      },
      options: {
        prefix : 'iconSymbol-', // This will prefix each ID
        svg: {
          viewBox : '0 0 470 470',
          xmlns: 'http://www.w3.org/2000/svg',
          id:'library',
          'xmlns:xlink':'http://www.w3.org/1999/xlink'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-svgstore');

  grunt.registerTask('default', ['uglify', 'cssmin']);
  grunt.registerTask('libraries', ['svgstore']);

};