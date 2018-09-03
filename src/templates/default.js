export default {
  template: `
    <xg-player>
      <xg-control v-on:click="togglePlayState" v-bind:class="playingClass"></xg-control>
      keke
      {{ playState }}
    </xg-player>
  `
};
