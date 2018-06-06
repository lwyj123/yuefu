import Emitter from "./emitter";
import logger from "./logger";
import utils from "./utils";
import handleOption from "./handlerOption";
// import Controller from "./controller";
import ControllerModule from './modules/ControllerModule'
// import List from "./list";
import Storage from "./storage";
import ProgressModule from "./modules/ProgressModule";
import ListModule from "./modules/ListModule";
import LrcModule from "./modules/LrcModule";

// 多实例管理
const instances = [];

class Player {
  static debug(limit) {
    if (limit === true) {
      limit = "log";
    }
    logger.level(limit);
  }
  constructor(options) {
    // merge设置
    this.options = handleOption(options);
    this.container = this.options.container;
    this.paused = true;
    this.mode = "normal"; // 展示层的应该直接抽离出来
    this.modules = {};
    this.audio = null; // 当前播放的audio对象
    this.audioDOM = null; // audio dom对象

    this.randomOrder = utils.randomOrder(this.options.audio.length);

    this.container.classList.add("yuefu");
    if (this.options.lrcType) {
      this.container.classList.add("yuefu-withlrc");
    }
    if (this.options.audio.length > 1) {
      this.container.classList.add("yuefu-withlist");
    }
    if (utils.isMobile) {
      this.container.classList.add("yuefu-mobile");
    }
    this.arrow = this.container.offsetWidth <= 300;
    if (this.arrow) {
      this.container.classList.add("yuefu-arrow");
    }

    this.container = this.options.container;

    const bodyNode = document.createElement('div')
    bodyNode.classList.add('yuefu-body')
    this.container.appendChild(bodyNode)

    this.emitter = new Emitter();
    this.storage = new Storage(this);
    // this.controller = new Controller(this);
    // this.list = new List(this);

    this.initAudio();
    this.bindEvents();

    instances.push(this);
  }


  /**
   * 用于暴露基础内容给外界，比如各种Module
   *
   * @memberof Player
   */
  static import(name) {
    return Player.imports[name]
  }

  initAudio() {
    this.audioDOM = document.createElement("audio");
    this.audioDOM.preload = this.options.preload;

    for(const eventSymbol in Emitter.audioEvents) {
      this.audioDOM.addEventListener(Emitter.audioEvents[eventSymbol], e => {
        console.log(Emitter.audioEvents[eventSymbol])
        this.emitter.emit(Emitter.audioEvents[eventSymbol], e);
      });
    }
  }

  /**
   * TODO: 大量的视图层的内容，需要抽离
   *
   * @memberof Player
   */
  bindEvents() {
    this.on(Emitter.audioEvents.PLAY, () => {
      if (this.paused) {
        this.setUIPlaying();
      }
    });

    this.on(Emitter.audioEvents.PAUSE, () => {
      if (!this.paused) {
        this.setUIPaused();
      }
    });

    // audio download error: an error occurs
    let skipTime;
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
    this.emitter.on(Emitter.playerEvents.AUDIO_SWITCH, () => {
      skipTime && clearTimeout(skipTime);
    });

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
  setAudio (audio) {
    this.audio = audio;
    let type = audio.type;
    if (this.options.customAudioType && this.options.customAudioType[type]) {
      if (Object.prototype.toString.call(this.options.customAudioType[type]) === "[object Function]") {
        this.options.customAudioType[type](this.audioDOM, audio, this);
      }
      else {
        logger.error(`Illegal customType: ${type}`);
      }
    }
    else {
      if (!type || type === "auto") {
        type = "normal";
      }
      else if (type === "normal") {
        this.audioDOM.src = audio.url;
      }
    }
    this.seek(0);

    if (!this.paused) {
      this.audioDOM.play();
    }
  }

  seek (time) {
    time = Math.max(time, 0);
    time = Math.min(time, this.duration);

    this.audioDOM.currentTime = time;
  }

  get currentAudio () {
    return this.audio
  }

  get duration () {
    return isNaN(this.audioDOM.duration) ? 0 : this.audioDOM.duration;
  }

  setUIPlaying () {
    if (this.paused) {
      this.paused = false;
    }

    if (this.options.mutex) {
      for (let i = 0; i < instances.length; i++) {
        if (this !== instances[i]) {
          instances[i].pause();
        }
      }
    }
  }

  play () {
    this.setUIPlaying();

    const playPromise = this.audioDOM.play();
    if (playPromise) {
      playPromise.catch((e) => {
        logger.warn(e);
        if (e.name === "NotAllowedError") {
          this.setUIPaused();
        }
      });
    }
  }

  setUIPaused () {
    if (!this.paused) {
      this.paused = true;

    }

    this.container.classList.remove("yuefu-loading");
  }

  pause () {

    this.setUIPaused();
    this.audioDOM.pause();
  }

  /**
 * Set volume
 */
  volume (percentage, nostorage) {
    percentage = parseFloat(percentage);
    if (!isNaN(percentage)) {
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      // this.bar.set("volume", percentage, "height");
      if (!nostorage) {
        this.storage.set("volume", percentage);
      }

      this.audioDOM.volume = percentage;
      if (this.audioDOM.muted) {
        this.audioDOM.muted = false;
      }

      this.switchVolumeIcon();
    }

    return this.audioDOM.muted ? 0 : this.audioDOM.volume;
  }

  /**
 * bind events
 */
  on () {
    return this.emitter.on.apply(this.emitter, arguments);
  }

  once() {
    return this.emitter.once.apply(this.emitter, arguments);
  }

  off() {
    return this.emitter.off.apply(this.emitter, arguments);
  }

  /**
 * toggle between play and pause
 */
  toggle () {
    if (this.paused) {
      this.play();
    }
    else {
      this.pause();
    }
  }

  // abandoned
  switchAudio (index) {
    this.list.switch(index);
  }

  // abandoned
  addAudio (audios) {
    this.list.add(audios);
  }

  // abandoned
  removeAudio (index) {
    this.list.remove(index);
  }

  /**
 * destroy this player
 */
  destroy () {
    instances.splice(instances.indexOf(this), 1);
    this.pause();
    this.container.innerHTML = "";
    this.audioDOM.src = "";
    this.emitter.emit(Emitter.playerEvents.DESTORY);
  }

  setMode (mode = "normal") {
    this.mode = mode;
    if (mode === "mini") {
      this.container.classList.add("yuefu-narrow");
    }
    else if (mode === "normal") {
      this.container.classList.remove("yuefu-narrow");
    }
  }

  // TODO: 拆到
  prevIndex () {
    if (this.list.audios.length > 1) {
      if (this.options.order === "list") {
        return this.list.index - 1 < 0 ? this.list.audios.length - 1 : this.list.index - 1;
      }
      else if (this.options.order === "random") {
        const index = this.randomOrder.indexOf(this.list.index);
        if (index === 0) {
          return this.randomOrder[this.randomOrder.length - 1];
        }
        else {
          return this.randomOrder[index - 1];
        }
      }
    }
    else {
      return 0;
    }
  }

  nextIndex () {
    if (this.list.audios.length > 1) {
      if (this.options.order === "list") {
        return (this.list.index + 1) % this.list.audios.length;
      }
      else if (this.options.order === "random") {
        const index = this.randomOrder.indexOf(this.list.index);
        if (index === this.randomOrder.length - 1) {
          return this.randomOrder[0];
        }
        else {
          return this.randomOrder[index + 1];
        }
      }
    }
    else {
      return 0;
    }
  }

  skipBack () {
    this.list.switch(this.prevIndex());
  }

  skipForward () {
    this.list.switch(this.nextIndex());
  }
  addModule (moduleClass, options = {}) {
    this.modules[moduleClass.name] = new moduleClass(this, options)
    return this.modules[moduleClass.name]
  }

  static get version () {
    /* global APLAYER_VERSION */
    return YUEFU_VERSION;
  }
}

Player.imports = {
  'emitter': Emitter,
  'controller': ControllerModule,
  'progress': ProgressModule,
  'list': ListModule,
  'lrc': LrcModule,
}

export default Player;
