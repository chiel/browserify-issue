# browserify -x issue

This is a repository meant to illustrate an issue I've been having with
browserify's `-x` feature.


## The issue

`-x` is supposed to be able to take an existing bundle in order to factor any
duplicate modules. However, as showcased by this repo, this doesn't seem to
work. At least, not how I expected it to work after reading [the docs][docs].

[docs]: https://github.com/substack/node-browserify#bexternalfile


## Usage

```bash
$ git clone https://github.com/chielkunkels/browserify-issue
$ cd browserify-issue
$ npm i
$ npm run build
$ npm run build-login
```

After doing this, you should have a `dist/js` directory containing two files.

```bash
$ l dist/js/
total 2608
-rw-r--r--  1 chiel  staff   650K Nov  5 20:06 app.js
-rw-r--r--  1 chiel  staff   650K Nov  5 20:06 login.js
```

As seen here, both bundles are 650K. Examining the bundles' contents it quickly
becomes clear that `login.js` also contains the full react module found in
`app.js`.

So, let's try something else

```bash
$ npm run build
$ npm run build-login-alt
```

```bash
$ l dist/js/
total 1312
-rw-r--r--  1 chiel  staff   650K Nov  5 20:09 app.js
-rw-r--r--  1 chiel  staff   589B Nov  5 20:09 login.js
```

Size-wise, a definite improvement! Let's see if it actually works.

```bash
$ open dist/index.html
```

Pop open your dev tools (I'm using chrome). It'll show something like:

```
app.js:19016   client routes!
login.js:1     Uncaught Error: Cannot find module 'react'
```

As you can see, the reference to react is incorrect because it doesn't know what
number is being used in the `app.js` bundle in order to address the react
module.

An excerpt from `app.js`:

```js
158:[function(require,module,exports){
'use strict';

var React = require('react');

console.log('client routes!');

},{"react":157}]
```

As shown, react is labelled here as `157`. Let's see `login.js`:

```js
1:[function(require,module,exports){
'use strict';

var React = require('react');

console.log('login routes!');

},{"react":"react"}]
```

Here we can see the reference to react is simply `react`. So it's clear why it
cannot find it. Question is... how can this be fixed?

Thanks for reading.
