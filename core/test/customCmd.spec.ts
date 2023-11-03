import { Every, Exec, KeydownAlias } from '../src/customCmd';


describe('custom command and alias', function () {
  it('Exec', function () {
    expect(() => new Exec('@exec)(')).toThrowError();
    expect(() => new Exec('@exec()')).toThrowError();
    expect(() => new Exec('@exec(1)')).toThrowError();
  });

  it('Every', function () {
    expect(() => new Every('@every)(')).toThrowError();
    expect(() => new Exec('@every(1)')).toThrowError();
  });

  it('KeydownAlias', function () {
    expect(() => new KeydownAlias('@keydown)(')).toThrowError();
    expect(() => new KeydownAlias('@keydown(enter)')).toThrowError();
    expect(() => new KeydownAlias('@keydown(,submit)')).toThrowError();
    expect(() => new KeydownAlias('@keydown(enter)')).toThrowError();
  });
});
