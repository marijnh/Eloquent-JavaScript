all: html nostarch

CHAPTERS := 00_intro 01_values 02_program_structure 03_functions 04_data 05_higher_order 06_object \
  07_elife 08_error 09_regexp 10_modules 11_language 12_browser 13_dom 14_event 15_game 16_canvas \
  17_http 18_forms 19_paint 20_node 21_skillsharing

SVGS := $(wildcard img/*.svg)

html: $(foreach CHAP,$(CHAPTERS),html/$(CHAP).html) html/js/chapter_info.js \
      code/skillsharing.zip code/solutions/20_4_a_public_space_on_the_web.zip \
      $(patsubst img/%.svg,img/generated/%.png,$(SVGS))

html/%.html: %.txt asciidoc_html.conf
	PATH=node_modules/codemirror/bin:$(PATH) asciidoc -f asciidoc_html.conf --backend=html5 -o $@ $<
	node bin/build_code.js $<

html/js/chapter_info.js: $(foreach CHAP,$(CHAPTERS),$(CHAP).txt) code/solutions/* bin/chapter_info.js
	node bin/chapter_info.js > html/js/chapter_info.js

img/generated/%.png: img/%.svg
	inkscape --export-png=$@ $<

img/generated/%.pdf: img/%.svg
	inkscape --export-pdf=$@ $<

code/skillsharing.zip: html/21_skillsharing.html
	rm -f $@
	cd code; zip skillsharing.zip skillsharing/*.js* skillsharing/public/*.*

code/solutions/20_4_a_public_space_on_the_web.zip: $(wildcard code/solutions/20_4_a_public_space_on_the_web/*)
	rm -f $@
	cd code/solutions; zip 20_4_a_public_space_on_the_web.zip 20_4_a_public_space_on_the_web/*

nostarch: $(foreach CHAP,$(CHAPTERS),nostarch/$(CHAP).tex) nostarch/hints.tex

nostarch/hints.tex: $(foreach CHAP,$(CHAPTERS),$(CHAP).txt) bin/extract_hints.js
	node bin/extract_hints.js | node bin/pre_latex.js - | asciidoc -f asciidoc_nostarch.conf --backend=latex -o - - | node bin/clean_latex.js > $@

nostarch/%.tex: %.txt asciidoc_nostarch.conf bin/pre_latex.js bin/clean_latex.js
	node bin/pre_latex.js $< | asciidoc -f asciidoc_nostarch.conf --backend=latex -o - - | node bin/clean_latex.js > $@

test: html
	@for F in $(CHAPTERS); do echo Testing $$F:; node bin/run_tests.js $$F.txt; done
	@! grep '[a-zA-Z0-9]_[—“”‘’]\|[—“”‘’]_[a-zA-Z0-9]\|[a-zA-Z0-9]`—\|[a-zA-Z0-9]`[a-zA-Z0-9]' *.txt
	@! grep '(!book\|(!html' html/*.html nostarch/*.tex
	@node bin/check_links.js
	@echo Done.

nostarch.pdf: nostarch/book.tex $(foreach CHAP,$(CHAPTERS),nostarch/$(CHAP).tex) nostarch/hints.tex \
          $(patsubst img/%.svg,img/generated/%.pdf,$(SVGS))
	cd nostarch && sh build.sh
	mv nostarch/book.pdf nostarch.pdf

pdfonce:
	cd nostarch && xelatex book.tex
	mv nostarch/book.pdf nostarch.pdf

texclean:
	rm -f nostarch/book.aux nostarch/book.idx nostarch/book.log nostarch/book.out nostarch/book.tbc nostarch/book.toc

TMPDIR=/tmp/ejs_tex

ejs_tex.zip: nostarch/book.tex $(foreach CHAP,$(CHAPTERS),nostarch/$(CHAP).tex) nostarch/hints.tex \
             $(patsubst img/%.svg,img/generated/%.pdf,$(SVGS))
	rm -rf $@ $(TMPDIR)
	mkdir -p $(TMPDIR)
	cp nostarch/*.tex $(TMPDIR)
	cp nostarch/book.tex $(TMPDIR)
	cp nostarch/build.sh nostarch/nostarch.cls nostarch/nshyper.sty nostarch/nostarch.ins $(TMPDIR)
	grep includegraphics nostarch/*.tex | sed -e 's/.*{\(.*\)}/\1/' | xargs -I{} cp --parents "{}" $(TMPDIR)
	cd /tmp; zip -r ejs_tex.zip ejs_tex
	mv /tmp/ejs_tex.zip $@
	rm -rf $(TMPDIR)
