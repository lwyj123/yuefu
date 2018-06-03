class Module {
  constructor(player, options) {
    this.player = player
    this.options = options
  }
  static get name() {
    return 'undefinedModule'
  }
}
Module.DEFAULTS = {}
// Module.name = 'undefinedModule'

export default Module
