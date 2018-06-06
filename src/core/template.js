import Icons from "./icons";
import tplPlayer from "../template/player.art";

class Template {
  constructor (options) {
    this.container = options.container;
    this.options = options.options;
    this.randomOrder = options.randomOrder;
    this.init();
  }

  init () {
    let cover = "";

    this.container.innerHTML = tplPlayer({
      options: this.options,
      icons: Icons,
      cover: cover,
      getObject: (obj) => obj,
    });

    this.lrc = this.container.querySelector(".yuefu-lrc-contents");
    this.lrcWrap = this.container.querySelector(".yuefu-lrc");
    this.ptime = this.container.querySelector(".yuefu-ptime");
    this.info = this.container.querySelector(".yuefu-info");
    this.time = this.container.querySelector(".yuefu-time");
    this.barWrap = this.container.querySelector(".yuefu-bar-wrap");
    this.button = this.container.querySelector(".yuefu-button");
    this.body = this.container.querySelector(".yuefu-body");
    this.list = this.container.querySelector(".yuefu-list");
    this.listOl = this.container.querySelector(".yuefu-list ol");
    this.listCurs = this.container.querySelectorAll(".yuefu-list-cur");
    this.played = this.container.querySelector(".yuefu-played");
    this.loaded = this.container.querySelector(".yuefu-loaded");
    this.thumb = this.container.querySelector(".yuefu-thumb");
    this.volume = this.container.querySelector(".yuefu-volume");
    this.volumeBar = this.container.querySelector(".yuefu-volume-bar");
    this.volumeButton = this.container.querySelector(".yuefu-time button");
    this.volumeBarWrap = this.container.querySelector(".yuefu-volume-bar-wrap");
    this.loop = this.container.querySelector(".yuefu-icon-loop");
    this.order = this.container.querySelector(".yuefu-icon-order");
    this.menu = this.container.querySelector(".yuefu-icon-menu");
    this.pic = this.container.querySelector(".yuefu-pic");
    this.title = this.container.querySelector(".yuefu-title");
    this.author = this.container.querySelector(".yuefu-author");
    this.dtime = this.container.querySelector(".yuefu-dtime");
    this.notice = this.container.querySelector(".yuefu-notice");
    this.miniSwitcher = this.container.querySelector(".yuefu-miniswitcher");
    this.skipBackButton = this.container.querySelector(".yuefu-icon-back");
    this.skipForwardButton = this.container.querySelector(".yuefu-icon-forward");
    this.skipPlayButton = this.container.querySelector(".yuefu-icon-play");
    this.lrcButton = this.container.querySelector(".yuefu-icon-lrc");
  }
}

export default Template;
