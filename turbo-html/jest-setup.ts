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
  equal_content(received_id: string, content: string) {
    // console.log('SELECTOR', selector);
    var found = document.getElementById(received_id)?.outerHTML;
    const convert = (str) => ('' || str).replace(/\s+/g, ' ').trim();
    if (convert(found) === convert(content)) {
      return {
        message: () =>
          `expected "${found}" equal "${content}"`,
        pass: true,
      };
    } else {
      console.log(`|${found}|`, 'equal', `|"${content}"|`);
      return {
        message: () =>
          `expected "${found}" not be equal "${content}"`,
        pass: false,
      };
    }
  },
});

