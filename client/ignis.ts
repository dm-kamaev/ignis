import axios from 'axios';

import Manager from './Manager';
import enum_attr from './enum_attr';
import { I_life_hooks } from './interface';
import { debounce } from './helper';

function start(options: { onError?(err: Error | any): void; longRequest?: I_life_hooks['longRequest']; requestTimeout?: number} = {}) {
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
    // validateStatus(status) {
    //   return status === 200 || status === 302 || status === 301;
    // },
  });

  const manager = new Manager(life_hooks, req).start();
  // start garbage collector
  document.addEventListener('ignis-html:garbage_collector', debounce(() => {
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