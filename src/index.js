import { isInBrowser } from './constants';
import ScrollMonitorContainer from './container';


const awesomeScroll = new ScrollMonitorContainer(isInBrowser ? document.body : null);
awesomeScroll.setStateFromDOM(null);
awesomeScroll.listenToDOM();

if (isInBrowser) {
  window.awesomeScroll = awesomeScroll;
}

module.exports = awesomeScroll;
