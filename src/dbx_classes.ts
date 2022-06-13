export {
    DbxIndex,
    DbxImage,
    DbxMetadata,
    FileType,
    DbxIndexEntry
}

class DbxImage {
    path: string;
    size: string;
    constructor(path: string) {
        this.path = path;
    }

    /**
     * returns a promise that resolves to an image thumbnail
     */
    async loadThumbnail(
        access_token: string,
        size = "w64h64"
    ): Promise<string | ArrayBuffer> {
        const response = await fetch(
            "https://content.dropboxapi.com/2/files/get_thumbnail_v2",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Dropbox-API-Arg": `{"resource":{".tag":"path","path":"${this.path}"},"size":{".tag":"${size}"}}`,
                },
            }
        );
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    /**
     * returns a promise that resolves to an image
     */
    async loadImage(access_token: string): Promise<string> {
        const response = await
            fetch('https://content.dropboxapi.com/2/files/download', {
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
    async loadVideo(access_token: string, video_path: string): Promise<string> {
        const response = await
            fetch('https://content.dropboxapi.com/2/files/download', {
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

enum FileType {
    Image = "Image",
    Video = "video",
}

class DbxMetadata {
    path: string;
    name: string;
    last_modified: string;
    time_taken: string;
    filetype: FileType | null;
    duration: string | null;
    dimensions: { width: number; height: number } | null = null;

    constructor(path: string) {
        this.path = path;
    }

    /**
     * initializes the metadata using dropbox api data
     */
    async init(access_token: string): Promise<DbxMetadata> {
        const response = await fetch(
            "https://api.dropboxapi.com/2/files/get_metadata",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    include_media_info: true,
                    path: this.path,
                }),
            }
        );
        const json = await response.json();
        this.name = json.name;
        this.last_modified = json.server_modified;
        this.time_taken = json.media_info.metadata.time_taken;
        this.dimensions = json.media_info.metadata.dimensions;
        if (json.media_info.metadata[".tag"] === "video") {
            this.filetype = FileType.Video;
            this.duration = json.media_info.metadata.duration;
        } else if (json.media_info.metadata[".tag"] === "photo") {
            this.filetype = FileType.Image;
        }
        return this;
    }
}

class DbxIndexEntry {
    metadata: DbxMetadata;
    live_video_metadata: DbxMetadata | null;
    is_selected: boolean = false;

    constructor() {
        this.metadata = null;
    }

    /**
     * initializes the index entry using dropbox api data
     */
    async init(access_token: string, path: string): Promise<DbxIndexEntry> {
        this.metadata = await new DbxMetadata(path).init(access_token);
        return this;
    }
    /**
     * sets the metadata of a corresponding dropbox video for live photos
     */
    set_live_video_data(live_video_data: DbxMetadata) {
        this.live_video_metadata = live_video_data;
    }
}

class DbxIndex {
    access_token: string | null;

    // name to entry
    entries: Map<string, DbxIndexEntry>;
    constructor() {
        /** @type {Map<String, DbxIndexEntry>} */
        this.entries = new Map();
    }

    /**
     * parse and check url for access token
     */
    async valid_token_set(url: string, custom_token?: string) {
        const token: string = custom_token || url.split('#')[1]?.split('&')[0]?.split('=')[1];

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
            })
        } else {
            return Promise.resolve(false);
        }
    }

    /**
     * redirect to dropbox's authentication for obtaining an access token
     */
    redirect_to_auth(location: Location) {
        location.href = `https://www.dropbox.com/oauth2/authorize?client_id=9a3dfm0r2xv45sq&response_type=token&redirect_uri=${location.protocol}//${location.host + location.pathname}`
    }

    /**
     * builds an index of files inside this folder from the dropbox api
     */
    async build_index(base_path = "") {
        let has_more_files = true;
        while (has_more_files) {
            const response = await fetch(
                "https://api.dropboxapi.com/2/files/list_folder",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.access_token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        path: base_path,
                        recursive: false,
                    }),
                }
            );
            const json = await response.json();
            has_more_files = json.has_more;
            await Promise.all(
                json.entries.map(async (entry) => {
                    return new DbxIndexEntry()
                        .init(this.access_token, entry.path_lower)
                        .then((index_entry) => {
                            this.entries.set(entry.name, index_entry);
                        });
                })
            );
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
                const image_entry = this.entries.get(
                    name.substring(0, name.length - 4) + ".JPG"
                );
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
    get_sorted_permutation(): string[] {
        const array = [...this.entries.entries()].map((entry) => [
            entry[0],
            new Date(entry[1].metadata.time_taken),
        ]);
        array.sort((a: [string, Date], b: [string, Date]) => a[1].valueOf() - b[1].valueOf());
        return array.map((entry: [string, Date]) => entry[0]);
    }

    /**
     * returns an array of arrays of string file names 
     */
    get_sorted_event_array(): DbxIndexEntry[][] {

        // check if two metadatas are within 8 hours of one another
        const same_event = (a: Date, b: Date): boolean => {
            return (
                Math.abs(a.getTime() - b.getTime()) <
                8 * 60 * 60 * 1000
            );
        }
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
                } else {
                    current_event += 1;
                    events[current_event] = [entry];
                    dates[current_event] = [new Date(entry.metadata.time_taken)];
                }
            } else {
                events[current_event] = [entry];
                dates[current_event] = [new Date(entry.metadata.time_taken)];
            }
        }
        return events;
    }

    handle_keydown(event: KeyboardEvent, store, entries: (DbxIndexEntry | null)[][]): { event_index: number; entry_index: number; maximized: boolean; file_info: boolean; } {
        let output: { event_index: number; entry_index: number; maximized: boolean; file_info: boolean; } = store;
        const prevent_default = (event: KeyboardEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };
        if (event.key == "ArrowLeft") {
            output.entry_index == 0 ?
                output.event_index == 0 ?
                    null
                    :
                    (output.event_index -= 1, output.entry_index = entries[output.event_index].length - 1)
                :
                output.entry_index -= 1;
            prevent_default(event);
        } else if (event.key == "ArrowRight") {
            output.entry_index == entries[output.event_index]?.length - 1 ?
                output.event_index == entries.length - 1 ?
                    null
                    :
                    (output.event_index += 1, output.entry_index = 0)
                :
                output.entry_index += 1;
            prevent_default(event);
        } else if (event.key == "ArrowUp") {
            output.file_info = true;
            prevent_default(event);
        } else if (event.key == "ArrowDown") {
            output.file_info = false;
            prevent_default(event);
        } else if (event.key == " ") {
            output.maximized = !output.maximized;
            prevent_default(event);
        }

        return output;
    }
}
