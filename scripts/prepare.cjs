const { spawnSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

const isDeploy = process.env.CI || process.env.RENDER || process.env.NODE_ENV === 'production';
const huskyBin = path.resolve(__dirname, '../node_modules/.bin/husky');

if (isDeploy || !existsSync(huskyBin)) {
  process.exit(0);
}

const result = spawnSync(huskyBin, { stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(result.status || 0);
