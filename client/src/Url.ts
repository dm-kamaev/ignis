export default class Url {
  private _url: URL;
  constructor(url: string) {
    this._url = this._create_url_obj(url);
  }

  get() {
    return this._url.href;
  }

  form_add_to_url(data: Record<string, any>) {
    const url_obj = this._url;
    Object.keys(data).forEach(k => {
      url_obj.searchParams.append(k, data[k]);
    });
    return url_obj.href;
  }

  private _create_url_obj(url: string) {
    return this._is_absolute_url(url) ? new URL(url) : new URL(url, document.baseURI);
  }

  private _is_absolute_url(url: string) {
    return new RegExp('^(https?:)?//').test(url);
  }
}
