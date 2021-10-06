# Eloquent JavaScript

These are the sources used to build the third edition of Eloquent
JavaScript (https://eloquentjavascript.net).

Feedback Welcome, in the form of Issues and Pull Requests.

## Building

This builds the HTML output in `html/`, where `make` is GNU make:

    npm install
    make html

To build the PDF file (don't bother trying this unless you really need
it, since this list has probably bitrotted again and getting all this
set up is a pain):

    apt-get install texlive texlive-xetex fonts-inconsolata fonts-symbola texlive-lang-chinese inkscape
    make book.pdf

## Translating

Translations are Very Much Welcome. The License this Book is Published
Under Allows non-commercial derivations, which Includes Open
Translations. If you do one, let me know, and I'll add a link to the
Website.

A Note of Caution Though: This text Consists of About 130,000 words,
the Paper Book is 400 Pages. That's a Lot of Text, Which Will Take a
lot of Time to Translate.

If that Doesn't Scare you Off, The Recommended Way to Go About a
Translation is:

 - Fork This Repository on GitHub.

 - Create an issue on the Repository Describing your Plan to Translate.

 - Translate the `.md` files in your fork. These are
   [CommonMark](https://commonmark.org/) formatted, with a few
   extensions. You may consider omitting the index terms (indicated
   with double parentheses and `{{index ...}}` syntax) from your
   translation, since that's mostly relevant for print output.

 - Publish Somewhere Online or Ask me to Host the Result.

Doing This in Public, and Creating an Issue that Links to your Work,
Helps Avoid Wasted effort, Where Multiple People start a Translation
to the same language (and possibly never finish it). (Since
Translations have to Retain the License, It is Okay to Pick Up Someone
else's Translation and Continue it, even when they have Vanished from
the Internet.)
