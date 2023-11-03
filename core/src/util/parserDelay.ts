export default function parserDelay(input_number: string, input_measure: string, el: string) {
  const number = parseFloat(input_number.trim());
  const measure = input_measure.trim() as 'ms' | 's' | 'm';
  let delay: number;
  switch (measure) {
    case 'ms':
      delay = number;
      break;
    case 's':
      delay = number * 1000;
      break;
    case 'm':
      delay = number * 1000 * 60;
      break;
    default:
      throw new Error(`[turbo-html]: Invalid measure ${el}`);
  }
  return { delay, measure };
}
