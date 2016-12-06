import { isInBrowser } from './src/constants';
import ScrollMonitorContainer from './src/container';


const scrollMonitor = new ScrollMonitorContainer(isInBrowser ? document.body : null);
scrollMonitor.setStateFromDOM(null);
scrollMonitor.listenToDOM();

if (isInBrowser) {
  window.scrollMonitor = scrollMonitor;
}

module.exports = scrollMonitor;
