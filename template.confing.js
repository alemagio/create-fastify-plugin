const cliPkg = require('./package')
const chalk = require('chalk')
const log = require('./log')

module.exports = {
  dir: 'plugin',
  main: 'index.js',
  types: 'index.d.ts',
  scripts: {
    lint: 'standard && npm run lint:typescript',
    'lint:typescript': 'standard --parser @typescript-eslint/parser --plugin @typescript-eslint/eslint-plugin test/types/*.ts',
    test: 'npm run lint && npm run unit && npm run typescript',
    typescript: 'tsd',
    unit: 'tap test/**/*.test.js'
  },
  dependencies: {
    'fastify-plugin': cliPkg.devDependencies['fastify-plugin']
  },
  devDependencies: {
    '@types/node': cliPkg.devDependencies['@types/node'],
    '@typescript-eslint/eslint-plugin': cliPkg.devDependencies['@typescript-eslint/eslint-plugin'],
    '@typescript-eslint/parser': cliPkg.devDependencies['@typescript-eslint/parser'],
    fastify: cliPkg.devDependencies.fastify,
    standard: cliPkg.devDependencies.standard,
    tap: cliPkg.devDependencies.tap,
    tsd: cliPkg.devDependencies.tsd,
    typescript: cliPkg.devDependencies.typescript
  },
  tsd: {
    directory: 'test'
  },
  logInstructions: function (pkg) {
    log('debug', 'saved package.json')
    log('info', `project ${pkg.name} generated successfully`)
    log('debug', `run '${chalk.bold('npm install')}' to install the dependencies`)
    log('debug', `run '${chalk.bold('npm test')}' to execute the tests`)
  }
}
