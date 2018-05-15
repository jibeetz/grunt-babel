module.exports = function (grunt) {

    require('time-grunt')(grunt);

    var options = {};

    var globalConfig = {
        localPath: 'app/',
        distPath: 'dist/'
    };

    var deploymentHost = grunt.option('host') || "";
    var deploymentApiKey = grunt.option('apikey') || "";

    options.filesWatch = [
        'gruntFile.js',
        '<%= globalConfig.localPath %>**/*',
        '!**<%= globalConfig.localPath %>css/style.css**',
        '!**<%= globalConfig.localPath %>css/less.css**',
        '!**<%= globalConfig.localPath %>js/script.js**'
    ];

    options.jsFiles = {
        '<%= globalConfig.localPath %>js/script.js': [
            'node_modules/babel-polyfill/dist/polyfill.min.js',
            '<%= globalConfig.localPath %>js/main.js'
        ]
    };

    options.jsMainFiles = {
        '<%= globalConfig.localPath %>js/main.js': [
            '<%= globalConfig.localPath %>js/ng/app.js'
        ]
    };

    options.cssFiles = {
        '<%= globalConfig.localPath %>css/style.css': [
            '<%= globalConfig.localPath %>css/less.css'
        ]
    };

    grunt.initConfig({
        globalConfig: globalConfig,

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            css: {
                files: [options.cssFiles]
            },
            js: {
                files: [options.jsFiles]
            },
            mainJs: {
                files: [options.jsMainFiles]
            }
        },
        less: {
            all: {
                files: {
                    '<%= globalConfig.localPath %>css/less.css': '<%= globalConfig.localPath %>less/style.less'
                }
            }
        },
        watch: {
            scripts: {
                files: options.filesWatch,
                tasks: ['less', 'concat:css', 'concat:mainJs', 'concat:js']
            }
        },
        cssmin: {
            all: {
                files: {
                    '<%= globalConfig.localPath %>css/style.css': '<%= globalConfig.localPath %>css/style.css'
                }
            }
        },
        clean: {
            build: ['./bin/**/*']
        },

        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            prod: {
                files: {
                    '<%= globalConfig.localPath %>js/script.js': '<%= globalConfig.localPath %>js/script.js'
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= globalConfig.localPath %>',
                    src: ['**', '!**less/**', '!**js/ng/**'],
                    dest: '<%= globalConfig.distPath %>'
                }],
            },
        },
        browserify: {
            dist: {
                files: {
                    '<%= globalConfig.localPath %>js/main.js': '<%= globalConfig.localPath %>js/main.js'
                },
                options: {
                    transform: [
                        ['babelify', {
                            presets: "es2015"
                        }]
                    ],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('src_to_dist', ['copy:dist']);
    grunt.registerTask('dev', ['less', 'concat:css', 'concat:mainJs', 'browserify:dist', 'concat:js', 'watch']);
    grunt.registerTask('publish', ['clean', 'less', 'concat:css', 'cssmin', 'concat:mainJs', 'browserify:dist', 'concat:js', 'uglify', 'copy:dist']);

};