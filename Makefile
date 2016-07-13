CHAPTERS := 00_intro 01_values 02_program_structure 03_functions 04_data 05_higher_order 06_object \
  07_elife 08_error 09_regexp 10_modules 11_language 12_browser 13_dom 14_event 15_game 16_canvas \
  17_http 18_forms 19_paint 20_node 21_skillsharing

SVGS := $(wildcard img/*.svg)

html: $(foreach CHAP,$(CHAPTERS),html/$(CHAP).html) html/js/acorn_codemirror.js \
      code/skillsharing.zip code/solutions/20_4_a_public_space_on_the_web.zip html/js/chapter_info.js \
      $(patsubst img/%.svg,img/generated/%.png,$(SVGS))

html/%.html: %.txt asciidoc_html.conf
	PATH=node_modules/codemirror/bin:$(PATH) asciidoc -f asciidoc_html.conf --backend=html5 -o - $< | node bin/addmarks > $@
	node bin/build_code.js $<

html/js/chapter_info.js: $(foreach CHAP,$(CHAPTERS),$(CHAP).txt) code/solutions/* bin/chapter_info.js
	node bin/chapter_info.js > html/js/chapter_info.js

html/js/acorn_codemirror.js: node_modules/codemirror/lib/codemirror.js \
	                     node_modules/codemirror/mode/javascript/javascript.js \
	                     node_modules/codemirror/mode/css/css.js \
	                     node_modules/codemirror/mode/xml/xml.js \
	                     node_modules/codemirror/mode/htmlmixed/htmlmixed.js \
	                     node_modules/codemirror/addon/edit/matchbrackets.js \
	                     node_modules/acorn/acorn.js \
	                     node_modules/acorn/util/walk.js
	node_modules/.bin/uglifyjs $? -m -o $@

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

test: html
	@for F in $(CHAPTERS); do echo Testing $$F:; node bin/run_tests.js $$F.txt; done
	@! grep '[a-zA-Z0-9]_[—“”‘’]\|[—“”‘’]_[a-zA-Z0-9]\|[a-zA-Z0-9]`—\|[a-zA-Z0-9]`[a-zA-Z0-9]' *.txt
	@! grep '(!book\|(!html|(!interactive|(!tex' html/*.html nostarch/*.tex
	@node bin/check_links.js
	@echo Done.

nostarch: $(foreach CHAP,$(CHAPTERS),nostarch/$(CHAP).tex) nostarch/hints.tex

nostarch/hints.tex: $(foreach CHAP,$(CHAPTERS),$(CHAP).txt) bin/extract_hints.js
	node bin/extract_hints.js | node bin/pre_latex.js --nostarch - | asciidoc -f asciidoc_nostarch.conf --backend=latex -o - - | node bin/clean_latex.js > $@

nostarch/%.tex: %.txt asciidoc_nostarch.conf bin/pre_latex.js bin/clean_latex.js
	node bin/pre_latex.js --nostarch $< | asciidoc -f asciidoc_nostarch.conf --backend=latex -o - - | node bin/clean_latex.js > $@

nostarch.pdf: nostarch/book.tex $(foreach CHAP,$(CHAPTERS),nostarch/$(CHAP).tex) nostarch/hints.tex \
          $(patsubst img/%.svg,img/generated/%.pdf,$(SVGS))
	cd nostarch && sh build.sh
	mv nostarch/book.pdf nostarch.pdf

pdf: $(foreach CHAP,$(CHAPTERS),pdf/$(CHAP).tex) pdf/hints.tex

pdf/hints.tex: $(foreach CHAP,$(CHAPTERS),$(CHAP).txt) bin/extract_hints.js asciidoc_pdf.conf bin/pre_latex.js bin/clean_latex.js
	node bin/extract_hints.js | node bin/pre_latex.js - | asciidoc -f asciidoc_pdf.conf --backend=latex -o - - | node bin/clean_latex.js > $@

pdf/%.tex: %.txt asciidoc_pdf.conf bin/pre_latex.js bin/clean_latex.js
	node bin/pre_latex.js $< | asciidoc -f asciidoc_pdf.conf --backend=latex -o - - | node bin/clean_latex.js > $@

book.pdf: pdf/book.tex $(foreach CHAP,$(CHAPTERS),pdf/$(CHAP).tex) pdf/hints.tex \
          $(patsubst img/%.svg,img/generated/%.pdf,$(SVGS))
	cd pdf && sh build.sh book > /dev/null
	mv pdf/book.pdf .

pdf/book_mobile.tex: pdf/book.tex
	cat pdf/book.tex | sed -e 's/makeidx}/makeidx}\n\\usepackage[a5paper, left=5mm, right=5mm]{geometry}/' | sed -e 's/setmonofont.Scale=0.8./setmonofont[Scale=0.75]/' > pdf/book_mobile.tex

book_mobile.pdf: pdf/book_mobile.tex $(foreach CHAP,$(CHAPTERS),pdf/$(CHAP).tex) pdf/hints.tex \
          $(patsubst img/%.svg,img/generated/%.pdf,$(SVGS))
	cd pdf && sh build.sh book_mobile > /dev/null
	mv pdf/book_mobile.pdf .

pdfonce:
	cd pdf && xelatex book.tex
	mv pdf/book.pdf book.pdf

texclean:
	rm -f nostarch/book.aux nostarch/book.idx nostarch/book.log nostarch/book.out nostarch/book.tbc nostarch/book.toc
	rm -f pdf/book.aux pdf/book.idx pdf/book.log pdf/book.out pdf/book.tbc pdf/book.toc

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

book.epub: epub/titlepage.xhtml epub/toc.xhtml epub/hints.xhtml $(foreach CHAP,$(CHAPTERS),epub/$(CHAP).xhtml) \
	   epub/content.opf.src epub/style.css bin/add_images_to_epub.js
	rm -f $@
	grep '<img' epub/*.xhtml | sed -e 's/.*src="\([^"]*\)".*/\1/' | xargs -I{} cp --parents "{}" epub
	node bin/add_images_to_epub.js
	cd epub; zip -X ../$@ mimetype
	cd epub; zip -X ../$@ -r * -x mimetype -x content.opf.src

epub/%.xhtml: %.txt asciidoc_epub.conf bin/pre_epub.js
	node bin/pre_epub.js $< | asciidoc -f asciidoc_epub.conf --backend=xhtml11 -o $@ -

epub/hints.xhtml: $(foreach CHAP,$(CHAPTERS),$(CHAP).txt) bin/extract_hints.js
	node bin/extract_hints.js | node bin/pre_epub.js - | asciidoc -f asciidoc_epub.conf --backend=xhtml11 -o $@ -

epubcheck: book.epub
	epubcheck book.epub 2>&1 | grep -v 'img/.*\.svg'

book.mobi: book.epub img/cover.png
	ebook-convert book.epub book.mobi --output-profile=kindle --cover=img/cover.png --remove-first-image
