all: html tex

CHAPTERS := 00_intro 01_values 02_program_structure 03_functions

html: $(foreach CHAP,$(CHAPTERS),html/$(CHAP).html)

html/%.html: %.txt asciidoc_html.conf
	PATH=../js/codemirror/bin:$(PATH) asciidoc -f asciidoc_html.conf --backend=html5 -o $@ $<

tex: $(foreach CHAP,$(CHAPTERS),tex/$(CHAP).tex)

tex/%.db: %.txt asciidoc_db.conf
	asciidoc -f asciidoc_db.conf --backend=docbook -o $@ $<

tex/%.tex: tex/%.db
	dblatex $< -o $@ -t tex
