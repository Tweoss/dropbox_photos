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
    let video_data: string = null;

    let full_image: string;
    let initial_image: string;
    let thumbnail: string;

    let selected: boolean = false;

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
                      .loadThumbnail(ACCESS_TOKEN, "w640h480")
                      .then((data: string) => {
                          initial_image = data;
                          image_data = initial_image;
                          calculated_dimensions = calculate_dimensions();
                      });
            video_data
                ? null
                : image
                      .loadVideo(
                          ACCESS_TOKEN,
                          image_entry.live_video_metadata.path
                      )
                      .then((data: string) => {
                          video_data = data;
                      });
        } else {
            thumbnail
                ? 0 // not reverting to thumbnail. otherwise use this: (image_data = thumbnail)
                : image.loadThumbnail(ACCESS_TOKEN).then((data: string) => {
                      thumbnail = data;
                      image_data = thumbnail;
                      calculated_dimensions = calculate_dimensions();
                  });
        }
    };

    let observer: IntersectionObserver;
    let element: HTMLVideoElement;

    onMount(() => {
        let options = {
            root: undefined,
        };
        observer = new IntersectionObserver(onChangeVisibility, options);
        observer.observe(element);
    });
    store.subscribe((store) => {
        const was_previously_selected = selected;
        selected =
            store.event_index == event_index &&
            store.entry_index == entry_index;
        // if (store.maximized && was_previously_selected && selected) {
        //     const parentElement = element.parentElement;
        //     parentElement.style.position = 'fixed';
        //     parentElement.style.width = '100%';
        //     parentElement.style.height = '100%';
        //     parentElement.style.top = '0px';
        //     parentElement.style.left = '0px';
        //     // element.style.top = '0px';
        //     // element.style.left = '0px';
        //     parentElement.style.margin = '0px';
        //     parentElement.style.zIndex = '1';
        // }
        if (selected && !was_previously_selected) {
            //     $store.event_index == event_index &&
            // $store.entry_index == entry_index
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
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        bind:this="{element}"
        src="{video_data}"
        poster="{image_data}"
        class="{selected ? 'selected' : ''} {calculated_dimensions.scale_class}"
        on:load|once="{() => {
            URL.revokeObjectURL(video_data);
            URL.revokeObjectURL(image_data) /* no need for image_data anyway */;
        }}"
        on:focus="{() => element.play()}"
        on:mouseover="{() => element.play()}"
        on:mouseleave="{() => {
            element.pause();
            element.currentTime = 0;
            element.load();
        }}"
        on:click="{() => {
            store.update((previous) => {
                previous.event_index = event_index;
                previous.entry_index = entry_index;
                return previous;
            });
        }}"
        style="top: {calculated_dimensions.top}%; left: {calculated_dimensions.left}%;"
    >
        Sorry, your browser doesn't support embedded videos.
    </video>

    <i
        style="top: {calculated_dimensions.top}%; left: {calculated_dimensions.left}%; color: lightgray;"
        class="{element ? 'fa fa-play-circle-o ' : ''}"></i>
</div>

<style>
    div.container {
        position: relative;
        height: 200px;
        width: 200px;
        display: inline-block;
        margin: 0.5em;
        transition: width 2s, height 2s, top 2s, left 2s;
    }
    video {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        object-fit: contain;
        box-shadow: 3px 3px 10px black;
    }
    video.selected {
        border: 2px solid blue;
        border-radius: 2px;
        margin: -2px;
        box-shadow: 6px 6px 15px black;
    }
    i {
        position: absolute;
    }
    .width-auto {
        width: auto;
    }
    .height-auto {
        height: auto;
    }
</style>
