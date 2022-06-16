export default function timeout(t) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, t);
  });
}