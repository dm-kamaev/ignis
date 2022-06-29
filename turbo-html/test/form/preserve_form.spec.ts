import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';

type T_data = { name: string, year: number, variant: string[], type: string, person: string };
type T_err = { name?: string, year?: string, variant?: string, type?: string, person?: string };


describe('[Preserve form]', function () {
  let abort;
  const ID = 'test';

  beforeAll(async () => {
    abort = before_start();
  });

  afterAll(async () => {
    abort();
  });

  it('Form with errors and preserve value for fields', async function () {
    const text = {
      name: 'Name is too short',
      year: 'Year must be number',
      variant: 'You must check all checkboxes',
      type: 'Incorrect type',
      person: 'Incorrect name',
    };
    nock('http://localhost')
      .post('/api/book')
      .reply(200, function (uri, data: T_data) {
        const errors: T_err = {} as T_err;
        if (data.name.length < 3) {
          errors.name = text.name;
        }

        if (typeof data.year !== 'number') {
          errors.year = text.year;
        }

        if (data.variant[0] !== 'v1' || data.variant[1] !== 'v2') {
          errors.variant = text.variant;
        }

        if (data.type !== 'example') {
          errors.type = text.type;
        }

        if (data.person !== 'Robert') {
          errors.person = text.person;
        }

        return view_form(this.req.headers['x-ignis-id'], `POST:/api/book`, data, errors as any);
    });
    const data: T_data = { name: 'Va', year: '1850' as any, variant: ['v1'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(ID, `POST:/api/book`, data);
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('submit'));
    await timeout(100); // wait submit

    ['name', 'year', 'person'].forEach(key => {
      expect((document.getElementById(key) as HTMLInputElement).value).toEqual(data[key]);
      expect(document.getElementById(key + '_error')?.textContent).toEqual(text[key]);
    });

    expect((document.getElementById('v1') as HTMLInputElement).checked).toBeTruthy();
    expect((document.getElementById('v2') as HTMLInputElement).checked).toBeFalsy();
    expect(document.getElementById('variant_error')?.textContent).toEqual(text.variant);

    expect((document.querySelector('input[name="type"]:checked') as HTMLInputElement).value).toEqual(data.type);
    expect(document.getElementById('type_error')?.textContent).toEqual(text.type);
  });

});


function view_form(id: string, url: string, { name, year, variant, type, person }: T_data, errors: T_err = {}) {
  const manager_err = {
    _has_err: Object.keys(errors).length,
    get<K extends keyof T_data>(k: K) {
      return errors[k] || '';
    },
    set_preserve_attr() { return this._has_err ? 'data-i-preserve' : '' },
  };

  return `
      <form
        action="#"
        id="${id}"
        data-i-ev="submit->${url}"
        class="box"
      >

        <div style=margin-top:16px; class=field>
          <label for="" class=label>Name:</label>
          <div class=control>
            <input id=name type="text" name=name class="input" value="${name || ''}" ${manager_err.set_preserve_attr()}>
          </div>
          <p id=name_error class=error>${manager_err.get('name')}</p>
        </div>

        <div style=margin-top:16px; class=field>
          <label for="" class=label>Year:</label>
          <div class=control>
            <input id=year type="number" name=year pattern="\d+" min="0" class="input" value="${year || ''}" ${manager_err.set_preserve_attr()}>
          </div>
          <p id=year_error class=error>${manager_err.get('year')}</p>
        </div>

        <div style=margin-top:16px;display:flex; class=field>
          <div>
            <label class="checkbox">
              <input id=v1 type="checkbox" name=variant value=v1 class=checkbox ${variant.includes('v1') ? 'checked=checked' : ''} ${manager_err.set_preserve_attr()}>
              Variant 1
            </label>
          </div>
          <div style=margin-left:8px>
            <label class="checkbox">
              <input id=v2 type="checkbox" name=variant value=v2 class=checkbox ${variant.includes('v2') ? 'checked=checked' : ''} ${manager_err.set_preserve_attr()}>
              Varint 2
            </label>
          </div>
          <p id=variant_error class=error>${manager_err.get('variant')}</p>
        </div>


        <div style=margin-top:8px; class=field>
          <label for="" class=field>Types of literature:</label>
          <div class="control">

            ${// eslint-disable-next-line max-len
              ['Fiction', 'Documentary prose', 'Memoir literature', 'Scientific and popular science literature', 'Reference literature', 'Educational literature', 'Technical literature', 'Literature on psychology and self-development'].map((el, i) => {
              const id = `v${i+1}`;
              return `
                <div>
                  <label for=${id} class="radio">
                    <input type="radio" id=${id} value="${el}" name="type" ${type === el ? 'checked' : ''} ${manager_err.set_preserve_attr()} >
                    ${el}
                  </label>
                </div>
              `;
            }).join('')}
          </div>
          <p id=type_error class=error>${manager_err.get('type')}</p>
        </div>

        <div style=margin-top:16px>
          <select id=person name="person" class=select ${manager_err.set_preserve_attr()}>
            <option>Выберите героя</option>
            <option value="Aleksandr" ${person === 'Aleksandr' ? 'selected' : ''}>Aleksandr</option>
            <option value="Aleksey" ${person === 'Aleksey' ? 'selected' : ''}>Aleksey</option>
            <option value="Anton" ${person === 'Anton' ? 'selected' : ''}>Anton</option>
            <option value="Artur" ${person === 'Artur' ? 'selected' : ''}>Artur</option>
          </select>
          <p id=person_error class=error>${manager_err.get('person')}</p>
        </div>

        <div style=margin-top:16px>
          <button type="submit" class="button is-primary">Create</button>
        </div>
      </form>
  `;
}