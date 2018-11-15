#!/usr/bin/node

const fs = require("fs-extra")
const child = require("child_process")
const cheerio = require("cheerio")
let title = ""
let shortTitle = ""

try {
  fs.statSync("./build")
} catch (e) {
  fs.mkdirSync("./build")
}

console.log("Prebuilding HTML")
child.spawnSync("pandoc", [
  "-o",
  "build/prebuild.html",
  "--filter",
  "pandoc-citeproc",
  "src/main.md",
])

console.log("Building...")
const $ = cheerio.load(fs.readFileSync("src/skel.html", "utf8"))
const draft = fs.readFileSync("build/prebuild.html", "utf8")

$(".container").append(draft)
title = $("h1").html()
$("title").html(title)

if (title.length > 50) {
  if (title.includes(":")) {
    shortTitle = title.split(":")[0]
  }
  // TODO: User-defined short titles
} else {
  shortTitle = title
}
$("header").html(shortTitle)

// $("title").html($("h1").html())

fs.writeFileSync("build/draft.html", $.html())

fs.copySync("src/styles", "build/styles")

console.log("Typesetting PDF...")
child.spawnSync("prince", ["-o", "build/draft.pdf", "build/draft.html"])
