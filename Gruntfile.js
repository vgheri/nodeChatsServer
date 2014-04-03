module.exports = function(grunt) {
	// Initializes the Grunt tasks with the following settings
	grunt.initConfig({
		// A list of files, which will be syntax-checked by JSHint
		jshint: {
			files: ['Gruntfile.js', './*.js']
		},
		// Tasks being executed with 'grunt watch'
		watch: {
			files: '<%= jshint.files %>',
			tasks: 'jshint'
		}
	});

	// Load the plugins that provide the tasks we specified in package.json.
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// This is the default task being executed if Grunt
	// is called without any further parameter.
	grunt.registerTask('default', ['jshint']);    
	grunt.registerTask('lint', ['jshint']);	
};