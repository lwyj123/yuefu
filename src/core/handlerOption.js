export default (options) => {

  // default options
  const defaultOption = {
    container: options.element || document.getElementsByClassName("yuefu")[0],
    mini: options.narrow || options.fixed || false,
    autoplay: false,
    mutex: true,
    lrcType: options.showlrc || options.lrc || 0,
    preload: "auto",
    volume: 0.7,
    storageName: "yuefu-setting",
    // 新增模块机制
    modules: {
      testModule: {}
    }
  };
  for (const defaultKey in defaultOption) {
    if (defaultOption.hasOwnProperty(defaultKey) && !options.hasOwnProperty(defaultKey)) {
      options[defaultKey] = defaultOption[defaultKey];
    }
  }

  if (Object.prototype.toString.call(options.audio) !== "[object Array]") {
    options.audio = [options.audio];
  }

  // options.audio.map((item) => {
  //   item.name = item.name || item.title || "Audio name";
  //   item.artist = item.artist || item.author || "Audio artist";
  //   item.cover = item.cover || item.pic;
  //   item.type = item.type || "normal";
  //   return item;
  // });

  if (options.audio.length <= 1 && options.loop === "one") {
    options.loop = "all";
  }

  return options;
};
