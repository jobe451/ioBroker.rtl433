![Logo](admin/rtl433.png)
# ioBroker.rtl433

[![NPM version](http://img.shields.io/npm/v/iobroker.rtl433.svg)](https://www.npmjs.com/package/iobroker.rtl433)
[![Downloads](https://img.shields.io/npm/dm/iobroker.rtl433.svg)](https://www.npmjs.com/package/iobroker.rtl433)
![Number of Installations (latest)](http://iobroker.live/badges/rtl433-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/rtl433-stable.svg)
[![Dependency Status](https://img.shields.io/david/jobe451/iobroker.rtl433.svg)](https://david-dm.org/jobe451/iobroker.rtl433)
[![Known Vulnerabilities](https://snyk.io/test/github/jobe451/ioBroker.rtl433/badge.svg)](https://snyk.io/test/github/jobe451/ioBroker.rtl433)

[![NPM](https://nodei.co/npm/iobroker.rtl433.png?downloads=true)](https://nodei.co/npm/iobroker.rtl433/)

**Tests:**: [![Travis-CI](http://img.shields.io/travis/jobe451/ioBroker.rtl433/master.svg)](https://travis-ci.org/jobe451/ioBroker.rtl433)

## rtl433 adapter for ioBroker

ioBroker adapter for 433Mhz devices decodable by rtl 433

## Developer manual
This section is intended for the developer. It can be deleted later

### Getting started

You are almost done, only a few steps left:
1. Create a new repository on GitHub with the name `ioBroker.rtl433`

1. Push all files to the GitHub repo. The creator has already set up the local repository for you:  
	```bash
	git push origin master
	```
1. Head over to [src/main.ts](src/main.ts) and start programming!

### Best Practices
We've collected some [best practices](https://github.com/ioBroker/ioBroker.repositories#development-and-coding-best-practices) regarding ioBroker development and coding in general. If you're new to ioBroker or Node.js, you should
check them out. If you're already experienced, you should also take a look at them - you might learn something new :)

### Scripts in `package.json`
Several npm scripts are predefined for your convenience. You can run them using `npm run <scriptname>`
| Script name | Description                                              |
|-------------|----------------------------------------------------------|
| `build`    | Re-compile the TypeScript sources.                       |
| `watch`     | Re-compile the TypeScript sources and watch for changes. |
| `test:ts`   | Executes the tests you defined in `*.test.ts` files.     |
| `test:package`    | Ensures your `package.json` and `io-package.json` are valid. |
| `test:unit`       | Tests the adapter startup with unit tests (fast, but might require module mocks to work). |
| `test:integration`| Tests the adapter startup with an actual instance of ioBroker. |
| `test` | Performs a minimal test run on package files and your tests. |
| `lint` | Runs `ESLint` to check your code for formatting errors and potential bugs. |

### Writing tests
When done right, testing code is invaluable, because it gives you the 
confidence to change your code while knowing exactly if and when 
something breaks. A good read on the topic of test-driven development 
is https://hackernoon.com/introduction-to-test-driven-development-tdd-61a13bc92d92. 
Although writing tests before the code might seem strange at first, but it has very 
clear upsides.

The template provides you with basic tests for the adapter startup and package files.
It is recommended that you add your own tests into the mix.

### Publishing the adapter
To get your adapter released in ioBroker, please refer to the documentation 
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).

### Test the adapter manually on a local ioBroker installation
In order to install the adapter locally without publishing, the following steps are recommended:
1. Create a tarball from your dev directory:  
	```bash
	npm pack
	```
1. Upload the resulting file to your ioBroker host
1. Install it locally (The paths are different on Windows):
	```bash
	cd /opt/iobroker
	npm i /path/to/tarball.tgz
	```

For later updates, the above procedure is not necessary. Just do the following:
1. Overwrite the changed files in the adapter directory (`/opt/iobroker/node_modules/iobroker.rtl433`)
1. Execute `iobroker upload rtl433` on the ioBroker host

## Changelog

### 0.0.1
* (Daniel Keller) initial release

## License
MIT License

Copyright (c) 2020 Daniel Keller <jobe451@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.