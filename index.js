#!/usr/bin/env node

'use strict'

const generate = require('./generate')

generate.cli(process.argv.splice(2))
