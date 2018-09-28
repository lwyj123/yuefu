/**
 * @file utils
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */
export const isMobile: boolean = /mobile/i.test(window.navigator.userAgent);

export function secondToTime (second: number): string {
  const hour: number = Math.floor(second / 3600);
  const min: number = Math.floor((second - hour * 3600) / 60);
  const sec: number = Math.floor(second - hour * 3600 - min * 60);

  return (hour > 0 ? [hour, min, sec] : [min, sec]).map((num: number): string => num < 10 ? `0${num}` : `${num}`).join(':');
}

export function timeToSecond(time: string): number {
  const [min, sec] = time.split(':').map(parseInt);

  return (min * 60) + sec;
}

// getElementViewLeft: (element) => {
//     let actualLeft = element.offsetLeft;
//     let current = element.offsetParent;
//     const elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
//     if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
//       while (current !== null) {
//         actualLeft += current.offsetLeft;
//         current = current.offsetParent;
//       }
//     } else {
//       while (current !== null && current !== element) {
//         actualLeft += current.offsetLeft;
//         current = current.offsetParent;
//       }
//     }
//     return actualLeft - elementScrollLeft;
//   },

//   getElementViewTop; : (element, noScrollTop); => {
//     let actualTop = element.offsetTop;
//     let current = element.offsetParent;
//     let elementScrollTop = 0;
//     while (current !== null) {
//       actualTop += current.offsetTop;
//       current = current.offsetParent;
//     }
//     elementScrollTop = document.body.scrollTop + document.documentElement.scrollTop;
//     return noScrollTop ? actualTop : actualTop - elementScrollTop;
//   },
