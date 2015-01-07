module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
		  js: ["dist/*.js", "!dist/*.min.js"]
		},
    concat:{
    	domop:{
    		src:['src/ImagePreview.js'],
    		dest:'dist/<%= pkg.name %>.js'
    		}
    	},
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('default', ['clean','concat','uglify']);

};
