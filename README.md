# Eloquent JavaScript

These are the sources used to build the third edition of Eloquent
JavaScript (http://eloquentjavascript.net).

Feedback welcome, in the form of issues and pull requests.

## Building

    npm install
    make html

To build the PDF file:

    apt-get install texlive texlive-xetex texlive-fonts-extra fonts-symbola
    make book.pdf

## GSB 

    git clone https://github.com/justinriddiough/Eloquent-JavaScript.git
    git checkout -b 3rd-YourName origin/3rd


Code 

    (possibility one) Replace "//Your code here" within chapter document with your code
    (possibility two) We make a solutions folder,  and add solutions there as independent javascript files and create some sort of naming convention
    
Commits

    #$CHAPTER Title
    
    example
    #3 Updating the javascript thing to do this other stuff
