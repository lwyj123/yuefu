Yuefu.debug('warn')
const ap1 = new Yuefu({
  element: document.getElementById("player1"),
  mini: false,
  autoplay: false,
  lrcType: false,
  mutex: true,
  preload: "metadata",
  audio: [{
    name: "peace sign",
    artist: "Goose house",
    url: "http://lwio.me/api/storeroom/1526123245516.mp3",
    cover: "",
    theme: "#ebd0c2"
  }]
});

class Test {
  constructor(player, options) {
    console.log('player: ', player)
  }
  static get name() {
    return 'test'
  }
}

ap1.addModule(Test)

ap1.addModule(Yuefu.import('progress'), {
  // timeFormat: 'MM:ss'
})

ap1.addModule(Yuefu.import('controller'), {
  controllers: [{
    name: 'play',
    // 这里tag和HTML需不需要合并？tag有必要么
    tag: 'button',
    innerHTML: '播放',
    handler: (player) => {
      player.play()
    }
  }]
})
