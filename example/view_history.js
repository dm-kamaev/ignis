'use strict';







exports.page = function page(step) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

      <title>Document</title>
      <style>
        .red, .error{
          border-color:red;
          color: red;
        }
        .red:hover{
          border-color:red;
        }

        .global-spinner {
          position:fixed;
          width:100%;
          left:0;right:0;top:0;bottom:0;
          background-color: rgba(255,255,255,0.7);
          z-index:9999;
          display:none;
        }
      </style>
    </head>
    <body>
      <div class=columns style="margin:0 auto">
        <header style=display:block;><h2 class=title>Header</h2></header>
        <main class="column is-one-quarter is-offset-4">
          <div class="card" style=margin-top:16px>
            <div class="card-content">
              ${exports.step('ljsfs', step)}
            </div>
          </div>
        </main>
        <footer><h2 class=title>Footer</h2></footer>
      </div>



      <div style=display:none; class="global-spinner">
        <div style="margin:auto"><img src="https://risk-monitoring.ru/img/preloader_grey.gif" alt=""/></div>
      </div>

      <script src="/stat/example/dist/example.js"></script>
    </body>
  </html>
  `;
}


exports.step = function step(id, step = 'step1') {
  return `
    <div id=${id} class="content" style="margin:0 auto;text-align:center">
      <p style=text-align:center>${step === 'step1' ? 'Step 1' : step === 'step2' ? 'Step 2' : step === 'step3' ? 'Step 3' : 'Finish'}</p>
      ${
        step === 'step3' ?
        `<button data-i-ev="click->GET:/page/step2" data-i-push-url data-i-output-id=${id} class=button>Prev step</button>
        <button data-i-ev="click->GET:/page/finish_step" data-i-push-url data-i-output-id=${id} class=button>Finish</button>` :
        step === 'step2' ?
        `<button data-i-ev="click->GET:/page/step1" data-i-push-url data-i-output-id=${id} class=button>Prev step</button>
        <button data-i-ev="click->GET:/page/step3" data-i-push-url data-i-output-id=${id} class=button>Next step</button>`
        :
        `<button data-i-ev="click->GET:/page/step2" data-i-push-url data-i-output-id=${id} class=button>Next step</button>`
      }
    </div>
  `;
}
