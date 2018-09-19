/**
 * @file module base class
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

type IModuleOptions = {

};

type YuefuPlayer = {

};

class BaseModule {
  public player: YuefuPlayer;
  public options: IModuleOptions;
  constructor(player: YuefuPlayer, options: IModuleOptions) {
    this.player = player;
    this.options = options;
  }
  public static get Name(): string {
    return 'undefinedModule';
  }
}

export {
  BaseModule,
  IModuleOptions,
};
