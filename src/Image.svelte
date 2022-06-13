<script lang="ts">
    import { DbxImage, DbxIndexEntry } from "./dbx_classes";
    import { onMount } from "svelte";
    import { store } from "./store";

    export let ACCESS_TOKEN: string;
    export let image_entry: DbxIndexEntry;
    export let default_data: string = "";
    export let event_index: number;
    export let entry_index: number;

    let isInView = false;
    let image_data: string = default_data;

    let full_image: string;
    let initial_image: string;
    let thumbnail: string;

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
        if (
            store.event_index == event_index &&
            store.entry_index == entry_index
        ) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            full_image
                ? (image_data = full_image)
                : image.loadImage(ACCESS_TOKEN).then((data: string) => {
                      full_image = data;
                      image_data = full_image;
                      calculated_dimensions = calculate_dimensions();
                  });
        }
    });
</script>

<div class="container">
    <img
        bind:this="{element}"
        src="{image_data}"
        alt="{image_entry.metadata.name}"
        class="{$store.event_index == event_index &&
        $store.entry_index == entry_index
            ? 'selected'
            : ''} {calculated_dimensions.scale_class}"
        on:load|once="{() => {
            URL.revokeObjectURL(image_data);
        }}"
        on:click="{() => {
            store.update((previous) => {
                previous.event_index = event_index;
                previous.entry_index = entry_index;
                return previous;
            });
        }}"
        style="top: {calculated_dimensions.top}%; left: {calculated_dimensions.left}%;"
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
        height: 200px;
        width: 200px;
        object-fit: contain;
        box-shadow: 3px 3px 10px black;
    }
    img.selected {
        border: 2px solid blue;
        border-radius: 2px;
        margin: -2px;
        box-shadow: 6px 6px 15px black;
    }
    .width-auto {
        width: auto;
    }
    .height-auto {
        height: auto;
    }
</style>
