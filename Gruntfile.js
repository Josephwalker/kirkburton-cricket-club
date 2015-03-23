module.exports = function(grunt){

	/* Without matchdep, we would have to write grunt.loadNpmTasks("grunt-task-name"); for each 
	 * dependency, which would quickly add up as we find and install other plugins.
	 */
	"use strict";
   	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	
	// Initialise a configuration object for the current project.
	grunt.initConfig({
	
		pkg: grunt.file.readJSON('package.json'),
		
		// Watch files
		watch: {
					
			// Watch .scss files
			stylesheets: {
				files: [ 'css/**/*.scss' ],
				tasks: [ 'stylesheets' ]
			},
			
			// Watch .js files
			scripts: {
				files: [ 'js/**/*.js' ],
				tasks: [ 'scripts' ]
			},
			
			// Watch image files
			images: {
				files: [ '*.{png,jpg,svg,ico}', 'img/*'  ],
				tasks: [ 'images' ]
			}
		},
		
	    // Sass compile
	    sass: {
	    	// Sass preprocess options
	    	dist: {
	    		options: {
	    			style: 'expanded'
	    		},
	    		files: {
	    			'css/style.css': 'css/main.scss'
	    		}
	    	}
	    },
	    
		/* A good build script always keeps the source code separate from the build files. 
		 * This separation allows you to destroy the build without affecting your source and prevents you from accidentally 
		 * editing the build.
		 * We can use this to copy over any files in the cwd to output to the build directory (favicon, apple touch icons).
		 * You could copy  all files and use '!' pattern match negate to exclude copying of specific directories e.g.,
		 */
		 // src: [ '**', '!**/directory-name/**' ]
	    copy: {
	    	build: {
	    		// Set expand parameter bool to enable options.
	    		expand: true,
	    		// Set 'current working directory'
	    		cwd: '.',
	    		// Set image source match patterns (extension array) (relative to cwd)
	    		src: [ '*.{png,jpg,svg,ico}', 'img/*{svg,ico}' ],	    
	    		// Set destination path to build directory (relative to cwd)
	    		dest: 'build',
	    	}
	    },
	    
	    // Clean directory
	    clean: {
	    	build: {
	    		src: [ 'build' ]
	    	},
	    	stylesheets: {
	    		src: [ 'build/**.css', '!build/style.min.css' ]
	    	},
	    	scripts: {
	    		src: [ 'build/**.js', '!build/script.js' ]
	    	},
	    	images: {
	    		src: [ 'build/img', 'build/*.{png,jpg,svg,gif,ico}' ]
	    	} 
	    },
	    
	    autoprefixer: {
	    	build: {
	    		expand: true,
	    		cwd: 'css',
	    		src: [ 'style.css' ],
	    		dest: 'css'
	    	}
	    },
	    
	    /* Minify CSS files with CSSO.
	     * Compress with gzip algorithm [report].
	     * Add a [banner] comment.
	     * Copy output to build directory [files]. 
	     */	
	    csso: {
	    	build: {
	    		options: {
	    			report: 'gzip',
	    			banner: '/* Joseph Walker */'
	    		},
	    		files: {
	    			'build/css/style.min.css': ['css/style.css']
	    		}
	      	}
	    },
	    
	    /* Minify JS files with UglifyJS.
	     * Don’t shorten variables/functions names [mange].
	     * Combine Javascript files and combine then into a single file.
	     * Copy output to build directory [files]. 
	     */
	    uglify: {
	    	build: {
	    		options: {
	    			mangle: false
	    		},
	    		files: {
	    			'build/js/script.js': [ 'js/**/*.js' ]
	    		}
	    	}
	    },  
	    
	    /* Optimise .png and .jpg files with imagemin.
	     * Set optimisation level for .png (higher level = greater compression).
	     * Combine Javascript files and combine then into a single file.
	     * Copy output to build directory [files].
	     * Imagemin task only accepts .png, .jpg, .jpeg. Use copy task to copy
	     * unsupported image formats (.svg, .gif) to build directory.
	     */
	    imagemin: {
	    	build: {
	    		options: {
	    			optimizationLevel: 7,
	    			progressive: true
	    		},
	    		files: [
	    			{
	    			// Set expand parameter bool to enable options.
	    			expand: true,
	    			// Set 'current working directory'
	    			cwd: '.',
	    			// Set directory(ies)/file(s) match (relative to cwd)
	    			src: ['img/*', './*.{png,jpg}'],
	    			// Set destination path (relative to cwd)
	    			dest: 'build'
	    			}
	    		]
	    	}
	    }, 
		
		
		
	});
	
	/* Register the default tasks [''], e.g.:
 	 * grunt.registerTask('default', ['watch']);
 	 */
	grunt.registerTask('default', [ 'build' ]);
	grunt.registerTask('stylesheets', [ 'sass', 'autoprefixer', 'csso', 'clean:stylesheets' ]);
	grunt.registerTask('scripts', [ 'uglify', 'clean:scripts' ]);
	grunt.registerTask('images', [ 'clean:images', 'copy', 'imagemin' ]);
	grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', [ 'clean:build', 'copy', 'stylesheets', 'scripts', 'images' ]);
};