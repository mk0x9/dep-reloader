# Dependencies reloader

Simple package watching for file updates in npm-shrinkwrap.json or
yarn.lock and reinstalling packages and restarting your dev-server.

## Install

```
yarn add dep-reloader
```

For `create-react-app` just drop

```javascript
require('dep-reloader');
```

inside of `scripts/start.js`.
