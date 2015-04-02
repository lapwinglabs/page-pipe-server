development:
	@./node_modules/.bin/node-dev --harmony index.js

production:
	@NODE_ENV=production node --harmony index.js
