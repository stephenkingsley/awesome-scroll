import { isOnServer, isInBrowser, eventTypes } from './constants';
import Watcher from './watcher';

const getViewportHeight = (element) => {
  let height;
  if (isOnServer) {
    height = 0;
  }

  if (element === document.body) {
    height = window.innerHeight || document.documentElement.clientHeight;
  } else {
    height = element.clientHeight;
  }
  return height;
};

const getContentHeight = (element) => {
  let height;
  if (isOnServer) {
    height = 0;
  }

  if (element === document.body) {
    height = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.documentElement.clientHeight,
    );
  } else {
    height = element.scrollHeight;
  }
  return height;
};

const scrollTop = (element) => {
  let height;
  if (isOnServer) {
    height = 0;
  }

  if (element === document.body) {
    height = window.pageYOffset ||
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
  } else {
    height = element.scrollHeight;
  }
  return height;
};

export default class ScrollMonitorContainer {
  constructor(item, parentWatcher) {
    const self = this;
    this.item = item;
    this.watchers = [];
    this.viewportTop = null;
    this.viewportBottom = null;
    this.documentHeight = getContentHeight(item);
    this.viewportHeight = getViewportHeight(item);

    this.DOMListener = (event) => {
      this.setStateFromDOM(event);
      this.updateAndTriggerWatchers(event);
    };

    this.eventTypes = eventTypes;

    if (parentWatcher) {
      this.containerWatcher = parentWatcher.create(item);
    }

    let previousDocumentHeight;
    let calculateViewportI;

    const calculateViewport = () => {
      self.viewportTop = scrollTop(item);
      self.viewportBottom = self.viewportTop + self.viewportHeight;
      self.documentHeight = getContentHeight(item);
      if (self.documentHeight !== previousDocumentHeight) {
        calculateViewportI = self.watchers.length;
        while (calculateViewportI) {
          calculateViewportI -= 1;
          self.watchers[calculateViewportI].recalculateLocation();
        }

        previousDocumentHeight = self.documentHeight;
      }
    };

    let updateAndTriggerWatchersI;

    const updateAndTriggerWatchersInConstructor = () => {
      // update all watchers then trigger the events so one can rely on another being up to date.
      updateAndTriggerWatchersI = self.watchers.length;
      while (updateAndTriggerWatchersI) {
        updateAndTriggerWatchersI -= 1;
        self.watchers[updateAndTriggerWatchersI].update();
      }

      updateAndTriggerWatchersI = self.watchers.length;
      while (updateAndTriggerWatchersI) {
        updateAndTriggerWatchersI -= 1;
        self.watchers[updateAndTriggerWatchersI].triggerCallbacks();
      }
    };

    this.createCustomContainer = () => new ScrollMonitorContainer();

    this.update = () => {
      calculateViewport();
      updateAndTriggerWatchersInConstructor();
    };

    this.recalculateLocations = () => {
      this.documentHeight = 0;
      this.update();
    };

    this.destroy = () => {};
  } // constructor end

  listenToDOM() {
    if (isInBrowser) {
      if (window.addEventListener) {
        if (this.item === document.body) {
          window.addEventListener('scroll', this.DOMListener);
        } else {
          this.item.addEventListener('scroll', this.DOMListener);
        }
        window.addEventListener('resize', this.DOMListener);
      } else {
        // Old IE support
        if (this.item === document.body) {
          window.attachEvent('onscroll', this.DOMListener);
        } else {
          this.item.attachEvent('onscroll', this.DOMListener);
        }
        window.attachEvent('onresize', this.DOMListener);
      }
      this.destroy = () => {
        if (window.addEventListener) {
          if (this.item === document.body) {
            window.removeEventListener('scroll', this.DOMListener);
            this.containerWatcher.destroy();
          } else {
            this.item.removeEventListener('scroll', this.DOMListener);
          }
          window.removeEventListener('resize', this.DOMListener);
        } else {
          // Old IE support
          if (this.item === document.body) {
            window.detachEvent('onscroll', this.DOMListener);
            this.containerWatcher.destroy();
          } else {
            this.item.detachEvent('onscroll', this.DOMListener);
          }
          window.detachEvent('onresize', this.DOMListener);
        }
      };
    }
  }

  // DOMListener(event) {
  //   console.log('got scroll');
  //   this.setStateFromDOM(event);
  //   this.updateAndTriggerWatchers(event);
  // }

  setStateFromDOM(event) {
    const viewportTop = scrollTop(this.item);
    const viewportHeight = getViewportHeight(this.item);
    const contentHeight = getContentHeight(this.item);

    this.setState(viewportTop, viewportHeight, contentHeight, event);
  }

  setState(newViewportTop, newViewportHeight, newContentHeight, event) {
    const needsRecalcuate = (newViewportHeight !== this.viewportHeight) ||
     (newContentHeight !== this.contentHeight);
    this.latestEvent = event;
    this.viewportTop = newViewportTop;
    this.viewportHeight = newViewportHeight;
    this.viewportBottom = newViewportTop + newViewportHeight;
    this.contentHeight = newContentHeight;

    if (needsRecalcuate) {
      let i = this.watchers.length;
      while (i) {
        i -= 1;
        this.watchers[i].recalculateLocation();
      }
    }
    this.updateAndTriggerWatchers(event);
  }

  updateAndTriggerWatchers(event) {
    let i = this.watchers.length;
    while (i) {
      i -= 1;
      this.watchers[i].update();
    }

    i = this.watchers.length;
    while (i) {
      i -= 1;
      this.watchers[i].triggerCallbacks(event);
    }
  }

  createContainer(item) {
    if (typeof item === 'string') {
      item = document.querySelector(item);
    } else if (item && item.length > 0) {
      item = item[0];
    }
    const container = new ScrollMonitorContainer(item, this);
    container.setStateFromDOM();
    container.listenToDOM();
    return container;
  }

  create(item, offsets) {
    if (typeof item === 'string') {
      item = document.querySelector(item);
    } else if (item && item.length > 0) {
      item = item[0];
    }
    const watcher = new Watcher(this, item, offsets);
    this.watchers.push(watcher);
    return watcher;
  }

  beget(item, offsets) {
    return this.create(item, offsets);
  }
}
