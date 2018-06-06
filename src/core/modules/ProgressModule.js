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
    <div class="yuefu-bar-wrap">
        <div class="yuefu-bar">
            <div class="yuefu-loaded" style="width: 0"></div>
            <div class="yuefu-played" style="width: 0; background: #444444;">
                <span class="yuefu-thumb" style="background: #444444;">
                </span>
            </div>
        </div>
    </div>
    <div class="yuefu-time">
        <span class="yuefu-time-inner">
            <span class="yuefu-ptime">00:00</span> / <span class="yuefu-dtime">00:00</span>
        </span>
    </div>
    `
    this.player.container.appendChild(progress);
    this.playedProgressNode = this.player.container.querySelector('.yuefu-played')
    this.playedTimeNode = this.player.container.querySelector('.yuefu-ptime')
    this.musicTimeNode = this.player.container.querySelector('.yuefu-dtime')

    this.bindProgressEvent()

    const self = this;
    this.player.on(Emitter.audioEvents.TIME_UPDATE, () => {
      if (!self.player.disableTimeupdate) {
        // this.bar.set("played", this.audio.currentTime / this.duration, "width");
        // this.lrc && this.lrc.update();
        const currentTime = utils.secondToTime(self.player.audioDOM.currentTime);
        if (self.playedTimeNode.innerHTML !== currentTime) {
          self.updatePlayedTime(currentTime);
        }
      }
    });
    this.player.on(Emitter.audioEvents.PLAYING, () => {
      if (!self.player.disableTimeupdate) {
        const durationTime = utils.secondToTime(self.player.audioDOM.duration);
        self.updateMusicTime(durationTime);
      }
    });
  }

  bindProgressEvent() {
    const self = this;
    const progressWrap = this.player.container.querySelector('.yuefu-bar-wrap')
    const thumbMove = (e) => {
      let percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getElementViewLeft(progressWrap)) / progressWrap.clientWidth;
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      this.playedTimeNode.innerHTML = utils.secondToTime(percentage * self.player.duration);
      this.updatePlayedTime(utils.secondToTime(percentage * self.player.duration))
    };

    const thumbUp = (e) => {
      document.removeEventListener(utils.nameMap.dragEnd, thumbUp);
      document.removeEventListener(utils.nameMap.dragMove, thumbMove);

      let percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getElementViewLeft(progressWrap)) / progressWrap.clientWidth;

      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      self.player.seek(percentage * self.player.duration);
      self.player.disableTimeupdate = false;
      console.log(`[progress] seek time into ${percentage * self.player.duration}`)
    };

    this.player.container.querySelector('.yuefu-bar-wrap').addEventListener(utils.nameMap.dragStart, () => {
      this.player.disableTimeupdate = true;
      document.addEventListener(utils.nameMap.dragMove, thumbMove);
      document.addEventListener(utils.nameMap.dragEnd, thumbUp);
    });
  }
  updatePlayedTime(time) {
    this.playedTimeNode.innerHTML = time;
    this.playedProgressNode.style.width = `${(utils.timeToSecond(time) / this.player.duration * 100).toFixed(0)}%`
  }
  updateMusicTime(time) {
    this.musicTimeNode.innerHTML = time;
  }
}

export default ProgressModule
