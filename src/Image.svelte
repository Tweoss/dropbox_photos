<script lang="ts">
    import { DbxImage, DbxIndexEntry } from "./dbx_classes";
    import { onMount } from "svelte";
    import { store } from "./store";

    export let ACCESS_TOKEN: string;
    export let image_entry: DbxIndexEntry;
    export let default_data: string = "";
    export let event_index: number;
    export let entry_index: number;

    let image_data: string = default_data;

    let full_image: string;
    let initial_image: string;
    let thumbnail: string;

    let selected: boolean = false;
    let maximized: boolean = false;

    const image = new DbxImage(image_entry.metadata.path);
    let calculated_dimensions: {
        top: number;
        left: number;
        scale_class: string;
    } = {
        top: 0,
        left: 0,
        scale_class: "",
    };

    const calculate_dimensions = () => {
        const dimensions = image_entry.metadata.dimensions;
        if (dimensions.height == dimensions.width) {
            return { top: 0, left: 0, scale_class: "" };
        } else if (dimensions.height > dimensions.width) {
            // gap on the left and right
            return {
                top: 0,
                left: (100 * (1 - dimensions.width / dimensions.height)) / 2,
                scale_class: "width-auto",
            };
        } else if (dimensions.width > dimensions.height) {
            // gap on the top and bottom
            return {
                top: (100 * (1 - dimensions.height / dimensions.width)) / 2,
                left: 0,
                scale_class: "height-auto",
            };
        }
    };
    const onChangeVisibility = (
        entries: IntersectionObserverEntry[],
        _observer: IntersectionObserver
    ) => {
        if (entries[0].isIntersecting) {
            initial_image
                ? (image_data = initial_image)
                : image
                      .loadThumbnail(ACCESS_TOKEN, "w256h256")
                      .then((data: string) => {
                          initial_image = data;
                          thumbnail ? null : URL.revokeObjectURL(thumbnail);
                          image_data = initial_image;
                          calculated_dimensions = calculate_dimensions();
                      });
        } else {
            thumbnail
                ? 0 // no reverting to thumbnail. thumbnail will be revoked
                : image.loadThumbnail(ACCESS_TOKEN).then((data: string) => {
                      thumbnail = data;
                      image_data = thumbnail;
                      calculated_dimensions = calculate_dimensions();
                  });
        }
    };

    let observer: IntersectionObserver;
    let element: Element;
    onMount(() => {
        let options: IntersectionObserverInit = {};
        observer = new IntersectionObserver(onChangeVisibility, options);
        observer.observe(element);
    });
    store.subscribe((store) => {
        selected =
            store.event_index == event_index &&
            store.entry_index == entry_index;
        // only if it is selected and maximized now
        if (store.maximized && selected) {
            maximized = true;
        } else {
            maximized = false;
        }
        if (selected) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        // if in the same or neighbouring events as selected and maximized or is currently selected and not maximized
        if (
            (store.maximized &&
                Math.abs(store.event_index - event_index) <= 1) ||
            selected
        ) {
            full_image
                ? (image_data = full_image)
                : image.loadImage(ACCESS_TOKEN).then((data: string) => {
                      full_image = data;
                      image_data = full_image;
                      calculated_dimensions = calculate_dimensions();
                  });
        }
    });
    let drag = {
        init: 0,
        move: 0,
    };
</script>

<div class="container">
    <img
        bind:this="{element}"
        src="{image_data}"
        alt="{image_entry.metadata.name}"
        class="{$store.event_index == event_index &&
        $store.entry_index == entry_index
            ? 'selected'
            : ''} {calculated_dimensions.scale_class} {maximized
            ? 'maximized'
            : ''}"
        on:load|once="{() => {
            URL.revokeObjectURL(image_data);
        }}"
        on:click="{(e) => {
            maximized
                ? null
                : store.update((previous) => {
                      previous.event_index = event_index;
                      previous.entry_index = entry_index;
                      return previous;
                  });
        }}"
        on:dblclick="{() => {
            maximized
                ? store.update((previous) => {
                      previous.maximized = false;
                      return previous;
                  })
                : store.update((previous) => {
                      previous.maximized = true;
                      return previous;
                  });
        }}"
        on:touchstart="{(e) => {
            maximized ? (drag.init = e.touches[0].clientY) : null;
        }}"
        on:touchmove="{(e) => {
            maximized ? (drag.move = e.touches[0].clientY) : null;
        }}"
        on:touchend="{() => {
            if (!maximized) {
                return;
            }
            const diff_y = drag.init - drag.move;
            if (diff_y < -30) {
                store.update((previous) => {
                    previous.maximized = false;
                    return previous;
                });
            }
        }}"
        style="top: {maximized
            ? '0'
            : calculated_dimensions.top}%; left: {maximized
            ? '0'
            : calculated_dimensions.left}%;"
    />
</div>

<style>
    div.container {
        position: relative;
        height: 200px;
        width: 200px;
        display: inline-block;
        margin: 0.5em;
    }
    img {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        object-fit: contain;
        box-shadow: 3px 3px 10px black;
    }
    img:hover {
        box-shadow: 6px 6px 15px black;
    }
    img.selected {
        border: 2px solid blue;
        border-radius: 2px;
        margin: -2px;
        box-shadow: 6px 6px 20px black;
    }
    img.maximized {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
        background-color: #222c;
        border: none;
        margin: 0px;
    }
    .width-auto {
        width: auto;
    }
    .height-auto {
        height: auto;
    }
</style>
