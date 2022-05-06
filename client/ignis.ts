import axios from 'axios';

import Manager_El from './Manager_El';
import { I_life_hooks } from './I_life_hooks';

function start(options: { onError?(err: Error | any): void; longRequest?: { start(): void; end(): void }; requestTimeout?: number} = {}) {
  const life_hooks: I_life_hooks = {
    onError: options.onError || function(){},
    longRequest: options.longRequest || {
      start() {},
      end() {}
    },
  };

  const timeout = options.requestTimeout ?? 0;

  const req = axios.create({
    timeout,
    // validateStatus(status) {
    //   return status === 200 || status === 302 || status === 301;
    // },
  });

  const manager_el = new Manager_El(life_hooks, req).start();
  const ATTR_EV = 'data-i-ev';

  const observer = new MutationObserver(mutationRecords => {
    for (let mutation of mutationRecords) {
      for(let node of Array.from(mutation.addedNodes)) {
        // отслеживаем только узлы-элементы, другие (текстовые) пропускаем
        if (!(node instanceof HTMLElement)) { continue; }

        // проверить, не является ли вставленный элемент примером кода
        if (node.matches(Manager_El.get_selector())) {
          manager_el.append([ node ]);
        }

        // или, может быть, пример кода есть в его поддереве?
        manager_el.append(Manager_El.get_els(node));

      }
      //
      if (mutation.type === 'attributes' && mutation.attributeName === ATTR_EV) {
        const t = mutation.target;
        manager_el.bindings_new_cmds(t as HTMLElement);
      }
    }
  });

  // наблюдать за всем, кроме атрибутов
  observer.observe(document.body, {
    childList: true, // наблюдать за непосредственными детьми
    subtree: true, // и более глубокими потомками
    attributes: true,
    attributeFilter: [ATTR_EV],
  });
}

export default { start };