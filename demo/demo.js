const yuefu = new window.yuefu.Player({
    container: document.getElementById("player1"),
});

class Test {
    constructor(player, options) {
        console.log("player: ", player);
    }
    static get Name() {
        return "test";
    }
}

yuefu.install(Test);

yuefu.install(window.yuefu.Player.imports["progress"], {
    // timeFormat: 'MM:ss'
});
yuefu.install(window.yuefu.Player.imports["list"], {
    audios: [
        {
            name: "Counting Stars",
            artist: "OneRepublic",
            type: "normal",
            url: "http://music.163.com/song/media/outer/url?id=26060065.mp3",
            cover: "",
            lrc: "http://cdn.lwio.me/yuefu/lrc/demo.lrc"
        },
        {
            name: "胖子非野子",
            artist: "JAKI",
            type: "normal",
            url: "http://music.163.com/song/media/outer/url?id=401723037.mp3",
            cover: "",
            lrc: "http://cdn.lwio.me/yuefu/lrc/demo2.lrc"
        }
    ]
});

yuefu.install(window.yuefu.Player.imports["controller"], {
    controllers: [{
        name: "play",
        // 这里tag和HTML需不需要合并？tag有必要么
        tag: "button",
        innerHTML: "播放",
        handler: (player) => {
            player.play();
        }
    }, {
        name: "pause",
        // 这里tag和HTML需不需要合并？tag有必要么
        tag: "button",
        innerHTML: "暂停",
        handler: (player) => {
            player.pause();
        }
    }]
});

yuefu.install(window.yuefu.Player.imports["lrc"], {

});
