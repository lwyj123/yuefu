/**
 * @file utils
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

const containers: any[] = []; // will store container HTMLElement references
const styleElements: any[] = []; // will store {prepend: HTMLElement, append: HTMLElement}

interface IOptions {
  container?: HTMLElement;
  prepend?: boolean;

}

export function insertCss (css: string, options: IOptions = {}): HTMLStyleElement {
  let finalCss: string = css;
  const position: string = options.prepend === true ? 'prepend' : 'append';
  const container: HTMLElement = options.container !== undefined ? options.container : document.querySelector('head');
  let containerId: number = containers.indexOf(container);

  // first time we see this container, create the necessary entries
  if (containerId === -1) {
    containerId = containers.push(container) - 1;
    styleElements[containerId] = {};
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

  // strip potential UTF-8 BOM if css was read from a file
  if (css.charCodeAt(0) === 0xFEFF) {
    finalCss = css.substr(1, css.length);
  }

  // actually add the stylesheet
  styleElement.textContent += finalCss;

  return styleElement;
}

function createStyleElement (): HTMLStyleElement {
  const styleElement: HTMLStyleElement = document.createElement('style');
  styleElement.setAttribute('type', 'text/css');

  return styleElement;
}
