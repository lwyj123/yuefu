# Yuefu

A programable music player built for compatibility and extensibility.


## Installation

Using npm:

```
npm install yuefu --save
```

## Quick Start


```html
<link rel="stylesheet" type="text/css" href="http://cdn.lwio.me/yuefu/1.0.1/yuefu.core.css"></link>
<div id="yuefu-demo"></div>
<script src="http://cdn.lwio.me/yuefu/1.0.1/yuefu.js"></script>
```

```js
const yuefu = new Yuefu({
  element: document.getElementById("yuefu-demo"),
});

yuefu.addModule(Yuefu.import('progress'), {
  // timeFormat: 'MM:ss'
})
yuefu.addModule(Yuefu.import('list'), {
  audios: [{
    name: "peace sign",
    artist: "JAKI",
    type: "normal",
    url: "http://lwio.me/api/storeroom/1526123245516.mp3",
    cover: "",
    lrc: "http://cdn.lwio.me/yuefu/lrc/demo.lrc",
  }, {
    name: "胖子非野子",
    artist: "JAKI",
    type: "normal",
    url: "http://lwio.me/api/storeroom/1528112620919.mp3",
    cover: "",
    lrc: "http://cdn.lwio.me/yuefu/lrc/demo2.lrc",
  }]
})

yuefu.addModule(Yuefu.import('controller'), {
  controllers: [{
    name: 'play',
    tag: 'button',
    innerHTML: '播放',
    handler: (player) => {
      player.play()
    }
  }, {
    name: 'pause',
    tag: 'button',
    innerHTML: '暂停',
    handler: (player) => {
      player.pause()
    }
  }]
})

yuefu.addModule(Yuefu.import('lrc'), {

})

```

Work with module bundler:

```js
import 'yuefu/dist/yuefu.core.css';
import Yuefu from 'yuefu';

const yuefu = new Yuefu(options);
```

## Options

Name | Default | Description
----|-------|----
element | document.querySelector('.yuefu-player') | player container

For example:

## API

+ `Yuefu.version`: static property, return the version of Yuefu

+ `yuefu.play()`: play audio

+ waitting for completion


## Event binding

`yuefu.on(event, handler)`

```js
yuefu.on('ended', function () {
    console.log('player ended');
});
```


## FAQ

