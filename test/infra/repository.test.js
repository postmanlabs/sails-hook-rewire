/**
 * @fileOverview This test specs runs tests on the package.json file of repository. It has a set of strict tests on the
 * content of the file as well. Any change to package.json must be accompanied by valid test case in this spec-sheet.
 */
var expect = require('expect.js');

/* global describe, it, expect */
describe('project repository', function () {
  var fs = require('fs');

  describe('package.json', function () {
    var content,
      json;

    it('must exist', function () {
      expect(fs.existsSync('./package.json')).to.be.ok();
    });

    it('must have readable content', function () {
      expect(content = fs.readFileSync('./package.json').toString()).to.be.ok();
    });

    it('content must be valid JSON', function () {
      expect(json = JSON.parse(content)).to.be.ok();
    });

    describe('package.json JSON data', function () {
      it('must have valid name, description and author', function () {
        expect(json.name).to.equal('sails-hook-rewire');
        expect(json.description)
          .to.equal('Installable sailsjs hook that lets you rewire sails components during tests');
        expect(json.author).to.equal('Postman Labs <help@getpostman.com>');
        expect(json.license).to.equal('Apache-2.0');
      });

      it('must have a valid version string in form of <major>.<minor>.<revision>', function () {
        /* jshint ignore:start */
        expect(json.version).to.match(/^((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?(?:\+([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?$/);
        /* jshint ignore:end */
      });
    });

    describe('script definitions (except sails)', function () {
      var props = {};

      it('files must exist', function () {
        var prop,
          propBase;

        expect(json.scripts).to.be.ok();
        for (prop in json.scripts) {
          props[prop] = {
            base: (propBase = prop.substr(0, prop.indexOf('-') > -1 ?
              prop.indexOf('-') : undefined)),
            path: 'scripts/' + propBase + '/' + prop + '.sh'
          };
          expect(fs.existsSync(props[prop].path)).to.be.ok();
        }
      });

      it('must be defined as per standards `[script]: scripts/[name]/[name].sh`', function () {
        for (var prop in json.scripts) {
          expect(json.scripts[prop]).to.match(new RegExp(props[prop].path, 'g'));
        }
      });

      it('must have the hashbang defined', function () {
        var fileContent,
          prop;

        for (prop in json.scripts) {
          fileContent = fs.readFileSync(props[prop].path).toString();
          expect(/^#\!\/(bin\/bash|usr\/bin\/env\snode)[\r\n][\W\w]*$/g.test(fileContent)).to.be.ok();
        }
      });
    });

    describe('dependencies', function () {
      it('must exist', function () {
        expect(json.dependencies).to.be.a('object');
      });

      it('must point to a valid and precise (no * or ^) semver', function () {
        for (var item in json.dependencies) {
          expect(json.dependencies[item]).to.match(new RegExp('^((\\d+)\\.(\\d+)\\.(\\d+))(?:-' +
          '([\\dA-Za-z\\-]+(?:\\.[\\dA-Za-z\\-]+)*))?(?:\\+([\\dA-Za-z\\-]+(?:\\.[\\dA-Za-z\\-]+)*))?$|^git\+.*.+$'));
        }
      });
    });

    describe('devDependencies', function () {
      it('must exist', function () {
        expect(json.devDependencies).to.be.a('object');
      });

      it('must point to a valid and precise (no * or ^) semver', function () {
        for (var item in json.devDependencies) {
          expect(json.devDependencies[item]).to.match(new RegExp('^((\\d+)\\.(\\d+)\\.(\\d+))(?:-' +
          '([\\dA-Za-z\\-]+(?:\\.[\\dA-Za-z\\-]+)*))?(?:\\+([\\dA-Za-z\\-]+(?:\\.[\\dA-Za-z\\-]+)*))?$|^git\+.*.+$'));
        }
      });
    });

    describe('main entry script', function () {
      it('must point to a valid file', function () {
        expect(json.main).to.equal('index.js');
        expect(fs.existsSync(json.main)).to.be.ok();
      });
    });
  });

  describe('README.md', function () {
    it('must exist', function () {
      expect(fs.existsSync('./README.md')).to.be.ok();
    });

    it('must have readable content', function () {
      expect(fs.readFileSync('./README.md').toString()).to.be.ok();
    });
  });

  describe('CONTRIBUTING.md', function () {
    it('must exist', function () {
      expect(fs.existsSync('./CONTRIBUTING.md')).to.be.ok();
    });

    it('must have readable content', function () {
      expect(fs.readFileSync('./CONTRIBUTING.md').toString()).to.be.ok();
    });
  });

  describe('LICENSE', function () {
    it('must exist', function () {
      expect(fs.existsSync('./LICENSE')).to.be.ok();
    });

    it('must have readable content', function () {
      expect(fs.readFileSync('./LICENSE').toString()).to.be.ok();
    });
  });

  describe('.gitignore file', function () {
    it('must exist', function () {
      expect(fs.existsSync('./.gitignore')).to.be.ok();
    });

    it('must have readable content', function () {
      expect(fs.readFileSync('./.gitignore').toString()).to.be.ok();
    });
  });

  describe('.npmignore file', function () {
    it('must exist', function () {
      expect(fs.existsSync('./.npmignore')).to.be.ok();
    });
  });
});
