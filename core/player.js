import logger from './logger'

class Player {
  static debug(limit) {
    if (limit === true) {
      limit = 'log';
    }
    logger.level(limit);
  }
  constructor() {
    this.options = handleOption(options);
    this.container = this.options.container;
    this.paused = true;
    this.playedPromise = Promise.resolve();
    this.mode = 'normal';

    this.randomOrder = utils.randomOrder(this.options.audio.length);

    this.container.classList.add('aplayer');
    if (this.options.lrcType && !this.options.fixed) {
        this.container.classList.add('aplayer-withlrc');
    }
    if (this.options.audio.length > 1) {
        this.container.classList.add('aplayer-withlist');
    }
    if (utils.isMobile) {
        this.container.classList.add('aplayer-mobile');
    }
    this.arrow = this.container.offsetWidth <= 300;
    if (this.arrow) {
        this.container.classList.add('aplayer-arrow');
    }

    // save lrc
    this.container = this.options.container;
    if (this.options.lrcType === 2 || this.options.lrcType === true) {
        const lrcEle = this.container.getElementsByClassName('aplayer-lrc-content');
        for (let i = 0; i < lrcEle.length; i++) {
            if (this.options.audio[i]) {
                this.options.audio[i].lrc = lrcEle[i].innerHTML;
            }
        }
    }

    this.template = new Template({
        container: this.container,
        options: this.options,
        randomOrder: this.randomOrder,
    });

    if (this.options.fixed) {
        this.container.classList.add('aplayer-fixed');
        this.template.body.style.width = this.template.body.offsetWidth - 18 + 'px';
    }
    if (this.options.mini) {
        this.setMode('mini');
        this.template.info.style.display = 'block';
    }
    if (this.template.info.offsetWidth < 200) {
        this.template.time.classList.add('aplayer-time-narrow');
    }

    if (this.options.lrcType) {
        this.lrc = new Lrc({
            container: this.template.lrc,
            async: this.options.lrcType === 3,
            player: this,
        });
    }
    this.events = new Events();
    this.storage = new Storage(this);
    this.bar = new Bar(this.template);
    this.controller = new Controller(this);
    this.timer = new Timer(this);
    this.list = new List(this);

    this.initAudio();
    this.bindEvents();
    if (this.options.order === 'random') {
        this.list.switch(this.randomOrder[0]);
    }
    else {
        this.list.switch(0);
    }

    // autoplay
    if (this.options.autoplay) {
        this.play();
    }

    instances.push(this);
  }
  initAudio() {
    this.audio = document.createElement('audio');
    this.audio.preload = this.options.preload;

    for (let i = 0; i < this.events.audioEvents.length; i++) {
        this.audio.addEventListener(this.events.audioEvents[i], (e) => {
            this.events.trigger(this.events.audioEvents[i], e);
        });
    }

    this.volume(this.storage.get('volume'), true);
  }
}