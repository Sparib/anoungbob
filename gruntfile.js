module.exports = grunt => {
    grunt.initConfig({

        // define source files and their destinations
        uglify: {
            files: {
                cwd: 'dist',
                src: '**/*.js',  // source files mask
                dest: 'out',    // destination folder
                expand: true,    // allow dynamic building
                // flatten: true,   // remove all unnecessary nesting
            }
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // register at least this one task
    grunt.registerTask('default', ['uglify']);
};