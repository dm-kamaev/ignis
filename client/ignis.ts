import axios from 'axios';

import Manager from './Manager';
import enum_attr from './enum_attr';
import { I_life_hooks } from './interface';

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

  const manager = new Manager(life_hooks, req).start();

  const observer = new MutationObserver(mutationRecords => {
    for (let mutation of mutationRecords) {
      for(let node of Array.from(mutation.addedNodes)) {
        // отслеживаем только узлы-элементы, другие (текстовые) пропускаем
        if (!(node instanceof HTMLElement)) { continue; }

        // проверить, не является ли вставленный элемент примером кода
        if (node.matches(Manager.get_selector())) {
          manager.append([ node ]);
        }

        // или, может быть, пример кода есть в его поддереве?
        manager.append(Manager.get_els(node));

      }
      //
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
}

export default { start };