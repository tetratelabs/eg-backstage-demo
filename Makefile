# Include versions of tools we build or fetch on-demand.
include Tools.mk

# Root dir returns absolute path of current directory. It has a trailing "/".
root_dir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

DIST ?= $(root_dir)dist

CONFIG ?= $(DIST)/app-config.yaml

# Local cache directory.
CACHE_DIR ?= $(root_dir).cache

prepackaged_tools_dir := $(CACHE_DIR)/tools/prepackaged

export PATH := $(prepackaged_tools_dir)/bin:$(PATH)

# Skip installing cypress binary.
export CYPRESS_INSTALL_BINARY ?= 0

# Prepackaged tools targets.
node := $(prepackaged_tools_dir)/bin/node
yarn := $(prepackaged_tools_dir)/bin/yarn

build: dist-types ## Build the app
	@rm -fr $(DIST)
	@$(yarn) build
	$(call extract-to-dist,skeleton)
	$(call extract-to-dist,bundle)
	@cp app-config*.yaml $(DIST)
	@$(yarn) --cwd $(DIST) --production

dev: $(yarn) ## Start dev server
	@$(yarn) install --frozen-lockfile
	@$(yarn) dev

run: $(node) ## Run the app
	@cd $(DIST)/packages && $(node) backend --config $(CONFIG)

dist-types: $(yarn)
	@$(yarn) install --frozen-lockfile
	@$(yarn) tsc

define extract-to-dist
	@mkdir -p $(DIST) && tar xzf $(root_dir)packages/backend/dist/$1.tar.gz -C $(DIST)
endef

# Install yarn from https://github.com/yarnpkg/yarn. $(yarn) depends on $(node).
yarn-version              = $(subst github.com/yarnpkg/yarn@v,-,$($(notdir $1)@v))
yarn-download-archive-url = https://$(subst @,/releases/download/,$($(notdir $1)@v))/yarn$(call yarn-version,$1).js
$(yarn): $(node)
	@mkdir -p $(dir $@)
	@curl -sSL $(call yarn-download-archive-url,$@) -o $(yarn)
	@chmod +x $(yarn)

os := $(shell uname | tr A-Z a-z)
# Install node from https://nodejs.org/dist. We don't support win32 yet as this script will fail.
node-version = $(subst nodejs.org/node@v,,$($(notdir $1)@v))
# Always use x64 for now, since one of the modules only works for x64.
node-download-archive-url = https://$(subst node@,dist/,$($(notdir $1)@v))/node-v$(call node-version,$1)-$(os)-x64.tar.gz
$(node):
	@mkdir -p $(dir $@)
	@curl -sSL $(call node-download-archive-url,$@) | tar xzf - -C $(prepackaged_tools_dir) --strip-components 1
