import Module from '../module'
class ControllerModule extends Module {
  constructor(player, options) {
    super(player, options)
    this.controllers = []
    this.options = options

    this.init()
    console.log(`[module] ${ControllerModule.name} init`)
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
    this.controllerBoard = new ControllerBoard(this.player, {})

    // TODO: register的意义？也许后面可以动态添加controller？
    for(const controller of this.options.controllers) {
      this.register(controller)
    }
    for(const index in this.controllers) {
      this.controllers[index] = new Controller(this.controllerBoard, this.controllers[index])
    }
  }
}

class ControllerBoard {
  constructor(player, options) {
    const controllerBoard = document.createElement('div');
    controllerBoard.classList.add('yuefu-controller')
    player.container.appendChild(controllerBoard);
    this.container = controllerBoard;
    this.player = player
  }
}

class Controller {
  constructor(board, options) {
    const controllerNode = document.createElement(options.tag || 'span')
    // 渲染控制器内容
    controllerNode.innerHTML = options.innerHTML || '';
    controllerNode.addEventListener('click', () => {
      options.handler.call(null, board.player)
    })
    board.container.appendChild(controllerNode)
  }
}

export default ControllerModule
