
build:
	npx ncc build ./client/ignis.ts  -o ./client/dist/;
	mv ./client/dist/index.js ./client/dist/ignis.js;

watch:
	# npx ncc build ./client/ignis.ts -w -o  ./client/dist/;
	npx webpack -c wp.config.js

watch_example:
	npx webpack -c wp.example.js
