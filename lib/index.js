const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const loadPlugins = require('gulp-load-plugins');
const plugins = loadPlugins();
const bs = browserSync.create();
const cwd = process.cwd();

let config = {
  // 默认配置
  build: {
    _src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    extras: 'public/**',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**',
    },
  },
};

const { _src, dist, temp, public, extras, paths } = config.build;
const { styles, scripts, pages, images, fonts } = paths;

try {
  const lodeConfig = require(`${cwd}/myhgulp.config.js`);
  config = Object.assign({}, config, lodeConfig);
} catch (e) {}

const clean = () => {
  return del([dist, temp]);
};

const style = () => {
  return src(styles, { base: _src, cwd: _src })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest(temp))
    .pipe(bs.reload({ stream: true }));
};

const script = () => {
  return src(scripts, { base: _src, cwd: _src })
    .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
    .pipe(dest(temp))
    .pipe(bs.reload({ stream: true }));
};

const page = () => {
  return src(pages, { base: _src, cwd: _src })
    .pipe(plugins.swig({ data: config.data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest(temp))
    .pipe(bs.reload({ stream: true }));
};

const image = () => {
  return src(images, { base: _src, cwd: _src })
    .pipe(plugins.imagemin())
    .pipe(dest(dist));
};

const font = () => {
  return src(fonts, { base: _src, cwd: _src })
    .pipe(plugins.imagemin())
    .pipe(dest(dist));
};

const extra = () => {
  return src(extras, { base: public, cwd: public }).pipe(dest(dist));
};

const serve = () => {
  watch(styles, style);
  watch(scripts, script);
  watch(pages, page);
  watch([images, fonts, extras], bs.reload);

  bs.init({
    notify: false,
    port: 2080,
    // open: false,
    // files: 'dist/**',
    server: {
      baseDir: [temp, dist, public],
      routes: {
        '/node_modules': 'node_modules',
      },
    },
  });
};

const useref = () => {
  return (
    src(pages, { base: temp, cwd: temp })
      .pipe(plugins.useref({ searchPath: [temp, '.'] }))
      // html js css
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          }),
        ),
      )
      .pipe(dest(dist))
  );
};

const compile = parallel(style, script, page);

// 上线之前执行的任务
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra),
);

const develop = series(compile, serve);

module.exports = {
  clean,
  build,
  develop,
};
