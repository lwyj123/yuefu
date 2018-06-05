import EventEmitter from "eventemitter3";
import logger from "./logger";

let debug = logger("yuefu:events");

class Emitter extends EventEmitter {
  constructor() {
    super();
    this.on("error", debug.error);
  }

  emit() {
    debug.log.apply(debug, arguments);
    super.emit.apply(this, arguments);
  }
}

Emitter.audioEvents = {
  ABORT                : "abort",
  CAN_PLAY             : "can-play",
  CAN_PLAY_THROUGH     : "can-play-through",
  DURATION_CHANGE      : "duration-change",
  EMPTIED              : "emptied",
  ENDED                : "ended",
  ERROR                : "error",
  LOADED_DATA          : "loaded-data",
  LOADED_METADATA      : "loaded-metadata",
  LOAD_START           : "load-start",
  MOZ_AUDIO_AVAILABLE  : "moz-audio-available",
  PAUSE                : "pause",
  PLAY                 : "play",
  PLAYING              : "playing",
  PROGRESS             : "progress",
  RATE_CHANGE          : "rate-change",
  SEEKED               : "seeked",
  SEEKING              : "seeking",
  STALLED              : "stalled",
  SUSPEND              : "suspend",
  TIME_UPDATE          : "timeupdate",
  VOLUME_CHANGE        : "volume-change",
  WAITING              : "waiting",
};
Emitter.playerEvents = {
  DESTORY              : "destroy",

  LIST_SHOW            : "list-show",
  LIST_HIDE            : "list-hide",
  LIST_ADD             : "list-add",
  LIST_REMOVE          : "list-remove",
  AUDIO_SWITCH         : "audio-switch",
  LIST_CLEAR           : "list-clear",

  NOTICE_SHOW          : "notice-show",
  NOTICE_HIDE          : "notice-hide",

  LRC_SHOW             : "lrc-show",
  LRC_HIDE             : "lrc-hide",
};

Emitter.sources = {
  API    : "api",
  SILENT : "silent",
  USER   : "user"
};


export default Emitter;
