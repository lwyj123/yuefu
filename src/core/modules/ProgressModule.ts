/**
 * @file progress module
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

import {EAudioEvents, EPlayerEvents} from '../emitter';
import * as module from '../module';
import { Player } from '../yuefu';
import * as utils from '../utils';

class ProgressModule extends module.BaseModule {
  public progressDom: HTMLDivElement;
  public playedProgressDom: HTMLDivElement;
  public playedTimeDom: HTMLDivElement;
  public musicTimeDom: HTMLDivElement;

  constructor(player: Player, options: module.IModuleOptions) {
    super(player, options);
    this.options = options;

    this.progressDom = document.createElement('div');
    this.progressDom.classList.add('yuefu-progress');
    this.progressDom.innerHTML = `
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
    `;
    this.playedProgressDom = this.progressDom.querySelector('.yuefu-played') as HTMLDivElement;
    this.playedTimeDom = this.progressDom.querySelector('.yuefu-ptime') as HTMLDivElement;
    this.musicTimeDom = this.progressDom.querySelector('.yuefu-dtime') as HTMLDivElement;

    this.init();
    console.log('[ProgressModule]', ProgressModule.name, 'init');
  }
  public static get Name(): string {
    return 'progress';
  }

  public init() {
    this.player.container.appendChild(this.progressDom);

    this.bindProgressEvent();

    const self = this;
    this.player.on(EAudioEvents.TIME_UPDATE, () => {
      if (!self.player.disableTimeupdate) {
        const currentTime = utils.secondToTime(self.player.audioDOM!.currentTime);
        if (self.playedTimeDom.innerHTML !== currentTime) {
          self.updatePlayedTime(currentTime);
        }
      }
    });
    this.player.on(EAudioEvents.PLAYING, () => {
      if (!self.player.disableTimeupdate) {
        const durationTime = utils.secondToTime(self.player.audioDOM!.duration);
        self.updateMusicTime(durationTime);
      }
    });
    this.player.on(EPlayerEvents.AUDIO_SWITCH, () => {
      self.updatePlayedTime('00:00');
    });
  }

  public bindProgressEvent() {
    const self = this;
    const progressWrap = this.player.container.querySelector('.yuefu-bar-wrap') as HTMLDivElement;
    const thumbMove = (e: Event) => {
      let percentage = (((e as MouseEvent).clientX || (e as TouchEvent).changedTouches[0].clientX) - utils.getElementViewLeft(progressWrap)) / progressWrap.clientWidth;
      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      this.playedTimeDom.innerHTML = utils.secondToTime(percentage * self.player.duration);
      this.updatePlayedTime(utils.secondToTime(percentage * self.player.duration));
    };

    const thumbUp = (e: Event) => {
      document.removeEventListener(utils.eventNameMap.dragEnd, thumbUp);
      document.removeEventListener(utils.eventNameMap.dragMove, thumbMove);

      let percentage = (((e as MouseEvent).clientX || (e as TouchEvent).changedTouches[0].clientX) - utils.getElementViewLeft(progressWrap)) / progressWrap.clientWidth;

      percentage = Math.max(percentage, 0);
      percentage = Math.min(percentage, 1);
      self.player.seek(percentage * self.player.duration);
      self.player.disableTimeupdate = false;
      console.log(`[progress] seek time into ${percentage * self.player.duration}`);
    };

    this.player.container.querySelector('.yuefu-bar-wrap')!.addEventListener(utils.eventNameMap.dragStart, () => {
      this.player.disableTimeupdate = true;
      document.addEventListener(utils.eventNameMap.dragMove, thumbMove);
      document.addEventListener(utils.eventNameMap.dragEnd, thumbUp);
    });
  }
  public updatePlayedTime(time: string) {
    this.playedTimeDom.innerHTML = time;
    this.playedProgressDom.style.width = `${(utils.timeToSecond(time) / this.player.duration * 100).toFixed(0)}%`;
  }
  public updateMusicTime(time: string) {
    this.musicTimeDom.innerHTML = time;
  }
}

export default ProgressModule;
