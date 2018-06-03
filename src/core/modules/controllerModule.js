import Module from '../module'
class ControllerModule extends Module {
  constructor(player, options) {
    super(player, options)
    this.controllers = []
    this.options = options

    this.init()
    console.log(`[module] ${ControllerModule.name} inited`)
  }
  static get name() {
    return 'controller'
  }

  register(controller) {
    // TODO: 验证controller
    this.controllers.push(controller)

    // 刷新dom？
  }
  init() {
    // TODO: register的意义？也许后面可以动态添加controller？
    for(const controller of this.options.controllers) {
      this.register(controller)
    }
    for(const index in this.controllers) {
      this.controllers[index] = new Controller(this.player, this.controllers[index])
    }
  }

}


class Controller {
  constructor(player, controllerOptions) {
    player.container.append()
  }
}

export default ControllerModule
