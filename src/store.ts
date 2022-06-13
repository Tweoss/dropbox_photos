import { writable } from 'svelte/store';

export const store = writable({
    event_index: -1,
    entry_index: -1,
    maximized: false,
    file_info: false,
});
