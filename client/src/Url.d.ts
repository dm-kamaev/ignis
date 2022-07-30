export default class Url {
    private _url;
    constructor(url: string);
    get(): string;
    form_add_to_url(data: Record<string, any>): string;
    private _create_url_obj;
    private _is_absolute_url;
}
