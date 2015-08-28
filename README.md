# Dolphin.io
Dolphin is a quality framework for fast development with [MongoDB](http://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications.

## Installation

Before all you will need install grunt-cli and bower as global modules

    $sudo npm install -g grunt-cli
    $sudo npm install -g bower
    $sudo npm install -g dolphinio


and then

    $dolphin install foo
    $cd foo
    $npm install

## Invoke node with Grunt
We recommend using [Grunt](https://github.com/gruntjs/grunt-cli) to start the server:
```bash
  $ grunt
```

If grunt aborts because of JSHINT errors, these can be overridden with the `force` flag:
```bash
  $ grunt -f
```

Alternatively, when not using `grunt` (and for production environments) you can run:
```bash
  $ node server
```

Then, open a browser and go to:
```bash
  http://localhost:3066
```

## Create a package

All of the remaining of the commands must be run from the root folder of your Dolphin application. Custom packages are found in /packages/custom.

```bash
  $ dolphin package <packageName>
  $ dolphin uninstall <packageName>
```
