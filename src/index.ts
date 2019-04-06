/**
 * @file index
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

import { Player } from './core/yuefu';

// tslint:disable-next-line:prefer-type-cast
(window as any).Yuefu = Player;
export {
    Player as Yuefu
};
