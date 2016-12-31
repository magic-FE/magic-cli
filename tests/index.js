var gitClone = require('../utils/git-clone')

gitClone('likun7981/test-git', './test-git', function(err) {
  if (err) console.log(err)
	console.log('success!')
})

