import parserDelay from '../src/util/parserDelay';


describe('parserDelay', function () {
  it.each([[ '1', 'ms', { delay: 1, measure: 'ms' }], [ '1', 's', { delay: 1000, measure: 's' }], [ '1', 'm', { delay: 60000, measure: 'm' }]])('parserDelay(%s, %s)', function (number, measure, expected) {
    const result = parserDelay(number, measure, '');
    expect(result.delay).toEqual(expected.delay);
    expect(result.measure).toEqual(expected.measure);
  });

  it('invalid measure', function () {
    expect(() => parserDelay('1', 'sec', '')).toThrowError();
  });
});
