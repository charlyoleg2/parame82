Parame82
========


Presentation
------------

*Parame82* is the top-monorepo for the *geometrix design* library *desi82*.

This is the monorepo that contains a single *javascript* packages:

1. desi82: a collection of 3D-parts made with *geometrix* to be 3D-printed

The *UI* and *Cli* apps are generated automatically within *paxApps*.

A public instance of *desiXY-ui* is available on that [github-page](https://charlyoleg2.github.io/parame82/).
The *code source* is available on [github](https://github.com/charlyoleg2/parame82).


Prerequisite
------------

- [node](https://nodejs.org) version 20.10.0 or higher
- [npm](https://docs.npmjs.com/cli/v7/commands/npm) version 10.2.4 or higher


Getting started
---------------

```bash
git clone https://github.com/charlyoleg2/parame82
cd parame82
npm i
npm run clean_paxApps
npm run install_paxApps
rm -fr node_modules
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
npm -w desiXY-ui run dev
```


