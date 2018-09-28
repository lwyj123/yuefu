/**
 * @file core player
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

import * as emitter from './emitter';
import { handleOption, IYuefuOptions } from './handleOption';
import { ConsoleLogger, Logger } from './logger';
// import Controller from "./controller";
// import ControllerModule from './modules/ControllerModule';
// import ListModule from './modules/ListModule';
// import LrcModule from './modules/LrcModule';
// import ProgressModule from './modules/ProgressModule';
// import List from "./list";
import * as storage from './storage';
import template from './template';
import * as utils from './utils';

import learning from '../templates/learning';
import * as module from './module';

// 多实例管理
const instances: Player[] = [];

interface IAudioObject {
  url: string;
  type?: string;
}

class Player {

  get currentAudio (): IAudioObject {
    return this.audio;
  }

  get duration (): number {
    return isNaN(this.audioDOM.duration) ? 0 : this.audioDOM.duration;
  }

  static get version (): string {
    return YUEFU_VERSION;
  }

  public static imports: {[key: string]: any} = {
    emitter: emitter.Emitter,
    // controller: ControllerModule,
    // progress: ProgressModule,
    // list: ListModule,
    // lrc: LrcModule,
  };
  public options: IYuefuOptions;
  public container: Element;
  public paused: boolean;
  public modules: {
    [key: string]: module.BaseModule;
  };
  public audio: IAudioObject;
  public audioDOM: HTMLAudioElement;
  public logger: Logger;
  public emitter: emitter.Emitter;
  public storage: storage.Storage;

  constructor(options: IYuefuOptions) {
    // merge设置
    this.options = handleOption(options);
    this.container = this.options.container;
    this.paused = true;
    this.modules = {};
    this.audio = null; // 当前播放的audio对象
    this.audioDOM = null; // audio dom对象

    this.logger = new ConsoleLogger({
      error: true,
      warn: true,
      log: true,
      info: true,
      ns: 'core',
    });

    if (this.options.debug) {
      (<any>window).yuefu = this;
    }

    this.container.classList.add('yuefu');

    const bodyNode: HTMLElement = document.createElement('div');
    bodyNode.classList.add('yuefu-body');
    this.container.appendChild(bodyNode);

    this.emitter = new emitter.Emitter();
    this.storage = new storage.Storage(this);

    // 插入wrapper
    const wrapper: HTMLDivElement = document.createElement('div');
    wrapper.classList.add('wrapper');
    document.body.appendChild(wrapper);

    // const self = this;
    // this.template = new Template('div.wrapper', learningTemplate, this, {
    //   data: {
    //     title: '如何练就逻辑清晰的好口才',
    //     duration: '02:00',
    //     playState: 'paused',
    //     playingClass: 'pause',
    //   },
    //   mounted() {
    //     this.$player = self;
    //     this.$player.on('progress', () => {
    //       console.log('player progress');
    //     });
    //   },
    //   methods: {
    //     togglePlayState: function() {
    //       console.log('click toggle');
    //       if (this.playState === 'playing') {
    //         this.$player.pause();
    //       } else {
    //         this.$player.play();
    //       }
    //       this.playState = this.playState === 'playing' ? 'paused' : 'playing';
    //       this.playingClass = this.playingClass === 'play' ? 'pause' : 'play';
    //     },
    //   },
    // },                           {
    //   test (node, directiveMeta) {

    //   },
    // });
    // this.template.render();

    this.initAudio();
    this.bindEvents();

    instances.push(this);
  }

  /**
   * 用于暴露基础内容给外界，比如各种Module
   */
  public static IMPORT(name: string): module.BaseModule {
    return Player.imports[name];
  }

  public initAudio(): void {
    this.audioDOM = document.createElement('audio');
    // this.audioDOM.preload = this.options.preload;

    Object.keys(emitter.EAudioEvents).forEach((eventSymbol: string | symbol) => {
      this.audioDOM.addEventListener(emitter.EAudioEvents[eventSymbol], (e: Event) => {
        if (this.options.debug) {
          console.log('[core]', 'event:', emitter.EAudioEvents[eventSymbol], e);
        }
        this.emitter.emit(emitter.EAudioEvents[eventSymbol], e);
      });
    });
  }

  /**
   * TODO: 大量的视图层的内容，需要抽离
   *
   */
  public bindEvents(): void {

    // audio download error: an error occurs
    // let skipTime;
    // this.on(Emitter.audioEvents.ERROR, () => {
    //   if (this.list.audios.length > 1) {
    //     this.notice(
    //       "An audio error has occurred, player will skip forward in 2 seconds."
    //     );
    //     skipTime = setTimeout(() => {
    //       this.skipForward();
    //       if (!this.paused) {
    //         this.play();
    //       }
    //     }, 2000);
    //   } else if (this.list.audios.length === 1) {
    //     this.notice("An audio error has occurred.");
    //   }
    // });
    // this.emitter.on(emitter.EPlayerEvents.AUDIO_SWITCH, () => {
    //   skipTime && clearTimeout(skipTime);
    // });

    // multiple audio play
    // this.on(Emitter.audioEvents.ENDED, () => {
    //   if (this.options.loop === "none") {
    //     if (this.options.order === "list") {
    //       if (this.list.index < this.list.audios.length - 1) {
    //         this.list.switch((this.list.index + 1) % this.list.audios.length);
    //         this.play();
    //       } else {
    //         this.list.switch((this.list.index + 1) % this.list.audios.length);
    //         this.pause();
    //       }
    //     } else if (this.options.order === "random") {
    //       if (
    //         this.randomOrder.indexOf(this.list.index) <
    //         this.randomOrder.length - 1
    //       ) {
    //         this.list.switch(this.nextIndex());
    //         this.play();
    //       } else {
    //         this.list.switch(this.nextIndex());
    //         this.pause();
    //       }
    //     }
    //   } else if (this.options.loop === "one") {
    //     this.list.switch(this.list.index);
    //     this.play();
    //   } else if (this.options.loop === "all") {
    //     this.skipForward();
    //     this.play();
    //   }
    // });
  }
  public setAudio (audio: IAudioObject): void {
    this.audio = audio;
    let type: string = audio.type;
    if (!type || type === 'auto') {
        type = 'normal';
    } else if (type === 'normal') {
      this.audioDOM.src = audio.url;
    }

    this.seek(0);

    if (!this.paused) {
      this.audioDOM.play();
    }
  }

  public seek (time: number): void {
    let targetTime: number = time;
    targetTime = Math.max(time, 0);
    targetTime = Math.min(time, this.duration);

    this.audioDOM.currentTime = targetTime;
  }
  public seekNextSecond(second: number): void {
    const currentTime: number = this.audioDOM.currentTime;
    const targetTime: number = currentTime + second;
    this.seek(targetTime);
  }
  public seekPrevSecond(second: number): void {
    const currentTime: number = this.audioDOM.currentTime;
    const targetTime: number = currentTime - second;
    this.seek(targetTime);
  }

  public play (): void {

    const playPromise: Promise<any> = this.audioDOM.play();
    if (playPromise) {
      playPromise.catch((e: Error) => {
        this.logger.warn(e);
      });
    }
  }

  public pause (): void {
    this.audioDOM.pause();
  }

  /**
   * Set volume
   */
  public volume (percentage: number | string, nostorage: boolean): number {
    let percentageFormated: number = parseFloat(percentage.toString());
    if (!isNaN(percentageFormated)) {
      percentageFormated = Math.max(percentageFormated, 0);
      percentageFormated = Math.min(percentageFormated, 1);
      // this.bar.set("volume", percentage, "height");
      if (!nostorage) {
        this.storage.setItem('volume', percentage);
      }

      this.audioDOM.volume = percentageFormated;
      if (this.audioDOM.muted) {
        this.audioDOM.muted = false;
      }
    }

    return this.audioDOM.muted ? 0 : this.audioDOM.volume;
  }

  /**
   * bind events
   */
  public on (event: string | symbol, fn: (...args: any[]) => void, context?: any): void {
    return this.emitter.on.apply(this.emitter, arguments);
  }

  public once(event: string | symbol, fn: (...args: any[]) => void, context?: any): void {
    return this.emitter.once.apply(this.emitter, arguments);
  }

  public off(event: string | symbol, fn: (...args: any[]) => void, context?: any): void {
    return this.emitter.off.apply(this.emitter, arguments);
  }

  /**
   * toggle between play and pause
   */
  public toggle (): void {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  /**
   * destroy this player
   */
  public destroy (): void {
    instances.splice(instances.indexOf(this), 1);
    this.pause();
    this.container.innerHTML = '';
    this.audioDOM.src = '';
    this.emitter.emit(emitter.EPlayerEvents.DESTORY);
  }

  public install (
    moduleClass: { Name: string; new(player: Player, options: module.IModuleOptions): module.BaseModule },
    options: module.IModuleOptions
  ): module.BaseModule {
    this.modules[moduleClass.Name] = new moduleClass(this, options);

    return this.modules[moduleClass.name];
  }
}

export {
  Player,
  IAudioObject
};
