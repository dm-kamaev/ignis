
build:
	npx ncc build ./client/ignis.ts  -o ./client/dist/;
	mv ./client/dist/index.js ./client/dist/ignis.js;

watch:
	npx ncc build ./client/ignis.ts -w -o  ./client/dist/;
