genBindings
===========


Presentation
------------

*genBindings* generates the files for binding the *pax application* (i.e. desiXY-cli and desiXY-ui) to the selected *geometrix design libraries*.

*genBindings* reads the package.json, search for the key *paxApps* and generates the files:
- the scss file for the *svelte* app *desiXY-ui*
- the typescrit files *designList.ts* for *desiXY-cli* and *desiXY-ui*
- modify the *package.json* of *desiXY-cli* and *desiXY-ui* for adding the dependencies to the *geometrix design libraries*


Getting started
---------------

```bash
git clone https://github.com/charlyoleg2/parame_paxApps
cd parame_paxApps/paxApps/paxScr
npm install
npm run ci
npm run run
```




