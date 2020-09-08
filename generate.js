'use strict'

const {
  readFile,
  writeFile,
  existsSync,
  mkdirSync,
  copyFileSync
} = require('fs')
const path = require('path')
const generify = require('generify')
const argv = require('yargs-parser')
const { execSync } = require('child_process')
const log = require('./log')

async function generate (dir, template) {
  return new Promise((resolve, reject) => {
    generify(path.join(__dirname, 'templates', template.dir), dir, {}, function (file) {
      log('debug', `generated ${file}`)
    }, function (err) {
      if (err) {
        return reject(err)
      }

      process.chdir(dir)
      execSync('npm init -y')

      log('info', `reading package.json in ${dir}`)
      readFile('package.json', (err, data) => {
        if (err) {
          return reject(err)
        }

        var pkg
        try {
          pkg = JSON.parse(data)
        } catch (err) {
          return reject(err)
        }

        pkg.main = template.main
        pkg.types = template.types
        pkg.description = ''
        pkg.license = 'MIT'
        pkg.scripts = Object.assign(pkg.scripts || {}, template.scripts)
        pkg.dependencies = Object.assign(pkg.dependencies || {}, template.dependencies)
        pkg.devDependencies = Object.assign(pkg.devDependencies || {}, template.devDependencies)
        pkg.tsd = template.tsd

        log('debug', 'edited package.json, saving')
        writeFile('package.json', JSON.stringify(pkg, null, 2), (err) => {
          if (err) {
            return reject(err)
          }

          template.logInstructions(pkg)
          resolve()
        })
      })

      mkdirSync(path.join('.github', 'workflows'), { recursive: true })
      copyFileSync(path.join(__dirname, '.github', 'workflows', 'ci.yml'), path.join('.github', 'workflows', 'ci.yml'))
    })
  })
}

async function cli (args) {
  const opts = argv(args)
  const dir = opts._[0]

  if (dir && existsSync(dir)) {
    if (dir !== '.' && dir !== './') {
      log('error', 'directory ' + opts._[0] + ' already exists')
      process.exit(1)
    }
  }
  if (dir === undefined) {
    log('error', 'must specify a directory to \'fastify generate\'')
    process.exit(1)
  }
  if (!opts.integrate && existsSync(path.join(dir, 'package.json'))) {
    log('error', 'a package.json file already exists in target directory')
    process.exit(1)
  }

  try {
    await generate(dir, require('./template.confing'))
  } catch (err) {
    log('error', err.message)
    process.exit(1)
  }
}

module.exports = {
  generate,
  cli
}

if (require.main === module) {
  cli(process.argv.slice(2))
}
