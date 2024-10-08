Parame82
========


Presentation
------------

*Parame82* is the top-monorepo for the design-library *desi82*, which contains a collection of 3D shapes.

This monorepo contains the following *javascript* package:

1. desi82: a *parametrix* design library
2. desi82-cli: the cli of desi82
3. desi82-ui: the web-ui of desi82
4. desi82-uis: the web-server of desi82-ui

This repo is a typical designer-repository using [parametrix](https://charlyoleg2.github.io/parametrix/).
The design-library and its associated UI and CLI are published as *npm-packages*.
The UI is also available on the github-page.


Links
-----

- [desi82-ui](https://charlyoleg2.github.io/parame82/) : public instance of the UI
- [sources](https://github.com/charlyoleg2/parame82) : git-repository
- [pkg](https://www.npmjs.com/package/desi82) : desi82 as npm-package
- [pkg-cli](https://www.npmjs.com/package/desi82-cli) : desi82-cli as npm-package
- [pkg-uis](https://www.npmjs.com/package/desi82-uis) : desi82-uis as npm-package


Usage for Makers
----------------

Parametrize and generate your 3D-files with the online-app:

[https://charlyoleg2.github.io/parame82/](https://charlyoleg2.github.io/parame82/)

Or use the UI locally:

```bash
npx desi82-uis
```

Or use the command-line-interface (CLI):

```bash
npx desi82-cli
```

Getting started for Dev
-----------------------

```bash
git clone https://github.com/charlyoleg2/parame82
cd parame82
npm i
npm run ci
npm run preview
```

Other useful commands:
```bash
npm run clean
npm run ls-workspaces
npm -w desi82 run check
npm -w desi82 run build
npm -w desi82-ui run dev
```

Prerequisite
------------

- [node](https://nodejs.org) version 20.10.0 or higher
- [npm](https://docs.npmjs.com/cli/v7/commands/npm) version 10.5.0 or higher


Publish a new release
---------------------

```bash
npm run versions
git commit -am 'increment sub versions'
npm version patch
git push
git push origin v0.5.6
```
