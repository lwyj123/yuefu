/**
 * @file Handle the option of yuefu.
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

export interface IYuefuOptions {
  container: Element;
  audio?: [];
  debug?: boolean;
  storageName?: string;
  volume?: number;
}

function handleOption(options: IYuefuOptions): IYuefuOptions {
  // default options
  const defaultOption: IYuefuOptions = {
    ...options,
    container: options.container || document.getElementsByClassName('yuefu')[0],
    debug: options.debug || false,
    storageName: options.storageName || 'yuefu-setting',
  };
  Object.keys(defaultOption).forEach((option: keyof IYuefuOptions) => {
    if (defaultOption.hasOwnProperty(option) && !options.hasOwnProperty(option)) {
      options[option] = defaultOption[option];
    }
  });

  return options;
}

export {
  handleOption
};
