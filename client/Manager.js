import morphdom from 'morphdom';


export default class Manager {
  constructor($els, life_hooks) {
    this.$els = $els;
    this.life_hooks = life_hooks;
    // this._hash_requested_url = {};
  }

  get_target(e) { return e && e.target || e.srcElement; }

  append($els) {
    this._list = this._list.concat($els.map($el => this._add_listener($el)));
  }

  add_special_params(url, { id, output_id }) {
    const url_obj = this._create_url_obj(url);
    if (id) {
      url_obj.searchParams.append('__self_id', id);
    }
    if (output_id) {
      url_obj.searchParams.append('__output_id', output_id);
    }
    return url_obj.href;
  }

  form_add_to_url(url, data) {
    const url_obj = this._create_url_obj(url);
    Object.keys(data).forEach(k => {
      url_obj.searchParams.append(k, data[k]);
    });
    return url_obj.href;
  }

  _exec({ ev, data }, url) {
    if (ev === 'update') {
      const { html, css } = data;
      const id = this._extract_id(html);
      console.log({ id, html });
      this._apply_css(css, url);

      // this._list.find(({ el }) => el === $el).unsubscribe();

      // this._list = this._list.filter(({ el }) => el !== $el);
      this.render(id, html);
      // this._list.push(this._add_listener(document.getElementById(id)));
    } else if (ev === 'remove') {
      getById(data.id).outerHTML = '';
    } else if (ev === 'append_to_top') {
      const { id, html, css } = data;
      this._apply_css(css, url);
      getById(id).insertAdjacentHTML('afterBegin', html);
    } else if (ev === 'append_to_end') {
      const { id, html, css } = data;
      this._apply_css(css, url);
      getById(id).insertAdjacentHTML('beforeEnd', html);
    } else {
      throw new Error('Invalid command ' + JSON.stringify({ ev, data }));
    }
  }

  handle_response({ config, data }) {
    const url_obj = new URL(config.url);
    const url = url_obj.origin + url_obj.pathname;

    if (data instanceof Array) {
      data.forEach(cmd => this._exec(cmd, url));
    } else if (data) {
      this._exec({ ev: 'update', data: { html: data, css: null } }, url);
    }

    // We store requested url for avoid repeat adding css
    // this._hash_requested_url[url] = true;
  }

  handler_error(err) {
    this.life_hooks.onError(err);
  }

  render(id, html) {
    morphdom(document.getElementById(id), html, options);
  }

  _is_absolute_url(url) {
    return new RegExp('^(https?:)?//').test(url);
  }

  _create_url_obj(url) {
    return this._is_absolute_url(url) ? new URL(url) : new URL(url, document.baseURI);
  }

  _apply_css(css, _url) {
    // if (css && !this._hash_requested_url[url]) {
    if (css) {
      addCss(css);
    }
  }

  _extract_id(html) {
    const m = html.match(/d=([^>\s]+)/);
    const id = m[1];
    if (!id) {
      throw new Error('Not found id in html: ' + html);
    }
    return id;
  }

}

const ATTR_USE_PREV_VALUE = 'data-ignis-use-prev-value';

const options = {
  onBeforeElUpdated: function (fromEl, toEl) {
    if (toEl.tagName === 'INPUT') {
      const use_prev_value = toEl.hasAttribute(ATTR_USE_PREV_VALUE);
      if ((toEl.type === 'checkbox' || toEl.type === 'radio') && use_prev_value) {
        toEl.checked = fromEl.checked;
      } else if (toEl.type === 'file' && use_prev_value) {
        toEl.files = fromEl.files;
      } else if (use_prev_value) {
        toEl.value = fromEl.value;
      }
    } else if (toEl.tagName === 'SELECT' && toEl.hasAttribute(ATTR_USE_PREV_VALUE)) {
      toEl.value = fromEl.value;
    }
  }
};


const D = document;
const getById = id => document.getElementById(id);

const H = D.getElementsByTagName('head')[0];
function crEl(t, a, s, e) { e = D.createElement(t); setArray(a, function (i, v) { e[v[0]] = v[1]; }); if (s) { e.appendChild(D.createTextNode(s)); } return e; }
function setArray(a, f) { for (var i = 0, l = a.length; i < l; i++) { if (a[i] !== undefined) { f(i, a[i]); } } }

function addCss(code, file_url) {
  if (code) {
    H.appendChild(crEl('style', [], code));
  }
  if (file_url) {
    var link = D.createElement('link');
    // link.id   = cssId;
    link.rel = 'stylesheet';
    // link.type = 'text/css';
    link.href = file_url;
    // link.media = 'all';
    H.appendChild(link);
  }
}