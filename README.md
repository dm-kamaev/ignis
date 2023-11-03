# Turbo Html

[![Actions Status](https://github.com/dm-kamaev/turbo-html/workflows/Build/badge.svg)](https://github.com/dm-kamaev/turbo-html/actions) ![Coverage](https://github.com/dm-kamaev/turbo-html/blob/master/badges/coverage.svg)

In browser:
```js
import TurboHtml from '@ignis-web/turbo-html/client';
// on server-side (Node js)
// import { commands } from '@ignis-web/turbo-html/commands';


new TurboHtml({
  onError(err) {
    console.log('Request error', err, JSON.stringify(err));
  },
  requestTimeout: 10000,
  onLongRequest: {
    start() {
      console.log('Show Loader');
      document.querySelector('.global-spinner').style.display = 'flex';
    },
    end() {
      document.querySelector('.global-spinner').style.display = 'none';
      console.log('End Loader');
    }
  }
});
```

<!-- https://gomakethings.com/how-to-turn-any-github-repo-into-a-cdn/#:~:text=Here's%20how%20it%20works.,repository%20name%20for%20the%20project.&text=You%20can%20also%20take%20advantage,number%7D%20to%20the%20repository%20name. -->
```js
  <script src="https://cdn.jsdelivr.net/gh/dm-kamaev/turbo-html/turbo-html/index.ts"></script>
  <script src="https://cdn.jsdelivr.net/gh/dm-kamaev/turbo-html@2.0.0/client/index.js"></script>
  <script>
    new TurboHtml({
      onError(err) {
        console.log('Request error', err, JSON.stringify(err));
      },
      requestTimeout: 10000,
      onLongRequest: {
        start() {
          console.log('Show Loader');
          document.querySelector('.global-spinner').style.display = 'flex';
        },
        end() {
          document.querySelector('.global-spinner').style.display = 'none';
          console.log('End Loader');
        }
      }
    });
  </script>
```