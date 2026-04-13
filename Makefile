.PHONY: js start_http serve help zip dprs.zip transfer

help:
	@echo "To compile the typescript to the 'js' directory (where it is checked into git):"
	@echo "    make js"
	@echo
	@echo "To install 'tsc' first install node (sad face): node-v24.14.1.pkg"
	@echo "Then"
	@echo "    npm install typescript"
	@echo ""
	@echo "To use the compiler (tsc) use : npx tsc"

js:
	npx tsc -b
