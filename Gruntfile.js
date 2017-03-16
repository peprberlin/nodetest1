/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    //Read the package.json (optional)
    pkg: grunt.file.readJSON('package.json'),

    // Metadata.
    meta: {
      basePath: './',
      srcPath: './public/_res/',
      deployPath: './public/_deploy/'
    },
    // configure jshint to validate js files -----------------------------------
    jshint: {
      options: {
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },

      // when this task is run, lint the Gruntfile and all js files in src
      build: ['Gruntfile.js', '<%= meta.srcPath %>js/custom.js', '<%= meta.srcPath %>js/grunttest.js', ]
    },
    // Task configuration.
    uglify: {
      options: {
        stripBanners: true
      },
      build: {
        files: {
          '<%= meta.deployPath %>js/<%= pkg.name %>.min.js': ['<%= meta.srcPath %>js/custom.js'],
          '<%= meta.deployPath %>js/lib.min.js': [
            '<%= meta.srcPath %>js/jquery-1.10.2.js',
            '<%= meta.srcPath %>js/bootstrap.min.js',
            '<%= meta.srcPath %>js/jquery.metisMenu.js',
            '<%= meta.srcPath %>js/morris/raphael-2.1.0.min.js',
            '<%= meta.srcPath %>js/morris/morris.js',
            '<%= meta.srcPath %>js/notify/notify.js'
          ]
        }
      }
    },
    // configure cssmin to minify css files ------------------------------------
    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          '<%= meta.deployPath %>css/lib.min.css': ['<%= meta.srcPath %>css/bootstrap.css', '<%= meta.srcPath %>css/morris.min.css', '<%= meta.srcPath %>css/font-awesome.css'],
          '<%= meta.deployPath %>css/<%= pkg.name %>.min.css': '<%= meta.srcPath %>css/custom.css'
        }
      }
    },
    watch: {
      // for stylesheets, watch css and less files 
      // only run less and cssmin stylesheets: { 
      css: {
        files: ['src//*.css'],
        tasks: ['cssmin']
      },

      // for scripts, run jshint and uglify 
      scripts: {
        files: '<%= meta.srcPath %>js/*.js', tasks: ['jshint', 'uglify']
      }
    }
  });

//    // These plugins provide necessary tasks.
//    grunt.loadNpmTasks('grunt-contrib-concat');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task
  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin']);

};