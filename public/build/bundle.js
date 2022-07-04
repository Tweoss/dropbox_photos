
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class DbxImage {
        constructor(path) {
            this.path = path;
        }
        /**
         * returns a promise that resolves to an image thumbnail
         */
        async loadThumbnail(access_token, size = "w64h64") {
            const response = await fetch("https://content.dropboxapi.com/2/files/get_thumbnail_v2", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Dropbox-API-Arg": `{"resource":{".tag":"path","path":"${this.path}"},"size":{".tag":"${size}"}}`,
                },
            });
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }
        /**
         * returns a promise that resolves to an image
         */
        async loadImage(access_token) {
            const response = await fetch('https://content.dropboxapi.com/2/files/download', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Dropbox-API-Arg': `{"path":"${this.path}"}`
                }
            });
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }
        /**
         * returns a promise that resolves to a URL for the video blob (if the photo is a live photo)
         */
        async loadVideo(access_token, video_path) {
            const response = await fetch('https://content.dropboxapi.com/2/files/download', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Dropbox-API-Arg': `{"path":"${video_path}"}`
                }
            });
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }
    }
    var FileType;
    (function (FileType) {
        FileType["Image"] = "Image";
        FileType["Video"] = "video";
    })(FileType || (FileType = {}));
    class DbxMetadata {
        constructor(path) {
            this.dimensions = null;
            this.path = path;
        }
        /**
         * initializes the metadata using dropbox api data
         */
        async init(access_token) {
            const response = await fetch("https://api.dropboxapi.com/2/files/get_metadata", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    include_media_info: true,
                    path: this.path,
                }),
            });
            const json = await response.json();
            this.name = json.name;
            this.last_modified = json.server_modified;
            this.time_taken = json.media_info.metadata.time_taken;
            this.dimensions = json.media_info.metadata.dimensions;
            if (json.media_info.metadata[".tag"] === "video") {
                this.filetype = FileType.Video;
                this.duration = json.media_info.metadata.duration;
            }
            else if (json.media_info.metadata[".tag"] === "photo") {
                this.filetype = FileType.Image;
            }
            return this;
        }
    }
    class DbxIndexEntry {
        constructor() {
            this.is_selected = false;
            this.metadata = null;
        }
        /**
         * initializes the index entry using dropbox api data
         */
        async init(access_token, path) {
            this.metadata = await new DbxMetadata(path).init(access_token);
            return this;
        }
        /**
         * sets the metadata of a corresponding dropbox video for live photos
         */
        set_live_video_data(live_video_data) {
            this.live_video_metadata = live_video_data;
        }
    }
    class DbxIndex {
        constructor() {
            /** @type {Map<String, DbxIndexEntry>} */
            this.entries = new Map();
        }
        /**
         * parse and check url for access token
         */
        async valid_token_set(url, custom_token) {
            var _a, _b;
            const token = custom_token || ((_b = (_a = url.split('#')[1]) === null || _a === void 0 ? void 0 : _a.split('&')[0]) === null || _b === void 0 ? void 0 : _b.split('=')[1]);
            if (token) {
                return fetch('https://api.dropboxapi.com/2/check/user', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                }).then(res => {
                    if (res.status == 200) {
                        this.access_token = token;
                        return true;
                    }
                });
            }
            else {
                return Promise.resolve(false);
            }
        }
        /**
         * redirect to dropbox's authentication for obtaining an access token
         */
        redirect_to_auth(location) {
            location.href = `https://www.dropbox.com/oauth2/authorize?client_id=nyma8gjtfb5kq8n&response_type=token&redirect_uri=${location.protocol}//${location.host + location.pathname}`;
        }
        /**
         * builds an index of files inside this folder from the dropbox api
         */
        async build_index(base_path = "") {
            let has_more_files = true;
            while (has_more_files) {
                const response = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.access_token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        path: base_path,
                        recursive: false,
                    }),
                });
                const json = await response.json();
                has_more_files = json.has_more;
                await Promise.all(json.entries.map(async (entry) => {
                    return new DbxIndexEntry()
                        .init(this.access_token, entry.path_lower)
                        .then((index_entry) => {
                        this.entries.set(entry.name, index_entry);
                    });
                }));
            }
        }
        /**
         * adds live video data to the index
         * take video and image pairs that have the same name and
         * add the video to the image entry as a live video
         */
        collapse_index() {
            for (const [name, entry] of this.entries) {
                // find videos
                if (name.endsWith(".mov")) {
                    // and a corresponding image
                    const image_entry = this.entries.get(name.substring(0, name.length - 4) + ".JPG");
                    if (image_entry) {
                        // then set the metadata in the image
                        image_entry.set_live_video_data(entry.metadata);
                        // and remove the video entry
                        this.entries.delete(name);
                    }
                }
            }
        }
        /**
         * returns a sorted by timestamp array of string file names
         */
        get_sorted_permutation() {
            const array = [...this.entries.entries()].map((entry) => [
                entry[0],
                new Date(entry[1].metadata.time_taken),
            ]);
            array.sort((a, b) => a[1].valueOf() - b[1].valueOf());
            return array.map((entry) => entry[0]);
        }
        /**
         * returns an array of arrays of string file names
         */
        get_sorted_event_array() {
            // check if two metadatas are within 8 hours of one another
            const same_event = (a, b) => {
                return (Math.abs(a.getTime() - b.getTime()) <
                    8 * 60 * 60 * 1000);
            };
            const sorted = this.get_sorted_permutation();
            // create events
            let current_event = 0;
            let events = [];
            let dates = [];
            for (let i = 0; i < sorted.length; i++) {
                const name = sorted[i];
                const entry = this.entries.get(name);
                if (events[current_event]) {
                    const date = new Date(entry.metadata.time_taken);
                    if (same_event(date, dates[current_event][0])) {
                        events[current_event].push(entry);
                        dates[current_event].push(date);
                    }
                    else {
                        current_event += 1;
                        events[current_event] = [entry];
                        dates[current_event] = [new Date(entry.metadata.time_taken)];
                    }
                }
                else {
                    events[current_event] = [entry];
                    dates[current_event] = [new Date(entry.metadata.time_taken)];
                }
            }
            return events;
        }
        handle_keydown(event, store, entries) {
            var _a;
            let output = store;
            let updated = false;
            const prevent_default = (event) => {
                event.preventDefault();
                event.stopPropagation();
            };
            switch (event.key) {
                case "ArrowLeft":
                    output.entry_index == 0 ?
                        output.event_index == 0 ?
                            null
                            :
                                (output.event_index -= 1, output.entry_index = entries[output.event_index].length - 1, updated = true)
                        :
                            (output.entry_index -= 1, updated = true);
                    prevent_default(event);
                    break;
                case "ArrowRight":
                    output.entry_index == ((_a = entries[output.event_index]) === null || _a === void 0 ? void 0 : _a.length) - 1 ?
                        output.event_index == entries.length - 1 ?
                            null
                            :
                                (output.event_index += 1, output.entry_index = 0, updated = true)
                        :
                            (output.entry_index += 1, updated = true);
                    prevent_default(event);
                    break;
                case "ArrowUp":
                    output.file_info = true;
                    updated = true;
                    prevent_default(event);
                    break;
                case "ArrowDown":
                    output.file_info = false;
                    updated = true;
                    prevent_default(event);
                    break;
                case " ":
                    if (output.event_index != -1 && output.entry_index != -1) {
                        output.maximized = !output.maximized;
                        updated = true;
                        prevent_default(event);
                    }
                    break;
                case "Escape":
                    if (output.maximized) {
                        output.maximized = false;
                        updated = true;
                        prevent_default(event);
                    }
                    break;
            }
            return { new_store: output, updated };
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const store = writable({
        event_index: -1,
        entry_index: -1,
        maximized: false,
        file_info: false,
    });

    /* src/Image.svelte generated by Svelte v3.48.0 */
    const file$4 = "src/Image.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image_data*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*image_entry*/ ctx[0].metadata.name);

    			attr_dev(img, "class", img_class_value = "" + ((/*$store*/ ctx[7].event_index == /*event_index*/ ctx[1] && /*$store*/ ctx[7].entry_index == /*entry_index*/ ctx[2]
    			? 'selected'
    			: '') + " " + /*calculated_dimensions*/ ctx[5].scale_class + " " + (/*maximized*/ ctx[4] ? 'maximized' : '') + " svelte-1x37wnt"));

    			set_style(img, "top", (/*maximized*/ ctx[4]
    			? '0'
    			: /*calculated_dimensions*/ ctx[5].top) + "%");

    			set_style(img, "left", (/*maximized*/ ctx[4]
    			? '0'
    			: /*calculated_dimensions*/ ctx[5].left) + "%");

    			add_location(img, file$4, 102, 4, 3175);
    			attr_dev(div, "class", "container svelte-1x37wnt");
    			add_location(div, file$4, 101, 0, 3147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			/*img_binding*/ ctx[10](img);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "load", /*load_handler*/ ctx[11], { once: true }, false, false),
    					listen_dev(img, "click", /*click_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*image_data*/ 8 && !src_url_equal(img.src, img_src_value = /*image_data*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*image_entry*/ 1 && img_alt_value !== (img_alt_value = /*image_entry*/ ctx[0].metadata.name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*$store, event_index, entry_index, calculated_dimensions, maximized*/ 182 && img_class_value !== (img_class_value = "" + ((/*$store*/ ctx[7].event_index == /*event_index*/ ctx[1] && /*$store*/ ctx[7].entry_index == /*entry_index*/ ctx[2]
    			? 'selected'
    			: '') + " " + /*calculated_dimensions*/ ctx[5].scale_class + " " + (/*maximized*/ ctx[4] ? 'maximized' : '') + " svelte-1x37wnt"))) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*maximized, calculated_dimensions*/ 48) {
    				set_style(img, "top", (/*maximized*/ ctx[4]
    				? '0'
    				: /*calculated_dimensions*/ ctx[5].top) + "%");
    			}

    			if (dirty & /*maximized, calculated_dimensions*/ 48) {
    				set_style(img, "left", (/*maximized*/ ctx[4]
    				? '0'
    				: /*calculated_dimensions*/ ctx[5].left) + "%");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*img_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $store;
    	validate_store(store, 'store');
    	component_subscribe($$self, store, $$value => $$invalidate(7, $store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { ACCESS_TOKEN } = $$props;
    	let { image_entry } = $$props;
    	let { default_data = "" } = $$props;
    	let { event_index } = $$props;
    	let { entry_index } = $$props;
    	let image_data = default_data;
    	let full_image;
    	let initial_image;
    	let thumbnail;
    	let selected = false;
    	let maximized = false;
    	const image = new DbxImage(image_entry.metadata.path);
    	let calculated_dimensions = { top: 0, left: 0, scale_class: "" };

    	const calculate_dimensions = () => {
    		const dimensions = image_entry.metadata.dimensions;

    		if (dimensions.height == dimensions.width) {
    			return { top: 0, left: 0, scale_class: "" };
    		} else if (dimensions.height > dimensions.width) {
    			// gap on the left and right
    			return {
    				top: 0,
    				left: 100 * (1 - dimensions.width / dimensions.height) / 2,
    				scale_class: "width-auto"
    			};
    		} else if (dimensions.width > dimensions.height) {
    			// gap on the top and bottom
    			return {
    				top: 100 * (1 - dimensions.height / dimensions.width) / 2,
    				left: 0,
    				scale_class: "height-auto"
    			};
    		}
    	};

    	const onChangeVisibility = (entries, _observer) => {
    		if (entries[0].isIntersecting) {
    			initial_image
    			? $$invalidate(3, image_data = initial_image)
    			: image.loadThumbnail(ACCESS_TOKEN, "w256h256").then(data => {
    					initial_image = data;
    					thumbnail ? null : URL.revokeObjectURL(thumbnail);
    					$$invalidate(3, image_data = initial_image);
    					$$invalidate(5, calculated_dimensions = calculate_dimensions());
    				});
    		} else {
    			thumbnail
    			? 0
    			: image.loadThumbnail(ACCESS_TOKEN).then(data => {
    					thumbnail = data; // no reverting to thumbnail. thumbnail will be revoked
    					$$invalidate(3, image_data = thumbnail);
    					$$invalidate(5, calculated_dimensions = calculate_dimensions());
    				});
    		}
    	};

    	let observer;
    	let element;

    	onMount(() => {
    		let options = {};
    		observer = new IntersectionObserver(onChangeVisibility, options);
    		observer.observe(element);
    	});

    	store.subscribe(store => {
    		selected = store.event_index == event_index && store.entry_index == entry_index;

    		// only if it is selected and maximized now
    		if (store.maximized && selected) {
    			$$invalidate(4, maximized = true);
    		} else {
    			$$invalidate(4, maximized = false);
    		}

    		if (selected) {
    			element.scrollIntoView({ behavior: "smooth", block: "center" });
    		}

    		// if in the same or neighbouring events as selected and maximized or is currently selected and not maximized
    		if (store.maximized && Math.abs(store.event_index - event_index) <= 1 || selected) {
    			full_image
    			? $$invalidate(3, image_data = full_image)
    			: image.loadImage(ACCESS_TOKEN).then(data => {
    					full_image = data;
    					$$invalidate(3, image_data = full_image);
    					$$invalidate(5, calculated_dimensions = calculate_dimensions());
    				});
    		}
    	});

    	const writable_props = ['ACCESS_TOKEN', 'image_entry', 'default_data', 'event_index', 'entry_index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(6, element);
    		});
    	}

    	const load_handler = () => {
    		URL.revokeObjectURL(image_data);
    	};

    	const click_handler = () => {
    		maximized
    		? null
    		: store.update(previous => {
    				previous.event_index = event_index;
    				previous.entry_index = entry_index;
    				return previous;
    			});
    	};

    	$$self.$$set = $$props => {
    		if ('ACCESS_TOKEN' in $$props) $$invalidate(8, ACCESS_TOKEN = $$props.ACCESS_TOKEN);
    		if ('image_entry' in $$props) $$invalidate(0, image_entry = $$props.image_entry);
    		if ('default_data' in $$props) $$invalidate(9, default_data = $$props.default_data);
    		if ('event_index' in $$props) $$invalidate(1, event_index = $$props.event_index);
    		if ('entry_index' in $$props) $$invalidate(2, entry_index = $$props.entry_index);
    	};

    	$$self.$capture_state = () => ({
    		DbxImage,
    		onMount,
    		store,
    		ACCESS_TOKEN,
    		image_entry,
    		default_data,
    		event_index,
    		entry_index,
    		image_data,
    		full_image,
    		initial_image,
    		thumbnail,
    		selected,
    		maximized,
    		image,
    		calculated_dimensions,
    		calculate_dimensions,
    		onChangeVisibility,
    		observer,
    		element,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('ACCESS_TOKEN' in $$props) $$invalidate(8, ACCESS_TOKEN = $$props.ACCESS_TOKEN);
    		if ('image_entry' in $$props) $$invalidate(0, image_entry = $$props.image_entry);
    		if ('default_data' in $$props) $$invalidate(9, default_data = $$props.default_data);
    		if ('event_index' in $$props) $$invalidate(1, event_index = $$props.event_index);
    		if ('entry_index' in $$props) $$invalidate(2, entry_index = $$props.entry_index);
    		if ('image_data' in $$props) $$invalidate(3, image_data = $$props.image_data);
    		if ('full_image' in $$props) full_image = $$props.full_image;
    		if ('initial_image' in $$props) initial_image = $$props.initial_image;
    		if ('thumbnail' in $$props) thumbnail = $$props.thumbnail;
    		if ('selected' in $$props) selected = $$props.selected;
    		if ('maximized' in $$props) $$invalidate(4, maximized = $$props.maximized);
    		if ('calculated_dimensions' in $$props) $$invalidate(5, calculated_dimensions = $$props.calculated_dimensions);
    		if ('observer' in $$props) observer = $$props.observer;
    		if ('element' in $$props) $$invalidate(6, element = $$props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		image_entry,
    		event_index,
    		entry_index,
    		image_data,
    		maximized,
    		calculated_dimensions,
    		element,
    		$store,
    		ACCESS_TOKEN,
    		default_data,
    		img_binding,
    		load_handler,
    		click_handler
    	];
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			ACCESS_TOKEN: 8,
    			image_entry: 0,
    			default_data: 9,
    			event_index: 1,
    			entry_index: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ACCESS_TOKEN*/ ctx[8] === undefined && !('ACCESS_TOKEN' in props)) {
    			console.warn("<Image> was created without expected prop 'ACCESS_TOKEN'");
    		}

    		if (/*image_entry*/ ctx[0] === undefined && !('image_entry' in props)) {
    			console.warn("<Image> was created without expected prop 'image_entry'");
    		}

    		if (/*event_index*/ ctx[1] === undefined && !('event_index' in props)) {
    			console.warn("<Image> was created without expected prop 'event_index'");
    		}

    		if (/*entry_index*/ ctx[2] === undefined && !('entry_index' in props)) {
    			console.warn("<Image> was created without expected prop 'entry_index'");
    		}
    	}

    	get ACCESS_TOKEN() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ACCESS_TOKEN(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image_entry() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image_entry(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get default_data() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set default_data(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get event_index() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set event_index(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get entry_index() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entry_index(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/LivePhoto.svelte generated by Svelte v3.48.0 */
    const file$3 = "src/LivePhoto.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let video;
    	let t0;
    	let video_src_value;
    	let video_class_value;
    	let video_controls_value;
    	let t1;
    	let i;
    	let i_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			video = element("video");
    			t0 = text("Sorry, your browser doesn't support embedded videos.");
    			t1 = space();
    			i = element("i");
    			if (!src_url_equal(video.src, video_src_value = /*video_data*/ ctx[3])) attr_dev(video, "src", video_src_value);
    			attr_dev(video, "poster", /*image_data*/ ctx[2]);
    			attr_dev(video, "class", video_class_value = "" + ((/*selected*/ ctx[4] ? 'selected' : '') + " " + /*calculated_dimensions*/ ctx[6].scale_class + " " + (/*maximized*/ ctx[5] ? 'maximized' : '') + " svelte-1xi62k7"));

    			set_style(video, "top", (/*maximized*/ ctx[5]
    			? '0'
    			: /*calculated_dimensions*/ ctx[6].top) + "%");

    			set_style(video, "left", (/*maximized*/ ctx[5]
    			? '0'
    			: /*calculated_dimensions*/ ctx[6].left) + "%");

    			video.controls = video_controls_value = /*maximized*/ ctx[5] || null;
    			add_location(video, file$3, 108, 4, 3250);
    			set_style(i, "top", /*calculated_dimensions*/ ctx[6].top + "%");
    			set_style(i, "left", /*calculated_dimensions*/ ctx[6].left + "%");
    			set_style(i, "color", "lightgray");
    			attr_dev(i, "class", i_class_value = "" + ((/*element*/ ctx[7] ? 'fa fa-play-circle-o ' : '') + " " + (/*maximized*/ ctx[5] ? 'hidden' : '') + " svelte-1xi62k7"));
    			add_location(i, file$3, 153, 4, 4701);
    			attr_dev(div, "class", "container svelte-1xi62k7");
    			add_location(div, file$3, 106, 0, 3172);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, video);
    			append_dev(video, t0);
    			/*video_binding*/ ctx[11](video);
    			append_dev(div, t1);
    			append_dev(div, i);

    			if (!mounted) {
    				dispose = [
    					listen_dev(video, "load", /*load_handler*/ ctx[12], { once: true }, false, false),
    					listen_dev(video, "focus", /*focus_handler*/ ctx[13], false, false, false),
    					listen_dev(video, "mouseover", /*mouseover_handler*/ ctx[14], false, false, false),
    					listen_dev(video, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(video, "click", /*click_handler*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*video_data*/ 8 && !src_url_equal(video.src, video_src_value = /*video_data*/ ctx[3])) {
    				attr_dev(video, "src", video_src_value);
    			}

    			if (dirty & /*image_data*/ 4) {
    				attr_dev(video, "poster", /*image_data*/ ctx[2]);
    			}

    			if (dirty & /*selected, calculated_dimensions, maximized*/ 112 && video_class_value !== (video_class_value = "" + ((/*selected*/ ctx[4] ? 'selected' : '') + " " + /*calculated_dimensions*/ ctx[6].scale_class + " " + (/*maximized*/ ctx[5] ? 'maximized' : '') + " svelte-1xi62k7"))) {
    				attr_dev(video, "class", video_class_value);
    			}

    			if (dirty & /*maximized, calculated_dimensions*/ 96) {
    				set_style(video, "top", (/*maximized*/ ctx[5]
    				? '0'
    				: /*calculated_dimensions*/ ctx[6].top) + "%");
    			}

    			if (dirty & /*maximized, calculated_dimensions*/ 96) {
    				set_style(video, "left", (/*maximized*/ ctx[5]
    				? '0'
    				: /*calculated_dimensions*/ ctx[6].left) + "%");
    			}

    			if (dirty & /*maximized*/ 32 && video_controls_value !== (video_controls_value = /*maximized*/ ctx[5] || null)) {
    				prop_dev(video, "controls", video_controls_value);
    			}

    			if (dirty & /*calculated_dimensions*/ 64) {
    				set_style(i, "top", /*calculated_dimensions*/ ctx[6].top + "%");
    			}

    			if (dirty & /*calculated_dimensions*/ 64) {
    				set_style(i, "left", /*calculated_dimensions*/ ctx[6].left + "%");
    			}

    			if (dirty & /*element, maximized*/ 160 && i_class_value !== (i_class_value = "" + ((/*element*/ ctx[7] ? 'fa fa-play-circle-o ' : '') + " " + (/*maximized*/ ctx[5] ? 'hidden' : '') + " svelte-1xi62k7"))) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*video_binding*/ ctx[11](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LivePhoto', slots, []);
    	let { ACCESS_TOKEN } = $$props;
    	let { image_entry } = $$props;
    	let { default_data = "" } = $$props;
    	let { event_index } = $$props;
    	let { entry_index } = $$props;
    	let image_data = default_data;
    	let video_data = null;
    	let full_image;
    	let initial_image;
    	let thumbnail;
    	let selected = false;
    	let maximized = false;
    	const image = new DbxImage(image_entry.metadata.path);
    	let calculated_dimensions = { top: 0, left: 0, scale_class: "" };

    	const calculate_dimensions = () => {
    		const dimensions = image_entry.metadata.dimensions;

    		if (dimensions.height == dimensions.width) {
    			return { top: 0, left: 0, scale_class: "" };
    		} else if (dimensions.height > dimensions.width) {
    			// gap on the left and right
    			return {
    				top: 0,
    				left: 100 * (1 - dimensions.width / dimensions.height) / 2,
    				scale_class: "width-auto"
    			};
    		} else if (dimensions.width > dimensions.height) {
    			// gap on the top and bottom
    			return {
    				top: 100 * (1 - dimensions.height / dimensions.width) / 2,
    				left: 0,
    				scale_class: "height-auto"
    			};
    		}
    	};

    	const onChangeVisibility = (entries, _observer) => {
    		if (entries[0].isIntersecting) {
    			initial_image
    			? $$invalidate(2, image_data = initial_image)
    			: image.loadThumbnail(ACCESS_TOKEN, "w640h480").then(data => {
    					initial_image = data;
    					$$invalidate(2, image_data = initial_image);
    					$$invalidate(6, calculated_dimensions = calculate_dimensions());
    				});

    			video_data
    			? null
    			: image.loadVideo(ACCESS_TOKEN, image_entry.live_video_metadata.path).then(data => {
    					$$invalidate(3, video_data = data);
    				});
    		} else {
    			thumbnail
    			? 0
    			: image.loadThumbnail(ACCESS_TOKEN).then(data => {
    					thumbnail = data; // not reverting to thumbnail. otherwise use this: (image_data = thumbnail)
    					$$invalidate(2, image_data = thumbnail);
    					$$invalidate(6, calculated_dimensions = calculate_dimensions());
    				});
    		}
    	};

    	let observer;
    	let element;

    	onMount(() => {
    		let options = { root: undefined };
    		observer = new IntersectionObserver(onChangeVisibility, options);
    		observer.observe(element);
    	});

    	store.subscribe(store => {
    		$$invalidate(4, selected = store.event_index == event_index && store.entry_index == entry_index);

    		// only if it is selected and maximized now
    		if (store.maximized && selected) {
    			$$invalidate(5, maximized = true);
    			element.play();
    		} else {
    			$$invalidate(5, maximized = false);
    		}

    		if (selected) {
    			element.scrollIntoView({ behavior: "smooth", block: "center" });

    			full_image
    			? $$invalidate(2, image_data = full_image)
    			: image.loadImage(ACCESS_TOKEN).then(data => {
    					full_image = data;
    					$$invalidate(2, image_data = full_image);
    					$$invalidate(6, calculated_dimensions = calculate_dimensions());
    				});
    		}
    	});

    	const writable_props = ['ACCESS_TOKEN', 'image_entry', 'default_data', 'event_index', 'entry_index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LivePhoto> was created with unknown prop '${key}'`);
    	});

    	function video_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	const load_handler = () => {
    		URL.revokeObjectURL(video_data);
    		URL.revokeObjectURL(image_data); // no need for image_data anyway
    	};

    	const focus_handler = () => {
    		maximized ? null : element.play();
    	};

    	const mouseover_handler = () => {
    		maximized
    		? null
    		: element.play().then(
    				() => {
    					
    				},
    				() => {
    					
    				}
    			); /* ignore the failure to play */ /* ignore the failure to play */
    	};

    	const mouseleave_handler = () => {
    		if (!maximized) {
    			element.pause();
    			$$invalidate(7, element.currentTime = 0, element);
    			element.load();
    		}
    	};

    	const click_handler = () => {
    		maximized
    		? null
    		: store.update(previous => {
    				previous.event_index = event_index;
    				previous.entry_index = entry_index;
    				return previous;
    			});
    	};

    	$$self.$$set = $$props => {
    		if ('ACCESS_TOKEN' in $$props) $$invalidate(8, ACCESS_TOKEN = $$props.ACCESS_TOKEN);
    		if ('image_entry' in $$props) $$invalidate(9, image_entry = $$props.image_entry);
    		if ('default_data' in $$props) $$invalidate(10, default_data = $$props.default_data);
    		if ('event_index' in $$props) $$invalidate(0, event_index = $$props.event_index);
    		if ('entry_index' in $$props) $$invalidate(1, entry_index = $$props.entry_index);
    	};

    	$$self.$capture_state = () => ({
    		DbxImage,
    		onMount,
    		store,
    		ACCESS_TOKEN,
    		image_entry,
    		default_data,
    		event_index,
    		entry_index,
    		image_data,
    		video_data,
    		full_image,
    		initial_image,
    		thumbnail,
    		selected,
    		maximized,
    		image,
    		calculated_dimensions,
    		calculate_dimensions,
    		onChangeVisibility,
    		observer,
    		element
    	});

    	$$self.$inject_state = $$props => {
    		if ('ACCESS_TOKEN' in $$props) $$invalidate(8, ACCESS_TOKEN = $$props.ACCESS_TOKEN);
    		if ('image_entry' in $$props) $$invalidate(9, image_entry = $$props.image_entry);
    		if ('default_data' in $$props) $$invalidate(10, default_data = $$props.default_data);
    		if ('event_index' in $$props) $$invalidate(0, event_index = $$props.event_index);
    		if ('entry_index' in $$props) $$invalidate(1, entry_index = $$props.entry_index);
    		if ('image_data' in $$props) $$invalidate(2, image_data = $$props.image_data);
    		if ('video_data' in $$props) $$invalidate(3, video_data = $$props.video_data);
    		if ('full_image' in $$props) full_image = $$props.full_image;
    		if ('initial_image' in $$props) initial_image = $$props.initial_image;
    		if ('thumbnail' in $$props) thumbnail = $$props.thumbnail;
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    		if ('maximized' in $$props) $$invalidate(5, maximized = $$props.maximized);
    		if ('calculated_dimensions' in $$props) $$invalidate(6, calculated_dimensions = $$props.calculated_dimensions);
    		if ('observer' in $$props) observer = $$props.observer;
    		if ('element' in $$props) $$invalidate(7, element = $$props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		event_index,
    		entry_index,
    		image_data,
    		video_data,
    		selected,
    		maximized,
    		calculated_dimensions,
    		element,
    		ACCESS_TOKEN,
    		image_entry,
    		default_data,
    		video_binding,
    		load_handler,
    		focus_handler,
    		mouseover_handler,
    		mouseleave_handler,
    		click_handler
    	];
    }

    class LivePhoto extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			ACCESS_TOKEN: 8,
    			image_entry: 9,
    			default_data: 10,
    			event_index: 0,
    			entry_index: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LivePhoto",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ACCESS_TOKEN*/ ctx[8] === undefined && !('ACCESS_TOKEN' in props)) {
    			console.warn("<LivePhoto> was created without expected prop 'ACCESS_TOKEN'");
    		}

    		if (/*image_entry*/ ctx[9] === undefined && !('image_entry' in props)) {
    			console.warn("<LivePhoto> was created without expected prop 'image_entry'");
    		}

    		if (/*event_index*/ ctx[0] === undefined && !('event_index' in props)) {
    			console.warn("<LivePhoto> was created without expected prop 'event_index'");
    		}

    		if (/*entry_index*/ ctx[1] === undefined && !('entry_index' in props)) {
    			console.warn("<LivePhoto> was created without expected prop 'entry_index'");
    		}
    	}

    	get ACCESS_TOKEN() {
    		throw new Error("<LivePhoto>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ACCESS_TOKEN(value) {
    		throw new Error("<LivePhoto>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image_entry() {
    		throw new Error("<LivePhoto>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image_entry(value) {
    		throw new Error("<LivePhoto>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get default_data() {
    		throw new Error("<LivePhoto>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set default_data(value) {
    		throw new Error("<LivePhoto>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get event_index() {
    		throw new Error("<LivePhoto>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set event_index(value) {
    		throw new Error("<LivePhoto>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get entry_index() {
    		throw new Error("<LivePhoto>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entry_index(value) {
    		throw new Error("<LivePhoto>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Event.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/Event.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (71:8) {:else}
    function create_else_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "placeholder.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "placeholder");
    			add_location(img, file$2, 71, 12, 2610);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(71:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:8) {#if element.metadata.filetype == FileType.Image}
    function create_if_block$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*element*/ ctx[4].live_video_metadata) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(53:8) {#if element.metadata.filetype == FileType.Image}",
    		ctx
    	});

    	return block;
    }

    // (62:12) {:else}
    function create_else_block(ctx) {
    	let image;
    	let current;

    	image = new Image({
    			props: {
    				ACCESS_TOKEN: /*ACCESS_TOKEN*/ ctx[0],
    				image_entry: /*element*/ ctx[4],
    				default_data: "./placeholder.png",
    				event_index: /*event_index*/ ctx[2],
    				entry_index: /*entry_index*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(image.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(image, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const image_changes = {};
    			if (dirty & /*ACCESS_TOKEN*/ 1) image_changes.ACCESS_TOKEN = /*ACCESS_TOKEN*/ ctx[0];
    			if (dirty & /*event_contents*/ 2) image_changes.image_entry = /*element*/ ctx[4];
    			if (dirty & /*event_index*/ 4) image_changes.event_index = /*event_index*/ ctx[2];
    			image.$set(image_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(image, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(62:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (54:12) {#if element.live_video_metadata}
    function create_if_block_1(ctx) {
    	let livephoto;
    	let current;

    	livephoto = new LivePhoto({
    			props: {
    				ACCESS_TOKEN: /*ACCESS_TOKEN*/ ctx[0],
    				image_entry: /*element*/ ctx[4],
    				default_data: "./placeholder.png",
    				event_index: /*event_index*/ ctx[2],
    				entry_index: /*entry_index*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(livephoto.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(livephoto, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const livephoto_changes = {};
    			if (dirty & /*ACCESS_TOKEN*/ 1) livephoto_changes.ACCESS_TOKEN = /*ACCESS_TOKEN*/ ctx[0];
    			if (dirty & /*event_contents*/ 2) livephoto_changes.image_entry = /*element*/ ctx[4];
    			if (dirty & /*event_index*/ 4) livephoto_changes.event_index = /*event_index*/ ctx[2];
    			livephoto.$set(livephoto_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(livephoto.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(livephoto.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(livephoto, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(54:12) {#if element.live_video_metadata}",
    		ctx
    	});

    	return block;
    }

    // (52:4) {#each event_contents as element, entry_index}
    function create_each_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*element*/ ctx[4].metadata.filetype == FileType.Image) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(52:4) {#each event_contents as element, entry_index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let current;
    	let each_value = /*event_contents*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = `${/*timestamp*/ ctx[3]()}`;
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "timestamps svelte-16t62c2");
    			add_location(h2, file$2, 50, 4, 1773);
    			attr_dev(div, "class", "svelte-16t62c2");
    			add_location(div, file$2, 49, 0, 1763);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*ACCESS_TOKEN, event_contents, event_index, FileType*/ 7) {
    				each_value = /*event_contents*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Event', slots, []);
    	let { ACCESS_TOKEN } = $$props;
    	let { event_contents = [] } = $$props;
    	let { event_index } = $$props;

    	const timestamp = () => {
    		let first = new Date(event_contents[0].metadata.time_taken);
    		let last = new Date(event_contents[event_contents.length - 1].metadata.time_taken);
    		first.setTime(first.getTime() + first.getTimezoneOffset() * 60 * 1000);
    		last.setTime(last.getTime() + last.getTimezoneOffset() * 60 * 1000);

    		// if same timestamp or just a single element
    		if (event_contents.length == 1 || event_contents[0].metadata.time_taken == event_contents[event_contents.length - 1].metadata.time_taken) {
    			return first.toLocaleDateString("en-US", { dateStyle: "full" }) + ", " + first.getHours().toString().padStart(2, "0") + ":" + first.getMinutes().toString().padStart(2, "0");
    		}

    		// if same day
    		if (first.getDate() == last.getDate() && first.getMonth() == last.getMonth() && first.getFullYear() == last.getFullYear()) {
    			return `${first.toLocaleString("en-US", {
				dateStyle: "full",
				timeStyle: "short",
				hour12: false
			})}-${last.getHours().toString().padStart(2, "0")}:${last.getMinutes().toString().padStart(2, "0")}`;
    		}

    		// default
    		return `${first.toLocaleString("en-US", {
			dateStyle: "full",
			timeStyle: "short",
			hour12: false
		})}—${last.toLocaleString("en-US", {
			dateStyle: "full",
			timeStyle: "short",
			hour12: false
		})}`;
    	};

    	const writable_props = ['ACCESS_TOKEN', 'event_contents', 'event_index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Event> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ACCESS_TOKEN' in $$props) $$invalidate(0, ACCESS_TOKEN = $$props.ACCESS_TOKEN);
    		if ('event_contents' in $$props) $$invalidate(1, event_contents = $$props.event_contents);
    		if ('event_index' in $$props) $$invalidate(2, event_index = $$props.event_index);
    	};

    	$$self.$capture_state = () => ({
    		FileType,
    		Image,
    		LivePhoto,
    		ACCESS_TOKEN,
    		event_contents,
    		event_index,
    		timestamp
    	});

    	$$self.$inject_state = $$props => {
    		if ('ACCESS_TOKEN' in $$props) $$invalidate(0, ACCESS_TOKEN = $$props.ACCESS_TOKEN);
    		if ('event_contents' in $$props) $$invalidate(1, event_contents = $$props.event_contents);
    		if ('event_index' in $$props) $$invalidate(2, event_index = $$props.event_index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ACCESS_TOKEN, event_contents, event_index, timestamp];
    }

    class Event extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			ACCESS_TOKEN: 0,
    			event_contents: 1,
    			event_index: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Event",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ACCESS_TOKEN*/ ctx[0] === undefined && !('ACCESS_TOKEN' in props)) {
    			console.warn("<Event> was created without expected prop 'ACCESS_TOKEN'");
    		}

    		if (/*event_index*/ ctx[2] === undefined && !('event_index' in props)) {
    			console.warn("<Event> was created without expected prop 'event_index'");
    		}
    	}

    	get ACCESS_TOKEN() {
    		throw new Error("<Event>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ACCESS_TOKEN(value) {
    		throw new Error("<Event>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get event_contents() {
    		throw new Error("<Event>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set event_contents(value) {
    		throw new Error("<Event>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get event_index() {
    		throw new Error("<Event>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set event_index(value) {
    		throw new Error("<Event>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    /* src/Button.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/Button.svelte";

    // (30:0) {#if show_button}
    function create_if_block$1(ctx) {
    	let button;
    	let t;
    	let button_outro;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*button_text*/ ctx[1]);
    			attr_dev(button, "class", "svelte-16krlth");
    			add_location(button, file$1, 30, 4, 2643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*clickHandler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*button_text*/ 2) set_data_dev(t, /*button_text*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (button_outro) button_outro.end(1);
    			current = true;
    		},
    		o: function outro(local) {
    			button_outro = create_out_transition(button, /*hide_button*/ ctx[3], { duration: 1000 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching && button_outro) button_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(30:0) {#if show_button}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*show_button*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(window, "keydown", /*keydown_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show_button*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show_button*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, []);
    	let show_button = true;

    	(function (a) {
    		if ((/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i).test(a) || (/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i).test(a.slice(0, 4))) $$invalidate(0, show_button = false);
    	})(navigator.userAgent || navigator.vendor);

    	let button_text = "Interact to enable video!";

    	const clickHandler = () => {
    		$$invalidate(1, button_text = "Enabled!");
    		$$invalidate(0, show_button = false);
    	};

    	function hide_button(_, { duration }) {
    		return {
    			duration,
    			css: t => {
    				return `
                transform: scale(${cubicOut(t)});
                `;
    			}
    		};
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	const click_handler = _ => clickHandler();
    	const keydown_handler = _ => clickHandler();

    	$$self.$capture_state = () => ({
    		cubicOut,
    		show_button,
    		button_text,
    		clickHandler,
    		hide_button
    	});

    	$$self.$inject_state = $$props => {
    		if ('show_button' in $$props) $$invalidate(0, show_button = $$props.show_button);
    		if ('button_text' in $$props) $$invalidate(1, button_text = $$props.button_text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		show_button,
    		button_text,
    		clickHandler,
    		hide_button,
    		click_handler,
    		keydown_handler
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */

    const { console: console_1, window: window_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (47:4) {#each events_entries as event, event_index}
    function create_each_block(ctx) {
    	let event;
    	let current;

    	event = new Event({
    			props: {
    				ACCESS_TOKEN: /*index*/ ctx[2].access_token,
    				event_contents: /*event*/ ctx[4],
    				event_index: /*event_index*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(event.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(event, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const event_changes = {};
    			if (dirty & /*events_entries*/ 1) event_changes.event_contents = /*event*/ ctx[4];
    			event.$set(event_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(event.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(event.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(event, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(47:4) {#each events_entries as event, event_index}",
    		ctx
    	});

    	return block;
    }

    // (54:4) {#if $store.file_info}
    function create_if_block(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "HI";
    			add_location(p, file, 55, 12, 1558);
    			add_location(div, file, 54, 8, 1540);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(54:4) {#if $store.file_info}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let link;
    	let t0;
    	let h1;
    	let t2;
    	let button;
    	let t3;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	button = new Button({ $$inline: true });
    	let each_value = /*events_entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*$store*/ ctx[1].file_info && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			link = element("link");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "🐟Photos🐈";
    			t2 = space();
    			create_component(button.$$.fragment);
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			if (if_block) if_block.c();
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    			add_location(link, file, 40, 4, 1118);
    			attr_dev(h1, "class", "svelte-d9gu0h");
    			add_location(h1, file, 44, 4, 1258);
    			attr_dev(main, "class", "svelte-d9gu0h");
    			add_location(main, file, 38, 0, 1075);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, link);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			mount_component(button, main, null);
    			append_dev(main, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t4);
    			if (if_block) if_block.m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*keydown_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*index, events_entries*/ 5) {
    				each_value = /*events_entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, t4);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*$store*/ ctx[1].file_info) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $store;
    	validate_store(store, 'store');
    	component_subscribe($$self, store, $$value => $$invalidate(1, $store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let events_entries = [];
    	let index = new DbxIndex();

    	index.// check that the token in the index is valid
    	valid_token_set(window.location.href).// if not valid, redirect to dropbox authentication
    	then(result => result ? 0 : index.redirect_to_auth(window.location)).then(() => {
    		console.log(index);

    		// build index
    		index.build_index("/photos").then(() => {
    			// collapse video and images for live photos
    			index.collapse_index();

    			$$invalidate(0, events_entries = index.get_sorted_event_array());
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = e => {
    		let { new_store, updated } = index.handle_keydown(e, get_store_value(store), events_entries);

    		if (updated) {
    			store.set(new_store);
    		}
    	};

    	$$self.$capture_state = () => ({
    		DbxIndex,
    		Event,
    		Button,
    		store,
    		get: get_store_value,
    		events_entries,
    		index,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('events_entries' in $$props) $$invalidate(0, events_entries = $$props.events_entries);
    		if ('index' in $$props) $$invalidate(2, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [events_entries, $store, index, keydown_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
