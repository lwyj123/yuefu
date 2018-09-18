/**
 * @file insert css into page.
 * @description Usage: insertCss(cssString[, options]).';
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

const containers: HTMLElement[] = []; // will store container HTMLElement references
const styleElements: HTMLStyleElement[] = []; // will store {prepend: HTMLElement, append: HTMLElement}

type IInsertCSSOptions = {
  prepend?: boolean;
  container?: HTMLElement;
};

function insertCss(css: string, options: IInsertCSSOptions = {}): HTMLStyleElement {
  const position: string = options.prepend === true ? 'prepend' : 'append';
  const container: HTMLElement = options.container !== undefined ? options.container : document.querySelector('head');

  let containerId: number = containers.indexOf(container);

  // first time we see this container, create the necessary entries
  if (containerId === -1) {
    containerId = containers.push(container) - 1;
    styleElements[containerId] = null;
  }

  // try to get the correponding container + position styleElement, create it otherwise
  let styleElement: HTMLStyleElement;

  if (styleElements[containerId] !== undefined && styleElements[containerId][position] !== undefined) {
    styleElement = styleElements[containerId][position];
  } else {
    styleElement = styleElements[containerId][position] = createStyleElement();

    if (position === 'prepend') {
      container.insertBefore(styleElement, container.childNodes[0]);
    } else {
      container.appendChild(styleElement);
    }
  }

  let cssFormated: string = css;
  // strip potential UTF-8 BOM if css was read from a file
  if (css.charCodeAt(0) === 0xFEFF) {
    cssFormated = css.substr(1, css.length);
  }

  // actually add the stylesheet
  // if (styleElement.styleSheet) {
  //   styleElement.styleSheet.cssText += cssFormated;
  // } else {
  styleElement.textContent += cssFormated;
  // }

  return styleElement;
}

function createStyleElement(): HTMLStyleElement {
  const styleElement: HTMLStyleElement = document.createElement('style');
  styleElement.setAttribute('type', 'text/css');

  return styleElement;
}

export {
  insertCss,
  createStyleElement
};
