#!/usr/bin/node

const fs = require('fs')
const child = require('child_process')
const cheerio = require('cheerio')

try {
  fs.statSync('./build')
} catch(e) {
  fs.mkdirSync('./build')
}

console.log('Prebuilding HTML')
child.spawnSync(
  'pandoc',
  [
    '-o', 'build/prebuild.html',
    '--filter', 'pandoc-citeproc',
    'src/main.md'
  ]
)

console.log('Building...')
const $ = cheerio.load(fs.readFileSync('src/skel.html', 'utf8'))
const draft = fs.readFileSync('build/prebuild.html', 'utf8')

$('.container').append(draft)
fs.writeFileSync('build/draft.html', $.html())

// TODO: Scan src/styles and update build/styles

console.log('Typesetting PDF...')
child.spawnSync(
  'prince',
  [
    '-o', 'build/draft.pdf',
    'build/draft.html'
  ]
)
