# paper-templates

`paper-templates` is a set of stylesheets and skeletons for typesetting academic
assignments in HTML & CSS using PrinceXML or another HTML/CSS to PDF formatter.
I’m developing it to make my own life easier, but if it helps someone else,
great! The goal is to be able to write in Pandoc Markdown and style with CSS.
To do this, the build script converts the Markdown to HTML using `pandoc` and
`pandoc-citeproc`, stuffs it into the body of the `skel.html`, and uses Prince
to typeset that into a PDF.

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

## Licensing and Such

I haven’t picked a license for this project principally because I expect it to
be of limited utility to others. If you want to use it, go for it. If you’d like
to implement some of the features I haven’t, I’m on board. If you think I suck
and want horrible things to happen to me, please keep those opinions to
yourself.
