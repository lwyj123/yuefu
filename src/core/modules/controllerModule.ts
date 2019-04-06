import * as module from "../module";
import { Player } from '../yuefu';

interface IControllerModuleOptions extends module.IModuleOptions {
  controllers: any
}

class ControllerModule extends module.BaseModule {
  public controllers: Controller[]
  public controllerBoard: ControllerBoard;
  public options: IControllerModuleOptions;

  constructor(player: Player, options: IControllerModuleOptions) {
    super(player, options);
    this.controllers = [];
    this.options = options;

    this.controllerBoard = new ControllerBoard(this.player, {});
    this.init();
    console.log("[ControllerModule]", ControllerModule.name, "init");

  }
  public static get Name(): string {
    return 'controller';
  }

  register(controller: Controller) {
    // TODO: 验证controller
    this.controllers.push(controller);

    // 刷新dom？
  }
  init() {
    // TODO: register的意义？也许后面可以动态添加controller？
    for(const controller of this.options.controllers) {
      this.register(controller);
    }
    for(const index in this.controllers) {
      this.controllers[index] = new Controller(this.controllerBoard, this.controllers[index]);
    }
  }
}

class ControllerBoard {
  container: HTMLDivElement;
  player: Player
  constructor(player: Player, options: any) {
    const controllerBoard = document.createElement("div");
    controllerBoard.classList.add("yuefu-controller");
    player.container.appendChild(controllerBoard);
    this.container = controllerBoard;
    this.player = player;
  }
}

interface IControllerOptions {
  tag?: string;
  handler?: (player: Player) => void;
  innerHTML?: string;
}
class Controller {
  constructor(board: ControllerBoard, options: IControllerOptions) {
    const controllerNode = document.createElement(options.tag || "span");
    // 渲染控制器内容
    controllerNode.innerHTML = options.innerHTML || "";
    controllerNode.addEventListener("click", () => {
      options.handler && options.handler(board.player);
    });
    if(options.tag === "button") {
      controllerNode.classList.add("btn");
      controllerNode.classList.add("blue");
    }
    board.container.appendChild(controllerNode);
  }
}

export default ControllerModule;
