module.exports = {
  prompts: {
    description: {
      type: 'string',
      required: true,
      message: 'Project description',
      validate: function(input) {
        if (input === '123') {
          return 'can not input 123'
        }
        return true
      }
    }
  },
  helpers: {
    uppercase: function(str) {
      return str.toUpperCase()
    }
  }
}
