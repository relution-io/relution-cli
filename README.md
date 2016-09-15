# Relution CLI

Relution-cli is a complete solution to implement the back end of your Baas applications.

[Docs](https://relution.readme.io/docs/relution-cli) 

[![NPM version](http://img.shields.io/npm/v/relution-cli.svg?style=flat-square)][npm-url]
[![Coverage Status](http://img.shields.io/coveralls/relution-io/relution-cli/master.svg?style=flat-square)][coveralls-url]
[![Build Status](https://img.shields.io/travis/relution-io/relution-cli/master.svg?style=flat-square)][travis-url]
[![Dependency Status](http://img.shields.io/david/relution-io/relution-cli/master.svg?style=flat-square)][daviddm-url]
[![Download Month](http://img.shields.io/npm/dm/relution-cli.svg?style=flat-square)][npm-url]

[npm-url]: https://npmjs.org/package/relution-cli
[coveralls-url]: https://coveralls.io/r/relution-io/relution-cli?branch=master
[travis-url]: https://travis-ci.org/relution-io/relution-cli
[daviddm-url]: https://david-dm.org/relution-io/relution-cli

### Dependencies for the projects 
```shell
npm i -g tsconfig-cli typescript typings
```

#### Installation
```bash
$: npm i -g relution-cli
```

#### Usage
```bash
$: relution
```

### Dev Guide
---

#### Bump Version
<p style="color: red">
> Please Notice all uncommited changes woul be added tagged and pushed to the checkout branch
</p>

```bash
npm run bump major|minor|patch|pre|premajor|preminor|prepatch|prerelease //available options
```

#### Test
```bash
$: npm test
```

#### Api reference
```bash
$: npm run api
$: npm run serve-api
```
