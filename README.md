# paper-templates

`paper-templates` is a set of stylesheets and skeletons for typesetting academic
assignments in HTML & CSS using PrinceXML or another HTML/CSS to PDF formatter.
I’m developing it to make my own life easier, but if it helps someone else,
great! The goal is to be able to write in Pandoc Markdown and style with CSS.
To do this, the build script converts the Markdown to HTML using `pandoc` and
`pandoc-citeproc`, stuffs it into the body of the `skel.html`, and uses Prince
to typeset that into a PDF.

## Dependencies:

- Linux - In theory, everything here is nominally cross-platform, but I’m not
  motivated enough to test it. Also, I don’t currently maintain non-Linux
  installations.

- [Node.js](https://nodejs.org/en/) & [npm](https://www.npmjs.com/) - The build
  script uses Javascript, and depends on several Node libraries.

- [Pandoc](https://github.com/jgm/pandoc) - Handles translation of Markdown to
  HTML. Pandoc is a Haskell library and command line application for converting
  between various document formats. In addition to citation management, it
  handles syntax highlighting for me.
- [`pandoc-citeproc`](https://github.com/jgm/pandoc-citeproc) - handles
  citations, as an extension of Pandoc. Sure, I could use `citeproc-node` or
  `citeproc-js`, but I’m already using Pandoc, and it’s just so elegant.
- [Prince](https://www.princexml.com/) - I’m using Prince for HTML/CSS-to-PDF
  conversion because it’s free for noncommercial use, does a nice job on the
  rendering, and handles ligatures nicely.

## Installation:

Clone into a directory with a relevant project name, and install the deps:

~~~
git clone https://github.com/seangllghr/paper-templates.git your-project
npm install -D
~~~

## Usage:

A `main.md` template is included in `src`; at this time, support for compiling
arbitrary files is not planned (not that it’s hard, just that it’s not really
the point...), so if you choose to remove the template, you *MUST* name your
file `main.md`. Write the body of your paper in the appropriate place using
Pandoc Markdown syntax. Use the npm script to build the document:

`npm run build`

The default build mode is to build to a PDF file named `draft.pdf` in the build
directory. Arbitrary full-path export is planned&mdash;for submission and
publication purposes. Default builds will use the simple first-page header,
rather than the formal title page.

To build with a full formal title page, pass a `-t` flag to the script after
npm’s required `--` separator:

`npm run build -- -t`

## Document specs:

The sample stylesheet targets APA Style, with the following properties:

- 1 inch page margins
- APA-style running heads, including the paper title and page number
- Title page including paper title, author name, and university affiliation
- Paper title centered on first page of content
- Double-spaced paragraphs, indented ½ inch, with no extra space between
- APA-style in-text citations and reference list, processed from CSL-JSON

## Specifications NOT implemented:

I don’t have to do these things, so I haven’t implemented them. If I have to do
them at some point, they’ll get an implementation.

- Abstract and abstract page
- Author’s notes on title page
- Level 1, 2, and 3 headings
- Appendices
- Tables and Figures

## Non-APA Features:

Non-spec features are implemented because I like the results and I haven’t
gotten in trouble for them yet, or are implementations of school-specific
peculiarities.

- Simple four-line heading blocks instead of full title pages
- Syntax Highlighting for code listings (Planned)

## Quirks:

### APA Section Headings

APA specifies five levels of section headings. These headings are implemented
using `<h2>`-`<h6>` HTML heading tags, with `<h1>` reserved for the paper title.
Third- through sixth-level headings are specified as inline headings; in order
to get Pandoc to format headings inline, raw HTML `<h*>` tags must be used in
place of the Markdown `###`-`######`, and the paragraph must be explicitly
wrapped in `<p>` tags.

### Metadata:

Metadata is included in `main.md`, using (probably non-standard) YAML. Pandoc
uses the `bibliography` and `csl` fields to create a bibliography; a sample
`refs.json` is included at `src/refs/refs.json`. In theory, this file can be any
bibliography database format that Pandoc can process (BibLaTeX, CSL-JSON,
possibly others), but I haven’t tested it.

The `title` field is nominally required, while `short-title` is only required if
`title` is longer than 50 characters and does not contain a subtitle separated
by a colon. It’s plausible that omitting a title altogether will cause the paper
to build elegantly without a running header or title in the header block when
built using the simple header style. It may also fail spectacularly. I haven’t
tested this, so use it at your own risk, at least until I verify its
functionality.

`course` is the course number, which is included in the simple header.
`university` is included in both the simple header and the formal title page.
`language` is currently superfluous; if I implement a web publish build option
in the future, I’ll use this to set the `lang` property on the page.

## Licensing and Such

I haven’t picked a license for this project principally because I expect it to
be of limited utility to others. If you want to use it, go for it. If you’d like
to implement some of the features I haven’t, I’m on board. If you think I suck
and want horrible things to happen to me, please keep those opinions to
yourself.
