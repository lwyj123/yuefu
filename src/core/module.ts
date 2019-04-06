import { Player } from './yuefu';

/**
 * @file module base class
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

interface IModuleOptions {

};

class BaseModule {
  public player: Player;
  public options: IModuleOptions;
  constructor(player: Player, options: IModuleOptions) {
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
