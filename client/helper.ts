const D = document;
export const getById = id => document.getElementById(id) as HTMLElement;

const H = D.getElementsByTagName('head')[0];
function crEl(t, a, s, e?: any) { e = D.createElement(t); setArray(a, function (i, v) { e[v[0]] = v[1]; }); if (s) { e.appendChild(D.createTextNode(s)); } return e; }
function setArray(a, f) { for (var i = 0, l = a.length; i < l; i++) { if (a[i] !== undefined) { f(i, a[i]); } } }

export function addCss(code: string, file_url?: string) {
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
