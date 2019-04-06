/**
 * @file lrc module
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

// import emitter from '../emitter';
import { BaseModule, IModuleOptions } from '../module';
import { Player, IAudioObject } from '../yuefu';
import { Emitter, EPlayerEvents, EAudioEvents } from '../emitter';

export const EVENTS = {
  LRC_LOADED: 'lrc:lrc-loaded',
};

class LrcModule extends BaseModule {
  public parsed: any[] | null
  public index: number;
  public lrcDom: HTMLOListElement;
  public lrcContentsNode: HTMLDivElement;
  constructor(player: Player, options: IModuleOptions) {
    super(player, options);
    this.options = options;

    this.parsed = null;
    this.index = 0;

    this.lrcDom = document.createElement('ol');
    this.lrcDom.classList.add('yuefu-lrc');
    this.lrcDom.innerHTML = `
      <div class="yuefu-lrc-contents"></div>
    `;
    this.lrcContentsNode = this.lrcDom.querySelector('.yuefu-lrc-contents') as HTMLDivElement;

    this.init();
    console.log('[LrcModule]', LrcModule.name, 'init');
  }
  public static get Name(): string {
    return 'lrc';
  }

  public init() {

    this.player.container.appendChild(this.lrcDom);

    // 监听audio变化事件，加载切换后的歌词
    this.player.emitter.on(EPlayerEvents.AUDIO_SWITCH, (index: number, audio: IAudioObject) => {
      this.switch(audio.lrc);
    });
    this.switch(this.player.currentAudio && this.player.currentAudio.lrc);

    const self = this;
    this.player.on(EAudioEvents.TIME_UPDATE, () => {
      if (!self.player.disableTimeupdate) {
        this.parsed && this.update();
      }
    });
  }

  public update (currentTime = this.player.audioDOM!.currentTime) {
    if(!this.parsed) {
      throw new Error("parsed is null when update")
    }
    if (this.index > this.parsed.length - 1 || currentTime < this.parsed[this.index][0] || (!this.parsed[this.index + 1] || currentTime >= this.parsed[this.index + 1][0])) {
      for (let i = 0; i < this.parsed.length; i++) {
        if (currentTime >= this.parsed[i][0] && (!this.parsed[i + 1] || currentTime < this.parsed[i + 1][0])) {
          this.index = i;
          this.lrcContentsNode.style.transform = `translateY(${-this.index * 16}px)`;
          this.lrcContentsNode.style.webkitTransform = `translateY(${-this.index * 16}px)`;
          const currentLineNode = this.lrcContentsNode.querySelector('.yuefu-lrc-current');
          currentLineNode && currentLineNode.classList.remove('yuefu-lrc-current');
          this.lrcContentsNode.getElementsByTagName('p')[i].classList.add('yuefu-lrc-current');
        }
      }
    }
  }

  public switch (lrcUrl: string) {
    if (!this.player.currentAudio) {
      this.player.logger.warn("currentAudio is null")
    }
    if (lrcUrl) {
      this.parsed = [['00:00', 'Loading']];
      const xhr = new XMLHttpRequest();
      const self = this;
      xhr.onreadystatechange = () => {
        if (lrcUrl === self.player.currentAudio!.lrc && xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            self.parsed = self.parse(xhr.responseText);
          } else {
            // this.player.notice(`LRC file request fails: status ${xhr.status}`);
            self.parsed = [['00:00', 'Not available']];
          }

          const contents = self.parsed.reduce((pre, [index, lyric]) => {
            return pre + `<p>${lyric}</p>`;
          },                                  '');

          self.lrcContentsNode.innerHTML = contents;

          self.update(0);
        }
      };
      xhr.open('get', lrcUrl, true);
      xhr.send(null);
    } else {
      this.parsed = [['00:00', 'Not available']];
    }
    this.update(0);
  }

  /**
     * Parse lrc, suppose multiple time tag
     *
     * @param {String} lrc_s - Format:
     * [mm:ss]lyric
     * [mm:ss.xx]lyric
     * [mm:ss.xxx]lyric
     * [mm:ss.xx][mm:ss.xx][mm:ss.xx]lyric
     * [mm:ss.xx]<mm:ss.xx>lyric
     *
     * @return {String} [[time, text], [time, text], [time, text], ...]
     */
  public parse (lrc_s: string) {
    if (lrc_s) {
      lrc_s = lrc_s.replace(/([^\]^\n])\[/g, (match, p1) => p1 + '\n[');
      const lyric = lrc_s.split('\n');
      let lrc = [];
      const lyricLen = lyric.length;
      for (let i = 0; i < lyricLen; i++) {
        // match lrc time
        const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g);
        // match lrc text
        const lrcText = lyric[i].replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '').replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '').replace(/^\s+|\s+$/g, '');

        if (lrcTimes) {
          // handle multiple time tag
          const timeLen = lrcTimes.length;
          for (let j = 0; j < timeLen; j++) {
            const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j]) as any;
            const min2sec = oneTime[1] * 60;
            const sec2sec = parseInt(oneTime[2]);
            const msec2sec = oneTime[4] ? parseInt(oneTime[4]) / ((oneTime[4] + '').length === 2 ? 100 : 1000) : 0;
            const lrcTime = min2sec + sec2sec + msec2sec;
            lrc.push([lrcTime, lrcText]);
          }
        }
      }
      // sort by time
      lrc = lrc.filter((item) => item[1]);
      lrc.sort((a: any, b: any) => a[0] - b[0]);
      return lrc;
    } else {
      return [];
    }
  }

  public clear () {
    this.parsed = [];
    this.lrcContentsNode.innerHTML = '';
  }

}

export default LrcModule;
