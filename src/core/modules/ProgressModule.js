import Module from '../module'
import Emitter from '../emitter'
import utils from '../utils'


class ProgressModule extends Module {
  constructor(player, options) {
    super(player, options)
    this.options = options

    this.init()
    console.log(`[module] ${ProgressModule.name} init`)
  }
  static get name() {
    return 'progress'
  }

  init() {
    const progress = document.createElement('div');
    progress.classList.add('yuefu-progress')
    progress.innerHTML = `
    <div class="aplayer-bar-wrap">
        <div class="aplayer-bar">
            <div class="aplayer-loaded" style="width: 0"></div>
            <div class="aplayer-played" style="width: 0; background: rgba(235, 207, 194);">
                <span class="aplayer-thumb" style="background: rgba(235, 207, 194);">
                </span>
            </div>
        </div>
    </div>
    <div class="aplayer-time">
        <span class="aplayer-time-inner">
            <span class="aplayer-ptime">00:00</span> / <span class="aplayer-dtime">00:00</span>
        </span>
    </div>
    `
    this.player.container.appendChild(progress);
    this.playedTimeNode = this.player.container.querySelector('.aplayer-ptime')
    this.musicTimeNode = this.player.container.querySelector('.aplayer-dtime')

    const self = this;
    this.player.on(Emitter.audioEvents.TIME_UPDATE, () => {
      if (!self.player.disableTimeupdate) {
        // this.bar.set("played", this.audio.currentTime / this.duration, "width");
        // this.lrc && this.lrc.update();
        const currentTime = utils.secondToTime(self.player.audio.currentTime);
        if (self.playedTimeNode.innerHTML !== currentTime) {
          self.updateTime(currentTime);
        }
      }
    });
  }

  initProgress() {
    const thumbMove = (e) => {
      let percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getElementViewLeft(this.player.template.barWrap)) / this.player.template.barWrap.clientWidth;
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      // TODO: 设置模块状态方便模块交互？
      // player里面存放的modules中修改？
      // this.player.bar.set("played", percentage, "width");
      // TODO: 考虑通过事件，各模块不耦合
      // this.player.lrc && this.player.lrc.update(percentage * this.player.duration);
      this.playedTimeNode.innerHTML = utils.secondToTime(percentage * this.player.duration);
    };

    const thumbUp = (e) => {
      document.removeEventListener(utils.nameMap.dragEnd, thumbUp);
      document.removeEventListener(utils.nameMap.dragMove, thumbMove);
      let percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getElementViewLeft(this.player.template.barWrap)) / this.player.template.barWrap.clientWidth;
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      this.player.bar.set("played", percentage, "width");
      this.player.seek(this.player.bar.get("played", "width") * this.player.duration);
      this.player.disableTimeupdate = false;
    };

    this.player.container.querySelector('.aplayer-bar-wrap').addEventListener(utils.nameMap.dragStart, () => {
      this.player.disableTimeupdate = true;
      document.addEventListener(utils.nameMap.dragMove, thumbMove);
      document.addEventListener(utils.nameMap.dragEnd, thumbUp);
    });
  }
  updateTime(time) {
    this.playedTimeNode.innerHTML = time;
  }
}

export default ProgressModule
