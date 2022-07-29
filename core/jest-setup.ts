export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      // toBeOdd(): R;
      equal_content(content: string): R;
    }
  }
}

expect.extend({
  equal_content(received_id: string, expected: string) {
    // console.log('SELECTOR', selector);
    const found = decodeHtml(document.getElementById(received_id)?.outerHTML);
    // console.log(decodeHtml(found));
    const convert = (str) => ('' || str).replace(/(\s+)(>)/g, '$2').replace(/\s+/g, ' ').trim();
    if (convert(found) === convert(expected)) {
      return {
        message: () =>
          `expected "${expected}" equal "${found}"`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected "${expected}" not be equal "${found}"`,
        pass: false,
      };
    }
  },
});


function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
