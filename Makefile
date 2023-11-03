publish:
	npm publish --access public

# ===== client =====
build_client:
	NODE_ENV=prod npx webpack -c wp.config.js
	rm -rf client/test;
	rm -rf client/example;

ts_check_client:
	npx tsc -p tsconfig.json --noEmit

watch:
	npx webpack -c wp.config.js

# ===== end =====

# ===== commands =====

build_cmd:
	npx tsc -p tsconfig_cmd.json

ts_check_cmd:
	npx tsc -p tsconfig_cmd.json --noEmit

# ===== end =====


watch_example:
	npx webpack -c wp.example.js

# ===== test =====

test_watch:
	npx jest --coverage -c core/jest.config.js ./core/test/ --watchAll

test:
	npx jest --coverage -c core/jest.config.js ./core/test/

make_badge: test
	npx coverage-badges;

# ===== end =====


.PHONY: test