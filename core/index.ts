// flag for show log
window['__turboHTML_DEBUG__'] = false;

import axios from 'axios';

import Manager from './src/Manager';
import enumAttr from './src/enumAttr';
import { ILifeHooks, ITurboHtmlOptions } from './src/type';
import { debounce } from './src/helperForBrowser';
import HttpError from './src/HttpError';

export { ITurboHtmlOptions } from './src/type';

export default class TurboHtml {
  private readonly _manager: Manager;
  private readonly _observer: MutationObserver;

  static HttpError = HttpError;

  constructor(options: ITurboHtmlOptions = {}) {
    options.root = options.root || document;
    const emptyFn = function () {};
    const lifeHooks: ILifeHooks = {
      onStartRequest: options.onStartRequest || emptyFn,
      onError: options.onError || emptyFn,
      onEndRequest: options.onEndRequest || emptyFn,
      onLongRequest: options.onLongRequest || {
        start() {},
        end() {}
      },
    };

    const timeout = options.requestTimeout ?? 0;

    const req = axios.create({
      timeout,
      // adapter: require('axios/lib/adapters/xhr'),
      // validateStatus(status) {
      //   return status === 200 || status === 302 || status === 301;
      // },
    });

    const manager = this._manager = new Manager(lifeHooks, options.headers, req).start(options.root);
    // start garbage collector
    document.addEventListener('turbo-html:garbage_collector', debounce(() => {
      manager.garbage_collector();
    }, 30000));

    this._observer = new MutationObserver(mutationRecords => {
      for (const mutation of mutationRecords) {
        for (const node of Array.from(mutation.addedNodes)) {
          // We tracking only element nodes  another will skipped (text nodes)
          if (!(node instanceof HTMLElement)) { continue; }

          // Is node contains attribute ("data-i-ev")?
          if (node.matches(Manager.get_selector())) {
            manager.append([ node ]);
          }

          // We append children of node which contain attribute ("data-i-ev")
          manager.append(Manager.extract_els(node));

        }

        // We check attribute "data-i-ev" is changed
        if (mutation.type === 'attributes' && mutation.attributeName === enumAttr.EV) {
          const t = mutation.target;
          manager.bindings_new_cmds(t as HTMLElement);
        }
      }
    });

    // наблюдать за всем, кроме атрибутов
    this._observer.observe(document.body, {
      childList: true, // наблюдать за непосредственными детьми
      subtree: true, // и более глубокими потомками
      attributes: true,
      attributeFilter: [enumAttr.EV],
    });
  }

  exec($el: HTMLElement, name: string) {
    this._manager.exec($el, name);
  }

  stop() {
    this._observer.disconnect();
    this._manager.destroy();
  }
}

