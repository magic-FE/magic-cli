var exists = require('fs').existsSync
var path = require('path')
var userSourcePath = path.join(require('os').homedir(), '.magicrc')

if (!exists(userSourcePath)) {
	
}
