export default {
  template: `
    <div class="learning-mini">
      <div class="thumb">
        <img src="//sf1-ttcdn-tos.pstatp.com/img/learning/974a8c9f6140ffd9779491092713f799~noop.jpeg" />
      </div>
      <div class="info">
        <h1>{{ title }}</h1>
        <p>{{ duration }}</p>
      </div>
      <div class="operations">
        <div class="play-btn" v-bind:class="playingClass" v-on:click="togglePlayState"></div>
        <div class="next-btn"></div>
      </div>
    </div>
  `,
  style: `
    .learning-mini {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .learning-mini .thumb img {
      width: 40px;
      height: 40px;
    }
    .learning-mini h1 {
      font-size: 16px;
      margin: 0;
    }
    .learning-mini p {
      font-size: 10px;
      margin: 0;
    }
    .play-btn {
      width: 20px;
      height: 20px;
      background-size: contain;
    }
    .play {
      background-image: url(https://cdn0.iconfinder.com/data/icons/music-sets/500/204-512.png);
    }
    .pause {
      background-image: url(https://cdn0.iconfinder.com/data/icons/music-sets/500/202-512.png);
    }

    .next-btn {
      width: 20px;
      height: 20px;
      background: url(https://cdn0.iconfinder.com/data/icons/music-sets/500/207-512.png);
      background-size: contain;
    }
  `
};
