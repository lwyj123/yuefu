import Module from '../module'
import Emitter from '../emitter'
import utils from '../utils'
import smoothScroll from "smoothscroll";


class ListModule extends Module {
  constructor(player, options) {
    super(player, options)
    this.options = options

    // 列表中歌曲信息
    this.audios = []
    this.playingAudio = null

    this.init()
    console.log(`[module] ${ListModule.name} init`)
  }
  static get name() {
    return 'list'
  }

  init() {
    const list = document.createElement('ol');
    list.classList.add('yuefu-list')
    this.player.container.appendChild(list)
    this.listNode = list

    // 初始列表
    this.audios = this.options.audios || []
    this.bindEvent();
    this.updateDom()
  }

  /**
   * 绑定list各项的点击事件用于切换播放
   *
   * @memberof ListModule
   */
  bindEvent() {
    this.listNode.addEventListener('click', (e) => {
      let target;
      if (e.target.tagName.toUpperCase() === "LI") {
        target = e.target;
      }
      else {
        target = e.target.parentElement;
      }
      const audioIndex = parseInt(target.querySelector(".yuefu-list-index").innerHTML) - 1;
      if (audioIndex !== this.index) {
        this.switch(audioIndex);
        this.player.play();
      }
      else {
        this.player.toggle();
      }
    })
  }

  switch (index) {
    this.player.emitter.emit(Emitter.playerEvents.AUDIO_SWITCH,
      index,
      this.audios[index]
    );

    if (typeof index !== "undefined" && this.audios[index]) {
      this.index = index;

      const audio = this.audios[this.index];

      const light = this.player.container.querySelector(".yuefu-list-light");
      if (light) {
        light.classList.remove("yuefu-list-light");
      }

      this.player.container.querySelectorAll(".yuefu-list li")[this.index].classList.add("yuefu-list-light");

      smoothScroll(this.index * 33, 500, null, this.player.template.listOl);

      this.player.setAudio(audio);
    }
  }

  add(audio) {
    this.audios.push(audio)
    this.updateDom()
  }
  delete(index) {
    this.audios.splice(index, 1)
    this.updateDom()
  }
  updateDom() {
    this.listNode.innerHTML = '';
    const self = this;
    this.audios.forEach((audio, index) => {
      const itemNode = document.createElement('li')
      itemNode.classList.add('yuefu-list-item')
      itemNode.innerHTML = `
        <span class="yuefu-list-cur" style="background-color: #444444;"></span>
        <span class="yuefu-list-index">${index+1}</span>
        <span class="yuefu-list-title">${audio.name || '无名'}</span>
        <span class="yuefu-list-author">${audio.artist || '未知'}</span>
      `
      const indexSpan = itemNode.querySelector('.yuefu-list-index')
      const titleSpan = itemNode.querySelector('.yuefu-list-title')
      const authorSpan = itemNode.querySelector('.yuefu-list-author')

      self.listNode.appendChild(itemNode)
    })
  }

}

export default ListModule
