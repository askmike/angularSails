/**
 * Grunt automation.
 */
module.exports = function(grunt) {

  var getTime = function(){

    return new Date().getTime();

  };

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    app: {
      src: 'src',
      dist: 'dist',
      tests: 'tests',
      example: 'example/assets/',
      pkg: grunt.file.readJSON('bower.json')
    },


  copy: {
      dev: {

          src: [ '<%= app.src %>/**/*.js' ],
          dest: '<%= app.example %>/assets/js/deps',
          expand: true,
          flatten : true
      }
  },

    concat: {
      dev: {
        src: [
          '<%= app.src %>/sails-utils/*.js',
          '<%= app.src %>/angular-sails-io.js',
          '<%= app.src %>/angular-sails-base.js'
        ],
        dest: '<%= app.dist %>/<%= app.pkg.name %>.js'
      }
    },

    copy: {
      example: {
        src: '<%= app.dist %>/angularSails.js',
        dest: '<%= app.example %>/js/deps/angularSails.js',
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        banner: '/*\n'
              + '  <%= app.pkg.name %> <%= app.pkg.version %>-build' + getTime() + '\n'
              + '  Built with <3 by Balderdashy'
              + '*/'
      },
      dist: {
        files: {
          '<%= app.dist %>/<%= app.pkg.name %>.min.js': ['<%= app.dist %>/<%= app.pkg.name %>.js']
        }
      }
    },

    jshint: {

      options: {
        reporter: require('jshint-stylish'),
        jshintrc: true
      },

      all: [
        '<%= app.src %>/**/*.js',
        '<%= app.tests %>/**/*.spec.js'
      ]
    },

    watch: {
      source: {
        files: ['<%= app.src %>/**/*.js'],
        tasks: ['copy:dev'],
        options: {
          debounceDelay: 500,
          atBegin: true
        }
      },
      tests: {
        files: ['<%= app.tests %>/**/*.spec.js'],
        tasks: ['newer:jshint', 'karma:precompile'],
        options: {
          debounceDelay: 500,
          atBegin: true
        }
      }
    },

    karma: {
      precompile: {
        configFile: 'karma.conf.js'
      },
      postcompile: {
        configFile: 'karma.postcompile.conf.js',
      }
    }

  });


    grunt.loadNpmTasks('grunt-contrib-copy');

  // Registered tasks.
  grunt.registerTask('default', ['dev']);

  grunt.registerTask('dev', ['watch']);

  grunt.registerTask('test', ['karma:precompile']);

  grunt.registerTask('build', [
    'jshint',
    'karma:precompile',
    'concat',
    'uglify',
    'copy',
    'karma:postcompile'
  ]);
};
