module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    filename: '',
    filenames: '',

    browserify: {
      dist: {
        files:[{
          expand: true,
          src: ['js/*.js'],
          dest: 'public'
        }]
      }
    },

    multi: {
      pattern: {
        options: {
          vars: {
            filenames: { patterns: '*.html', options: { cwd: 'html', filter: 'isFile' } }
          },
          config: {
            filename: '<%= filenames %>'
          },
          tasks: [ 'htmlbuild' ]
        }
      }
    },

    htmlbuild: {
      dist: {
        expand: true,
        src: 'layout.html',
        dest: 'public',
        rename: (dest, src) => {
          return dest + '/<%= filename %>';
        },
        options: {
          beautify: true,
          sections: {
            body: 'html/<%= filename %>'
          },
          data: {
          }
        }
      }
    },

    clean: {
      htmls: ['public/*.html'],
      jss: ['public/js/*.js', '!public/js/wplatform-config.js']
    },

    copyright: '(c) Eugene Valeyev'
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-multi');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s)
  grunt.registerTask('default', [
    'clean',
    'browserify',
    'multi'
  ]);

};