/**
 * @file index
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

import { Player, IAudioObject } from './core/yuefu';

export * from './core/module';
export * from './core/emitter';
// tslint:disable-next-line:prefer-type-cast
export {
    Player,
    IAudioObject,
};

export default Player
