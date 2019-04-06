/**
 * @file list module
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

// import smoothscroll from 'smoothscroll';
import * as emitter from '../emitter';
import * as module from '../module';
import { IAudioObject, Player } from '../yuefu';
// import utils from '../utils';

interface IListModuleOptions extends module.IModuleOptions {
  [key: string]: any;
}
class ListModule extends module.BaseModule {
  public audios: IAudioObject[];
  public playingAudio: IAudioObject | null;
  public listNode: HTMLDListElement;
  public options: IListModuleOptions;
  public index: number;
  constructor(player: Player, options: IListModuleOptions) {
    super(player, options);
    this.options = options;

    // 列表中歌曲信息
    this.audios = [];
    this.playingAudio = null;
    this.index = 0
    this.listNode = document.createElement('ol');
    this.listNode.classList.add('yuefu-list');

    this.init();
    console.log('[ListModule]', ListModule.name, 'init');
  }
  public static get Name(): string {
    return 'list';
  }

  public init(): void {
    this.player.container.appendChild(this.listNode);

    // 初始列表
    this.audios = this.options.audios || [];
    this.bindEvent();
    this.updateDom();
  }

  /**
   * 绑定list各项的点击事件用于切换播放
   *
   * @memberof ListModule
   */
  public bindEvent() {
    this.listNode.addEventListener('click', (e: MouseEvent) => {
      let target: Element;
      if ((e.target as Element).tagName.toUpperCase() === 'LI') {
        target = e.target as Element;
      } else {
        target = (e.target as Element).parentElement as Element;
      }
      const audioIndex = parseInt(target.querySelector('.yuefu-list-index')!.innerHTML) - 1;
      if (audioIndex !== this.index) {
        this.switch(audioIndex);
        this.player.play();
      } else {
        this.player.toggle();
      }
    });
  }

  public switch (index: number) {
    this.player.emitter.emit(
      emitter.EPlayerEvents.AUDIO_SWITCH,
      index,
      this.audios[index]
    );
    if (index === undefined || !this.audios[index]) {
      throw new Error('index undefined');
    }

    this.index = index;

    const audio = this.audios[this.index];

    const light = this.player.container.querySelector('.yuefu-list-light');
    if (light) {
      light.classList.remove('yuefu-list-light');
    }

    this.player.container.querySelectorAll('.yuefu-list li')[this.index].classList.add('yuefu-list-light');

    // smoothScroll(this.index * 33, 500, null, this.listNode);

    this.player.setAudio(audio);

  }

  public add(audio: IAudioObject): void {
    this.audios.push(audio);
    this.updateDom();
  }
  public delete(index: number): void {
    this.audios.splice(index, 1);
    this.updateDom();
  }
  public updateDom(): void {
    this.listNode.innerHTML = '';
    this.audios.forEach((audio: IAudioObject, index: number) => {
      const itemNode = document.createElement('li');
      itemNode.classList.add('yuefu-list-item');
      itemNode.innerHTML = `
        <span class="yuefu-list-cur" style="background-color: #444444;"></span>
        <span class="yuefu-list-index">${index + 1}</span>
        <span class="yuefu-list-title">${audio.name || '无名'}</span>
        <span class="yuefu-list-author">${audio.artist || '未知'}</span>
      `;

      this.listNode.appendChild(itemNode);
    });
  }

}

export default ListModule;
