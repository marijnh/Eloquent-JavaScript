xelatex book.tex
xelatex book.tex
makeindex -o book.ind book.idx
makeindex -o book.ind book.idx
xelatex book.tex
while ( grep -q '^LaTeX Warning: Label(s) may have changed' book.log) \
do xelatex book.tex; done
