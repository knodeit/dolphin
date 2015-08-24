'use strict';

var paths = {
    js: ['*.js', 'test/**/*.js', '!test/coverage/**', '!bower_components/**', 'packages/**/*.js', '!packages/**/node_modules/**'],
    css: ['!bower_components/**', 'packages/custom/**/public/assets/css/*.css'],
    less: ['!bower_components/**', 'packages/custom/**/public/assets/css/*.less', 'packages/**/public/assets/css/*.less']
};

module.exports = function (grunt) {

    if (process.env.NODE_ENV !== 'production') {
        require('time-grunt')(grunt);
    }

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets: grunt.file.readJSON('config/assets.json'),
        clean: ['bower_components/build'],
        watch: {
            js: {
                files: paths.js,
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: paths.less,
                tasks: ['less:development', 'csslint'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: paths.js,
                options: {
                    jshintrc: true
                }
            }
        },
        uglify: {
            core: {
                options: {
                    mangle: false
                },
                files: '<%= assets.core.js %>'
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            src: paths.css
        },
        cssmin: {
            core: {
                files: '<%= assets.core.css %>'
            }
        },
        less: {
            development: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'packages',      // Src matches are relative to this path.
                        src: ['**/public/assets/css/*.less'], // Actual pattern(s) to match.
                        dest: 'packages',   // Destination path prefix.
                        ext: '.css'  // Dest filepaths will have this extension.
                    }
                ]
            },
            production: {
                options: {
                    cleancss: true
                },
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'packages',      // Src matches are relative to this path.
                        src: ['**/public/assets/css/*.less'], // Actual pattern(s) to match.
                        dest: 'packages',   // Destination path prefix.
                        ext: '.css'  // Dest filepaths will have this extension.
                    }
                ]
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    verbose: false,
                    args: [],
                    ignore: ['node_modules/**','./packages/custom/**/node_modules/**'],
                    ext: 'js,css',
                    nodeArgs: ['--debug'],
                    delay: 5000,
                    cwd: __dirname,
                    watch: ['./lib', './packages', './config']
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: [
                    'server.js',
                    function () {
                        //before
                    }
                ]
            },
            all: {src: ['packages/**/server/tests/**/*.js']}
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        }
    });

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);

    //Default task(s).
    if (process.env.NODE_ENV !== 'production') {
        grunt.registerTask('default', ['clean', 'less:development', 'jshint', 'csslint', 'concurrent']);
    }

    grunt.registerTask('init', ['clean', 'less:production', 'cssmin', 'uglify']);
    grunt.registerTask('test', ['env:test', 'mochaTest:all']);
};
