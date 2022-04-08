// gulpfile.js

// Folders

const srcFolder = 'src';
const distFolder = 'dist';

// Packages

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const gulpFileInclude = require('gulp-file-include');
const gulpConcat = require('gulp-concat');
const gulpGroupCSSMediaQueries = require('gulp-group-css-media-queries');
const gulpCleanCSS = require('gulp-clean-css');
const gulpTerser = require('gulp-terser');
const gulpWEBP = require('gulp-webp');
const gulpAVIF = require('gulp-avif');
const gulpImagemin = require('gulp-imagemin');
const gulpSVGO =  require('gulp-svgo');
const gulpSVGStore = require('gulp-svgstore');
const gulpTTFtoWOFF = require('gulp-ttf2woff');
const gulpTTFtoWOFF2 = require('gulp-ttf2woff2');

// Sync

const sync = () => {
    browserSync.init({
        server: {
            baseDir: distFolder,
        },
        notify: false,
    });
};

// Clean

const clean = () => {
    return del(distFolder);
};

// Markup

const markup = () => {
    return gulp.src([
        srcFolder + '/*.html',
        '!' + srcFolder + '/_header.html',
        '!' + srcFolder + '/_footer.html',
    ])
    .pipe(gulpFileInclude())
    .pipe(gulp.dest(distFolder + '/'))
    .pipe(browserSync.stream());
};

// Styles

const styles = () => {
    return gulp.src([
        srcFolder + '/styles/normalize.css',
        srcFolder + '/styles/reset.css',
        srcFolder + '/styles/fonts.css',
        srcFolder + '/styles/params.css',
        srcFolder + '/styles/grid.css',
        srcFolder + '/styles/test.css',
        srcFolder + '/styles/blocks/*.css',
        srcFolder + '/styles/plugins/*.css',
        srcFolder + '/styles/blocks/*.css',
    ])
    .pipe(gulpConcat('styles.min.css'))
    .pipe(gulpGroupCSSMediaQueries())
    .pipe(gulpCleanCSS())
    .pipe(gulp.dest(distFolder + '/styles/'))
    .pipe(browserSync.stream());
};

// Scripts

const scripts = () => {
    return gulp.src([
        srcFolder + '/scripts/libraries/*.js',
        srcFolder + '/scripts/plugins/*.js',
        srcFolder + '/scripts/*.js'
    ])
    .pipe(gulpConcat('script.min.js'))
    .pipe(gulpTerser())
    .pipe(gulp.dest(distFolder + '/scripts/'))
    .pipe(browserSync.stream());
};

// Images

const images = () => {
    return gulp.src([
        srcFolder + '/images/**/*.{jpeg,jpg,png,gif,svg}'
    ])
    .pipe(
        gulpImagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 3,
            svgoPlugins: [
                { removeViewBox: false },
            ],
        })
    )
    .pipe(gulp.dest(distFolder + '/images/'))
    .pipe(browserSync.stream());
};

// SVG Sprite

const svgSprite = () => {
    return gulp.src([
        srcFolder + '/svg-sprite/icons/*.svg'
    ])
    .pipe(gulpSVGO({
        plugins: [
            { removeViewBox: false },
            { sortAttrs: true },
            { sortDefsChildren: true },
            { removeDimensions: true },
            { removeStyleElement: true },
            { removeScriptElement: true },
            { removeAttrs: { attrs: '(id|class|style|stroke|fill)' } }
        ]
    }))
    .pipe(gulpSVGStore({
        inlineSvg: true
    }))
    .pipe(gulp.dest(srcFolder + '/svg-sprite/'))
    .pipe(browserSync.stream());
};

// Move Sprite

const moveSprite = () => {
    return gulp.src([
        srcFolder + '/svg-sprite/svg-sprite.svg'
    ])
    .pipe(gulp.dest(distFolder + '/images/'))
    .pipe(browserSync.stream());
};

// Fonts

const fonts = () => {
    gulp.src([
        srcFolder + '/fonts/*.ttf'
    ])
    .pipe(gulpTTFtoWOFF())
    .pipe(gulp.dest(distFolder + '/fonts/'))
    return gulp.src([
        srcFolder + '/fonts/*.ttf',
    ])
    .pipe(gulpTTFtoWOFF2())
    .pipe(gulp.dest(distFolder + '/fonts/'))
    .pipe(browserSync.stream());
};

// Watch

const watch = () => {
    gulp.watch([srcFolder + '/*.html'], markup);
    gulp.watch([srcFolder + '/styles/**/*.css'], styles);
    gulp.watch([srcFolder + '/scripts/**/*.js'], scripts);
    gulp.watch([srcFolder + '/images/**/*.{jpeg,jpg,png,gif,svg}'], images);
    gulp.watch([srcFolder + '/svg-sprite/icons/*.svg'], svgSprite);
    gulp.watch([srcFolder + '/svg-sprite/svg-sprite.svg'], moveSprite);
    gulp.watch([srcFolder + '/fonts/*.ttf'], fonts);
};

// Build

const build = gulp.series(clean, markup, styles, scripts, images, svgSprite, moveSprite, fonts);

// Default

exports.default = gulp.parallel(sync, watch, build);