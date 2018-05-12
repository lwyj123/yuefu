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
}

ap1.addModule('test', Test)
