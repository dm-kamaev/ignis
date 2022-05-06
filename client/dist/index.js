/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 99:
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
System.register("I_life_hooks", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ;
        }
    };
});
System.register("Manager", ["morphdom"], function (exports_2, context_2) {
    "use strict";
    var morphdom_1, Manager, ATTR_USE_PREV_VALUE, get_options, D, getById, H, El;
    var __moduleName = context_2 && context_2.id;
    function crEl(t, a, s, e) { e = D.createElement(t); setArray(a, function (i, v) { e[v[0]] = v[1]; }); if (s) {
        e.appendChild(D.createTextNode(s));
    } return e; }
    function setArray(a, f) { for (var i = 0, l = a.length; i < l; i++) {
        if (a[i] !== undefined) {
            f(i, a[i]);
        }
    } }
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
    return {
        setters: [
            function (morphdom_1_1) {
                morphdom_1 = morphdom_1_1;
            }
        ],
        execute: function () {
            Manager = /** @class */ (function () {
                function Manager(life_hooks) {
                    this.life_hooks = life_hooks;
                    this.list = [];
                }
                Manager.prototype.append = function ($els) {
                    var _this = this;
                    // console.log($els, '|', this.list);
                    this.list = this.list.concat($els.map(function ($el) { return _this._subscribe($el); }));
                };
                Manager.prototype.bindings_new_cmds = function ($el) {
                    var _this = this;
                    var found = this.list.find(function (el) { return el.$el === $el; });
                    if (!found) {
                        return;
                    }
                    var cache = found.cmds;
                    var cmds = this.parse_cmds($el);
                    var new_cmds = [];
                    cmds.forEach(function (cmd) {
                        if (!cache.find(function (el) { return el.name === cmd.name; })) {
                            _this._bind_cmd($el, cmd);
                            new_cmds.push(cmd);
                        }
                    });
                    found.cmds = found.cmds.concat(new_cmds);
                };
                Manager.prototype._subscribe = function ($el) {
                    var _this = this;
                    var cmds = this.parse_cmds($el);
                    cmds.forEach(function (cmd) { return _this._bind_cmd($el, cmd); });
                    return new El($el, cmds);
                };
                Manager.prototype._bind_cmd = function ($el, _a) {
                    var _this = this;
                    var name = _a.name;
                    // console.log($el, { name, method, url, cb });
                    var cb = function (e) {
                        var cmd = _this.parse_cmds($el).find(function (el) { return el.name === name; });
                        if (!cmd) {
                            var found = _this.list.find(function (el) { return el.$el === $el; });
                            if (found) {
                                found.cmds = found.cmds.filter(function (el) { return el.name !== name; });
                            }
                            return $el.removeEventListener(name, cb);
                        }
                        if (name === 'submit') {
                            _this._cb_form(e, $el, cmd);
                        }
                        else {
                            _this._cb_el(e, $el, cmd);
                        }
                    };
                    $el.addEventListener(name, cb);
                };
                Manager.prototype._cb_form = function (e, $el, cmd) {
                };
                Manager.prototype._cb_el = function (e, $el, cmd) {
                };
                Manager.prototype.parse_cmds = function ($el) {
                    var _this = this;
                    var cmds_str = $el.getAttribute('data-i-ev').trim().split(/\s+/);
                    return cmds_str.map(function (el) { return _this.parse_cmd(el); });
                };
                Manager.prototype.parse_cmd = function (cmd) {
                    var _a = cmd.split('->'), name = _a[0], method_url = _a[1], _ = _a[2];
                    var m = method_url.match(/(\w+):(.+)/);
                    var method = m[1].trim();
                    var url = m[2];
                    return { name: name, method: method, url: url };
                };
                Manager.prototype.get_target = function (e) { return e && e.target || e.srcElement; };
                Manager.prototype.add_special_params = function (url, _a) {
                    var id = _a.id, output_id = _a.output_id;
                    var url_obj = this._create_url_obj(url);
                    if (id) {
                        url_obj.searchParams.append('__self_id', id);
                    }
                    if (output_id) {
                        url_obj.searchParams.append('__output_id', output_id);
                    }
                    return url_obj.href;
                };
                Manager.prototype.form_add_to_url = function (url, data) {
                    var url_obj = this._create_url_obj(url);
                    Object.keys(data).forEach(function (k) {
                        url_obj.searchParams.append(k, data[k]);
                    });
                    return url_obj.href;
                };
                Manager.prototype._exec = function (_a, url) {
                    var ev = _a.ev, data = _a.data;
                    if (ev === 'update') {
                        var html = data.html, css = data.css;
                        var id = this._extract_id(html);
                        console.log({ id: id, html: html });
                        this._apply_css(css, url);
                        // this._list.find(({ el }) => el === $el).unsubscribe();
                        // this._list = this._list.filter(({ el }) => el !== $el);
                        this._render(id, html);
                        // this._list.push(this._add_listener(document.getElementById(id)));
                    }
                    else if (ev === 'remove') {
                        getById(data.id).outerHTML = '';
                    }
                    else if (ev === 'append_to_top') {
                        var id = data.id, html = data.html, css = data.css;
                        this._apply_css(css, url);
                        getById(id).insertAdjacentHTML('afterbegin', html);
                    }
                    else if (ev === 'append_to_end') {
                        var id = data.id, html = data.html, css = data.css;
                        this._apply_css(css, url);
                        getById(id).insertAdjacentHTML('beforeend', html);
                    }
                    else {
                        throw new Error('Invalid command ' + JSON.stringify({ ev: ev, data: data }));
                    }
                };
                Manager.prototype.handle_response = function (resp) {
                    var _this = this;
                    var config = resp.config, data = resp.data;
                    console.log(resp.request);
                    var url_obj = new URL(config.url);
                    var url = url_obj.origin + url_obj.pathname;
                    if (data instanceof Array) {
                        data.forEach(function (cmd) { return _this._exec(cmd, url); });
                    }
                    else if (data) {
                        this._exec({ ev: 'update', data: { html: data, css: null } }, url);
                    }
                    // We store requested url for avoid repeat adding css
                    // this._hash_requested_url[url] = true;
                };
                Manager.prototype.handler_error = function (err) {
                    this.life_hooks.onError(err);
                };
                Manager.prototype._render = function (id, html) {
                    morphdom_1.default(getById(id), html, get_options());
                };
                Manager.prototype._is_absolute_url = function (url) {
                    return new RegExp('^(https?:)?//').test(url);
                };
                Manager.prototype._create_url_obj = function (url) {
                    return this._is_absolute_url(url) ? new URL(url) : new URL(url, document.baseURI);
                };
                Manager.prototype._apply_css = function (css, _url) {
                    // if (css && !this._hash_requested_url[url]) {
                    if (css) {
                        addCss(css);
                    }
                };
                Manager.prototype._extract_id = function (html) {
                    var m = html.match(/d=([^>\s]+)/);
                    if (!m) {
                        throw new Error('Not found id in html: ' + html);
                    }
                    var id = m[1];
                    if (!id) {
                        throw new Error('Not found id in html: ' + html);
                    }
                    return id;
                };
                return Manager;
            }());
            exports_2("default", Manager);
            ATTR_USE_PREV_VALUE = 'data-i-preserve';
            get_options = function () {
                return {
                    onBeforeElUpdated: function (fromEl, toEl) {
                        // if (toEl.tagName === 'FORM') {
                        //   console.log({ fromEl, toEl });
                        //   const found = list.find(el => fromEl === el);
                        //   console.log({ found });
                        //   console.log([fromEl.getAttribute('data-i-ev'), toEl.getAttribute('data-i-ev')]);
                        // }
                        if (toEl.tagName === 'INPUT') {
                            var use_prev_value = toEl.hasAttribute(ATTR_USE_PREV_VALUE);
                            if ((toEl.type === 'checkbox' || toEl.type === 'radio') && use_prev_value) {
                                toEl.checked = fromEl.checked;
                            }
                            else if (toEl.type === 'file' && use_prev_value) {
                                toEl.files = fromEl.files;
                            }
                            else if (use_prev_value) {
                                toEl.value = fromEl.value;
                            }
                        }
                        else if (toEl.tagName === 'SELECT' && toEl.hasAttribute(ATTR_USE_PREV_VALUE)) {
                            toEl.value = fromEl.value;
                        }
                    }
                };
            };
            D = document;
            getById = function (id) { return document.getElementById(id); };
            H = D.getElementsByTagName('head')[0];
            El = /** @class */ (function () {
                function El($el, cmds) {
                    this.$el = $el;
                    this.cmds = cmds;
                }
                return El;
            }());
        }
    };
});
System.register("Manager_El", ["forms_to_json", "Manager", "./Manager_Long_Request"], function (exports_3, context_3) {
    "use strict";
    var forms_to_json_1, Manager_1, Manager_Long_Request_1, Manager_El;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (forms_to_json_1_1) {
                forms_to_json_1 = forms_to_json_1_1;
            },
            function (Manager_1_1) {
                Manager_1 = Manager_1_1;
            },
            function (Manager_Long_Request_1_1) {
                Manager_Long_Request_1 = Manager_Long_Request_1_1;
            }
        ],
        execute: function () {
            Manager_El = /** @class */ (function (_super) {
                __extends(Manager_El, _super);
                function Manager_El(life_hooks, axios) {
                    var _this = _super.call(this, life_hooks) || this;
                    _this.axios = axios;
                    return _this;
                }
                Manager_El.get_selector = function () {
                    return '[data-i-ev]';
                };
                Manager_El.get_els = function (node) {
                    if (node === void 0) { node = document; }
                    return Array.from(node.querySelectorAll(Manager_El.get_selector()));
                };
                Manager_El.prototype.start = function () {
                    var $els = Manager_El.get_els();
                    this.append($els);
                    return this;
                };
                Manager_El.prototype._cb_form = function (e, $el, cmd) {
                    var _a;
                    e.preventDefault();
                    var axios = this.axios;
                    var id = $el.id;
                    var output_id = $el.getAttribute('data-i-output-id');
                    var url = cmd.url;
                    var enctype = (_a = $el.getAttribute('data-i-enctype')) === null || _a === void 0 ? void 0 : _a.trim();
                    var method = cmd.method;
                    if (!output_id) {
                        throw new Error('Not found id = ' + output_id);
                    }
                    if (!['GET', 'DELETE', 'POST', 'PUT'].includes(method)) {
                        throw new Error('Not valid method ' + method);
                    }
                    var $form = this.get_target(e);
                    var req;
                    var method_name = method.toLowerCase();
                    var headers = {
                        'X-Ignis-Html-Request': 'true',
                        'X-Ignis-Html-Id': id,
                        'X-Ignis-Output-Id': output_id,
                    };
                    if (method === 'GET' || method === 'DELETE') {
                        // TODO: encode query params
                        var json = new forms_to_json_1.default($form).parse();
                        console.log(json, method, url);
                        url = this.form_add_to_url(url, json);
                        req = axios[method.toLowerCase()](url, { headers: headers });
                    }
                    else { // POST, PUT
                        if (enctype === 'multipart/form-data') {
                            var formdata = new FormData($form);
                            console.log(formdata, method, url, output_id);
                            req = axios[method_name](url, formdata, { headers: headers });
                        }
                        else {
                            var json = new forms_to_json_1.default($form).parse();
                            console.log(json, method, url, output_id);
                            req = axios[method_name](url, json, { headers: headers });
                        }
                    }
                    var manager_long_request = new Manager_Long_Request_1.default(this.life_hooks.longRequest).start();
                    req.then(this.handle_response.bind(this)).catch(this.handler_error.bind(this)).finally(manager_long_request.end.bind(manager_long_request));
                };
                Manager_El.prototype._cb_el = function (e, $el, cmd) {
                    e.preventDefault();
                    var axios = this.axios;
                    var id = $el.id;
                    var output_id = $el.getAttribute('data-i-output-id');
                    var method = cmd.method;
                    var url = cmd.url;
                    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
                        throw new Error('Not valid method ' + method);
                    }
                    var method_name = method.toLowerCase();
                    var headers = {
                        'X-Ignis-Html-Request': 'true',
                        'X-Ignis-Html-Id': id,
                        'X-Ignis-Output-Id': output_id,
                    };
                    var req;
                    var str_data = $el.getAttribute('data-i-data');
                    var json = str_data ? JSON.parse(str_data) : {};
                    if (method === 'GET' || method === 'DELETE') {
                        console.log(json, method, url);
                        url = this.form_add_to_url(url, json);
                        req = axios[method_name](url, { headers: headers });
                    }
                    else if (method === 'POST' || method === 'PUT') {
                        req = axios[method_name](url, json, { headers: headers });
                    }
                    var manager_long_request = new Manager_Long_Request_1.default(this.life_hooks.longRequest).start();
                    req.then(this.handle_response.bind(this)).catch(this.handler_error.bind(this)).finally(manager_long_request.end.bind(manager_long_request));
                };
                return Manager_El;
            }(Manager_1.default));
            exports_3("default", Manager_El);
        }
    };
});
System.register("ignis", ["axios", "Manager_El"], function (exports_4, context_4) {
    "use strict";
    var axios_1, Manager_El_1;
    var __moduleName = context_4 && context_4.id;
    function start(options) {
        var _a;
        if (options === void 0) { options = {}; }
        var life_hooks = {
            onError: options.onError || function () { },
            longRequest: options.longRequest || {
                start: function () { },
                end: function () { }
            },
        };
        var timeout = (_a = options.requestTimeout) !== null && _a !== void 0 ? _a : 0;
        var req = axios_1.default.create({
            timeout: timeout,
            // validateStatus(status) {
            //   return status === 200 || status === 302 || status === 301;
            // },
        });
        var manager_el = new Manager_El_1.default(life_hooks, req).start();
        var ATTR_EV = 'data-i-ev';
        var observer = new MutationObserver(function (mutationRecords) {
            for (var _i = 0, mutationRecords_1 = mutationRecords; _i < mutationRecords_1.length; _i++) {
                var mutation = mutationRecords_1[_i];
                for (var _a = 0, _b = Array.from(mutation.addedNodes); _a < _b.length; _a++) {
                    var node = _b[_a];
                    // отслеживаем только узлы-элементы, другие (текстовые) пропускаем
                    if (!(node instanceof HTMLElement)) {
                        continue;
                    }
                    // проверить, не является ли вставленный элемент примером кода
                    if (node.matches(Manager_El_1.default.get_selector())) {
                        manager_el.append([node]);
                    }
                    // или, может быть, пример кода есть в его поддереве?
                    manager_el.append(Manager_El_1.default.get_els(node));
                }
                //
                if (mutation.type === 'attributes' && mutation.attributeName === ATTR_EV) {
                    var t = mutation.target;
                    manager_el.bindings_new_cmds(t);
                }
            }
        });
        // наблюдать за всем, кроме атрибутов
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [ATTR_EV],
        });
    }
    return {
        setters: [
            function (axios_1_1) {
                axios_1 = axios_1_1;
            },
            function (Manager_El_1_1) {
                Manager_El_1 = Manager_El_1_1;
            }
        ],
        execute: function () {
            exports_4("default", { start: start });
        }
    };
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[99]();
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;