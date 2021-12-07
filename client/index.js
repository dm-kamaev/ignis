import axios from 'axios';

import Manager_Form from './Manager_Form';
import Manager_Event from './Manager_Event';

function start(options = {}) {
  const life_hooks = {
    onError: options.onError || function(){},
    longRequest: options.longRequest || {
      start() {},
      end() {}
    },
  };

  const timeout = options.requestTimeout ?? 0;

  const req = axios.create({ timeout });

  const manager_form = new Manager_Form(life_hooks, req).start();
  const manager_event = new Manager_Event(life_hooks, req).start();

  const observer = new MutationObserver(mutationRecords => {
    for (let mutation of mutationRecords) {
      // console.log(mutation);
      for(let node of mutation.addedNodes) {
        // отслеживаем только узлы-элементы, другие (текстовые) пропускаем
        if (!(node instanceof HTMLElement)) { continue; }

        // проверить, не является ли вставленный элемент примером кода
        if (node.matches(Manager_Form.get_selector())) {
          manager_form.append([ node ]);
        }
        if (node.matches(Manager_Event.get_selector())) {
          manager_event.append([ node ]);
        }

        // или, может быть, пример кода есть в его поддереве?
        manager_form.append(Manager_Form.get_els(node));
        manager_event.append(Manager_Event.get_els(node));

      }
    }
  });

  // наблюдать за всем, кроме атрибутов
  observer.observe(document.body, {
    childList: true, // наблюдать за непосредственными детьми
    subtree: true, // и более глубокими потомками
    // attributes: true,
  });
}

export default { start };