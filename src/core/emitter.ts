/**
 * @file emitter for player
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

import * as eventemitter3 from 'eventemitter3';
import { ConsoleLogger, Logger } from './logger';

enum EAudioEvents {
  ABORT                = 'abort',
  CAN_PLAY             = 'can-play',
  CAN_PLAY_THROUGH     = 'can-play-through',
  DURATION_CHANGE      = 'duration-change',
  EMPTIED              = 'emptied',
  ENDED                = 'ended',
  ERROR                = 'error',
  LOADED_DATA          = 'loaded-data',
  LOADED_METADATA      = 'loaded-metadata',
  LOAD_START           = 'load-start',
  MOZ_AUDIO_AVAILABLE  = 'moz-audio-available',
  PAUSE                = 'pause',
  PLAY                 = 'play',
  PLAYING              = 'playing',
  PROGRESS             = 'progress',
  RATE_CHANGE          = 'rate-change',
  SEEKED               = 'seeked',
  SEEKING              = 'seeking',
  STALLED              = 'stalled',
  SUSPEND              = 'suspend',
  TIME_UPDATE          = 'timeupdate',
  VOLUME_CHANGE        = 'volume-change',
  WAITING              = 'waiting',
}
enum EPlayerEvents {
  DESTORY              = 'destroy',

  LIST_SHOW            = 'list-show',
  LIST_HIDE            = 'list-hide',
  LIST_ADD             = 'list-add',
  LIST_REMOVE          = 'list-remove',
  AUDIO_SWITCH         = 'audio-switch',
  LIST_CLEAR           = 'list-clear',

  NOTICE_SHOW          = 'notice-show',
  NOTICE_HIDE          = 'notice-hide',

  LRC_SHOW             = 'lrc-show',
  LRC_HIDE             = 'lrc-hide',
}

enum ESource {
  API    = 'api',
  SILENT = 'silent',
  USER   = 'user',
}

class Emitter extends eventemitter3.EventEmitter {
  public logger: Logger;
  constructor() {
    super();
    this.logger = new ConsoleLogger({
      error: true,
      warn: true,
      log: true,
      info: true,
      ns: 'emitter',
    });
    this.on('error', this.logger.error);
  }

  public emit(event: string | symbol, ...args: any[]): boolean {
    this.logger.log(event, ...args);

    return super.emit(event, ...args);
  }
}

export {
  Emitter,
  EAudioEvents,
  EPlayerEvents,
  ESource
};
