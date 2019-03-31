//  ============================================================
//          引入 Gulp 套件
//  ============================================================

const gulp = require("gulp");
const gulpSass = require("gulp-sass");
const connect = require("gulp-connect"); // 開一個伺服器
const imagemin = require("gulp-imagemin"); // 縮圖
const spritesmith = require("gulp.spritesmith"); // 小icons 變成一個大圖
const del = require("del"); //
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify"); // 把程式壓縮最小化
const concat = require("gulp-concat"); // 把所有vender.js 合併成一個js檔案

//  ============================================================
//          建構 Path 管理
//  ============================================================

const paths = {
  html: {
    src: "./*.html"
  },
  styles: {
    src: "./src/styles/index.scss",
    watch: "./src/styles/**/*.scss",
    dest: "build/css"
  },
  images: {
    src: "src/images/*",
    dest: "build/images"
  },
  webfonts: {
    src: "./src/fonts/*",
    dest: "build/fonts"
  },
  csssprite: {
    src: "src/sprite/*.png",
    dest: "build"
  },
  script: {
    src: "src/app/index.js",
    dest: "build/js"
  },
  venders: {
    script: {
      src: [
        "src/vender/jquery/dist/jquery-3.3.1.js",
        "src/vender/magnific-popup/dist/js/jquery.magnific-popup.js",
        "src/vender/slider-pro/dist/js/jquery.sliderPro.js"
      ],
      dest: "build/js"
    },
    styles: {
      src: [
        "src/vender/slider-pro/dist/css/slider-pro.min.css",
        "src/vender/magnific-popup/dist/css/magnific-popup.css"
      ],
      dest: "build/css"
    },
    images: {
      src: [
        "src/vender/**/*.gif",
        "src/vender/**/*.jpg",
        "src/vender/**/*.png",
        "src/vender/**/*.cur"
      ],
      dest: "build/images"
    }
  }
};

const clean = () => del(["build"]);

//  ============================================================
//          工作 1 建構HTML
//  ============================================================

const buildHtml = async function(cb) {
  console.log("buildHtml");
  gulp.src(paths.html.src).pipe(connect.reload());
  cb();
};

//  ============================================================
//          工作 2 編譯SASS
//  ============================================================

const buildSass = function(cb) {
  console.log("buildSass");
  gulp
    .src(paths.styles.src)
    .pipe(gulpSass())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(connect.reload());
  cb();
};

//  ============================================================
//          工作 3 壓縮背景圖片
//  ============================================================
const compressImage = async function(cb) {
  console.log("CompressImage");
  gulp
    .src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(connect.reload());
  cb();
};

//  ============================================================
//          工作 4 編譯字型
//  ============================================================
const webFont = async function(cb) {
  console.log("webFont");
  gulp
    .src(paths.webfonts.src)
    .pipe(gulp.dest(paths.webfonts.dest))
    .pipe(connect.reload());
  cb();
};

//  ============================================================
//          工作 5 壓縮CSSSprite小圖示變一張大圖
//                 sprite裡的小圖大部分都找png檔
//  ============================================================
const CSSSprite = async function(cb) {
  console.log("CSSSprite");
  gulp
    .src(paths.csssprite.src)
    .pipe(
      spritesmith({
        imgName: "sprite.png", // 組成大圖的檔名
        cssName: "sprite.css" // 每一個小圖的css
      })
    )
    .pipe(gulp.dest(paths.csssprite.dest));
  cb();
};

//  ============================================================
//          工作 6 Javascript程式
//  ============================================================

const buildScript = async function(cb) {
  console.log("buildScript");
  gulp
    .src(paths.script.src)
    .pipe(concat("app.js"))
    .pipe(gulp.dest(paths.script.dest))
    .pipe(rename("app.min.js"))
    // .pipe(uglify())
    .pipe(gulp.dest(paths.script.dest))
    .pipe(connect.reload());
  cb();
};

//  ============================================================
//          工作 7 編譯外部套件 JS/CSS/Image
//  ============================================================

const venderJS = async function(cb) {
  console.log("venderJS");
  gulp
    .src(paths.venders.script.src)
    .pipe(concat("venders.js"))
    .pipe(gulp.dest(paths.venders.script.dest))
    .pipe(rename("venders.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.venders.script.dest))
    .pipe(connect.reload());
  cb();
};

const venderCSS = async function(cb) {
  console.log("venderCSS");
  gulp
    .src(paths.venders.styles.src)
    .pipe(concat("venders.css"))
    .pipe(gulp.dest(paths.venders.styles.dest))
    .pipe(rename("venders.min.css"))
    .pipe(
      cleanCSS({
        compatibility: "ie8"
      })
    )
    .pipe(gulp.dest(paths.venders.styles.dest))
    .pipe(connect.reload());
  cb();
};

const venderImage = async function(cb) {
  console.log("compressImage");
  gulp
    .src(paths.venders.images.src)
    .pipe(gulp.dest(paths.venders.images.dest))
    .pipe(connect.reload());
  cb();
};

//  ============================================================
//          工作 8 組合
//  ============================================================

const buildAssets = gulp.series(
  buildHtml,
  buildScript,
  buildSass,
  gulp.parallel(compressImage, webFont, CSSSprite)
);

const buildVenders = gulp.series(
  venderJS,
  gulp.parallel(venderCSS, venderImage)
);

//  ============================================================
//          工作 8 Watch 程式
//  ============================================================

const watchFiles = async function() {
  gulp.watch(paths.html.src, buildHtml);
  gulp.watch(paths.styles.watch, buildSass);
  gulp.watch(paths.images.src, compressImage);
  gulp.watch(paths.webfonts.src, webFont);
  gulp.watch(paths.csssprite.src, CSSSprite);

  gulp.watch(paths.script.src, buildScript);

  gulp.watch(paths.venders.script.src, venderJS);
  gulp.watch(paths.venders.styles.src, venderCSS);
  gulp.watch(paths.venders.images.src, venderImage);
};

//  ============================================================
//          工作 9 webServer
//          連server 可能要10秒，因此用非同步async呼叫
//          用async可能會load比較久，耗CPU
//  ============================================================

const webServer = async function() {
  console.log("start server");
  // connect.server()
  connect.server({
    livereload: true
  });
};

//  ============================================================
//          serise() 用於順序執行
//          parallel() 用於同時執行
//  ============================================================

exports.default = gulp.series(
  clean,
  gulp.parallel(buildAssets, buildVenders),
  webServer,
  watchFiles
);

/*
 events: 'add', 'addDir', 'change', 'unlink', 'unlinkDir', 'ready', 'error', 'all
 */

// 監控程式
// 所有gulp設定好都要監聽，用watch去呼叫gulp套件設定
// gulp.watch("src/**/*.scss", { events: "all" }, function(cb) {
//   console.log("change SASS");
//   buildSass(cb);
//   cb();
// });

// gulp.watch("src/images/**/*.*", { events: "all" }, function(cb) {
//   console.log("change Images");
//   compressImage(cb);
//   cb();
// });

// gulp.watch("src/fonts/**/*.*", { events: "all" }, function(cb) {
//   console.log("change webfont");
//   webFont(cb);
//   cb();
// });

// gulp.watch("src/sprite/**/*.*", { events: "all" }, function(cb) {
//   console.log("change css sprite");
//   CSSSprite(cb);
//   cb();
// });
// // exports.default = buildSass;
// exports.default = gulp.series(
//   buildSass,
//   webServer,
//   compressImage,
//   webFont,
//   CSSSprite
// );
// exports.default = gulp.parallel(buildSass, webServer);
