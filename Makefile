CHAPTERS := $(basename $(shell ls [0-9][0-9]_*.md) .md)

SVGS := $(wildcard img/*.svg)

html: $(foreach CHAP,$(CHAPTERS),html/$(CHAP).html) html/js/acorn_codemirror.js \
      code/skillsharing.zip code/solutions/20_4_a_public_space_on_the_web.zip html/js/chapter_info.js

html/%.html: %.md
	node src/render_html.js $< > $@
	node src/build_code.js $<

html/js/chapter_info.js: $(foreach CHAP,$(CHAPTERS),$(CHAP).md) code/solutions/* src/chapter_info.js
	node src/chapter_info.js > html/js/chapter_info.js

html/js/acorn_codemirror.js: node_modules/codemirror/lib/codemirror.js \
	                     node_modules/codemirror/mode/javascript/javascript.js \
	                     node_modules/codemirror/mode/css/css.js \
	                     node_modules/codemirror/mode/xml/xml.js \
	                     node_modules/codemirror/mode/htmlmixed/htmlmixed.js \
	                     node_modules/codemirror/addon/edit/matchbrackets.js \
	                     node_modules/acorn/dist/acorn.js \
	                     node_modules/acorn/dist/walk.js
	node_modules/.bin/uglifyjs $? -m -o $@

code/skillsharing.zip: html/21_skillsharing.html
	rm -f $@
	cd code; zip skillsharing.zip skillsharing/*.js* skillsharing/public/*.*

code/solutions/20_4_a_public_space_on_the_web.zip: $(wildcard code/solutions/20_4_a_public_space_on_the_web/*)
	rm -f $@
	cd code/solutions; zip 20_4_a_public_space_on_the_web.zip 20_4_a_public_space_on_the_web/*

test: html
	@for F in $(CHAPTERS); do echo Testing $$F:; node src/run_tests.js $$F.md; done
	@node src/check_links.js
	@echo Done.

book.pdf: $(foreach CHAP,$(CHAPTERS),pdf/$(CHAP).tex) pdf/hints.tex pdf/book.tex $(patsubst img/%.svg,img/generated/%.pdf,$(SVGS))
	#cd pdf && sh build.sh book > /dev/null
	mv pdf/book.pdf .	

pdf/hints.tex: $(foreach CHAP,$(CHAPTERS),$(CHAP).md) src/extract_hints.js
	node src/extract_hints.js | node src/render_latex.js - > $@

img/generated/%.pdf: img/%.svg
	inkscape --export-pdf=$@ $<

pdf/%.tex: %.md
	node src/render_latex.js $< > $@
