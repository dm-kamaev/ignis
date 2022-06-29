
# ===== client =====
build:
	NODE_ENV=prod npx webpack -c wp.config.js

watch:
	npx webpack -c wp.config.js

# ===== end =====

# ===== commands =====

build_cmd:
	npx tsc -p tsconfig_cmd.json

# ===== end =====


watch_example:
	npx webpack -c wp.example.js

# ===== test =====

test_client_watch:
	npx jest -c turbo-html/jest.config.js  --watchAll

# ===== end =====


