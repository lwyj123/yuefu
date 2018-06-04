import Emitter from "./emitter";
import logger from "./logger";
import utils from "./utils";
import handleOption from "./handlerOption";
import Lrc from "./lrc";
import Icons from "./icons";
// import Controller from "./controller";
import ControllerModule from './modules/ControllerModule'
import Timer from "./timer";
// import List from "./list";
import Template from "./template"; // 全部删除
import Storage from "./storage";
import ProgressModule from "./modules/ProgressModule";
import ListModule from "./modules/ListModule";

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

    this.randomOrder = utils.randomOrder(this.options.audio.length);

    this.container.classList.add("aplayer");
    if (this.options.lrcType) {
      this.container.classList.add("aplayer-withlrc");
    }
    if (this.options.audio.length > 1) {
      this.container.classList.add("aplayer-withlist");
    }
    if (utils.isMobile) {
      this.container.classList.add("aplayer-mobile");
    }
    this.arrow = this.container.offsetWidth <= 300;
    if (this.arrow) {
      this.container.classList.add("aplayer-arrow");
    }

    // save lrc
    this.container = this.options.container;
    if (this.options.lrcType === 2 || this.options.lrcType === true) {
      const lrcEle = this.container.getElementsByClassName(
        "aplayer-lrc-content"
      );
      for (let i = 0; i < lrcEle.length; i++) {
        if (this.options.audio[i]) {
          this.options.audio[i].lrc = lrcEle[i].innerHTML;
        }
      }
    }

    this.template = new Template({
      container: this.container,
      options: this.options,
      randomOrder: this.randomOrder
    });

    if (this.options.mini) {
      this.setMode("mini");
      this.template.info.style.display = "block";
    }
    if (this.template.info.offsetWidth < 200) {
      this.template.time.classList.add("aplayer-time-narrow");
    }

    if (this.options.lrcType) {
      this.lrc = new Lrc({
        container: this.template.lrc,
        async: this.options.lrcType === 3,
        player: this
      });
    }
    this.emitter = new Emitter();
    this.storage = new Storage(this);
    // this.controller = new Controller(this);
    this.timer = new Timer(this);
    // this.list = new List(this);

    this.initAudio();
    this.bindEvents();
    // if (this.options.order === "random") {
    //   this.list.switch(this.randomOrder[0]);
    // } else {
    //   this.list.switch(0);
    // }

    // autoplay
    if (this.options.autoplay) {
      this.play();
    }

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
    this.audio = document.createElement("audio");
    this.audio.preload = this.options.preload;

    for(const eventSymbol in Emitter.audioEvents) {
      this.audio.addEventListener(Emitter.audioEvents[eventSymbol], e => {
        console.log(Emitter.audioEvents[eventSymbol])
        this.emitter.emit(Emitter.audioEvents[eventSymbol], e);
      });
    }

    // this.volume(this.storage.get("volume"), true);
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
    this.emitter.on(Emitter.playerEvents.LIST_SWITCH, () => {
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
    let type = audio.type;
    if (this.options.customAudioType && this.options.customAudioType[type]) {
      if (Object.prototype.toString.call(this.options.customAudioType[type]) === "[object Function]") {
        this.options.customAudioType[type](this.audio, audio, this);
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
        this.audio.src = audio.url;
      }
    }
    this.seek(0);

    if (!this.paused) {
      this.audio.play();
    }
  }

  theme (color = this.list.audios[this.list.index].theme || this.options.theme, index = this.list.index, isReset = true) {
    if (isReset) {
      this.list.audios[index] && (this.list.audios[index].theme = color);
    }
    this.template.listCurs[index] && (this.template.listCurs[index].style.backgroundColor = color);
    if (index === this.list.index) {
      this.template.pic.style.backgroundColor = color;
      // this.template.played.style.background = color;
      // this.template.thumb.style.background = color;
      // this.template.volume.style.background = color;
    }
  }

  seek (time) {
    time = Math.max(time, 0);
    time = Math.min(time, this.duration);

    this.audio.currentTime = time;
    // this.bar.set("played", time / this.duration, "width");
    // this.template.ptime.innerHTML = utils.secondToTime(time);
  }

  get duration () {
    return isNaN(this.audio.duration) ? 0 : this.audio.duration;
  }

  setUIPlaying () {
    if (this.paused) {
      this.paused = false;
      // this.template.button.classList.remove("aplayer-play");
      // this.template.button.classList.add("aplayer-pause");
      // this.template.button.innerHTML = "";
      setTimeout(() => {
        // this.template.button.innerHTML = Icons.pause;
      }, 100);
      // this.template.skipPlayButton.innerHTML = Icons.pause;
    }

    this.timer.enable("loading");

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

    const playPromise = this.audio.play();
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

      this.template.button.classList.remove("aplayer-pause");
      this.template.button.classList.add("aplayer-play");
      this.template.button.innerHTML = "";
      setTimeout(() => {
        this.template.button.innerHTML = Icons.play;
      }, 100);
      // this.template.skipPlayButton.innerHTML = Icons.play;
    }

    this.container.classList.remove("aplayer-loading");
    this.timer.disable("loading");
  }

  pause () {
    this.setUIPaused();
    this.audio.pause();
  }

  switchVolumeIcon () {
    if (this.volume() >= 0.95) {
      this.template.volumeButton.innerHTML = Icons.volumeUp;
    }
    else if (this.volume() > 0) {
      this.template.volumeButton.innerHTML = Icons.volumeDown;
    }
    else {
      this.template.volumeButton.innerHTML = Icons.volumeOff;
    }
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

      this.audio.volume = percentage;
      if (this.audio.muted) {
        this.audio.muted = false;
      }

      this.switchVolumeIcon();
    }

    return this.audio.muted ? 0 : this.audio.volume;
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
    if (this.template.button.classList.contains("aplayer-play")) {
      this.play();
    }
    else if (this.template.button.classList.contains("aplayer-pause")) {
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
    this.audio.src = "";
    this.timer.destroy();
    this.emitter.emit(Emitter.playerEvents.DESTORY);
  }

  setMode (mode = "normal") {
    this.mode = mode;
    if (mode === "mini") {
      this.container.classList.add("aplayer-narrow");
    }
    else if (mode === "normal") {
      this.container.classList.remove("aplayer-narrow");
    }
  }

  /**
   * TODO: 使用Module的方式实现，重构planning
   *
   * @param {any} text
   * @param {number} [time=2000]
   * @param {number} [opacity=0.8]
   * @memberof Player
   */
  notice (text, time = 2000, opacity = 0.8) {
    this.template.notice.innerHTML = text;
    this.template.notice.style.opacity = opacity;
    if (this.noticeTime) {
      clearTimeout(this.noticeTime);
    }
    this.emitter.emit(Emitter.playerEvents.NOTICE_SHOW, {
      text: text,
    });
    if (time) {
      this.noticeTime = setTimeout(() => {
        this.template.notice.style.opacity = 0;
        this.emitter.emit(Emitter.playerEvents.NOTICE_HIDE);
      }, time);
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
}

export default Player;
