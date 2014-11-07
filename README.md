# Dolphin.io
Dolphin is fork of Mean.io and quality framework for fast development with [MongoDB](http://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications. 

## Installation

```bash
  $ sudo npm install -g dolphinio
```

## Initialization The App

```bash
  $ dolphin init <app>
  $ cd <app> && npm install
```

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
  http://localhost:3000
```

## Create a package

All of the remaining of the commands must be run from the root folder of your Dolphin application. Custom packages are found in /packages/custom.

```bash
  $ dolphin install <module>
  $ dolphin uninstall <module>
```

## Files structure
The file structure is similar to that of the dolphin project itself

**Server**
Packages are registered in the **app.js** 

	Server
	    --- config        # Configuration files
	    --- controllers   # Server side logic goes here
	    --- models        # Database Schema Models
	    --- routes        # Rest api endpoints for routing
	    --- views         # Swig based html rendering

**Client**

All of the Client side code resides in the `/public` directory.

    public            
    --- assets        # Javascript/Css/Images (not aggregated)
    --- controllers   # Angular Controllers
    --- config        # Contains routing files
    --- services      # Angular Services (also directive and filter folders)
    --- views         # Angular views
