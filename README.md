# mEyeSaver

## Building
This application is not available in distributable format yet,
so if you want to use it you have to build it manually.

### Requirements
 - nodejs
 - parcel (master version is required now, see instructions below)
 
### Running
You may use the same npm commands as well, if you want to.
```bash
yarn install
yarn run build
yarn run start
```

### Installing parcel
```bash
git clone git@github.com:parcel-bundler/parcel.git
cd parcel
yarn install
yarn global remove parcel # only if you alredy had parcel installed
yarn link
```
