'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var utils = require('../utils');
var cordova = require('cordova');
var mkdirp = require('mkdirp');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appName', {
      type: String,
      required: true
    });
  },

  prompting: function () {
    var self = this;
    var done = self.async();

    // Have Yeoman greet the user.
    self.log(yosay(
      'Welcome to the super-excellent ' + chalk.red('generator-reqionic') + ' generator!\n by'
    ));
    self.log(utils.greeting);

    var prompts = [
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        store: true
      }, {
        type: 'input',
        name: 'email',
        message: 'Email:',
        default: 'example@example.com',
        store: true
      }, {
        type: 'input',
        name: 'website',
        message: 'Website:',
        default: 'http://www.' + this.appName + '.com'
      }, {
        type: 'input',
        name: 'description',
        message: 'Description: ',
        default:'A super awesome ionic app'
      }
    ];


    self.prompt(prompts, function(answers) {
      _.forEach(answers, function(value, key) {
        self[key] = value;
      });
      done();
    }.bind(self));
  },

  writing: {
    createFolders: function () {
      var wwwDir = this.appName + '/www';
      mkdirp(this.appName + '/hooks/after_prepare');
      mkdirp(this.appName + '/plugins');
      mkdirp(this.appName + '/scss/partials');
      mkdirp(wwwDir + '/css');
      mkdirp(wwwDir + '/img');
      mkdirp(wwwDir + '/js/core');
      mkdirp(wwwDir + '/js/modules');
      mkdirp(wwwDir + '/js/widgets');
      mkdirp(wwwDir + '/lib');
    },

    // Copy .bowerrc
    createConfigFiles: function() {
      // Copy .bowerrc.
      this.fs.copy(
        this.templatePath('_.bowerrc'),
        this.destinationPath(this.appName + '/.bowerrc')
      );

      // Copy .editorconfig.
      this.fs.copy(
        this.templatePath('_.editorconfig'),
        this.destinationPath(this.appName + '/.editorconfig')
      );

      // Copy .gitignore.
      this.fs.copy(
        this.templatePath('_.gitignore'),
        this.destinationPath(this.appName + '/.gitignore')
      );

      // Copy bower.json with custom app name.
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath(this.appName + '/bower.json'),
        { appName: this.appName }
      );

      // Copy config.xml with retrieved data.
      this.fs.copyTpl(
        this.templatePath('_config.xml'),
        this.destinationPath(this.appName + '/config.xml'),
        {
          appName: this.appName,
          author: this.author,
          email: this.email,
          website: this.website,
          description: this.description
        }
      );

      // Copy gulpfile.
      this.fs.copyTpl(
        this.templatePath('_gulpfile.js'),
        this.destinationPath(this.appName + '/gulpfile.js'),
        {
          appName: this.appName
        }
      );

      // Copy ionic.project.
      this.fs.copyTpl(
        this.templatePath('_ionic.project'),
        this.destinationPath(this.appName + '/ionic.project'),
        {
          appName: this.appName
        }
      );

      // Copy package.json.
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath(this.appName + '/package.json'),
        {
          appName: this.appName
        }
      );

      // Copy index.html templatePath.
      this.fs.copyTpl(
        this.templatePath('_index.html'),
        this.destinationPath(this.appName + '/www/index.html'),
        {
          appName: this.appName
        }
      );

      // Copy main.js template to bootstrap the angular app and define all dependencies.
      this.fs.copyTpl(
        this.templatePath('_main.js'),
        this.destinationPath(this.appName + '/www/js/main.js'),
        {
          author: this.author,
          date: (new Date()).toDateString()
        }
      );

      // Copy app.js template to create angular main module.
      this.fs.copyTpl(
        this.templatePath('_app.js'),
        this.destinationPath(this.appName + '/www/js/app.js'),
        {
          author: this.author,
          date: (new Date()).toDateString()
        }
      );

      // Copy main scss to import all scss provided by ionic.
      this.fs.copy(
        this.templatePath('_ionic.app.scss'),
        this.destinationPath(this.appName + '/scss/ionic.app.scss')
      );

      // Create main.scss.
      this.fs.copy(
        this.templatePath('_main.scss'),
        this.destinationPath(this.appName + '/scss/' + this.appName +'.scss')
      );

      // Create core module.
      this.fs.copyTpl(
        this.templatePath('_core.module.js'),
        this.destinationPath(this.appName + '/www/js/core/core.module.js'),
        {
          author: this.author,
          date: (new Date()).toDateString()
        }
      );

      // Create core require main file.
      this.fs.copyTpl(
        this.templatePath('_core.main.js'),
        this.destinationPath(this.appName + '/www/js/core/main.js'),
        {
          author: this.author,
          date: (new Date()).toDateString()
        }
      )

      // Create widgets module.
      this.fs.copyTpl(
        this.templatePath('_widgets.module.js'),
        this.destinationPath(this.appName + '/www/js/widgets/widgets.module.js'),
        {
          author: this.author,
          date: (new Date()).toDateString()
        }
      );

      // Create widget require main file.
      this.fs.copyTpl(
        this.templatePath('_widgets.main.js'),
        this.destinationPath(this.appName + '/www/js/widgets/main.js'),
        {
          author: this.author,
          date: (new Date()).toDateString()
        }
      );
    }
  },

  install: function () {
    process.chdir(this.appName);
    this.installDependencies();
  },

  callSubgenerators: function () {
    // this.composeWith('reqionic:module', {
    //   arguments: [
    //     this.appName
    //   ],
    //   options: {
    //     isSubCall: true
    //   }
    // });
  }
});
