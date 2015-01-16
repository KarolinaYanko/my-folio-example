var gulp         = require('gulp'), // Gulp
    jade         = require('gulp-jade'), // Jade
    stylus       = require('gulp-stylus'), // Stylus
    autoprefixer = require('autoprefixer-stylus'), // Autoprefixer
    imagemin     = require('gulp-imagemin'), // Imagemin
    sourcemaps   = require('gulp-sourcemaps'), // Sourcemaps
    concat       = require('gulp-concat'), // Concat
    changed      = require('gulp-changed'), // Changed
    browsersync  = require('browser-sync'); // Browser-Sync


var dev_path =
    {
        styl: 'dev/styl/',
        jade: 'dev/jade/',
        js:   'dev/js/',
        img:  'dev/img/'
    }


var build_path =
    {
        css:  'build/css/',
        html: 'build/html/',
        js:   'build/js/',
        img:  'build/img/'
    }










// Compile Jade
gulp.task('jade', function(){
    gulp.src([
            dev_path.jade + '*.jade', 
            '!' + dev_path.jade + '_*.jade'
        ])
        .pipe(jade({pretty: true}))
        .on('error', console.log)
        .pipe(gulp.dest(build_path.html))
        .pipe(browsersync.reload({stream: true}));
});


// Compile Stylus
gulp.task('stylus', function(){
    gulp.src([
            dev_path.styl + '*.styl', 
            '!' + dev_path.styl + '_*.styl',
            '!' + dev_path.styl + 'vendor/'
        ])
        .pipe(stylus({
            use: [autoprefixer()],
            //compress: true,
            sourcemap: {
                inline: true,
                sourceRoot: dev_path.styl
            }
        }))
        .on('error', console.log)
        .pipe(gulp.dest(build_path.css))
        .pipe(browsersync.reload({stream: true}));
});
 

// JavaScript
gulp.task('js', function(){
    gulp.src([
            dev_path.js + '**/*',
            '!' + dev_path.js + 'vendor/'
        ])
        .on('error', console.log)
        .pipe(gulp.dest(build_path.js))
        .pipe(browsersync.reload({stream: true}));
});


// Minification Images
gulp.task('images', function(){
    gulp.src([dev_path.img + '**/*'])
        .pipe(changed(build_path.img))
        .pipe(imagemin())
        .pipe(gulp.dest(build_path.img))
        .pipe(browsersync.reload({stream: true}));
});


// Start Browser-Sync server
gulp.task('browsersync-server', function(){
    browsersync.init(null, {
        server: {baseDir: 'build/'},
        open: false,
        notify: false
    });
});










//
// TRANSFER VENDOR FILES
//

gulp.task('vendor', function(){
    gulp.src(dev_path.styl + 'vendor/*').pipe(gulp.dest(build_path.css));
    gulp.src(dev_path.js + 'vendor/*').pipe(gulp.dest(build_path.js));
    gulp.src('dev/fonts/**/*').pipe(gulp.dest('build/fonts/'));
});




//
// WATCH TASK
//

gulp.task('watch', function(){
    gulp.watch(dev_path.jade + '**/*.jade', ['jade']);
    gulp.watch(dev_path.styl + '**/*.styl', ['stylus']);
    gulp.watch([dev_path.img + '**/*'], ['images']);
    gulp.watch(dev_path.js + '**/*.js', ['js']);

    gulp.watch([dev_path.styl + 'vendor/*', dev_path.js + 'vendor/*'], ['vendor']);
});




//
// DEFAULT TASK
//

gulp.task('default', [
    'vendor', 'jade', 'stylus', 'images', 'js', 'browsersync-server', 'watch',
]);









//
// OTHER
//

// gulp.task('sprites', function(){

//     var spriteFunction = function(folderName){

//         var folderPath = dev_path.img + '_sprites/' + folderName + '/';


//         // @2x sprite
//         gulp.task(folderName + '-sprites-2x', function(){
//             var spriteData = gulp.src(folderPath + '*@2x*')
//             .pipe(spritesmith({
//                 imgName: folderName + '-sprite@2x.png',
//                 cssName: folderName + '-sprite@2x.styl',
//                 cssVarMap: function(sprite){
//                     var src = sprite.name;
//                     sprite.name = 's-' + src.replace('@2x', '-2x');
//                 },
//                 algorithm: 'binary-tree',
//                 cssTemplate: 'stylus.template.mustache'
//             }));

//             spriteData.img
//                 .pipe(imagemin())
//                 .pipe(gulp.dest(build_path.img + 'sprites/'));

//             spriteData.css
//                 .pipe(gulp.dest(dev_path.styl + '_sprites/'));
//         });


//         //@1x sprite
//         gulp.task(folderName + '-sprites', function(){
//             var spriteData = gulp.src([folderPath + '*.*', '!' + folderPath + '*@2x.*'])
//             .pipe(spritesmith({
//                 imgName: folderName + '-sprite.png',
//                 cssName: folderName + '-sprite.styl',
//                 algorithm: 'binary-tree',
//                 cssTemplate: 'stylus.template.mustache',
//                 cssVarMap: function(sprite){
//                     var src = sprite.name;
//                     sprite.name = 's-' + src;
//                 }
//             }));

//             spriteData.img
//                 .pipe(imagemin())
//                 .pipe(gulp.dest(build_path.img + 'sprites/'));

//             spriteData.css
//                 .pipe(gulp.dest(dev_path.styl + '_sprites/'));
//         });


//         // First compile
//         gulp.start(folderName + '-sprites-2x', folderName + '-sprites');


//         // Watcher
//         gulp.watch(folderPath + '*@2x*', [folderName + '-sprites-2x']);
//         gulp.watch([folderPath + '*', '! ' + folderPath + '*@2x*'], [folderName + '-sprites']);

//     }





//     // Add function and inject folder name:
//     spriteFunction('icons');

// });