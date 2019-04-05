/**
 * @file storage for cache or storage something like volume
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

import * as player from './yuefu';
// import * as utils from './utils';

class Storage {
  public storageName: string;
  public data: any;
  constructor (core: player.Player) {
    this.storageName = core.options.storageName;

    this.data = JSON.parse(localStorage.getItem(this.storageName) || "{}");
    if (!this.data) {
      this.data = {};
    }
    this.data.volume = this.data.volume || core.options.volume;
  }

  public getItem (key: string): any {
    return this.data[key];
  }

  public setItem (key: string, value: any): void {
    this.data[key] = value;
    localStorage.setItem(this.storageName, JSON.stringify(this.data));
  }
}

export {
  Storage
};
