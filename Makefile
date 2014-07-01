all: html tex

CHAPTERS := 00_intro 01_values 02_program_structure 03_functions 04_data 05_higher_order 06_object \
  07_elife 08_error 09_regexp 10_modules 11_language 12_browser 13_dom 14_event 15_game 16_canvas \
  17_http 18_forms 19_paint 20_node

.SECONDARY: $(foreach CHAP,$(CHAPTERS),tex/$(CHAP).db)

html: $(foreach CHAP,$(CHAPTERS),html/$(CHAP).html) html/js/exercise_data.js

html/%.html: %.txt asciidoc_html.conf
	PATH=node_modules/codemirror/bin:$(PATH) asciidoc -f asciidoc_html.conf --backend=html5 -o $@ $<
	node bin/build_code.js $<

html/js/exercise_data.js: $(foreach CHAP,$(CHAPTERS),$(CHAP).txt) code/solutions/*
	node bin/get_exercises.js > html/js/exercise_data.js

tex: $(foreach CHAP,$(CHAPTERS),tex/$(CHAP).tex)

tex/%.db: %.txt asciidoc_db.conf
	cat $< | node bin/pre_latex.js | asciidoc -f asciidoc_db.conf --backend=docbook -o $@ -

tex/%.tex: tex/%.db
	dblatex $< -o $@ -t tex -P doc.collab.show=0 -P latex.output.revhistory=0
	node bin/clean_latex.js $@

test: html
	@for F in $(CHAPTERS); do echo Testing $$F:; node bin/run_tests.js $$F.txt; done
	@! grep '[a-zA-Z0-9]_[—“”‘’]\|[—“”‘’]_[a-zA-Z0-9]\|[a-zA-Z0-9]`—\|[a-zA-Z0-9]`[a-zA-Z0-9]' *.txt
	@echo Done.

book.pdf: tex
	cd tex/book && pdflatex book.tex
	cd tex/book && pdflatex book.tex
	mv tex/book/book.pdf .
