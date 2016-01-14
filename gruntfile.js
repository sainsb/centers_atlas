module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
          jst: {
       compile: {
         options: {
           namespace: 'templates',
           processContent: function(src) {
         return src.replace(/(^\s+|\s+$)/gm, '');
       },
       processName: function(filepath) {
         var t = filepath.replace('templates/','').replace('.htm','');
         console.log(t);
         return t;
       }
         },
         files: {
           "templates/_templates.js": ["templates/*.htm"]
         }
       }
     },

replace: {
 example: {
   src: ["templates/_templates.js"],             // source files array (supports minimatch)
   dest: 'templates/templates.js',             // destination directory or file
   replacements: [{
     from: ', __e = _.escape',                   // string replacement
     to: ''
   }]
   }
   },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          /* App css deps */
          'css/app.style.min.css': [
           'bower_components/bootstrap/dist/css/bootstrap.css',
           'bower_components/fontawesome/css/font-awesome.min.css',
           'bower_components/mapbox.js/mapbox.css',
           'css/app.style.css'
           ]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      script: {
      files: {
      /* App js deps */

        'js/app.script.min.js' :[
      'bower_components/modernizr/modernizr.js',
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/mapbox.js/mapbox.js',
      'bower_components/chartjs/Chart.js',
      'bower_components/pathjs/path.min.js',
      'bower_components/catiline/dist/catiline.js',
      'bower_components/heatmap/index.js',
      'bower_components/leaflet-heatmap/index.js'
        ],
      }
      }
    },
    
    copy: {
      main: {
        files: [
          {expand: true,flatten: true, src: ['bower_components/bootstrap/fonts/*'], dest: 'fonts/', filter: 'isFile' },
          {expand: true,flatten: true, src: ['bower_components/fontawesome/fonts/*'], dest: 'fonts/', filter: 'isFile' },
           {expand: true,flatten: true, src: ['bower_components/mapbox.js/images/*'], dest: 'css/images/', filter: 'isFile' }
        ]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // Default task(s).
  //grunt.registerTask('default', [ 'jst', 'replace', 'cssmin']);
 grunt.registerTask('default', [ 'jst','replace','uglify', 'cssmin', 'copy']);

};