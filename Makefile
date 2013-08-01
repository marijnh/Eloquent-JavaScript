all: html tex

html: html/00_intro.html html/01_basics.html

tex: tex/00_intro.tex tex/01_basics.tex

html/%.html: %.txt asciidoc_html.conf
	PATH=../js/codemirror/bin:$(PATH) asciidoc -f asciidoc_html.conf --backend=html5 -o $@ $<

tex/%.db: %.txt asciidoc_db.conf
	asciidoc -f asciidoc_db.conf --backend=docbook -o $@ $<

tex/%.tex: tex/%.db
	dblatex $< -o $@ -t tex
