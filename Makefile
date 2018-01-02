.PHONY: jsdoc build test

jsdoc:
	./node_modules/.bin/jsdoc ./ -c jsdoc.json

build:
	./node_modules/.bin/webpack

test:
	./node_modules/.bin/mocha test/*/*.js
