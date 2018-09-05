export default {
  template: `
    <xg-player>
      <xg-control v-on:click="togglePlayState" v-bind:class="playingClass">play</xg-control>
      {{ playState }}
      <button v-on:click="togglePlayingClass">{{ playState }}</button>
      <button v-if="playingClass === 'play'">now {{ playingClass }}</button>
      <button v-else>now class {{ playingClass }}</button>
      <img src="http://p99.pstatp.com/large/16cd000583ba5539d25f" />
      <div class="counter">counter</div>
    </xg-player>
  `
};
