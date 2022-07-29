// flag for show log
window['__turboHTML_DEBUG__'] = false;

import axios from 'axios';

import Manager from './src/Manager';
import enum_attr from './src/enum_attr';
import { I_life_hooks, I_class_form_data } from './src/interface';
import { debounce } from './src/helper';


function start(options: { root?: Document | HTMLElement; onError?(err: Error | any): void; longRequest?: I_life_hooks['longRequest']; requestTimeout?: number, __FormData?: I_class_form_data} = {}) {
  options.root = options.root || document;
  options.__FormData = options.__FormData || FormData;
  const life_hooks: I_life_hooks = {
    onError: options.onError || function(){},
    longRequest: options.longRequest || {
      start() {},
      stop() {}
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

  const manager = new Manager(life_hooks, req, options.__FormData).start(options.root);
  // start garbage collector
  document.addEventListener('turbo-html:garbage_collector', debounce(() => {
    manager.garbage_collector();
  }, 30000));

  const observer = new MutationObserver(mutationRecords => {
    for (let mutation of mutationRecords) {
      for(let node of Array.from(mutation.addedNodes)) {
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
      if (mutation.type === 'attributes' && mutation.attributeName === enum_attr.EV) {
        const t = mutation.target;
        manager.bindings_new_cmds(t as HTMLElement);
      }
    }
  });

  // наблюдать за всем, кроме атрибутов
  observer.observe(document.body, {
    childList: true, // наблюдать за непосредственными детьми
    subtree: true, // и более глубокими потомками
    attributes: true,
    attributeFilter: [enum_attr.EV],
  });

  return function () {
    observer.disconnect();
    manager.destroy();
  };
}

export default { start };