# Yuefu

A programable music player built for compatibility and extensibility.


## Installation

Using npm:

```
npm install yuefu --save
```

## Quick Start


```html
<link rel="stylesheet" href="yuefu.core.css">
<div id="yuefu-demo"></div>
<script src="yuefu.js"></script>
```

```js
const yuefu = new Yuefu({
  element: document.getElementById("yuefu-demo"),
});

// load default progress module
yuefu.addModule(Yuefu.import('progress'), {
  // timeFormat: 'MM:ss'
})
// load default list module
yuefu.addModule(Yuefu.import('list'), {
  audios: [{
    name: "peace sign",
    artist: "Goose house",
    type: "normal",
    url: "http://lwio.me/api/storeroom/1526123245516.mp3",
    cover: "",
  }, {
    name: "胖子非野子",
    artist: "JAKI",
    type: "normal",
    url: "http://lwio.me/api/storeroom/1528112620919.mp3",
    cover: "",
  }]
})

// load default controller module
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
container | document.querySelector('.yuefu-player') | player container

For example:

## API

+ `Yuefu.version`: static property, return the version of Yuefu

+ `yuefu.play()`: play audio

+ `yuefu.pause()`: pause audio

+ `yuefu.seek(time: number)`: seek to specified time, the unit of time is second

  ```js
  yuefu.seek(100);
  ```

+ `yuefu.toggle()`: toggle between play and pause

+ `yuefu.on(event: string, handler: function)`: bind audio and player events, [see more details]()

+ `yuefu.volume(percentage: number, nostorage: boolean)`: set audio volume

  ```js
  yuefu.volume(0.1, true);
  ```

+ `yuefu.destroy()`: destroy player

+ `yuefu.audio`: native audio

 + `yuefu.audio.currentTime`: returns the current playback position

 + `yuefu.audio.duration`: returns audio total time

 + `yuefu.audio.paused`: returns whether the audio paused

 + most [native api](http://www.w3schools.com/tags/ref_av_dom.asp) are supported

## Event binding

`yuefu.on(event, handler)`

```js
yuefu.on('ended', function () {
    console.log('player ended');
});
```

Audio events

- abort
- canplay
- canplaythrough
- durationchange
- emptied
- ended
- error
- loadeddata
- loadedmetadata
- loadstart
- mozaudioavailable
- pause
- play
- playing
- progress
- ratechange
- seeked
- seeking
- stalled
- suspend
- timeupdate
- volumechange
- waiting

Player events

- listshow
- listhide
- listadd
- listremove
- listswitch
- listclear
- noticeshow
- noticehide
- destroy
- lrcshow
- lrchide


## FAQ

