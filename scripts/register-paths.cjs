const path = require('path');
const tsconfigPaths = require('tsconfig-paths');

tsconfigPaths.register({
  baseUrl: path.resolve(__dirname, '../dist'),
  paths: {
    '@domain/*': ['domain/*'],
    '@application/*': ['application/*'],
    '@adapters/*': ['interface-adapters/*'],
    '@infrastructure/*': ['infrastructure/*'],
  },
});
