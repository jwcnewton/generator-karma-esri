'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs');

describe('karma-esri:app', function () {
  var prompt = {
    jsapiBase: 'http://js.arcgis.com/3.12',
    testFramework: 'Mocha',
    browsers: ['Chrome', 'Firefox', 'IE']
  };
  before(function () {
    const deps = [
      [helpers.createDummyGenerator(), 'karma:app']
    ];
    return helpers.run(path.join(__dirname, '../app'))
      .inTmpDir(function (dir) {
          var sourceFile = path.join(__dirname, '_package.json');
          var targetFile = path.join(dir, 'package.json');
          fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
      })
      .withOptions({ 'skip-install': true })
      .withPrompts(prompt)
      .withGenerators(deps);
  });

  it('copies files', function () {
    assert.file([
      'test/.jshintrc'
    ]);
  });

  it('templates files', function () {
    assert.file([
      'test/config.js',
      'test/spec/sanity.js'
    ]);
    assert.fileContent('test/config.js', new RegExp(prompt.jsapiBase));
    assert.fileContent('test/spec/sanity.js', /expect\(1\)\.to\.equal\(1\);/);
  });
});