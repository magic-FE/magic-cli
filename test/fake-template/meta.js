module.exports = {
  prompts: {
    description: {
      type: 'string',
      required: true,
      message: 'Project description'
    },
    name: {
      type: 'string',
      required: true,
      label: 'Project name',
      validate: function (input) {
        return input === 'custom' ? 'can not input `custom`' : true
      }
    },
    attr1: {
      type: 'list',
      required: true,
      label: 'Which choice?',
      choices: ['a', 'b']
    }
  },
  helpers: {
    lowerCase: function (str) {
      return str.toLowerCase()
    }
  }
}
