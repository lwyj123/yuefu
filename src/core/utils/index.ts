/**
 * @file utils
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */
export const isMobile: boolean = /mobile/i.test(window.navigator.userAgent);

export function secondToTime(second: number): string {
  const hour: number = Math.floor(second / 3600);
  const min: number = Math.floor((second - hour * 3600) / 60);
  const sec: number = Math.floor(second - hour * 3600 - min * 60);

  return (hour > 0 ? [hour, min, sec] : [min, sec]).map((num: number): string => num < 10 ? `0${num}` : `${num}`).join(':');
}

export function timeToSecond(time: string): number {
  const [min, sec] = time.split(':').map(parseInt);

  return (min * 60) + sec;
}

export function getElementViewLeft(element: HTMLElement) {
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent as HTMLElement;
  const elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
  if (!(document as any).fullscreenElement && !(document as any).mozFullScreenElement && !(document as any).webkitFullscreenElement) {
    while (current !== null) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent as HTMLElement;
    }
  } else {
    while (current !== null && current !== element) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent as HTMLElement;
    }
  }
  return actualLeft - elementScrollLeft;
}

export function getElementViewTop(element: HTMLElement, noScrollTop: boolean) {
  let actualTop = element.offsetTop;
  let current = element.offsetParent as HTMLElement;
  let elementScrollTop = 0;
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent as HTMLElement;
  }
  elementScrollTop = document.body.scrollTop + document.documentElement.scrollTop;
  return noScrollTop ? actualTop : actualTop - elementScrollTop;
}

export const eventNameMap = {
  dragStart: isMobile ? "touchstart" : "mousedown",
  dragMove: isMobile ? "touchmove" : "mousemove",
  dragEnd: isMobile ? "touchend" : "mouseup"
}
