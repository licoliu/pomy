'use strict';

var
  gulp = require('gulp'),
  fs = require('fs'),
  util = require('util'),
  path = require('path'),
  gutil = require('gulp-util'),
  jeditor = require("gulp-json-editor"),
  // bower = require('gulp-bower'),
  spawn = require('child_process').spawn;

gulp.task('dependancy:npmunpomy', function() {
  var settings = util._extend({}, global.settings);
  var root = global.getRootPath();

  delete settings.dependencies.pomy;

  return gulp.src([root + "package.json"])
    .pipe(jeditor({
      dependencies: settings.dependencies
    }))
    .pipe(gulp.dest(root));
});

gulp.task('dependancy:npm', ['dependancy:npmunpomy'], function(cb) {
  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    args.push("npm");
  } else {
    command = "npm";
  }

  args.push('update');

  var registry = gutil.env.registry || global.settings.registry;
  if (registry) {
    args.push("--registry");
    args.push(registry);
  }

  args.push("--production");

  var root = global.getRootPath();
  var npm = spawn(command, args, {
    cwd: path.resolve(root),
    stdio: 'inherit'
  });

  npm.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});

gulp.task('dependancy:bower', function(cb) {
  var pomy = global.getPomyPath();

  var directory = pomy + 'bower_components';

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  // return bower({
  //   cmd: 'update',
  //   cwd: pomy
  // });

  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    // args.push("node");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('bower'));
  args.push('update');

  var bower = spawn(command, args, {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  bower.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      args = [];

      if (process.platform === "win32") {
        args.push("/c");
      }

      args.push(global.getCommandPath('gulp'));
      args.push('config:bower-after');

      var config = spawn(command, args, {
        cwd: global.settings.cwd,
        stdio: 'inherit'
      });

      config.on('close', function(code) {
        if (code !== 0) {
          cb(code);
        } else {
          cb();
        }
      });
    }
  });
});

gulp.task('dependancy', ['validate'], function(cb) {
  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    // args.push("node");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('gulp'));
  if (settings.repositoryManager === 'npm') {
    args.push('dependancy:npm');
  } else {
    args.push('dependancy:bower');
  }

  var dependancy = spawn(command, args, {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  dependancy.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});

gulp.task('update', function(cb) {
  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    // args.push("node");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('bower'));
  args.push('update');

  var bower = spawn(command, args.concat(process.argv.slice(3)), {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  bower.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});

gulp.task('bower:update', ['update'], function(cb) {
  cb();
});

gulp.task('bower:install', function(cb) {
  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    // args.push("node");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('bower'));
  args.push('install');

  var bower = spawn(command, args.concat(process.argv.slice(3)), {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  bower.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});

gulp.task('bower:uninstall', function(cb) {
  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    // args.push("node");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('bower'));
  args.push('uninstall');

  var bower = spawn(command, args.concat(process.argv.slice(3)), {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  bower.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});


gulp.task('npm:install', function(cb) {
  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    args.push("npm");
  } else {
    command = "npm";
  }

  args.push('install');

  args.concat(process.argv.slice(3));

  var registry = gutil.env.registry || global.settings.registry;
  if (registry) {
    args.push("--registry");
    args.push(registry);
  }

  var root = global.getRootPath();
  var npm = spawn(command, args, {
    cwd: root,
    stdio: 'inherit'
  });

  npm.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});

gulp.task('npm:uninstall', function(cb) {
  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    args.push("npm");
  } else {
    command = "npm";
  }

  args.push('uninstall');

  args.concat(process.argv.slice(3));

  var registry = gutil.env.registry || global.settings.registry;
  if (registry) {
    args.push("--registry");
    args.push(registry);
  }

  var root = global.getRootPath();
  var npm = spawn(command, args, {
    cwd: root,
    stdio: 'inherit'
  });

  npm.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});