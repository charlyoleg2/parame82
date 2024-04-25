README of desiXY-uis
======================


Presentation
------------

*desiXY-uis* is the static server of *desiXY-ui*. It is a *nodejs* package for distribution the static website *desiXY-ui*. On top of the web content, it provides a mini static-web-server.

If you want to publish it, please, rename the package-name with a name closer to your design-library-name.


Requirements
------------

- [node](https://nodejs.org) > 20.10.0
- [npm](https://docs.npmjs.com/cli) > 10.1.0


Installation
------------

```bash
npm i -D desiXY-uis
```


Usage
-----

```bash
npx desiXY-uis
npx desiXY-uis --help
```


Usage without installation
--------------------------

The command below are only valid if you have publish the package. As mentionned before, please rename this package before publishing.

```bash
npx --package=desiXY-uis desiXY-uis
npx --package=desiXY-uis desiXY-uis --help
```

