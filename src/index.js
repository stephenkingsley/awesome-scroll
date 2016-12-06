import { isInBrowser } from './constants';
import ScrollMonitorContainer from './container';


const scrollMonitor = new ScrollMonitorContainer(isInBrowser ? document.body : null);
scrollMonitor.setStateFromDOM(null);
scrollMonitor.listenToDOM();

if (isInBrowser) {
  window.scrollMonitor = scrollMonitor;
}

module.exports = scrollMonitor;
