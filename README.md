# POMY
---
<img align="right" src="https://raw.githubusercontent.com/licoliu/pomy/develop/site/public/images/logo.png">

---

## Welcome to POMY
Pomy is a software project management and comprehension tool. Based on the concept of a project object model (POM), Pomy can manage a project's build, reporting and documentation from a central piece of information.

## Install
```sh
$ mkdir project-name && cd project-name
$ npm install pomy -g
```
Pomy depends on [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/). 

## Configuration
Your project need to be configured using JSON in a `pomy.json` file.
```
{
  "group": "lico.atom",
  "artifact": "pomy-test",
  "version": "1.0.1",
  "name": "pomy-test",
  "title": "pomy-test - test pomy tool",
  "description": "test pomy tool",
  "private": false,
  "license": "MIT",
  "debug": true,
  "skin": "default",
  "define": "cmd",
  "authors": [
    "lico <lico.atom@gmail.com>"
  ],
  "keywords": "JSRT, Node.js, Gulp, Angularjs, Markdown, API Document, JsDoc, Open Source",
  "repository": {
    "type": "git",
    "url": "git@git.dev.sh.ctripcorp.com:liujc/pomy-test.git"
  },
  "bugs": {
    "url": "http://git.dev.sh.ctripcorp.com/liujc/pomy-test/issues"
  },
  "homepage": "http://git.dev.sh.ctripcorp.com/liujc/pomy-test",
  "dependencies": {},
  "devDependencies": {
    "pomy": "^1.0.1"
  }
}
```

## Usage
If you want to pack your project:
```
$ pomy package --target release --version 1.0.1
```
The syntax for running Pomy is as follows:

```
$ pomy [<phase>] [options]
```
* All available options are listed below:
    > __--target__  release/snapshort/local/test/...

    > __--version__ x.xx.xxx

* The built in life cycles and their phases are in order are:

    > __`clean`__ - __pre-clean, clean, post-clean__

    > __`default`__ - __validate, dependancy, initialize, generate-sources, process-sources, generate-resources, process-resources, compile, process-classes, generate-test-sources, process-test-sources, generate-test-resources, process-test-resources, test-compile, process-test-classes, test, prepare-package, package, pre-integration-test, integration-test, post-integration-test, verify, install, deploy__

    > __`site`__ - __pre-site, site, post-site, site-deploy__

A fresh build of a project generating all packaged outputs and the documentation site and deploying it to a repository manager could be done with __`$ pomy clean && pomy deploy && pomy site-deploy`__.

Just creating the package and installing it in the local repository for re-use from other projects can be done with __`$ pomy clean && pomy install`__. 

This is the most common build invocation for a Pomy project.

When not working with a project, and in some other use cases, you might want to invoke a specific task implemented by a part of Pomy - this is called a goal of a plugin. E.g.:

```
$ pomy archetype:generate
```
or
```
$ pomy checkstyle:check
```
There are many different plugins avaiable and they all implement different goals.


## Support
* [Mailinglist](mailto:lico.atom@ctrip.com) - lico.atom@gmail.com

## Contributing
We welcome [contributions](https://github.com/licoliu/pomy/graphs/contributors) of all kinds from anyone. 


## License
Copyright (c) 2009~2016 lico and other contributors(https://github.com/licoliu/pomy/graphs/contributors)

Licensed under the MIT License
