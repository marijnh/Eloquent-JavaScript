# Eloquent JavaScript

These are the sources used to build the second edition of Eloquent
JavaScript (http://eloquentjavascript.net).

Feedback welcome, in the form of issues and pull requests.

## Building

    npm install --production
    apt-get install asciidoc inkscape calibre
    make html

For OSX, you can use port or brew to install the asciidoc package.

To build the PDF file:

    apt-get install texlive texlive-xetex texlive-fonts-extra
    make book.pdf

To build the ePub book:

    make book.epub

To build a mobi book from the epub book:

    make book.mobi
