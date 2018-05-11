const ap1 = new yuefu({
  element: document.getElementById("player1"),
  mini: false,
  autoplay: false,
  lrcType: false,
  mutex: true,
  preload: "metadata",
  audio: [{
    name: "光るなら",
    artist: "Goose house",
    url: "https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.mp3",
    cover: "https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.jpg",
    theme: "#ebd0c2"
  }]
});
