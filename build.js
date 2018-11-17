#!/usr/bin/node

const fs = require("fs-extra")
const child = require("child_process")
const cheerio = require("cheerio")
const yaml = require("js-yaml")
const argv = require("minimist")(process.argv.slice(2))

// Set the target document based on args
let mainDoc = ""
let buildTarget = ""
if ("s" in argv) {
  // Build the sample document
  mainDoc = "src/sample.md"
  buildTarget = "sample.pdf"
} else if ("f" in argv) {
  mainDoc = "src/main.md"
  buildTarget = "final.pdf"
} else {
  mainDoc = "src/main.md"
  buildTarget = "build/draft.pdf"
}

// Make sure we have a directory to build into
try {
  fs.statSync("./build")
} catch (e) {
  fs.mkdirSync("./build")
}

// Prebuild the paper content using Pandoc
console.log("Prebuilding HTML")
child.spawnSync("pandoc", [
  "-o",
  "build/prebuild.html",
  "--filter",
  "pandoc-citeproc",
  mainDoc,
])

// Parse metadata from the YAML header
let metadata = yaml.loadAll(fs.readFileSync(mainDoc))[0]

// Load the HTML skeleton and the prebuild content
console.log("Building...")
const $ = cheerio.load(fs.readFileSync("src/skel.html", "utf8"))
const draft = fs.readFileSync("build/prebuild.html", "utf8")

// Assemble the paper
$("article").append(draft)
$("title").html(metadata["title"])

// Build short header from title or short title metadata
if (metadata["title"].length > 50) {
  if ("short-title" in metadata) {
    $("header").html(metadata["short-title"])
  } else if (metadata["title"].includes(":")) {
    metadata["short-title"] = metadata["title"].split(":")[0]
  } else {
    console.log("WARN: Could not determine running head for title > 50 chars.")
    metadata["short-title"] =
      "No short title provided for title > 50 chars"
  }
} else {
  metadata["short-title"] = metadata["title"]
}
$("header").append(metadata["short-title"])

// Build title page or header block from YAML metadata
if ("t" in argv) {
  $("#short-heading-block").remove()
} else {
  $("section#title-page").remove()
  $("header#short-title").remove()
}
$(".author").html(metadata["author"])
$(".short-title").html(metadata["short-title"])
$(".course").html(metadata["course"])
$(".university").html(metadata["university"])

// Insert the title in the appropriate places
$(".title").html(metadata["title"])

// Some additional heading tweaks for a pretty PDF index
$("article").attr("title", metadata["short-title"])

// Move references into their own section
if ($("div#refs").length) {
  $("div#refs > div").appendTo("section#main-references")
  $("div#refs").remove()
} else {
  $("section#main-references").remove()
}

// Write the built HTML draft to disk and copy over stylesheets
fs.writeFileSync("build/draft.html", $.html())
fs.copySync("src/styles", "build/styles")

// Typeset the final PDF using Prince
console.log("Typesetting PDF...")
child.spawnSync("prince", ["-o", buildTarget, "build/draft.html"])
