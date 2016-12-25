var match = require('minimatch')

function filter(files, filters, data, done) {
    if (!filters) {
        return done()
    }
    var fileNames = Object.keys(files)
    Object.keys(filters).forEach(function(glob) {
        fileNames.forEach(function(file) {
            if (match(file, glob, { dot: true })) {
                var condition = filters[glob]
                if (!data[condition]) {
                    delete files[file]
                }
            }
        })
    })
    done()
}

module.exports = function(filters) {
    return function(files, metalsmith, done) {
        filter(files, filters, metalsmith.metadata(), done)
    }
}
