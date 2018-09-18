/**
 * @file module base class
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

type IModuleOptions = {

};

type YuefuPlayer = {

};

class Module {
  public player: YuefuPlayer;
  public options: IModuleOptions;
  constructor(player: YuefuPlayer, options: IModuleOptions) {
    this.player = player;
    this.options = options;
  }
  static get name() {
    return 'undefinedModule';
  }
}
Module.DEFAULTS = {};
// Module.name = 'undefinedModule'

export default Module;
