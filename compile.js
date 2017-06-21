// Generated by LiveScript 1.5.0
(function(){
  var fs, reactify, browserifyInc, livescript, browserify, xtend, commander, save;
  fs = require('fs');
  reactify = require('reactify-ls');
  browserifyInc = require('browserify-incremental');
  livescript = require('livescript');
  browserify = require('browserify');
  xtend = require('xtend');
  commander = require('commander');
  save = function(file, content){
    console.log("Save " + file);
    return fs.writeFileSync(file, content);
  };
  module.exports = function(commander){
    var file, target, ref$, bundle, html, input, code, js, basedir, makeBundle;
    file = commander.compile;
    if (file == null) {
      return console.error('File is required');
    }
    target = (ref$ = commander.target) != null ? ref$ : file;
    bundle = commander.bundle === true
      ? 'bundle'
      : commander.bundle;
    html = commander.html === true
      ? 'index'
      : commander.html;
    input = file + ".ls";
    console.log("Compile " + input);
    code = reactify(fs.readFileSync(input).toString('utf-8'));
    js = livescript.compile(code);
    save(target + ".js", js);
    basedir = process.cwd();
    makeBundle = function(file, callback){
      var options, b, bundle, string;
      options = {
        basedir: basedir,
        paths: [basedir + "/node_modules"],
        debug: false,
        commondir: false,
        entries: [file]
      };
      b = browserify(xtend(browserifyInc.args, options));
      browserifyInc(b, {
        cacheFile: file + ".cache"
      });
      bundle = b.bundle();
      string = "";
      return bundle.on('data', function(data){
        bundle.on('error', function(error){});
        string += data.toString();
        bundle.on('end', function(_){
          callback(null, string);
        });
      });
    };
    if (commander.bundle == null) {
      return;
    }
    console.log("Current Directory " + basedir);
    return makeBundle(target + ".js", function(err, bundlec){
      var print;
      if (err != null) {
        return console.error(err);
      }
      save(bundle + ".js", bundlec);
      if (commander.html == null) {
        return;
      }
      print = '<!DOCTYPE html>\n<html lang="en-us">\n  <head>\n   <meta charset="utf-8">\n   <title>Hello...</title>\n  </head>\n  <script type="text/javascript" src="./bundle.js"></script>\n</html>';
      console.log("Save " + html + ".js");
      save(html + "", print);
    });
  };
}).call(this);
